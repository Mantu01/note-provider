import { describe, it, expect } from "vitest";
import { Category } from "../../../src/server/db/models/category.model";

describe("Category model", () => {
  it("has correct schema fields", () => {
    const schema = Category.schema;
    expect(schema.path("name")).toBeDefined();
    expect(schema.path("slug")).toBeDefined();
    expect(schema.path("subjects")).toBeDefined();
  });

  it("validates name constraints", () => {
    const namePath = Category.schema.path("name") as any;
    expect(namePath.isRequired).toBe(true);
    expect(namePath.options.trim).toBe(true);
  });

  it("validates slug constraints", () => {
    const slugPath = Category.schema.path("slug") as any;
    expect(slugPath.isRequired).toBe(true);
    expect(slugPath.options.unique).toBe(true);
    expect(slugPath.options.index).toBe(true);
  });

  it("validates subjects subdocument structure", () => {
    const subjectsPath = Category.schema.path("subjects") as any;
    expect(subjectsPath.schema.path("name")).toBeDefined();
    expect(subjectsPath.schema.path("slug")).toBeDefined();
    expect(subjectsPath.schema.path("order")).toBeDefined();
    expect(subjectsPath.schema.path("isActive")).toBeDefined();
  });

  it("has custom indexes", () => {
    const indexes = Category.schema.indexes();
    const indexKeys = (indexes as any[]).map(([k]: [any, any]) => k);
    expect(indexKeys.some((k: Record<string, number>) => k.name)).toBe(true);
    expect(indexKeys.some((k: Record<string, number>) => k["subjects.slug"])).toBe(true);
  });

  it("creates a valid category document", async () => {
    const category = new Category({
      name: "Mathematics",
      slug: "mathematics",
    });
    expect(category.name).toBe("Mathematics");
    expect(category.slug).toBe("mathematics");
  });

  it("validates name is required", async () => {
    const category = new Category({ slug: "math" } as any);
    await expect(category.validate()).rejects.toThrow();
  });

  it("validates slug is required", async () => {
    const category = new Category({ name: "Math" } as any);
    await expect(category.validate()).rejects.toThrow();
  });

  it("trims name and subject names", async () => {
    const category = new Category({
      name: "  Physics  ",
      slug: "physics",
      subjects: [{ name: "  Mechanics  ", slug: "mechanics" }],
    });
    expect(category.name).toBe("Physics");
    expect(category.subjects[0].name).toBe("Mechanics");
  });

  it("defaults subjects to empty array", async () => {
    const category = new Category({ name: "Chemistry", slug: "chemistry" });
    expect(category.subjects).toEqual([]);
  });

  it("defaults order to 0", async () => {
    const category = new Category({ name: "Biology", slug: "biology" });
    expect((category as any).order).toBe(0);
  });

  it("defaults isActive to true", async () => {
    const category = new Category({ name: "Art", slug: "art" });
    expect(category.isActive).toBe(true);
  });

  it("validates description maxlength 300", async () => {
    const descPath = Category.schema.path("description") as any;
    expect(descPath.options.maxlength).toBe(300);
  });

  it("defaults description to null", async () => {
    const category = new Category({ name: "Music", slug: "music" });
    expect(category.description).toBeNull();
  });

  it("has text/index support on slug field", async () => {
    const slugPath = Category.schema.path("slug") as any;
    expect(slugPath.options.index).toBe(true);
  });

  it("enables timestamps in schema options", async () => {
    expect(Category.schema.options.timestamps).toBe(true);
  });

  it("has index on subjects.slug subfield", () => {
    const indexes = Category.schema.indexes();
    const subjIndex = (indexes as any[]).find(
      ([k]: [Record<string, number>, unknown]) => k["subjects.slug"],
    );
    expect(subjIndex).toBeDefined();
  });

  it("trims subject names", async () => {
    const cat = new Category({
      name: "Math",
      slug: "math",
      subjects: [{ name: "  Algebra  ", slug: "algebra" }],
    });
    expect(cat.subjects[0].name).toBe("Algebra");
  });
});
