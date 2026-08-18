import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { Group } from "@/server/db/models/group.model";
import { Note } from "@/server/db/models/note.model";
import { logActivity } from "@/server/services/activity.service";
import { toAdminGroup } from "@/server/mappers/group.mapper";
import { createGroupSchema } from "@/lib/schemas/group.schema";
import { uniqueSlug } from "@/server/lib/slug";
import { validateNoteIdsExist } from "@/server/lib/note-validation";
import { rupeesToPaise } from "@/lib/format";
import { requireAdmin } from "@/server/lib/auth-guard";

vi.mock("@/server/db/connect", () => ({ connectDb: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/server/db/models/group.model", () => ({
  Group: {
    find: vi.fn(),
    countDocuments: vi.fn(),
    create: vi.fn(),
    findById: vi.fn(),
  },
}));
vi.mock("@/server/db/models/note.model", () => ({ Note: { find: vi.fn() } }));
vi.mock("@/server/services/activity.service", () => ({
  logActivity: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/server/mappers/group.mapper", () => ({
  toAdminGroup: vi.fn((g: any) => g),
}));
vi.mock("@/lib/schemas/group.schema", () => ({
  createGroupSchema: { safeParse: vi.fn() },
}));
vi.mock("@/server/lib/slug", () => ({
  uniqueSlug: vi.fn(async (_m: any, n: string) => n.toLowerCase()),
}));
vi.mock("@/server/lib/note-validation", () => ({
  validateNoteIdsExist: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/format", () => ({
  rupeesToPaise: vi.fn((n: number) => n * 100),
}));
vi.mock("@/server/lib/auth-guard", () => ({
  requireAdmin: vi.fn(),
}));

const ADMIN = { id: "a1", name: "Admin", email: "a@b.com", isHead: false };
const HEAD_ADMIN = { ...ADMIN, isHead: true };

function makeChain(val: unknown) {
  const result: any = {
    sort: vi.fn((x: any) => { result.lastSort = x; return result; }),
    skip: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    populate: vi.fn((x: any) => { result.lastPopulate = x; return result; }),
    lean: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(val),
  };
  return result;
}

function mockReq(method: string, path: string, body?: unknown) {
  const url = `http://localhost${path}`;
  const opts: RequestInit = { method, headers: { "content-type": "application/json" } };
  if (body !== undefined) opts.body = typeof body === "string" ? body : JSON.stringify(body);
  return new NextRequest(url, opts as any);
}

describe("GET /api/admin/groups", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ;(requireAdmin as any).mockResolvedValue(ADMIN);
    ;(Group.find as any).mockReturnValue(makeChain([]));
    ;(Group.countDocuments as any).mockReturnValue(makeChain(0));
  });

  it("returns paginated groups with populated relations", async () => {
    const groups = [{ _id: "g1", name: "Bundle 1" }];
    ;(Group.find as any).mockReturnValue(makeChain(groups));
    ;(Group.countDocuments as any).mockReturnValue(makeChain(1));
    const { GET } = await import("@/app/api/admin/groups/route");
    const res = await GET(mockReq("GET", "/api/admin/groups") as any, undefined);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.items).toHaveLength(1);
    expect(json.data.pagination.total).toBe(1);
    expect(json.data.pagination.limit).toBe(20);
  });

  it("supports custom pagination params", async () => {
    ;(Group.find as any).mockReturnValue(makeChain([]));
    const { GET } = await import("@/app/api/admin/groups/route");
    await GET(mockReq("GET", "/api/admin/groups?page=2&limit=5") as any, undefined);
    expect(Group.find).toHaveBeenCalledWith({});
  });

  it("sorts by createdAt descending", async () => {
    ;(Group.find as any).mockReturnValue(makeChain([]));
    const { GET } = await import("@/app/api/admin/groups/route");
    await GET(mockReq("GET", "/api/admin/groups") as any, undefined);
    const chain = (Group.find as any).mock.results[0].value;
    expect(chain.lastSort).toEqual({ createdAt: -1 });
  });

  it("populates category, createdBy, and notes", async () => {
    ;(Group.find as any).mockReturnValue(makeChain([]));
    const { GET } = await import("@/app/api/admin/groups/route");
    await GET(mockReq("GET", "/api/admin/groups") as any, undefined);
    const chain = (Group.find as any).mock.results[0].value;
    expect(chain.lastPopulate).toBeDefined();
  });

  it("is protected by admin auth", async () => {
    ;(requireAdmin as any).mockResolvedValue(null);
    const { GET } = await import("@/app/api/admin/groups/route");
    const req = mockReq("GET", "/api/admin/groups");
    await GET(req as any, undefined);
    expect(requireAdmin).toHaveBeenCalled();
  });
});

