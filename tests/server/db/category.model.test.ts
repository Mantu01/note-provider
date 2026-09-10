import { describe, it, expect, vi } from "vitest";
import { Category } from "../../../src/server/db/models/category.model";
import type { CategoryDoc } from "../../../src/server/db/models/category.model";

describe("Category model", () => {
  it("has correct schema fields", () => {
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

  it("validates name constraints", () => {
    const namePath = Category.schema.path("name") as any;
    expect(namePath.isRequired).toBe(true);
    expect(namePath.options.unique).toBe(true);
    expect(namePath.options.trim).toBe(true);
    expect(namePath.options.minlength).toBe(2);
    expect(namePath.options.maxlength).toBe(60);
  });

  it("validates slug constraints", () => {
    const slugPath = Category.schema.path("slug") as any;
    expect(slugPath.isRequired).toBe(true);
    expect(slugPath.options.unique).toBe(true);
    expect(slugPath.options.index).toBe(true);
  });

  it("validates description maxlength", () => {
    const descPath = Category.schema.path("description") as any;
    expect(descPath.options.maxlength).toBe(300);
    expect(descPath.defaultValue).toBeNull();
  });

  it("validates subjects subdocument structure", () => {
    const subjectsPath = Category.schema.path("subjects") as any;
    expect(subjectsPath).toBeDefined();
    expect(subjectsPath.schema).toBeDefined();

    const subjectName = subjectsPath.schema.path("name") as any;
    const subjectSlug = subjectsPath.schema.path("slug") as any;
    expect(subjectName.isRequired).toBe(true);
    expect(subjectSlug.isRequired).toBe(true);
    expect(subjectSlug.options.lowercase).toBe(true);
    expect(subjectSlug.options.trim).toBe(true);
  });

  it("defaults isActive to true", () => {
    const path = Category.schema.path("isActive") as any;
    expect(path.defaultValue).toBe(true);
  });

  it("defaults order to 0", () => {
    const path = Category.schema.path("order") as any;
    expect(path.defaultValue).toBe(0);
  });

  it("enables timestamps", () => {
    expect(Category.schema.options.timestamps).toBe(true);
  });

  it("has custom indexes", () => {
    const indexes = Category.schema.indexes();
    const indexFields = indexes.map(([k]: [Record<string, number>, unknown]) => k);
    expect(indexFields.some((k: Record<string, number>) => k.order && k.name)).toBe(true);
    expect(indexFields.some((k: Record<string, number>) => k["subjects.slug"])).toBe(true);
  });

  it("creates a valid category document", async () => {
    const cat = new Category({
      name: "Web Development",
      slug: "web-dev",
      description: "Learn web dev",
    });
    expect(cat.name).toBe("Web Development");
    expect(cat.slug).toBe("web-dev");
    expect(cat.isActive).toBe(true);
    expect(cat.order).toBe(0);
    expect(cat.subjects).toEqual([]);
  });
});
