import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  listActiveCategories,
  getCategoryById,
  getCategoryBySlug,
  getCategoryWithNoteCount,
  getCategoryCounts,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../src/server/services/category.service";
import * as CategoryModel from "../../../src/server/db/models/category.model";
import * as NoteModel from "../../../src/server/db/models/note.model";
import * as GroupModel from "../../../src/server/db/models/group.model";
import * as ActivityService from "../../../src/server/services/activity.service";
import * as SlugLib from "../../../src/server/lib/slug";
import * as Errors from "../../../src/server/lib/errors";

vi.mock("../../../src/server/db/models/category.model", () => ({
  Category: {
    find: vi.fn(),
    findById: vi.fn(),
    findOne: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("../../../src/server/db/models/note.model", () => ({
  Note: {
    countDocuments: vi.fn(),
    aggregate: vi.fn(),
  },
}));

vi.mock("../../../src/server/db/models/group.model", () => ({
  Group: {
    countDocuments: vi.fn(),
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
    internal: vi.fn((msg: string) => new Error(msg)),
  },
}));

const validObjectId = "65a1b2c3d4e5f6a7b8c9d0e1";
const mockCtx = {
  ip: "1.2.3.4",
  userAgent: "Mozilla/5.0",
  admin: { _id: validObjectId, name: "Admin" },
};

const mockCategory = {
  _id: "cat1",
  name: "Web Development",
  slug: "web-dev",
  description: "Learn web dev",
  icon: "code",
  order: 1,
  isActive: true,
  subjects: [],
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

describe("listActiveCategories", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns active categories sorted by order then name", async () => {
    const query = {
      sort: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([mockCategory]),
    };
    vi.mocked(CategoryModel.Category.find).mockReturnValue(query as any);

    const result = await listActiveCategories();
    expect(CategoryModel.Category.find).toHaveBeenCalledWith({ isActive: true });
    expect(result).toEqual([mockCategory]);
  });
});

describe("getCategoryById", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns a category when found", async () => {
    const query = { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockCategory) };
    vi.mocked(CategoryModel.Category.findById).mockReturnValue(query as any);

    const result = await getCategoryById("cat1");
    expect(CategoryModel.Category.findById).toHaveBeenCalledWith("cat1");
    expect(result).toEqual(mockCategory);
  });

  it("returns null when not found", async () => {
    const query = { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(null) };
    vi.mocked(CategoryModel.Category.findById).mockReturnValue(query as any);

    const result = await getCategoryById("nonexistent");
    expect(result).toBeNull();
  });
});

describe("getCategoryBySlug", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns a category when found", async () => {
    const query = { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockCategory) };
    vi.mocked(CategoryModel.Category.findOne).mockReturnValue(query as any);

    const result = await getCategoryBySlug("web-dev");
    expect(CategoryModel.Category.findOne).toHaveBeenCalledWith({ slug: "web-dev", isActive: true });
    expect(result).toEqual(mockCategory);
  });

  it("returns null when not found", async () => {
    const query = { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(null) };
    vi.mocked(CategoryModel.Category.findOne).mockReturnValue(query as any);

    const result = await getCategoryBySlug("nonexistent");
    expect(result).toBeNull();
  });
});

describe("getCategoryWithNoteCount", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns category and noteCount when found", async () => {
    vi.mocked(CategoryModel.Category.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockCategory) } as any,
    );
    vi.mocked(NoteModel.Note.countDocuments).mockResolvedValue(5);

    const result = await getCategoryWithNoteCount("cat1");
    expect(result.category).toEqual(mockCategory);
    expect(result.noteCount).toBe(5);
  });

  it("throws not found when category does not exist", async () => {
    vi.mocked(CategoryModel.Category.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(null) } as any,
    );
    (vi.mocked(Errors.AppError.notFound) as any).mockImplementation(() => new Error("Category not found"));

    await expect(getCategoryWithNoteCount("nonexistent")).rejects.toThrow("Category not found");
  });
});

