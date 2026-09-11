import { describe, it, expect } from "vitest";
import { Note } from "../../../src/server/db/models/note.model";
import { NOTE_LEVELS, NOTE_PRICING_TYPES, NOTE_VISIBILITIES } from "../../../src/lib/constants";

const validNoteBase = {
  title: "Advanced TypeScript Patterns",
  slug: "advanced-typescript-patterns",
  description: "Comprehensive guide to TypeScript advanced patterns and best practices",
  category: "507f1f77bcf86cd799439011",
  level: "intermediate" as const,
  pricingType: "paid" as const,
  price: 29900,
  fullFileUrl: "https://example.com/typescript-notes.pdf",
};

describe("Note model — schema structure", () => {
  it("has all expected schema fields", () => {
    const schema = Note.schema;
    expect(schema.path("title")).toBeDefined();
    expect(schema.path("slug")).toBeDefined();
    expect(schema.path("description")).toBeDefined();
    expect(schema.path("category")).toBeDefined();
    expect(schema.path("level")).toBeDefined();
    expect(schema.path("visibility")).toBeDefined();
    expect(schema.path("pricingType")).toBeDefined();
    expect(schema.path("price")).toBeDefined();
    expect(schema.path("compareAtPrice")).toBeDefined();
    expect(schema.path("fullFileUrl")).toBeDefined();
    expect(schema.path("fullFilePublicId")).toBeDefined();
    expect(schema.path("fullFileBytes")).toBeDefined();
    expect(schema.path("pdfSource")).toBeDefined();
    expect(schema.path("drivePdfUrl")).toBeDefined();
    expect(schema.path("previewFileUrl")).toBeDefined();
    expect(schema.path("previewFilePublicId")).toBeDefined();
    expect(schema.path("previewFileBytes")).toBeDefined();
    expect(schema.path("coverImageUrl")).toBeDefined();
    expect(schema.path("coverImagePublicId")).toBeDefined();
    expect(schema.path("pageCount")).toBeDefined();
    expect(schema.path("tags")).toBeDefined();
    expect(schema.path("isFeatured")).toBeDefined();
    expect(schema.path("downloadCount")).toBeDefined();
    expect(schema.path("purchaseCount")).toBeDefined();
    expect(schema.path("revenuePaise")).toBeDefined();
    expect(schema.path("createdBy")).toBeDefined();
    expect(schema.path("updatedBy")).toBeDefined();
  });

  it("title is required, trimmed, with correct length limits", () => {
    const titlePath = Note.schema.path("title") as any;
    expect(titlePath.isRequired).toBe(true);
    expect(titlePath.options.trim).toBe(true);
    expect(titlePath.options.minlength).toBe(3);
    expect(titlePath.options.maxlength).toBe(160);
  });

  it("slug is required, unique, indexed", () => {
    const slugPath = Note.schema.path("slug") as any;
    expect(slugPath.isRequired).toBe(true);
    expect(slugPath.options.unique).toBe(true);
    expect(slugPath.options.index).toBe(true);
  });

  it("description is required with correct length limits", () => {
    const descPath = Note.schema.path("description") as any;
    expect(descPath.isRequired).toBe(true);
    expect(descPath.options.minlength).toBe(10);
    expect(descPath.options.maxlength).toBe(5000);
  });

  it("pricingType enum contains all NOTE_PRICING_TYPES", () => {
    const path = Note.schema.path("pricingType") as any;
    for (const pt of NOTE_PRICING_TYPES) {
      expect(path.enumValues).toContain(pt);
    }
    expect(path.isRequired).toBe(true);
    expect(path.options.index).toBe(true);
  });

  it("level enum contains all NOTE_LEVELS", () => {
    const path = Note.schema.path("level") as any;
    for (const level of NOTE_LEVELS) {
      expect(path.enumValues).toContain(level);
    }
    expect(path.isRequired).toBe(true);
    expect(path.options.index).toBe(true);
  });

  it("visibility enum contains all NOTE_VISIBILITIES with public default", () => {
    const path = Note.schema.path("visibility") as any;
    for (const vis of NOTE_VISIBILITIES) {
      expect(path.enumValues).toContain(vis);
    }
    expect(path.defaultValue).toBe("public");
    expect(path.options.index).toBe(true);
  });

  it("price is required with min of 0", () => {
    const pricePath = Note.schema.path("price") as any;
    expect(pricePath.isRequired).toBe(true);
    expect(pricePath.options.min).toBe(0);
  });

  it("fullFileUrl is required", () => {
    const path = Note.schema.path("fullFileUrl") as any;
    expect(path.isRequired).toBe(true);
  });

  it("pdfSource enum has correct values and defaults to upload", () => {
    const path = Note.schema.path("pdfSource") as any;
    expect(path.enumValues).toContain("upload");
    expect(path.enumValues).toContain("drive");
    expect(path.defaultValue).toBe("upload");
    expect(path.options.index).toBe(true);
  });

  it("tags is an indexed array defaulting to empty", () => {
    const tagsPath = Note.schema.path("tags") as any;
    expect(tagsPath.instance).toBe("Array");
    expect(tagsPath.defaultValue()).toEqual([]);
    expect(tagsPath.options.index).toBe(true);
  });

  it("isFeatured defaults to false and is indexed", () => {
    const path = Note.schema.path("isFeatured") as any;
    expect(path.defaultValue).toBe(false);
    expect(path.options.index).toBe(true);
  });

  it("downloadCount, purchaseCount, revenuePaise default to 0", () => {
    expect((Note.schema.path("downloadCount") as any).defaultValue).toBe(0);
    expect((Note.schema.path("purchaseCount") as any).defaultValue).toBe(0);
    expect((Note.schema.path("revenuePaise") as any).defaultValue).toBe(0);
  });

  it("has timestamps enabled", () => {
    expect(Note.schema.options.timestamps).toBe(true);
  });

  it("has text search index named note_search_index", () => {
    const indexes = Note.schema.indexes();
    const indexNames = (indexes as any[]).map(([, opts]: [any, any]) => opts?.name).filter(Boolean);
    expect(indexNames).toContain("note_search_index");
  });

  it("text search index includes title, description, and tags", () => {
    const indexes = Note.schema.indexes();
    const textIndex = (indexes as any[]).find(([k]: [any, any]) => {
      const keys = Object.keys(k as Record<string, unknown>);
      return keys.includes("title") && keys.includes("description") && keys.includes("tags");
    });
    expect(textIndex).toBeDefined();
  });

  it("has composite index on visibility+createdAt", () => {
    const indexes = Note.schema.indexes();
    const indexKeys = (indexes as any[]).map(([k]: [any, any]) => k);
    expect(indexKeys.some((k: Record<string, number>) => k.visibility !== undefined && k.createdAt !== undefined)).toBe(true);
  });

  it("has composite index on category+level+pricingType", () => {
    const indexes = Note.schema.indexes();
    const indexKeys = (indexes as any[]).map(([k]: [any, any]) => k);
    expect(indexKeys.some((k: Record<string, number>) => k.category !== undefined && k.level !== undefined && k.pricingType !== undefined)).toBe(true);
  });

  it("has index on price field", () => {
    const indexes = Note.schema.indexes();
    const indexKeys = (indexes as any[]).map(([k]: [any, any]) => k);
    expect(indexKeys.some((k: Record<string, number>) => k.price !== undefined && Object.keys(k).length === 1)).toBe(true);
  });

  it("has composite index on isFeatured+createdAt", () => {
    const indexes = Note.schema.indexes();
    const indexKeys = (indexes as any[]).map(([k]: [any, any]) => k);
    expect(indexKeys.some((k: Record<string, number>) => k.isFeatured !== undefined && k.createdAt !== undefined)).toBe(true);
  });
});

