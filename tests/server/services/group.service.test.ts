import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  listGroups,
  getGroupBySlug,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  getRelatedGroups,
  getFeaturedGroups,
} from "../../../src/server/services/group.service";
import * as GroupModel from "../../../src/server/db/models/group.model";
import * as NoteModel from "../../../src/server/db/models/note.model";
import * as ActivityService from "../../../src/server/services/activity.service";
import * as SlugLib from "../../../src/server/lib/slug";
import * as Errors from "../../../src/server/lib/errors";

vi.mock("../../../src/server/db/models/group.model", () => ({
  Group: {
    find: vi.fn(),
    findById: vi.fn(),
    findOne: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
    create: vi.fn(),
    countDocuments: vi.fn(),
  },
}));

vi.mock("../../../src/server/db/models/note.model", () => ({
  Note: {
    find: vi.fn(),
  },
}));

vi.mock("../../../src/server/services/activity.service", () => ({
  logActivity: vi.fn(),
}));

vi.mock("../../../src/server/lib/slug", () => ({
  uniqueSlug: vi.fn(),
}));

vi.mock("../../../src/server/lib/errors", () => ({
  AppError: {
    notFound: vi.fn((entity: string) => new Error(`${entity} not found`)),
    validation: vi.fn((fields: any, msg: string) => new Error(msg)),
    internal: vi.fn((msg: string) => new Error(msg)),
  },
}));

const mockNoteId = "507f1f77bcf86cd799439011";
const mockGroupId = "507f1f77bcf86cd799439012";
const validObjectId = "65a1b2c3d4e5f6a7b8c9d0e1";
const mockCtx = {
  ip: "1.2.3.4",
  userAgent: "Mozilla/5.0",
  admin: { _id: validObjectId, name: "Admin" },
};

const mockGroup = {
  _id: mockGroupId,
  name: "JS Mastery",
  slug: "js-mastery",
  description: "Master JavaScript",
  category: "cat1",
  price: 50000,
  notes: [mockNoteId, "507f1f77bcf86cd799439013"],
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

describe("listGroups", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns paginated groups with populated category and notes", async () => {
    const query = {
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([mockGroup]),
    };
    vi.mocked(GroupModel.Group.find).mockReturnValue(query as any);
    vi.mocked(GroupModel.Group.countDocuments).mockReturnValue({
      exec: vi.fn().mockResolvedValue(1),
    } as any);

    const result = await listGroups({}, 0, 10);
    expect(result.items).toEqual([mockGroup]);
    expect(result.total).toBe(1);
  });
});

describe("getGroupBySlug", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns a group when found", async () => {
    const query = {
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(mockGroup),
    };
    vi.mocked(GroupModel.Group.findOne).mockReturnValue(query as any);

    const result = await getGroupBySlug("js-mastery");
    expect(result).toEqual(mockGroup);
  });

  it("returns null when not found", async () => {
    const query = {
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
    };
    vi.mocked(GroupModel.Group.findOne).mockReturnValue(query as any);

    const result = await getGroupBySlug("nonexistent");
    expect(result).toBeNull();
  });
});

describe("getGroupById", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns a group when found", async () => {
    const query = {
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(mockGroup),
    };
    vi.mocked(GroupModel.Group.findById).mockReturnValue(query as any);

    const result = await getGroupById("grp1");
    expect(result).toEqual(mockGroup);
  });

  it("returns null when not found", async () => {
    const query = {
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
    };
    vi.mocked(GroupModel.Group.findById).mockReturnValue(query as any);

    const result = await getGroupById("nonexistent");
    expect(result).toBeNull();
  });
});