describe("getCategoryCounts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns note counts grouped by category", async () => {
    vi.mocked(NoteModel.Note.aggregate).mockResolvedValue([
      { _id: "cat1", noteCount: 5 },
      { _id: "cat2", noteCount: 3 },
    ]);

    const result = await getCategoryCounts();
    expect(result).toEqual([
      { categoryId: "cat1", noteCount: 5 },
      { categoryId: "cat2", noteCount: 3 },
    ]);
  });

  it("returns empty array when no categories have notes", async () => {
    vi.mocked(NoteModel.Note.aggregate).mockResolvedValue([]);

    const result = await getCategoryCounts();
    expect(result).toEqual([]);
  });
});

describe("createCategory", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates a category with auto-generated slug", async () => {
    vi.mocked(SlugLib.uniqueSlug).mockResolvedValue("web-dev");
    vi.mocked(CategoryModel.Category.create).mockResolvedValue(mockCategory as any);

    const result = await createCategory(
      { name: "Web Development", description: "Learn web dev", subjects: [] },
      mockCtx as any,
    );

    expect(SlugLib.uniqueSlug).toHaveBeenCalledWith(expect.any(Object), "Web Development");
    expect(CategoryModel.Category.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Web Development",
        slug: "web-dev",
        createdBy: expect.any(Object),
        updatedBy: expect.any(Object),
      }),
    );
    expect(ActivityService.logActivity).toHaveBeenCalledWith(
      expect.objectContaining({ action: "category.create" }),
    );
    expect(result).toEqual(mockCategory);
  });
});

describe("updateCategory", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates a category with provided fields", async () => {
    const updated = { ...mockCategory, name: "Updated Name" };
    vi.mocked(CategoryModel.Category.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockCategory) } as any,
    );
    vi.mocked(CategoryModel.Category.findByIdAndUpdate).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(updated) } as any,
    );

    const result = await updateCategory("cat1", { name: "Updated Name" }, mockCtx as any);
    expect(result.name).toBe("Updated Name");
    expect(ActivityService.logActivity).toHaveBeenCalledWith(
      expect.objectContaining({ action: "category.update" }),
    );
  });

  it("throws not found when category does not exist", async () => {
    vi.mocked(CategoryModel.Category.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(null) } as any,
    );
    (vi.mocked(Errors.AppError.notFound) as any).mockImplementation(() => new Error("Category not found"));

    await expect(
      updateCategory("nonexistent", { name: "X" }, mockCtx as any),
    ).rejects.toThrow("Category not found");
  });

  it("throws internal error when findByIdAndUpdate returns null", async () => {
    vi.mocked(CategoryModel.Category.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockCategory) } as any,
    );
    vi.mocked(CategoryModel.Category.findByIdAndUpdate).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(null) } as any,
    );
    (vi.mocked(Errors.AppError.internal) as any).mockImplementation(() => new Error("Internal error"));

    await expect(
      updateCategory("cat1", { name: "X" }, mockCtx as any),
    ).rejects.toThrow("Internal error");
  });

  it("only updates provided fields", async () => {
    const updated = { ...mockCategory, icon: "new-icon" };
    vi.mocked(CategoryModel.Category.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockCategory) } as any,
    );
    vi.mocked(CategoryModel.Category.findByIdAndUpdate).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(updated) } as any,
    );

    await updateCategory("cat1", { icon: "new-icon" }, mockCtx as any);
    const calls = vi.mocked(CategoryModel.Category.findByIdAndUpdate).mock.calls;
    const updates = calls[0][1] as Record<string, unknown>;
    expect(updates.icon).toBe("new-icon");
    expect(updates.name).toBeUndefined();
    expect(updates.description).toBeUndefined();
  });

  it("handles isActive false correctly", async () => {
    const updated = { ...mockCategory, isActive: false };
    vi.mocked(CategoryModel.Category.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockCategory) } as any,
    );
    vi.mocked(CategoryModel.Category.findByIdAndUpdate).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(updated) } as any,
    );

    await updateCategory("cat1", { isActive: false }, mockCtx as any);
    const calls = vi.mocked(CategoryModel.Category.findByIdAndUpdate).mock.calls;
    const updates = calls[0][1] as Record<string, unknown>;
    expect(updates.isActive).toBe(false);
  });
});