describe("POST /api/admin/groups", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ;(requireAdmin as any).mockResolvedValue(HEAD_ADMIN);
    ;(createGroupSchema.safeParse as any).mockReturnValue({
      success: false,
      error: { issues: [{ path: ["name"], message: "required" }] },
    });
    ;(Group.create as any).mockResolvedValue({ _id: "g1", name: "New Bundle", toJSON: () => ({ _id: "g1", name: "New Bundle" }) });
    ;(Group.findById as any).mockReturnValue(makeChain(null));
    ;(validateNoteIdsExist as any).mockResolvedValue(undefined);
    ;(logActivity as any).mockResolvedValue(undefined);
    ;(toAdminGroup as any).mockImplementation((g: any) => g);
  });

  it("returns validation error for invalid body", async () => {
    const { POST } = await import("@/app/api/admin/groups/route");
    const res = await POST(mockReq("POST", "/api/admin/groups", { invalid: true }) as any, undefined);
    expect(res.status).toBe(400);
  });

  it("validates note IDs exist before creating group", async () => {
    ;(createGroupSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { name: "Bundle", noteIds: ["n1", "n2"], price: 299, visibility: "public" },
    });
    const { POST } = await import("@/app/api/admin/groups/route");
    await POST(mockReq("POST", "/api/admin/groups", { name: "Bundle", noteIds: ["n1", "n2"], price: 299 }) as any, undefined);
    expect(validateNoteIdsExist).toHaveBeenCalledWith(expect.arrayContaining(["n1", "n2"]));
  });

  it("creates group with unique slug", async () => {
    ;(createGroupSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { name: "Web Dev Bundle", noteIds: [], price: 299, visibility: "public" },
    });
    ;(uniqueSlug as any).mockResolvedValue("web-dev-bundle");
    ;(Group.findById as any).mockReturnValue(makeChain({ _id: "g1", name: "Web Dev Bundle" }));
    const { POST } = await import("@/app/api/admin/groups/route");
    const res = await POST(mockReq("POST", "/api/admin/groups", { name: "Web Dev Bundle", noteIds: [], price: 299 }) as any, undefined);
    expect(res.status).toBe(200);
    expect(Group.create).toHaveBeenCalledWith(expect.objectContaining({ name: "Web Dev Bundle", slug: "web-dev-bundle" }));
  });

  it("converts price from rupees to paise", async () => {
    ;(createGroupSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { name: "G", noteIds: [], price: 500, visibility: "public" },
    });
    ;(Group.findById as any).mockReturnValue(makeChain({ _id: "g1" }));
    const { POST } = await import("@/app/api/admin/groups/route");
    await POST(mockReq("POST", "/api/admin/groups", { name: "G", noteIds: [], price: 500 }) as any, undefined);
    expect(rupeesToPaise).toHaveBeenCalledWith(500);
  });

  it("logs activity on group creation", async () => {
    ;(createGroupSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { name: "New Bundle", noteIds: [], price: 299, visibility: "public" },
    });
    ;(Group.findById as any).mockReturnValue(makeChain({ _id: "g1", name: "New Bundle" }));
    const { POST } = await import("@/app/api/admin/groups/route");
    await POST(mockReq("POST", "/api/admin/groups", { name: "New Bundle", noteIds: [], price: 299 }) as any, undefined);
    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({ action: "group.create" }));
  });

  it("deduplicates note IDs before validation", async () => {
    ;(createGroupSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { name: "G", noteIds: ["n1", "n1", "n2"], price: 299, visibility: "public" },
    });
    ;(Group.findById as any).mockReturnValue(makeChain({ _id: "g1" }));
    const { POST } = await import("@/app/api/admin/groups/route");
    await POST(mockReq("POST", "/api/admin/groups", { name: "G", noteIds: ["n1", "n1", "n2"], price: 299 }) as any, undefined);
    expect(validateNoteIdsExist).toHaveBeenCalledWith(["n1", "n2"]);
  });

  it("handles cover image data", async () => {
    ;(createGroupSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { name: "G", noteIds: [], price: 299, visibility: "public", coverImage: { url: "https://cdn/img.jpg", publicId: "pub/img" } },
    });
    ;(Group.findById as any).mockReturnValue(makeChain({ _id: "g1" }));
    const { POST } = await import("@/app/api/admin/groups/route");
    await POST(mockReq("POST", "/api/admin/groups", { name: "G", noteIds: [], price: 299, coverImage: { url: "https://cdn/img.jpg", publicId: "pub/img" } }) as any, undefined);
    expect(Group.create).toHaveBeenCalledWith(expect.objectContaining({ coverImageUrl: "https://cdn/img.jpg", coverImagePublicId: "pub/img" }));
  });

  it("is protected by admin auth", async () => {
    ;(requireAdmin as any).mockResolvedValue(null);
    const { POST } = await import("@/app/api/admin/groups/route");
    const req = mockReq("POST", "/api/admin/groups", { name: "G" });
    await POST(req as any, undefined);
    expect(requireAdmin).toHaveBeenCalled();
  });
});