describe("createGroup", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates a group with valid inputs", async () => {
    vi.mocked(SlugLib.uniqueSlug).mockResolvedValue("js-mastery");
    vi.mocked(NoteModel.Note.find).mockReturnValue(
      { select: vi.fn().mockReturnThis(), lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue([{ _id: mockNoteId }, { _id: "507f1f77bcf86cd799439013" }]) } as any,
    );
    vi.mocked(GroupModel.Group.create).mockResolvedValue(mockGroup as any);

    const result = await createGroup(
      {
        name: "JS Mastery",
        description: "Master JavaScript",
        categoryId: "cat1",
        price: 500,
        noteIds: [mockNoteId, "507f1f77bcf86cd799439013"],
      },
      mockCtx as any,
    );

    expect(SlugLib.uniqueSlug).toHaveBeenCalled();
    expect(GroupModel.Group.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: "JS Mastery", slug: "js-mastery" }),
    );
    expect(ActivityService.logActivity).toHaveBeenCalledWith(
      expect.objectContaining({ action: "group.create" }),
    );
    expect(result).toEqual(mockGroup);
  });

  it("throws validation error when price is too low", async () => {
    (vi.mocked(Errors.AppError.validation) as any).mockImplementation(() => new Error("Price must be at least Rs.1"));

    await expect(
      createGroup(
        { name: "Cheap", description: "Too cheap", categoryId: "cat1", price: 0.5, noteIds: [mockNoteId] },
        mockCtx as any,
      ),
    ).rejects.toThrow("Price must be at least");
  });

  it("throws validation error when no notes are provided", async () => {
    (vi.mocked(Errors.AppError.validation) as any).mockImplementation(() => new Error("At least one note is required"));

    await expect(
      createGroup(
        { name: "Empty", description: "No notes", categoryId: "cat1", price: 100, noteIds: [] },
        mockCtx as any,
      ),
    ).rejects.toThrow("At least one note is required");
  });

  it("throws not found when some notes are missing", async () => {
    vi.mocked(NoteModel.Note.find).mockReturnValue(
      { select: vi.fn().mockReturnThis(), lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue([{ _id: mockNoteId }]) } as any,
    );
    (vi.mocked(Errors.AppError.notFound) as any).mockImplementation((_msg: string) => new Error(_msg));

    await expect(
      createGroup(
        { name: "Partial", description: "Missing notes", categoryId: "cat1", price: 100, noteIds: [mockNoteId, "000000000000000000000001"] },
        mockCtx as any,
      ),
    ).rejects.toThrow("not found");
  });

  it("deduplicates noteIds", async () => {
    vi.mocked(SlugLib.uniqueSlug).mockResolvedValue("dedup");
    vi.mocked(NoteModel.Note.find).mockReturnValue(
      { select: vi.fn().mockReturnThis(), lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue([{ _id: mockNoteId }]) } as any,
    );
    vi.mocked(GroupModel.Group.create).mockResolvedValue({ ...mockGroup, notes: [mockNoteId] } as any);

    await createGroup(
      { name: "Dedup", description: "Dedup test", categoryId: "cat1", price: 100, noteIds: [mockNoteId, mockNoteId, mockNoteId] },
      mockCtx as any,
    );

    const call = vi.mocked(GroupModel.Group.create).mock.calls[0][0] as Record<string, unknown>;
    expect((call.notes as string[]).length).toBe(1);
  });
});