describe("deleteCategory", () => {
  beforeEach(() => vi.clearAllMocks());

  it("refuses deletion when notes exist", async () => {
    vi.mocked(CategoryModel.Category.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockCategory) } as any,
    );
    vi.mocked(NoteModel.Note.countDocuments).mockResolvedValue(2);
    vi.mocked(GroupModel.Group.countDocuments).mockResolvedValue(0);

    const result = await deleteCategory("cat1", mockCtx as any);
    expect(result.refused).toBe(true);
    expect(result.conflictMessage).toContain("2 notes");
    expect(ActivityService.logActivity).toHaveBeenCalledWith(
      expect.objectContaining({ action: "category.delete", metadata: expect.objectContaining({ refused: true }) }),
    );
    expect(CategoryModel.Category.findByIdAndDelete).not.toHaveBeenCalled();
  });

  it("refuses deletion when groups exist", async () => {
    vi.mocked(CategoryModel.Category.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockCategory) } as any,
    );
    vi.mocked(NoteModel.Note.countDocuments).mockResolvedValue(0);
    vi.mocked(GroupModel.Group.countDocuments).mockResolvedValue(3);

    const result = await deleteCategory("cat1", mockCtx as any);
    expect(result.refused).toBe(true);
    expect(result.conflictMessage).toContain("3 groups");
  });

  it("refuses deletion when both notes and groups exist", async () => {
    vi.mocked(CategoryModel.Category.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockCategory) } as any,
    );
    vi.mocked(NoteModel.Note.countDocuments).mockResolvedValue(1);
    vi.mocked(GroupModel.Group.countDocuments).mockResolvedValue(2);

    const result = await deleteCategory("cat1", mockCtx as any);
    expect(result.refused).toBe(true);
    expect(result.conflictMessage).toContain("1 note and 2 groups");
  });

  it("throws not found when category does not exist", async () => {
    vi.mocked(CategoryModel.Category.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(null) } as any,
    );
    (vi.mocked(Errors.AppError.notFound) as any).mockImplementation(() => new Error("Category not found"));

    await expect(deleteCategory("nonexistent", mockCtx as any)).rejects.toThrow("Category not found");
  });

  it("deletes category when no notes or groups exist", async () => {
    vi.mocked(CategoryModel.Category.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockCategory) } as any,
    );
    vi.mocked(NoteModel.Note.countDocuments).mockResolvedValue(0);
    vi.mocked(GroupModel.Group.countDocuments).mockResolvedValue(0);
    vi.mocked(CategoryModel.Category.findByIdAndDelete).mockReturnValue(
      { exec: vi.fn().mockResolvedValue(undefined) } as any,
    );

    const result = await deleteCategory("cat1", mockCtx as any);
    expect(result.refused).toBe(false);
    expect(CategoryModel.Category.findByIdAndDelete).toHaveBeenCalledWith("cat1");
    expect(ActivityService.logActivity).toHaveBeenCalledWith(
      expect.objectContaining({ action: "category.delete" }),
    );
  });

  it("uses singular 'note' when only one note exists", async () => {
    vi.mocked(CategoryModel.Category.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockCategory) } as any,
    );
    vi.mocked(NoteModel.Note.countDocuments).mockResolvedValue(1);
    vi.mocked(GroupModel.Group.countDocuments).mockResolvedValue(0);

    const result = await deleteCategory("cat1", mockCtx as any);
    expect(result.conflictMessage).toContain("1 note");
  });
});
