import { describe, it, expect } from "vitest";
import { Category } from "../../../src/server/db/models/category.model";

describe("Category model — schema structure", () => {
  it("has all expected top-level fields", () => {
    const schema = Category.schema;
    expect(schema.path("name")).toBeDefined();
    expect(schema.path("slug")).toBeDefined();
    expect(schema.path("description")).toBeDefined();
    expect(schema.path("icon")).toBeDefined();
    expect(schema.path("order")).toBeDefined();
    expect(schema.path("isActive")).toBeDefined();
    expect(schema.path("subjects")).toBeDefined();
    expect(schema.path("createdBy")).toBeDefined();
    expect(schema.path("updatedBy")).toBeDefined();
  });

  it("name is required, unique, trimmed with correct lengths", () => {
    const namePath = Category.schema.path("name") as any;
    expect(namePath.isRequired).toBe(true);
    expect(namePath.options.unique).toBe(true);
    expect(namePath.options.trim).toBe(true);
    expect(namePath.options.minlength).toBe(2);
    expect(namePath.options.maxlength).toBe(60);
  });

  it("slug is required, unique, indexed", () => {
    const slugPath = Category.schema.path("slug") as any;
    expect(slugPath.isRequired).toBe(true);
    expect(slugPath.options.unique).toBe(true);
    expect(slugPath.options.index).toBe(true);
  });

  it("description has maxlength of 300", () => {
    const descPath = Category.schema.path("description") as any;
    expect(descPath.options.maxlength).toBe(300);
  });

  it("subjects subdocument has correct fields", () => {
    const subjectsPath = Category.schema.path("subjects") as any;
    expect(subjectsPath.schema.path("name")).toBeDefined();
    expect(subjectsPath.schema.path("slug")).toBeDefined();
    expect(subjectsPath.schema.path("order")).toBeDefined();
    expect(subjectsPath.schema.path("isActive")).toBeDefined();
  });

  it("subjects.name is required with correct length limits", () => {
    const subjectsPath = Category.schema.path("subjects") as any;
    const namePath = subjectsPath.schema.path("name") as any;
    expect(namePath.isRequired).toBe(true);
    expect(namePath.options.trim).toBe(true);
    expect(namePath.options.minlength).toBe(1);
    expect(namePath.options.maxlength).toBe(100);
  });

  it("has timestamps enabled", () => {
    expect(Category.schema.options.timestamps).toBe(true);
  });

  it("has compound index on order+name", () => {
    const indexes = Category.schema.indexes();
    const indexKeys = (indexes as any[]).map(([k]: [any, any]) => k);
    expect(indexKeys.some((k: Record<string, number>) => k.order !== undefined && k.name !== undefined)).toBe(true);
  });

  it("has index on subjects.slug", () => {
    const indexes = Category.schema.indexes();
    const subjIndex = (indexes as any[]).find(
      ([k]: [Record<string, number>, unknown]) => k["subjects.slug"],
    );
    expect(subjIndex).toBeDefined();
  });
});

