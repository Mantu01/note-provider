import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { Note } from "@/server/db/models/note.model";
import { Category } from "@/server/db/models/category.model";
import { logActivity } from "@/server/services/activity.service";
import { toAdminNote } from "@/server/mappers/note.mapper";
import { createNoteSchema } from "@/lib/schemas/note.schema";
import { uniqueSlug } from "@/server/lib/slug";
import { rupeesToPaise } from "@/lib/format";
import { MIN_PAID_PRICE_PAISE } from "@/lib/constants";
import { requireAdmin } from "@/server/lib/auth-guard";

vi.mock("@/server/db/connect", () => ({ connectDB: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/server/db/models/note.model", () => ({
  Note: {
    find: vi.fn(),
    countDocuments: vi.fn(),
    create: vi.fn(),
    findById: vi.fn(),
  },
}));
vi.mock("@/server/db/models/category.model", () => ({
  Category: { findById: vi.fn() },
}));
vi.mock("@/server/services/activity.service", () => ({
  logActivity: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/server/mappers/note.mapper", () => ({
  toAdminNote: vi.fn((n: any) => n),
}));
vi.mock("@/lib/schemas/note.schema", () => ({
  createNoteSchema: { safeParse: vi.fn() },
}));
vi.mock("@/server/lib/slug", () => ({
  uniqueSlug: vi.fn(async (_m: any, n: string) => n.toLowerCase().replace(/\s+/g, "-")),
}));
vi.mock("@/lib/format", () => ({
  rupeesToPaise: vi.fn((n: number) => n * 100),
}));
vi.mock("@/server/lib/auth-guard", () => ({
  requireAdmin: vi.fn(),
}));

const ADMIN = { id: "a1", name: "Admin", email: "a@b.com", isHead: false };

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
  const opts: RequestInit = { method, headers: { "content-type": "application/json" }, body: body !== undefined ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined };
  return new NextRequest(url, opts as any);
}

describe("GET /api/admin/notes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ;(requireAdmin as any).mockResolvedValue(ADMIN);
    ;(Note.find as any).mockReturnValue(makeChain([]));
    ;(Note.countDocuments as any).mockReturnValue(makeChain(0));
  });

  it("returns paginated notes with populated relations", async () => {
    const notes = [{ _id: "n1", title: "React Notes" }];
    ;(Note.find as any).mockReturnValue(makeChain(notes));
    ;(Note.countDocuments as any).mockReturnValue(makeChain(1));
    const { GET } = await import("@/app/api/admin/notes/route");
    const res = await GET(mockReq("GET", "/api/admin/notes") as any, undefined);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.items).toHaveLength(1);
    expect(json.data.pagination.total).toBe(1);
  });

  it("supports custom pagination", async () => {
    ;(Note.find as any).mockReturnValue(makeChain([]));
    const { GET } = await import("@/app/api/admin/notes/route");
    await GET(mockReq("GET", "/api/admin/notes?page=2&limit=5") as any, undefined);
    const chain = (Note.find as any).mock.results[0].value;
    expect(chain.lastSort).toEqual({ createdAt: -1 });
  });

  it("populates category and createdBy", async () => {
    ;(Note.find as any).mockReturnValue(makeChain([]));
    const { GET } = await import("@/app/api/admin/notes/route");
    await GET(mockReq("GET", "/api/admin/notes") as any, undefined);
    const chain = (Note.find as any).mock.results[0].value;
    expect(chain.lastPopulate).toBeDefined();
  });

  it("is protected by admin auth", async () => {
    ;(requireAdmin as any).mockResolvedValue(null);
    const { GET } = await import("@/app/api/admin/notes/route");
    const req = mockReq("GET", "/api/admin/notes");
    await GET(req as any, undefined);
    expect(requireAdmin).toHaveBeenCalled();
  });
});