describe("Note model — document instantiation", () => {
  it("creates valid note with correct defaults", async () => {
    const note = new Note(validNoteBase);
    expect(note.downloadCount).toBe(0);
    expect(note.purchaseCount).toBe(0);
    expect(note.revenuePaise).toBe(0);
    expect(note.tags).toEqual([]);
    expect(note.isFeatured).toBe(false);
    expect(note.visibility).toBe("public");
    expect(note.pdfSource).toBe("upload");
    expect(note.compareAtPrice).toBeNull();
    expect(note.drivePdfUrl).toBeNull();
    expect(note.previewFileUrl).toBeNull();
    expect(note.previewFilePublicId).toBeNull();
    expect(note.coverImageUrl).toBeNull();
    expect(note.coverImagePublicId).toBeNull();
    expect(note.pageCount).toBeNull();
    expect(note.fullFileBytes).toBe(0);
  });

  it("trims title on creation", async () => {
    const note = new Note({ ...validNoteBase, title: "  Advanced TypeScript  " });
    expect(note.title).toBe("Advanced TypeScript");
  });

  it("accepts all NOTE_LEVELS values", async () => {
    for (const level of NOTE_LEVELS) {
      const note = new Note({ ...validNoteBase, slug: `note-${level}`, level });
      expect(note.level).toBe(level);
    }
  });

  it("accepts all NOTE_PRICING_TYPES values", async () => {
    for (const pricingType of NOTE_PRICING_TYPES) {
      const note = new Note({ ...validNoteBase, slug: `note-${pricingType}`, pricingType, price: 0 });
      expect(note.pricingType).toBe(pricingType);
    }
  });

  it("accepts all NOTE_VISIBILITIES values", async () => {
    for (const vis of NOTE_VISIBILITIES) {
      const note = new Note({ ...validNoteBase, slug: `note-vis-${vis}`, visibility: vis });
      expect(note.visibility).toBe(vis);
    }
  });

  it("accepts both pdfSource values (upload and drive)", async () => {
    const uploadNote = new Note({ ...validNoteBase, slug: "upload-note", pdfSource: "upload" });
    expect(uploadNote.pdfSource).toBe("upload");

    const driveNote = new Note({ ...validNoteBase, slug: "drive-note", pdfSource: "drive" });
    expect(driveNote.pdfSource).toBe("drive");
  });

  it("allows tags array to be set", async () => {
    const note = new Note({ ...validNoteBase, tags: ["typescript", "patterns", "advanced"] });
    expect(note.tags).toEqual(["typescript", "patterns", "advanced"]);
  });

  it("allows isFeatured to be true", async () => {
    const note = new Note({ ...validNoteBase, isFeatured: true });
    expect(note.isFeatured).toBe(true);
  });

  it("allows compareAtPrice to be set", async () => {
    const note = new Note({ ...validNoteBase, compareAtPrice: 49900 });
    expect(note.compareAtPrice).toBe(49900);
  });

  it("allows drivePdfUrl for drive source notes", async () => {
    const note = new Note({ ...validNoteBase, pdfSource: "drive", drivePdfUrl: "https://drive.google.com/file" });
    expect(note.drivePdfUrl).toBe("https://drive.google.com/file");
  });

  it("allows pageCount to be set", async () => {
    const note = new Note({ ...validNoteBase, pageCount: 42 });
    expect(note.pageCount).toBe(42);
  });

  it("allows setting preview file fields", async () => {
    const note = new Note({
      ...validNoteBase,
      previewFileUrl: "https://example.com/preview.pdf",
      previewFilePublicId: "notes/preview/abc123",
      previewFileBytes: 1024,
    });
    expect(note.previewFileUrl).toBe("https://example.com/preview.pdf");
    expect(note.previewFilePublicId).toBe("notes/preview/abc123");
    expect(note.previewFileBytes).toBe(1024);
  });

  it("allows setting cover image fields", async () => {
    const note = new Note({
      ...validNoteBase,
      coverImageUrl: "https://example.com/cover.jpg",
      coverImagePublicId: "covers/abc123",
    });
    expect(note.coverImageUrl).toBe("https://example.com/cover.jpg");
    expect(note.coverImagePublicId).toBe("covers/abc123");
  });
});

