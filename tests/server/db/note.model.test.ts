import { describe, it, expect } from "vitest";
import { Note } from "../../../src/server/db/models/note.model";
import { NOTE_LEVELS, NOTE_PRICING_TYPES, NOTE_VISIBILITIES } from "../../../src/lib/constants";

describe("Note model", () => {
  it("has correct schema fields", () => {
    const schema = Note.schema;
    expect(schema.path("title")).toBeDefined();
    expect(schema.path("slug")).toBeDefined();
    expect(schema.path("description")).toBeDefined();
    expect(schema.path("pricingType")).toBeDefined();
    expect(schema.path("level")).toBeDefined();
    expect(schema.path("pdfSource")).toBeDefined();
    expect(schema.path("price")).toBeDefined();
    expect(schema.path("tags")).toBeDefined();
    expect(schema.path("fullFileUrl")).toBeDefined();
    expect(schema.path("coverImageUrl")).toBeDefined();
    expect(schema.path("purchaseCount")).toBeDefined();
    expect(schema.path("downloadCount")).toBeDefined();
    expect(schema.path("revenuePaise")).toBeDefined();
    expect(schema.path("visibility")).toBeDefined();
    expect(schema.path("isFeatured")).toBeDefined();
    expect(schema.path("createdBy")).toBeDefined();
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

  it("validates pricingType enum", () => {
    const path = Note.schema.path("pricingType") as any;
    expect(path.enumValues).toContain(NOTE_PRICING_TYPES[0]);
    expect(path.isRequired).toBe(true);
  });

  it("validates price min 0", () => {
    const pricePath = Note.schema.path("price") as any;
    expect(pricePath.isRequired).toBe(true);
    expect(pricePath.options.min).toBe(0);
  });

  it("validates pdfSource enum", () => {
    const path = Note.schema.path("pdfSource") as any;
    expect(path.enumValues).toContain("upload");
    expect(path.enumValues).toContain("drive");
    expect(path.defaultValue).toBe("upload");
  });

  it("validates level enum", () => {
    const path = Note.schema.path("level") as any;
    expect(path.enumValues).toContain(NOTE_LEVELS[0]);
    expect(path.isRequired).toBe(true);
  });

  it("defaults downloadCount/purchaseCount/revenuePaise to 0", () => {
    const downloadPath = Note.schema.path("downloadCount") as any;
    const purchasePath = Note.schema.path("purchaseCount") as any;
    const revenuePath = Note.schema.path("revenuePaise") as any;
    expect(downloadPath.defaultValue).toBe(0);
    expect(purchasePath.defaultValue).toBe(0);
    expect(revenuePath.defaultValue).toBe(0);
  });

  it("defaults tags to empty array with index", () => {
    const tagsPath = Note.schema.path("tags") as any;
    expect(tagsPath.instance).toBe("Array");
    expect(tagsPath.defaultValue()).toEqual([]);
    expect(tagsPath.options.index).toBe(true);
  });

  it("has text search index on title/description/tags", () => {
    const indexes = Note.schema.indexes();
    const textIndex = (indexes as any[]).find(([k]: [any, any]) => {
      const keys = Object.keys(k as Record<string, unknown>);
      return keys.includes("title") && keys.includes("description");
    });
    expect(textIndex).toBeDefined();
  });

  it("enables timestamps", () => {
    expect(Note.schema.options.timestamps).toBe(true);
  });

  it("creates a valid note document", async () => {
    const note = new Note({
      title: "React Notes",
      slug: "react-notes",
      pricingType: "paid",
      level: "beginner",
      price: 29900,
      fullFileUrl: "https://example.com/note.pdf",
    });
    expect(note.downloadCount).toBe(0);
    expect(note.purchaseCount).toBe(0);
    expect(note.tags).toEqual([]);
    expect(note.isFeatured).toBe(false);
  });

  it("validates title is required", async () => {
    const note = new Note({
      slug: "react-notes",
      pricingType: "paid",
      level: "beginner",
      price: 29900,
      fullFileUrl: "https://example.com/note.pdf",
    } as any);
    await expect(note.validate()).rejects.toThrow();
  });

  it("validates slug is required", async () => {
    const note = new Note({
      title: "React",
      pricingType: "paid",
      level: "beginner",
      price: 29900,
      fullFileUrl: "https://example.com/note.pdf",
    } as any);
    await expect(note.validate()).rejects.toThrow();
  });

  it("validates description is required", async () => {
    const note = new Note({
      title: "React",
      slug: "react",
      pricingType: "paid",
      level: "beginner",
      price: 29900,
      fullFileUrl: "https://example.com/note.pdf",
    } as any);
    await expect(note.validate()).rejects.toThrow();
  });

  it("validates category is required", async () => {
    const note = new Note({
      title: "React",
      slug: "react",
      pricingType: "paid",
      level: "beginner",
      price: 29900,
      fullFileUrl: "https://example.com/note.pdf",
    } as any);
    await expect(note.validate()).rejects.toThrow();
  });

  it("validates fullFileUrl is required", async () => {
    const note = new Note({
      title: "React",
      slug: "react",
      pricingType: "paid",
      level: "beginner",
      price: 29900,
    } as any);
    await expect(note.validate()).rejects.toThrow();
  });

  it("trims title on creation", async () => {
    const note = new Note({
      title: "  Advanced TypeScript  ",
      slug: "ts-advanced",
      pricingType: "paid",
      level: "intermediate",
      price: 49900,
      fullFileUrl: "https://example.com/ts.pdf",
    });
    expect(note.title).toBe("Advanced TypeScript");
  });

  it("defaults visibility to public", async () => {
    const note = new Note({
      title: "Intro Node",
      slug: "intro-node",
      pricingType: "free",
      level: "beginner",
      price: 0,
      fullFileUrl: "https://example.com/node.pdf",
    });
    expect(note.visibility).toBe("public");
  });

  it("defaults compareAtPrice to null", async () => {
    const note = new Note({
      title: "GraphQL",
      slug: "graphql",
      pricingType: "paid",
      level: "beginner",
      price: 39900,
      fullFileUrl: "https://example.com/gql.pdf",
    });
    expect(note.compareAtPrice).toBeNull();
  });

  it("defaults drivePdfUrl and preview fields to null", async () => {
    const note = new Note({
      title: "REST API",
      slug: "rest-api",
      pricingType: "paid",
      level: "beginner",
      price: 19900,
      fullFileUrl: "https://example.com/rest.pdf",
    });
    expect(note.drivePdfUrl).toBeNull();
    expect(note.previewFileUrl).toBeNull();
    expect(note.previewFilePublicId).toBeNull();
    expect(note.coverImageUrl).toBeNull();
    expect(note.coverImagePublicId).toBeNull();
  });

  it("defaults pageCount to null", async () => {
    const note = new Note({
      title: "Algorithms",
      slug: "algo",
      pricingType: "paid",
      level: "advanced",
      price: 59900,
      fullFileUrl: "https://example.com/algo.pdf",
    });
    expect(note.pageCount).toBeNull();
  });

  it("supports all pdfSource values", async () => {
    const uploadNote = new Note({
      title: "Upload Note",
      slug: "upload-note",
      pricingType: "paid",
      level: "beginner",
      price: 1000,
      fullFileUrl: "https://example.com/upload.pdf",
      pdfSource: "upload",
    });
    expect(uploadNote.pdfSource).toBe("upload");

    const driveNote = new Note({
      title: "Drive Note",
      slug: "drive-note",
      pricingType: "paid",
      level: "beginner",
      price: 1000,
      fullFileUrl: "https://example.com/drive.pdf",
      pdfSource: "drive",
    });
    expect(driveNote.pdfSource).toBe("drive");
  });

  it("supports all visibility values", async () => {
    for (const vis of NOTE_VISIBILITIES) {
      const note = new Note({
        title: `Vis ${vis}`,
        slug: `vis-${vis}`,
        pricingType: "paid",
        level: "beginner",
        price: 1000,
        fullFileUrl: `https://example.com/${vis}.pdf`,
        visibility: vis,
      });
      expect(note.visibility).toBe(vis);
    }
  });

  it("schema has text search index named note_search_index", () => {
    const indexes = Note.schema.indexes();
    const indexNames = (indexes as any[]).map(([k, opts]: [any, any]) => opts?.name).filter(Boolean);
    expect(indexNames).toContain("note_search_index");
  });
});