describe("POST /api/admin/notes", () => {
  const validFile = { source: "upload" as const, url: "https://cdn/n.pdf", publicId: "pub/n", bytes: 1024 };

  beforeEach(() => {
    vi.clearAllMocks();
    ;(requireAdmin as any).mockResolvedValue(ADMIN);
    ;(createNoteSchema.safeParse as any).mockReturnValue({
      success: false,
      error: { issues: [{ path: ["title"], message: "required" }] },
    });
    ;(Note.create as any).mockResolvedValue({ _id: "n1", title: "New Note", toJSON: () => ({ _id: "n1", title: "New Note" }) });
    ;(Note.findById as any).mockReturnValue(makeChain(null));
    ;(Category.findById as any).mockReturnValue(makeChain(null));
    ;(logActivity as any).mockResolvedValue(undefined);
    ;(toAdminNote as any).mockImplementation((n: any) => n);
  });

  it("returns validation error for invalid body", async () => {
    const { POST } = await import("@/app/api/admin/notes/route");
    const res = await POST(mockReq("POST", "/api/admin/notes", { invalid: true }) as any, undefined);
    expect(res.status).toBe(400);
  });

  it("validates category exists", async () => {
    ;(createNoteSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { title: "Note", categoryId: "c1", level: "basics", visibility: "public", pricingType: "free", price: 0, tags: [], fullFile: validFile, pageCount: 10 },
    });
    ;(Category.findById as any).mockReturnValue(makeChain(null));
    const { POST } = await import("@/app/api/admin/notes/route");
    const res = await POST(mockReq("POST", "/api/admin/notes", { title: "Note", categoryId: "c1" }) as any, undefined);
    expect(res.status).toBe(404);
  });

  it("enforces minimum price for paid notes", async () => {
    ;(createNoteSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { title: "Note", categoryId: "c1", level: "basics", visibility: "public", pricingType: "paid", price: 0, tags: [], fullFile: validFile, pageCount: 10 },
    });
    ;(Category.findById as any).mockReturnValue(makeChain({ _id: "c1" }));
    const { POST } = await import("@/app/api/admin/notes/route");
    const res = await POST(mockReq("POST", "/api/admin/notes", { title: "Note", categoryId: "c1", pricingType: "paid", price: 0 }) as any, undefined);
    expect(res.status).toBe(400);
  });

  it("creates note with unique slug", async () => {
    ;(createNoteSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { title: "React Hooks", categoryId: "c1", level: "basics", visibility: "public", pricingType: "free", price: 0, tags: [], fullFile: validFile, pageCount: 20 },
    });
    ;(Category.findById as any).mockReturnValue(makeChain({ _id: "c1" }));
    ;(uniqueSlug as any).mockResolvedValue("react-hooks");
    ;(Note.findById as any).mockReturnValue(makeChain({ _id: "n1", title: "React Hooks" }));
    const { POST } = await import("@/app/api/admin/notes/route");
    const res = await POST(mockReq("POST", "/api/admin/notes", { title: "React Hooks", categoryId: "c1", pricingType: "free", price: 0, fullFile: validFile, pageCount: 20 }) as any, undefined);
    expect(res.status).toBe(200);
    expect(Note.create).toHaveBeenCalledWith(expect.objectContaining({ slug: "react-hooks" }));
  });

  it("converts price from rupees to paise", async () => {
    ;(createNoteSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { title: "G", categoryId: "c1", level: "basics", visibility: "public", pricingType: "free", price: 500, tags: [], fullFile: validFile, pageCount: 10 },
    });
    ;(Category.findById as any).mockReturnValue(makeChain({ _id: "c1" }));
    ;(Note.findById as any).mockReturnValue(makeChain({ _id: "n1" }));
    const { POST } = await import("@/app/api/admin/notes/route");
    await POST(mockReq("POST", "/api/admin/notes", { title: "G", categoryId: "c1", pricingType: "free", price: 500, fullFile: validFile }) as any, undefined);
    expect(rupeesToPaise).toHaveBeenCalledWith(500);
  });

  it("logs activity on note creation", async () => {
    ;(createNoteSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { title: "New Note", categoryId: "c1", level: "basics", visibility: "public", pricingType: "free", price: 0, tags: [], fullFile: validFile, pageCount: 10 },
    });
    ;(Category.findById as any).mockReturnValue(makeChain({ _id: "c1" }));
    ;(Note.findById as any).mockReturnValue(makeChain({ _id: "n1", title: "New Note" }));
    const { POST } = await import("@/app/api/admin/notes/route");
    await POST(mockReq("POST", "/api/admin/notes", { title: "New Note", categoryId: "c1", pricingType: "free", price: 0, fullFile: validFile }) as any, undefined);
    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({ action: "note.create" }));
  });

  it("handles optional preview file", async () => {
    ;(createNoteSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { title: "G", categoryId: "c1", level: "basics", visibility: "public", pricingType: "free", price: 0, tags: [], fullFile: validFile, previewFile: null, pageCount: 10 },
    });
    ;(Category.findById as any).mockReturnValue(makeChain({ _id: "c1" }));
    ;(Note.findById as any).mockReturnValue(makeChain({ _id: "n1" }));
    const { POST } = await import("@/app/api/admin/notes/route");
    await POST(mockReq("POST", "/api/admin/notes", { title: "G", categoryId: "c1", pricingType: "free", price: 0, fullFile: validFile }) as any, undefined);
    expect(Note.create).toHaveBeenCalledWith(expect.objectContaining({ previewFileUrl: null, previewFilePublicId: null }));
  });

  it("handles optional cover image", async () => {
    ;(createNoteSchema.safeParse as any).mockReturnValue({
      success: true,
      data: { title: "G", categoryId: "c1", level: "basics", visibility: "public", pricingType: "free", price: 0, tags: [], fullFile: validFile, coverImage: null, pageCount: 10 },
    });
    ;(Category.findById as any).mockReturnValue(makeChain({ _id: "c1" }));
    ;(Note.findById as any).mockReturnValue(makeChain({ _id: "n1" }));
    const { POST } = await import("@/app/api/admin/notes/route");
    await POST(mockReq("POST", "/api/admin/notes", { title: "G", categoryId: "c1", pricingType: "free", price: 0, fullFile: validFile }) as any, undefined);
    expect(Note.create).toHaveBeenCalledWith(expect.objectContaining({ coverImageUrl: null, coverImagePublicId: null }));
  });

  it("is protected by admin auth", async () => {
    ;(requireAdmin as any).mockResolvedValue(null);
    const { POST } = await import("@/app/api/admin/notes/route");
    const req = mockReq("POST", "/api/admin/notes", { title: "G" });
    await POST(req as any, undefined);
    expect(requireAdmin).toHaveBeenCalled();
  });
});
