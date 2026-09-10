import { describe, it, expect } from "vitest";
import { Note } from "../../../src/server/db/models/note.model";

describe("Note model", () => {
  it("has correct schema fields", () => {
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
    expect(schema.path("pdfSource")).toBeDefined();
    expect(schema.path("drivePdfUrl")).toBeDefined();
    expect(schema.path("previewFileUrl")).toBeDefined();
    expect(schema.path("coverImageUrl")).toBeDefined();
    expect(schema.path("pageCount")).toBeDefined();
    expect(schema.path("tags")).toBeDefined();
    expect(schema.path("isFeatured")).toBeDefined();
    expect(schema.path("downloadCount")).toBeDefined();
    expect(schema.path("purchaseCount")).toBeDefined();
    expect(schema.path("revenuePaise")).toBeDefined();
    expect(schema.path("createdBy")).toBeDefined();
    expect(schema.path("updatedBy")).toBeDefined();
  });

  it("validates title constraints", () => {
    const titlePath = Note.schema.path("title") as any;
    expect(titlePath.isRequired).toBe(true);
    expect(titlePath.options.trim).toBe(true);
    expect(titlePath.options.minlength).toBe(3);
    expect(titlePath.options.maxlength).toBe(160);
  });

  it("validates slug constraints", () => {
    const slugPath = Note.schema.path("slug") as any;
    expect(slugPath.isRequired).toBe(true);
    expect(slugPath.options.unique).toBe(true);
    expect(slugPath.options.index).toBe(true);
  });

  it("validates description constraints", () => {
    const descPath = Note.schema.path("description") as any;
    expect(descPath.isRequired).toBe(true);
    expect(descPath.options.minlength).toBe(10);
    expect(descPath.options.maxlength).toBe(5000);
  });

  it("validates pricingType enum", () => {
    const pricingPath = Note.schema.path("pricingType") as any;
    expect(pricingPath.isRequired).toBe(true);
    expect(pricingPath.enumValues).toContain("free");
    expect(pricingPath.enumValues).toContain("paid");
    expect(pricingPath.options.index).toBe(true);
  });

  it("validates price min 0", () => {
    const pricePath = Note.schema.path("price") as any;
    expect(pricePath.isRequired).toBe(true);
    expect(pricePath.options.min).toBe(0);
    expect(pricePath.defaultValue).toBe(0);
  });

  it("validates pdfSource enum", () => {
    const pdfPath = Note.schema.path("pdfSource") as any;
    expect(pdfPath.enumValues).toContain("upload");
    expect(pdfPath.enumValues).toContain("drive");
    expect(pdfPath.defaultValue).toBe("upload");
    expect(pdfPath.options.index).toBe(true);
  });

  it("validates level enum", () => {
    const levelPath = Note.schema.path("level") as any;
    expect(levelPath.isRequired).toBe(true);
    expect(levelPath.options.index).toBe(true);
  });

  it("defaults downloadCount/purchaseCount/revenuePaise to 0", () => {
    expect(Note.schema.path("downloadCount").defaultValue).toBe(0);
    expect(Note.schema.path("purchaseCount").defaultValue).toBe(0);
    expect(Note.schema.path("revenuePaise").defaultValue).toBe(0);
  });

  it("defaults tags to empty array with index", () => {
    const tagsPath = Note.schema.path("tags") as any;
    expect(tagsPath.defaultValue()).toEqual([]);
    expect(tagsPath.options.index).toBe(true);
  });

  it("has text search index", () => {
    const indexes = Note.schema.indexes();
    const textIndex = indexes.find(
      ([k]: [Record<string, unknown>, unknown]) => k.title === "text",
    );
    expect(textIndex).toBeDefined();
    const key = textIndex![0] as Record<string, string>;
    expect(key.title).toBe("text");
    expect(key.description).toBe("text");
    expect(key.tags).toBe("text");
  });

  it("enables timestamps", () => {
    expect(Note.schema.options.timestamps).toBe(true);
  });

  it("creates a valid note document", async () => {
    const note = new Note({
      title: "React Notes",
      slug: "react-notes",
      description: "Complete React guide for beginners",
      category: "507f1f77bcf86cd799439011",
      level: "intermediate",
      pricingType: "paid",
      price: 500,
      fullFileUrl: "https://example.com/note.pdf",
    });
    expect(note.visibility).toBe("public");
    expect(note.pdfSource).toBe("upload");
    expect(note.isFeatured).toBe(false);
    expect(note.downloadCount).toBe(0);
    expect(note.coverImageUrl).toBeNull();
    expect(note.pageCount).toBeNull();
  });
});
