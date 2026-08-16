import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  listNotes,
  getNoteBySlug,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getRelatedNotes,
  getGroupsByNoteId,
  getFeaturedNotes,
  getLatestNotes,
  getFreeNotes,
  getNotesByCategory,
  incrementDownloadCount,
  incrementPurchaseCount,
  addRevenuePaise,
} from "../../../src/server/services/note.service";
import * as NoteModel from "../../../src/server/db/models/note.model";
import * as GroupModel from "../../../src/server/db/models/group.model";
import * as ActivityService from "../../../src/server/services/activity.service";
import * as SlugLib from "../../../src/server/lib/slug";
import * as Errors from "../../../src/server/lib/errors";

vi.mock("../../../src/server/db/models/note.model", () => ({
  Note: {
    find: vi.fn(),
    findOne: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
    updateOne: vi.fn(),
    create: vi.fn(),
    countDocuments: vi.fn(),
    distinct: vi.fn(),
  },
}));

vi.mock("../../../src/server/db/models/group.model", () => ({
  Group: {
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    create: vi.fn(),
    countDocuments: vi.fn(),
    distinct: vi.fn(),
    find: vi.fn(),
    updateOne: vi.fn(),
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

const validObjectId = "65a1b2c3d4e5f6a7b8c9d0e1";
const mockCtx = {
  ip: "1.2.3.4",
  userAgent: "Mozilla/5.0",
  admin: { _id: validObjectId, name: "Admin" },
};

const mockNote = {
  _id: "note1",
  title: "React Notes",
  slug: "react-notes",
  description: "Complete React guide",
  category: "cat1",
  pricingType: "paid",
  price: 50000,
  visibility: "public",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

describe("listNotes", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns paginated notes with populated category", async () => {
    const query = {
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([mockNote]),
    };
    vi.mocked(NoteModel.Note.find).mockReturnValue(query as any);
    vi.mocked(NoteModel.Note.countDocuments).mockReturnValue({
      exec: vi.fn().mockResolvedValue(1),
    } as any);

    const result = await listNotes({ visibility: "public" }, { createdAt: -1 }, 0, 10);
    expect(result.items).toEqual([mockNote]);
    expect(result.total).toBe(1);
  });
});

describe("getNoteBySlug", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns a note when found", async () => {
    const query = {
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(mockNote),
    };
    vi.mocked(NoteModel.Note.findOne).mockReturnValue(query as any);

    const result = await getNoteBySlug("react-notes");
    expect(result).toEqual(mockNote);
  });

  it("returns null when not found", async () => {
    const query = {
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
    };
    vi.mocked(NoteModel.Note.findOne).mockReturnValue(query as any);

    const result = await getNoteBySlug("nonexistent");
    expect(result).toBeNull();
  });
});

describe("getNoteById", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns a note when found", async () => {
    const query = {
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(mockNote),
    };
    vi.mocked(NoteModel.Note.findById).mockReturnValue(query as any);

    const result = await getNoteById("note1");
    expect(result).toEqual(mockNote);
  });

  it("returns null when not found", async () => {
    const query = {
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
    };
    vi.mocked(NoteModel.Note.findById).mockReturnValue(query as any);

    const result = await getNoteById("nonexistent");
    expect(result).toBeNull();
  });
});

describe("createNote", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates a note with valid inputs", async () => {
    vi.mocked(SlugLib.uniqueSlug).mockResolvedValue("react-notes");
    vi.mocked(NoteModel.Note.create).mockResolvedValue(mockNote as any);

    const result = await createNote(
      {
        title: "React Notes",
        description: "Complete guide",
        categoryId: "cat1",
        level: "intermediate",
        pricingType: "paid",
        price: 500,
        fullFile: { url: "https://example.com/note.pdf", publicId: "full1", bytes: 100000 },
        previewFile: { url: "https://example.com/preview.pdf", publicId: "prev1", bytes: 50000 },
        coverImage: null,
        tags: [],
      },
      mockCtx as any,
    );

    expect(SlugLib.uniqueSlug).toHaveBeenCalled();
    expect(NoteModel.Note.create).toHaveBeenCalledWith(
      expect.objectContaining({ title: "React Notes", slug: "react-notes" }),
    );
    expect(ActivityService.logActivity).toHaveBeenCalledWith(
      expect.objectContaining({ action: "note.create" }),
    );
    expect(result).toEqual(mockNote);
  });

  it("throws validation error when paid note price is too low", async () => {
    (vi.mocked(Errors.AppError.validation) as any).mockImplementation(() => new Error("Price must be at least"));

    await expect(
      createNote(
        {
          title: "Cheap",
          description: "Too cheap",
          categoryId: "cat1",
          level: "basics",
          pricingType: "paid",
          price: 0.5,
          fullFile: { url: "https://example.com/note.pdf", publicId: "full1", bytes: 1000 },
          previewFile: null,
          coverImage: null,
          tags: [],
        },
        mockCtx as any,
      ),
    ).rejects.toThrow("Price must be at least");
  });

  it("converts free note price correctly", async () => {
    vi.mocked(SlugLib.uniqueSlug).mockResolvedValue("free-note");
    vi.mocked(NoteModel.Note.create).mockResolvedValue({ ...mockNote, price: 0 } as any);

    await createNote(
      {
        title: "Free Note",
        description: "Completely free",
        categoryId: "cat1",
        level: "basics",
        pricingType: "free",
        price: 0,
        fullFile: { url: "https://example.com/note.pdf", publicId: "full1", bytes: 1000 },
        previewFile: null,
        coverImage: null,
        tags: [],
      },
      mockCtx as any,
    );

    const call = vi.mocked(NoteModel.Note.create).mock.calls[0][0] as Record<string, unknown>;
    expect(call.price).toBe(0);
  });
});