describe("updateGroup", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates a group with valid inputs", async () => {
    const updated = { ...mockGroup, name: "Updated JS" };
    vi.mocked(GroupModel.Group.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockGroup) } as any,
    );
    vi.mocked(GroupModel.Group.findByIdAndUpdate).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(updated) } as any,
    );

    const result = await updateGroup("grp1", { name: "Updated JS" }, mockCtx as any);
    expect(result.name).toBe("Updated JS");
    expect(ActivityService.logActivity).toHaveBeenCalledWith(
      expect.objectContaining({ action: "group.update" }),
    );
  });

  it("throws not found when group does not exist", async () => {
    vi.mocked(GroupModel.Group.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(null) } as any,
    );
    (vi.mocked(Errors.AppError.notFound) as any).mockImplementation(() => new Error("Group not found"));

    await expect(updateGroup("nonexistent", { name: "X" }, mockCtx as any)).rejects.toThrow("Group not found");
  });

  it("throws validation error when new noteIds are empty", async () => {
    vi.mocked(GroupModel.Group.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockGroup) } as any,
    );
    (vi.mocked(Errors.AppError.validation) as any).mockImplementation(() => new Error("At least one note is required"));

    await expect(
      updateGroup(mockGroupId, { noteIds: [] }, mockCtx as any),
    ).rejects.toThrow("At least one note is required");
  });

  it("throws not found when updating with missing notes", async () => {
    vi.mocked(GroupModel.Group.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockGroup) } as any,
    );
    vi.mocked(NoteModel.Note.find).mockReturnValue(
      { select: vi.fn().mockReturnThis(), lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue([]) } as any,
    );
    (vi.mocked(Errors.AppError.notFound) as any).mockImplementation((_msg: string) => new Error(_msg));

    await expect(
      updateGroup(mockGroupId, { noteIds: [mockNoteId, "000000000000000000000001"] }, mockCtx as any),
    ).rejects.toThrow("not found");
  });

  it("throws internal error when findByIdAndUpdate returns null", async () => {
    vi.mocked(GroupModel.Group.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockGroup) } as any,
    );
    vi.mocked(GroupModel.Group.findByIdAndUpdate).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(null) } as any,
    );
    (vi.mocked(Errors.AppError.internal) as any).mockImplementation(() => new Error("Failed to update group"));

    await expect(updateGroup(mockGroupId, { name: "X" }, mockCtx as any)).rejects.toThrow("Failed to update group");
  });

  it("handles coverImage upload", async () => {
    const updated = { ...mockGroup };
    vi.mocked(GroupModel.Group.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockGroup) } as any,
    );
    vi.mocked(GroupModel.Group.findByIdAndUpdate).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(updated) } as any,
    );

    await updateGroup(
      mockGroupId,
      { coverImage: { url: "https://example.com/cover.jpg", publicId: "cover1" } },
      mockCtx as any,
    );

    const calls = vi.mocked(GroupModel.Group.findByIdAndUpdate).mock.calls;
    const updates = calls[0][1] as Record<string, unknown>;
    expect(updates.coverImageUrl).toBe("https://example.com/cover.jpg");
    expect(updates.coverImagePublicId).toBe("cover1");
  });

  it("handles price conversion", async () => {
    const updated = { ...mockGroup };
    vi.mocked(GroupModel.Group.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockGroup) } as any,
    );
    vi.mocked(GroupModel.Group.findByIdAndUpdate).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(updated) } as any,
    );

    await updateGroup(mockGroupId, { price: 500 }, mockCtx as any);

    const calls = vi.mocked(GroupModel.Group.findByIdAndUpdate).mock.calls;
    const updates = calls[0][1] as Record<string, unknown>;
    expect(updates.price).toBe(50000);
  });
});

describe("deleteGroup", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deletes a group successfully", async () => {
    vi.mocked(GroupModel.Group.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockGroup) } as any,
    );
    vi.mocked(GroupModel.Group.findByIdAndDelete).mockReturnValue(
      { exec: vi.fn().mockResolvedValue(undefined) } as any,
    );

    const result = await deleteGroup(mockGroupId, mockCtx as any);
    expect(result.deleted).toBe(true);
    expect(ActivityService.logActivity).toHaveBeenCalledWith(
      expect.objectContaining({ action: "group.delete" }),
    );
  });

  it("throws not found when group does not exist", async () => {
    vi.mocked(GroupModel.Group.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(null) } as any,
    );
    (vi.mocked(Errors.AppError.notFound) as any).mockImplementation(() => new Error("Group not found"));

    await expect(deleteGroup("nonexistent", mockCtx as any)).rejects.toThrow("Group not found");
  });
});

describe("getRelatedGroups", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns related groups excluding the current one", async () => {
    const query = {
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([mockGroup]),
    };
    vi.mocked(GroupModel.Group.find).mockReturnValue(query as any);

    const result = await getRelatedGroups("cat1", mockGroupId, 5);
    expect(result).toEqual([mockGroup]);
  });
});

describe("getFeaturedGroups", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns featured groups sorted by createdAt descending", async () => {
    const query = {
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([mockGroup]),
    };
    vi.mocked(GroupModel.Group.find).mockReturnValue(query as any);

    const result = await getFeaturedGroups(5);
    expect(result).toEqual([mockGroup]);
  });
});