describe("Category model — document instantiation", () => {
  it("creates valid category with correct defaults", async () => {
    const category = new Category({
      name: "Mathematics",
      slug: "mathematics",
    });
    expect(category.name).toBe("Mathematics");
    expect(category.slug).toBe("mathematics");
    expect(category.subjects).toEqual([]);
    expect(category.isActive).toBe(true);
    expect((category as any).order).toBe(0);
    expect(category.description).toBeNull();
    expect(category.icon).toBeNull();
  });

  it("trims name on creation", async () => {
    const category = new Category({
      name: "  Physics  ",
      slug: "physics",
    });
    expect(category.name).toBe("Physics");
  });

  it("trims subject names on creation", async () => {
    const category = new Category({
      name: "Math",
      slug: "math",
      subjects: [{ name: "  Algebra  ", slug: "algebra" }],
    });
    expect(category.subjects[0].name).toBe("Algebra");
  });

  it("subjects default to empty array", () => {
    const category = new Category({ name: "Chemistry", slug: "chemistry" });
    expect(category.subjects).toEqual([]);
  });

  it("order defaults to 0", () => {
    const category = new Category({ name: "Biology", slug: "biology" });
    expect((category as any).order).toBe(0);
  });

  it("isActive defaults to true", () => {
    const category = new Category({ name: "Art", slug: "art" });
    expect(category.isActive).toBe(true);
  });

  it("description defaults to null", () => {
    const category = new Category({ name: "Music", slug: "music" });
    expect(category.description).toBeNull();
  });

  it("icon defaults to null", () => {
    const category = new Category({ name: "Science", slug: "science" });
    expect((category as any).icon).toBeNull();
  });

  it("accepts multiple subjects", () => {
    const category = new Category({
      name: "Programming",
      slug: "programming",
      subjects: [
        { name: "JavaScript", slug: "javascript" },
        { name: "TypeScript", slug: "typescript" },
        { name: "Python", slug: "python" },
      ],
    });
    expect(category.subjects.length).toBe(3);
  });

  it("assigns auto-generated _id to each subject", () => {
    const category = new Category({
      name: "Programming",
      slug: "programming",
      subjects: [{ name: "JavaScript", slug: "javascript" }],
    });
    expect(category.subjects[0]._id).toBeDefined();
  });

  it("allows order to be set explicitly", () => {
    const category = new Category({
      name: "Featured",
      slug: "featured",
      order: 5,
    });
    expect((category as any).order).toBe(5);
  });

  it("allows isActive to be set to false", () => {
    const category = new Category({
      name: "Archived",
      slug: "archived",
      isActive: false,
    });
    expect(category.isActive).toBe(false);
  });
});

describe("Category model — validation", () => {
  it("rejects missing name", async () => {
    const category = new Category({ slug: "math" } as any);
    await expect(category.validate()).rejects.toThrow();
  });

  it("rejects missing slug", async () => {
    const category = new Category({ name: "Math" } as any);
    await expect(category.validate()).rejects.toThrow();
  });

  it("rejects name shorter than 2 characters", async () => {
    const category = new Category({ name: "A", slug: "a" });
    await expect(category.validate()).rejects.toThrow();
  });

  it("rejects name longer than 60 characters", async () => {
    const category = new Category({ name: "A".repeat(61), slug: "long" });
    await expect(category.validate()).rejects.toThrow();
  });

  it("accepts name at minimum length (2 chars)", async () => {
    const category = new Category({ name: "Al", slug: "al" });
    await expect(category.validate()).resolves.toBeUndefined();
  });

  it("rejects description longer than 300 characters", async () => {
    const category = new Category({
      name: "Valid",
      slug: "valid",
      description: "A".repeat(301),
    });
    await expect(category.validate()).rejects.toThrow();
  });

  it("accepts description at exactly 300 characters", async () => {
    const category = new Category({
      name: "Valid",
      slug: "valid",
      description: "A".repeat(300),
    });
    await expect(category.validate()).resolves.toBeUndefined();
  });

  it("rejects subject name shorter than 1 character", async () => {
    const category = new Category({
      name: "Valid",
      slug: "valid",
      subjects: [{ name: "", slug: "empty" }],
    });
    await expect(category.validate()).rejects.toThrow();
  });

  it("rejects subject name longer than 100 characters", async () => {
    const category = new Category({
      name: "Valid",
      slug: "valid",
      subjects: [{ name: "A".repeat(101), slug: "long" }],
    });
    await expect(category.validate()).rejects.toThrow();
  });

  it("passes with all valid fields", async () => {
    const category = new Category({
      name: "Web Dev",
      slug: "web-dev",
      description: "All things web development",
      icon: "Code",
      order: 1,
      isActive: true,
      subjects: [{ name: "React", slug: "react", order: 0, isActive: true }],
    });
    await expect(category.validate()).resolves.toBeUndefined();
  });
});