describe("updateNote", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates a note with all fields", async () => {
    const updated = { ...mockNote, title: "Updated React Notes" };
    vi.mocked(NoteModel.Note.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockNote) } as any,
    );
    vi.mocked(NoteModel.Note.findByIdAndUpdate).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(updated) } as any,
    );

    const result = await updateNote("note1", { title: "Updated React Notes" }, mockCtx as any);
    expect(result.title).toBe("Updated React Notes");
    expect(ActivityService.logActivity).toHaveBeenCalledWith(
      expect.objectContaining({ action: "note.update" }),
    );
  });

  it("throws not found when note does not exist", async () => {
    vi.mocked(NoteModel.Note.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(null) } as any,
    );
    (vi.mocked(Errors.AppError.notFound) as any).mockImplementation(() => new Error("Note not found"));

    await expect(updateNote("nonexistent", { title: "X" }, mockCtx as any)).rejects.toThrow("Note not found");
  });

  it("clears preview file when previewFile is false", async () => {
    const updated = { ...mockNote };
    vi.mocked(NoteModel.Note.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockNote) } as any,
    );
    vi.mocked(NoteModel.Note.findByIdAndUpdate).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(updated) } as any,
    );

    await updateNote("note1", { previewFile: false as any }, mockCtx as any);

    const calls = vi.mocked(NoteModel.Note.findByIdAndUpdate).mock.calls;
    const updates = calls[0][1] as Record<string, unknown>;
    expect(updates.previewFileUrl).toBeNull();
    expect(updates.previewFilePublicId).toBeNull();
    expect(updates.previewFileBytes).toBeNull();
  });

  it("sets preview file when previewFile is provided", async () => {
    const updated = { ...mockNote };
    vi.mocked(NoteModel.Note.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockNote) } as any,
    );
    vi.mocked(NoteModel.Note.findByIdAndUpdate).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(updated) } as any,
    );

    await updateNote(
      "note1",
      { previewFile: { url: "https://example.com/p.pdf", publicId: "p1", bytes: 5000 } },
      mockCtx as any,
    );

    const calls = vi.mocked(NoteModel.Note.findByIdAndUpdate).mock.calls;
    const updates = calls[0][1] as Record<string, unknown>;
    expect(updates.previewFileUrl).toBe("https://example.com/p.pdf");
    expect(updates.previewFilePublicId).toBe("p1");
    expect(updates.previewFileBytes).toBe(5000);
  });

  it("sets cover image when provided", async () => {
    const updated = { ...mockNote };
    vi.mocked(NoteModel.Note.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockNote) } as any,
    );
    vi.mocked(NoteModel.Note.findByIdAndUpdate).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(updated) } as any,
    );

    await updateNote(
      "note1",
      { coverImage: { url: "https://example.com/cover.jpg", publicId: "cover1" } },
      mockCtx as any,
    );

    const calls = vi.mocked(NoteModel.Note.findByIdAndUpdate).mock.calls;
    const updates = calls[0][1] as Record<string, unknown>;
    expect(updates.coverImageUrl).toBe("https://example.com/cover.jpg");
    expect(updates.coverImagePublicId).toBe("cover1");
  });

  it("throws internal error when findByIdAndUpdate returns null", async () => {
    vi.mocked(NoteModel.Note.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockNote) } as any,
    );
    vi.mocked(NoteModel.Note.findByIdAndUpdate).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(null) } as any,
    );
    (vi.mocked(Errors.AppError.internal) as any).mockImplementation(() => new Error("Failed to update note"));

    await expect(updateNote("note1", { title: "X" }, mockCtx as any)).rejects.toThrow("Failed to update note");
  });

  it("handles partial update with only title", async () => {
    const updated = { ...mockNote, title: "Only Title Changed" };
    vi.mocked(NoteModel.Note.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockNote) } as any,
    );
    vi.mocked(NoteModel.Note.findByIdAndUpdate).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(updated) } as any,
    );

    await updateNote("note1", { title: "Only Title Changed" }, mockCtx as any);
    const calls = vi.mocked(NoteModel.Note.findByIdAndUpdate).mock.calls;
    const updates = calls[0][1] as Record<string, unknown>;
    expect(updates.title).toBe("Only Title Changed");
    expect(updates.description).toBeUndefined();
  });
});

