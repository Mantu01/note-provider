import { describe, it, expect } from "vitest";
import { toPublicNote, toAdminNote } from "../../../src/server/mappers/note.mapper";

describe("toPublicNote", () => {
  it("returns a full PublicNote from a complete document", () => {
    const now = new Date("2024-01-01");
    const doc = {
      _id: "note1",
      slug: "react-notes",
      title: "React Notes",
      description: "Complete React guide",
      level: "intermediate",
      category: { _id: "cat1", name: "Web Dev", slug: "web-dev", icon: "code" },
      pricingType: "paid",
      price: 50000,
      compareAtPrice: 100000,
      coverImageUrl: "https://example.com/cover.jpg",
      pageCount: 50,
      fullFileBytes: 2000000,
      previewFileUrl: "https://example.com/preview.pdf",
      tags: ["react", "frontend"],
      isFeatured: true,
      downloadCount: 100,
      purchaseCount: 20,
      createdAt: now,
      updatedAt: now,
    };
    const result = toPublicNote(doc);
    expect(result).toEqual({
      id: "note1",
      slug: "react-notes",
      title: "React Notes",
      description: "Complete React guide",
      level: "intermediate",
      category: { id: "cat1", name: "Web Dev", slug: "web-dev", icon: "code" },
      pricingType: "paid",
      price: 50000,
      priceLabel: "₹500",
      compareAtPrice: 100000,
      coverImageUrl: "https://example.com/cover.jpg",
      pageCount: 50,
      fileSizeLabel: "1.9 MB",
      isLocked: true,
      hasPreview: true,
      tags: ["react", "frontend"],
      isFeatured: true,
      downloadCount: 100,
      purchaseCount: 20,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    });
  });

  it("returns a free note with isLocked false", () => {
    const now = new Date("2024-01-01");
    const doc = {
      _id: "note1",
      slug: "free-note",
      title: "Free Note",
      description: "A free note",
      level: "basics",
      category: { _id: "cat1", name: "Test", slug: "test" },
      pricingType: "free",
      price: 0,
      compareAtPrice: null,
      coverImageUrl: null,
      pageCount: null,
      fullFileBytes: 500000,
      previewFileUrl: null,
      tags: [],
      isFeatured: false,
      downloadCount: 0,
      purchaseCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    const result = toPublicNote(doc);
    expect(result.pricingType).toBe("free");
    expect(result.price).toBe(0);
    expect(result.priceLabel).toBe("Free");
    expect(result.isLocked).toBe(false);
    expect(result.hasPreview).toBe(false);
  });

  it("handles paid note without preview", () => {
    const now = new Date("2024-01-01");
    const doc = {
      _id: "note1",
      slug: "paid-no-preview",
      title: "Paid No Preview",
      description: "No preview available",
      level: "advance",
      category: { _id: "cat1", name: "Test", slug: "test" },
      pricingType: "paid",
      price: 200,
      compareAtPrice: null,
      coverImageUrl: null,
      pageCount: null,
      fullFileBytes: 100000,
      previewFileUrl: null,
      tags: [],
      isFeatured: false,
      downloadCount: 0,
      purchaseCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    const result = toPublicNote(doc);
    expect(result.isLocked).toBe(true);
    expect(result.hasPreview).toBe(false);
  });

  it("handles tags as non-array", () => {
    const now = new Date("2024-01-01");
    const doc = {
      _id: "note1",
      slug: "no-tags",
      title: "No Tags",
      description: "No tags here",
      level: "basics",
      category: { _id: "cat1", name: "Test", slug: "test" },
      pricingType: "free",
      price: 0,
      compareAtPrice: null,
      coverImageUrl: null,
      pageCount: null,
      fullFileBytes: 1000,
      previewFileUrl: null,
      tags: "not-an-array",
      isFeatured: false,
      downloadCount: 0,
      purchaseCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    const result = toPublicNote(doc);
    expect(result.tags).toEqual([]);
  });

  it("handles non-object input gracefully", () => {
    const result = toPublicNote(null);
    expect(result.id).toBe("");
    expect(result.slug).toBe("");
    expect(result.title).toBe("");
    expect(result.isLocked).toBe(false);
    expect(result.hasPreview).toBe(false);
  });
});

describe("toAdminNote", () => {
  it("returns a full AdminNote with all fields", () => {
    const now = new Date("2024-01-01");
    const doc = {
      _id: "note1",
      slug: "react-notes",
      title: "React Notes",
      description: "Complete React guide",
      level: "intermediate",
      category: { _id: "cat1", name: "Web Dev", slug: "web-dev", icon: "code" },
      pricingType: "paid",
      price: 50000,
      compareAtPrice: 100000,
      coverImageUrl: "https://example.com/cover.jpg",
      pageCount: 50,
      fullFileBytes: 2000000,
      previewFileUrl: "https://example.com/preview.pdf",
      previewFileBytes: 500000,
      tags: ["react"],
      isFeatured: true,
      downloadCount: 100,
      purchaseCount: 20,
      visibility: "public",
      fullFileUrl: "https://example.com/full.pdf",
      fullFilePublicId: "notes/full/note1",
      previewFilePublicId: "notes/preview/note1",
      coverImagePublicId: "covers/note1",
      createdBy: { _id: "adm1", name: "Admin" },
      updatedBy: { _id: "adm2", name: "Editor" },
      createdAt: now,
      updatedAt: now,
    };
    const result = toAdminNote(doc);
    expect(result.visibility).toBe("public");
    expect(result.fullFileUrl).toBe("https://example.com/full.pdf");
    expect(result.fullFilePublicId).toBe("notes/full/note1");
    expect(result.fullFileBytes).toBe(2000000);
    expect(result.previewFileUrl).toBe("https://example.com/preview.pdf");
    expect(result.previewFilePublicId).toBe("notes/preview/note1");
    expect(result.previewFileBytes).toBe(500000);
    expect(result.coverImagePublicId).toBe("covers/note1");
    expect(result.createdBy).toEqual({ id: "adm1", name: "Admin" });
    expect(result.updatedBy).toEqual({ id: "adm2", name: "Editor" });
  });

  it("handles private visibility", () => {
    const now = new Date("2024-01-01");
    const doc = {
      _id: "note1",
      slug: "private",
      title: "Private Note",
      description: "Private content",
      level: "basics",
      category: { _id: "cat1", name: "Test", slug: "test" },
      pricingType: "free",
      price: 0,
      compareAtPrice: null,
      coverImageUrl: null,
      pageCount: null,
      fullFileBytes: 1000,
      previewFileUrl: null,
      previewFileBytes: null,
      tags: [],
      isFeatured: false,
      downloadCount: 0,
      purchaseCount: 0,
      visibility: "private",
      fullFileUrl: null,
      fullFilePublicId: null,
      previewFilePublicId: null,
      coverImagePublicId: null,
      createdBy: null,
      updatedBy: null,
      createdAt: now,
      updatedAt: now,
    };
    const result = toAdminNote(doc);
    expect(result.visibility).toBe("private");
    expect(result.fullFileUrl).toBeNull();
    expect(result.createdBy).toBeNull();
    expect(result.updatedBy).toBeNull();
  });

  it("defaults visibility to public when not 'private'", () => {
    const now = new Date("2024-01-01");
    const doc = {
      _id: "note1",
      slug: "public",
      title: "Public Note",
      description: "Public content",
      level: "basics",
      category: { _id: "cat1", name: "Test", slug: "test" },
      pricingType: "free",
      price: 0,
      compareAtPrice: null,
      coverImageUrl: null,
      pageCount: null,
      fullFileBytes: 1000,
      previewFileUrl: null,
      previewFileBytes: null,
      tags: [],
      isFeatured: false,
      downloadCount: 0,
      purchaseCount: 0,
      visibility: "public",
      fullFileUrl: null,
      fullFilePublicId: null,
      previewFilePublicId: null,
      coverImagePublicId: null,
      createdBy: null,
      updatedBy: null,
      createdAt: now,
      updatedAt: now,
    };
    const result = toAdminNote(doc);
    expect(result.visibility).toBe("public");
  });

  it("handles non-object input gracefully", () => {
    const result = toAdminNote(null);
    expect(result.id).toBe("");
    expect(result.visibility).toBe("public");
    expect(result.fullFileUrl).toBeNull();
  });
});