describe("Note model — validation", () => {
  it("rejects missing title", async () => {
    const { title: _t, ...rest } = validNoteBase;
    const note = new Note(rest as any);
    await expect(note.validate()).rejects.toThrow();
  });

  it("rejects missing slug", async () => {
    const { slug: _s, ...rest } = validNoteBase;
    const note = new Note(rest as any);
    await expect(note.validate()).rejects.toThrow();
  });

  it("rejects missing description", async () => {
    const { description: _d, ...rest } = validNoteBase;
    const note = new Note(rest as any);
    await expect(note.validate()).rejects.toThrow();
  });

  it("rejects missing category", async () => {
    const { category: _c, ...rest } = validNoteBase;
    const note = new Note(rest as any);
    await expect(note.validate()).rejects.toThrow();
  });

  it("rejects missing level", async () => {
    const { level: _l, ...rest } = validNoteBase;
    const note = new Note(rest as any);
    await expect(note.validate()).rejects.toThrow();
  });

  it("rejects missing pricingType", async () => {
    const { pricingType: _pt, ...rest } = validNoteBase;
    const note = new Note(rest as any);
    await expect(note.validate()).rejects.toThrow();
  });

  it("rejects missing fullFileUrl", async () => {
    const { fullFileUrl: _f, ...rest } = validNoteBase;
    const note = new Note(rest as any);
    await expect(note.validate()).rejects.toThrow();
  });

  it("rejects title shorter than 3 characters", async () => {
    const note = new Note({ ...validNoteBase, title: "AB" });
    await expect(note.validate()).rejects.toThrow();
  });

  it("rejects title longer than 160 characters", async () => {
    const note = new Note({ ...validNoteBase, title: "A".repeat(161) });
    await expect(note.validate()).rejects.toThrow();
  });

  it("rejects description shorter than 10 characters", async () => {
    const note = new Note({ ...validNoteBase, description: "Short" });
    await expect(note.validate()).rejects.toThrow();
  });

  it("rejects description longer than 5000 characters", async () => {
    const note = new Note({ ...validNoteBase, description: "A".repeat(5001) });
    await expect(note.validate()).rejects.toThrow();
  });

  it("rejects price below 0", async () => {
    const note = new Note({ ...validNoteBase, price: -1 });
    await expect(note.validate()).rejects.toThrow();
  });

  it("accepts price of 0 (for free notes)", async () => {
    const note = new Note({ ...validNoteBase, pricingType: "free", price: 0 });
    await expect(note.validate()).resolves.toBeUndefined();
  });

  it("rejects invalid level value", async () => {
    const note = new Note({ ...validNoteBase, level: "expert" as any });
    await expect(note.validate()).rejects.toThrow();
  });

  it("rejects invalid pricingType value", async () => {
    const note = new Note({ ...validNoteBase, pricingType: "freemium" as any });
    await expect(note.validate()).rejects.toThrow();
  });

  it("rejects invalid visibility value", async () => {
    const note = new Note({ ...validNoteBase, visibility: "draft" as any });
    await expect(note.validate()).rejects.toThrow();
  });

  it("rejects invalid pdfSource value", async () => {
    const note = new Note({ ...validNoteBase, pdfSource: "s3" as any });
    await expect(note.validate()).rejects.toThrow();
  });

  it("passes validation with all valid required fields", async () => {
    const note = new Note(validNoteBase);
    await expect(note.validate()).resolves.toBeUndefined();
  });

  it("passes validation with all optional fields set", async () => {
    const note = new Note({
      ...validNoteBase,
      compareAtPrice: 49900,
      fullFilePublicId: "notes/full/abc123",
      fullFileBytes: 1024000,
      pdfSource: "upload",
      previewFileUrl: "https://example.com/preview.pdf",
      previewFilePublicId: "notes/preview/abc123",
      previewFileBytes: 204800,
      coverImageUrl: "https://example.com/cover.jpg",
      coverImagePublicId: "covers/abc123",
      pageCount: 42,
      tags: ["typescript", "advanced"],
      isFeatured: true,
      visibility: "public",
    });
    await expect(note.validate()).resolves.toBeUndefined();
  });
});