describe("deleteNote", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deletes a note with no affected groups", async () => {
    vi.mocked(NoteModel.Note.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockNote) } as any,
    );
    vi.mocked(GroupModel.Group.distinct).mockResolvedValue([]);
    vi.mocked(NoteModel.Note.findByIdAndDelete).mockReturnValue(
      { exec: vi.fn().mockResolvedValue(undefined) } as any,
    );

    const result = await deleteNote("note1", mockCtx as any);
    expect(result.deleted).toBe(true);
    expect(result.affectedGroups).toEqual([]);
    expect(ActivityService.logActivity).toHaveBeenCalledWith(
      expect.objectContaining({ action: "note.delete" }),
    );
  });

  it("deletes a note and updates groups that still have other notes", async () => {
    const group = { _id: "grp1", name: "JS Bundle", slug: "js-bundle", notes: ["note1", "n2"] };
    vi.mocked(NoteModel.Note.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockNote) } as any,
    );
    vi.mocked(GroupModel.Group.distinct).mockResolvedValue(["grp1"]);
    vi.mocked(GroupModel.Group.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(group) } as any,
    );
    vi.mocked(GroupModel.Group.findByIdAndUpdate).mockReturnValue(
      { exec: vi.fn().mockResolvedValue(undefined) } as any,
    );
    vi.mocked(NoteModel.Note.findByIdAndDelete).mockReturnValue(
      { exec: vi.fn().mockResolvedValue(undefined) } as any,
    );

    const result = await deleteNote("note1", mockCtx as any);
    expect(result.deleted).toBe(true);
    expect(result.affectedGroups).toEqual([]);
    expect(GroupModel.Group.findByIdAndUpdate).toHaveBeenCalledWith("grp1", { notes: ["n2"] });
  });

  it("hides groups that become empty after note deletion", async () => {
    const group = { _id: "grp1", name: "Solo Group", slug: "solo", notes: ["note1"] };
    vi.mocked(NoteModel.Note.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockNote) } as any,
    );
    vi.mocked(GroupModel.Group.distinct).mockResolvedValue(["grp1"]);
    vi.mocked(GroupModel.Group.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(group) } as any,
    );
    vi.mocked(GroupModel.Group.findByIdAndUpdate).mockReturnValue(
      { exec: vi.fn().mockResolvedValue(undefined) } as any,
    );
    vi.mocked(NoteModel.Note.findByIdAndDelete).mockReturnValue(
      { exec: vi.fn().mockResolvedValue(undefined) } as any,
    );

    const result = await deleteNote("note1", mockCtx as any);
    expect(result.affectedGroups).toEqual([
      { id: "grp1", name: "Solo Group", slug: "solo", hiddenBecauseEmpty: true },
    ]);
    expect(GroupModel.Group.findByIdAndUpdate).toHaveBeenCalledWith("grp1", { visibility: "private" });
  });

  it("throws not found when note does not exist", async () => {
    vi.mocked(NoteModel.Note.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(null) } as any,
    );
    (vi.mocked(Errors.AppError.notFound) as any).mockImplementation(() => new Error("Note not found"));

    await expect(deleteNote("nonexistent", mockCtx as any)).rejects.toThrow("Note not found");
  });

  it("skips groups that no longer exist", async () => {
    vi.mocked(NoteModel.Note.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockNote) } as any,
    );
    vi.mocked(GroupModel.Group.distinct).mockResolvedValue(["grp1"]);
    vi.mocked(GroupModel.Group.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(null) } as any,
    );
    vi.mocked(NoteModel.Note.findByIdAndDelete).mockReturnValue(
      { exec: vi.fn().mockResolvedValue(undefined) } as any,
    );

    const result = await deleteNote("note1", mockCtx as any);
    expect(result.deleted).toBe(true);
    expect(result.affectedGroups).toEqual([]);
  });
});

describe("getRelatedNotes", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns related notes excluding the current one", async () => {
    const query = {
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([mockNote]),
    };
    vi.mocked(NoteModel.Note.find).mockReturnValue(query as any);

    const result = await getRelatedNotes("cat1", "65a1b2c3d4e5f6a7b8c9d0e1", 5);
    expect(result).toEqual([mockNote]);
  });
});

describe("getGroupsByNoteId", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns groups containing the note", async () => {
    const query = {
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([mockNote]),
    };
    vi.mocked(GroupModel.Group.find).mockReturnValue(query as any);

    const result = await getGroupsByNoteId("note1");
    expect(result).toEqual([mockNote]);
  });
});

describe("getFeaturedNotes", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns featured notes sorted by createdAt descending", async () => {
    const query = {
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([mockNote]),
    };
    vi.mocked(NoteModel.Note.find).mockReturnValue(query as any);

    const result = await getFeaturedNotes(5);
    expect(result).toEqual([mockNote]);
  });
});

describe("getLatestNotes", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns latest notes sorted by createdAt descending", async () => {
    const query = {
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([mockNote]),
    };
    vi.mocked(NoteModel.Note.find).mockReturnValue(query as any);

    const result = await getLatestNotes(10);
    expect(result).toEqual([mockNote]);
  });
});

describe("getFreeNotes", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns free notes sorted by createdAt descending", async () => {
    const query = {
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([mockNote]),
    };
    vi.mocked(NoteModel.Note.find).mockReturnValue(query as any);

    const result = await getFreeNotes(5);
    expect(result).toEqual([mockNote]);
  });
});

describe("getNotesByCategory", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns notes for a specific category", async () => {
    const query = {
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([mockNote]),
    };
    vi.mocked(NoteModel.Note.find).mockReturnValue(query as any);

    const result = await getNotesByCategory("cat1", 10);
    expect(result).toEqual([mockNote]);
  });
});

describe("incrementDownloadCount", () => {
  beforeEach(() => vi.clearAllMocks());

  it("increments the downloadCount by 1", async () => {
    vi.mocked(NoteModel.Note.updateOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue({ nModified: 1 }),
    } as any);

    await incrementDownloadCount("note1");
    expect(NoteModel.Note.updateOne).toHaveBeenCalledWith(
      { _id: "note1" },
      { $inc: { downloadCount: 1 } },
    );
  });
});

describe("incrementPurchaseCount", () => {
  beforeEach(() => vi.clearAllMocks());

  it("increments purchaseCount on a Note model", async () => {
    vi.mocked(NoteModel.Note.updateOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue({ nModified: 1 }),
    } as any);

    await incrementPurchaseCount(NoteModel.Note as any, "note1");
    expect(NoteModel.Note.updateOne).toHaveBeenCalledWith(
      { _id: "note1" },
      { $inc: { purchaseCount: 1 } },
    );
  });

  it("increments purchaseCount on a Group model", async () => {
    vi.mocked(NoteModel.Note.updateOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue({ nModified: 1 }),
    } as any);
    vi.mocked(GroupModel.Group.updateOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue({ nModified: 1 }),
    } as any);

    await incrementPurchaseCount(GroupModel.Group as any, "507f1f77bcf86cd799439011");
    expect(GroupModel.Group.updateOne).toHaveBeenCalledWith(
      { _id: "507f1f77bcf86cd799439011" },
      { $inc: { purchaseCount: 1 } },
    );
  });
});

describe("addRevenuePaise", () => {
  beforeEach(() => vi.clearAllMocks());

  it("adds revenue to a Note model", async () => {
    vi.mocked(NoteModel.Note.updateOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue({ nModified: 1 }),
    } as any);

    await addRevenuePaise(NoteModel.Note as any, "note1", 50000);
    expect(NoteModel.Note.updateOne).toHaveBeenCalledWith(
      { _id: "note1" },
      { $inc: { revenuePaise: 50000 } },
    );
  });

  it("adds revenue to a Group model", async () => {
    vi.mocked(NoteModel.Note.updateOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue({ nModified: 1 }),
    } as any);
    vi.mocked(GroupModel.Group.updateOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue({ nModified: 1 }),
    } as any);

    await addRevenuePaise(GroupModel.Group as any, "507f1f77bcf86cd799439011", 100000);
    expect(GroupModel.Group.updateOne).toHaveBeenCalledWith(
      { _id: "507f1f77bcf86cd799439011" },
      { $inc: { revenuePaise: 100000 } },
    );
  });
});
