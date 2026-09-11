import { describe, it, expect } from "vitest";
import { Group } from "../../../src/server/db/models/group.model";
import { NOTE_VISIBILITIES } from "../../../src/lib/constants";

const validGroupBase = {
  name: "JavaScript Mastery Bundle",
  slug: "js-mastery-bundle",
  description: "Complete JavaScript course covering fundamentals to advanced topics",
  category: "507f1f77bcf86cd799439011",
  price: 500,
};

describe("Group model — schema structure", () => {
  it("has all expected schema fields", () => {
    const schema = Group.schema;
    expect(schema.path("name")).toBeDefined();
    expect(schema.path("slug")).toBeDefined();
    expect(schema.path("description")).toBeDefined();
    expect(schema.path("category")).toBeDefined();
    expect(schema.path("price")).toBeDefined();
    expect(schema.path("compareAtPrice")).toBeDefined();
    expect(schema.path("notes")).toBeDefined();
    expect(schema.path("coverImageUrl")).toBeDefined();
    expect(schema.path("coverImagePublicId")).toBeDefined();
    expect(schema.path("visibility")).toBeDefined();
    expect(schema.path("isFeatured")).toBeDefined();
    expect(schema.path("purchaseCount")).toBeDefined();
    expect(schema.path("revenuePaise")).toBeDefined();
    expect(schema.path("createdBy")).toBeDefined();
    expect(schema.path("updatedBy")).toBeDefined();
  });

  it("name is required, trimmed, with correct length limits", () => {
    const namePath = Group.schema.path("name") as any;
    expect(namePath.isRequired).toBe(true);
    expect(namePath.options.trim).toBe(true);
    expect(namePath.options.minlength).toBe(3);
    expect(namePath.options.maxlength).toBe(160);
  });

  it("slug is required, unique, and indexed", () => {
    const slugPath = Group.schema.path("slug") as any;
    expect(slugPath.isRequired).toBe(true);
    expect(slugPath.options.unique).toBe(true);
    expect(slugPath.options.index).toBe(true);
  });

  it("description is required with correct length limits", () => {
    const descPath = Group.schema.path("description") as any;
    expect(descPath.isRequired).toBe(true);
    expect(descPath.options.minlength).toBe(10);
    expect(descPath.options.maxlength).toBe(5000);
  });

  it("category is required and indexed", () => {
    const catPath = Group.schema.path("category") as any;
    expect(catPath.isRequired).toBe(true);
    expect(catPath.options.index).toBe(true);
  });

  it("price is required with min of 100", () => {
    const pricePath = Group.schema.path("price") as any;
    expect(pricePath.isRequired).toBe(true);
    expect(pricePath.options.min).toBe(100);
  });

  it("visibility enum contains all NOTE_VISIBILITIES values", () => {
    const visibilityPath = Group.schema.path("visibility") as any;
    for (const vis of NOTE_VISIBILITIES) {
      expect(visibilityPath.enumValues).toContain(vis);
    }
    expect(visibilityPath.defaultValue).toBe("public");
    expect(visibilityPath.options.index).toBe(true);
  });

  it("notes is an array of ObjectId refs", () => {
    const notesPath = Group.schema.path("notes") as any;
    expect(notesPath.instance).toBe("Array");
    expect(notesPath.defaultValue()).toEqual([]);
  });

  it("isFeatured defaults to false and is indexed", () => {
    const path = Group.schema.path("isFeatured") as any;
    expect(path.defaultValue).toBe(false);
    expect(path.options.index).toBe(true);
  });

  it("purchaseCount defaults to 0", () => {
    const path = Group.schema.path("purchaseCount") as any;
    expect(path.defaultValue).toBe(0);
  });

  it("revenuePaise defaults to 0", () => {
    const path = Group.schema.path("revenuePaise") as any;
    expect(path.defaultValue).toBe(0);
  });

  it("has timestamps enabled", () => {
    expect(Group.schema.options.timestamps).toBe(true);
  });

  it("has composite index on visibility+createdAt", () => {
    const indexes = Group.schema.indexes();
    const indexKeys = (indexes as any[]).map(([k]: [any, any]) => k);
    expect(indexKeys.some((k: Record<string, number>) => k.visibility !== undefined && k.createdAt !== undefined)).toBe(true);
  });

  it("has composite index on category+visibility", () => {
    const indexes = Group.schema.indexes();
    const indexKeys = (indexes as any[]).map(([k]: [any, any]) => k);
    expect(indexKeys.some((k: Record<string, number>) => k.category !== undefined && k.visibility !== undefined)).toBe(true);
  });

  it("has composite index on isFeatured+createdAt", () => {
    const indexes = Group.schema.indexes();
    const indexKeys = (indexes as any[]).map(([k]: [any, any]) => k);
    expect(indexKeys.some((k: Record<string, number>) => k.isFeatured !== undefined && k.createdAt !== undefined)).toBe(true);
  });
});

describe("Group model — document instantiation", () => {
  it("creates valid group with correct defaults", async () => {
    const group = new Group(validGroupBase);
    expect(group.name).toBe("JavaScript Mastery Bundle");
    expect(group.price).toBe(500);
    expect(group.visibility).toBe("public");
    expect(group.notes).toEqual([]);
    expect(group.isFeatured).toBe(false);
    expect(group.purchaseCount).toBe(0);
    expect(group.revenuePaise).toBe(0);
    expect(group.compareAtPrice).toBeNull();
    expect(group.coverImageUrl).toBeNull();
    expect(group.coverImagePublicId).toBeNull();
  });

  it("trims name on creation", async () => {
    const group = new Group({ ...validGroupBase, name: "  Advanced React  " });
    expect(group.name).toBe("Advanced React");
  });

  it("accepts all NOTE_VISIBILITIES values", async () => {
    for (const vis of NOTE_VISIBILITIES) {
      const group = new Group({ ...validGroupBase, slug: `vis-${vis}`, visibility: vis });
      expect(group.visibility).toBe(vis);
    }
  });

  it("supports notes array with ObjectId references", async () => {
    const group = new Group({
      ...validGroupBase,
      notes: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
    });
    expect(group.notes.length).toBe(2);
  });

  it("allows createdBy and updatedBy as ObjectId refs", async () => {
    const group = new Group({
      ...validGroupBase,
      createdBy: "507f1f77bcf86cd799439011",
      updatedBy: "507f1f77bcf86cd799439012",
    });
    expect(group.createdBy).toBeDefined();
    expect(group.updatedBy).toBeDefined();
  });

  it("allows compareAtPrice to be set", async () => {
    const group = new Group({ ...validGroupBase, compareAtPrice: 1000 });
    expect(group.compareAtPrice).toBe(1000);
  });

  it("allows isFeatured to be true", async () => {
    const group = new Group({ ...validGroupBase, isFeatured: true });
    expect(group.isFeatured).toBe(true);
  });

  it("allows coverImageUrl to be set", async () => {
    const group = new Group({ ...validGroupBase, coverImageUrl: "https://example.com/image.jpg" });
    expect(group.coverImageUrl).toBe("https://example.com/image.jpg");
  });
});

describe("Group model — validation", () => {
  it("rejects missing name", async () => {
    const { name: _n, ...rest } = validGroupBase;
    const group = new Group(rest as any);
    await expect(group.validate()).rejects.toThrow();
  });

  it("rejects missing slug", async () => {
    const { slug: _s, ...rest } = validGroupBase;
    const group = new Group(rest as any);
    await expect(group.validate()).rejects.toThrow();
  });

  it("rejects missing description", async () => {
    const { description: _d, ...rest } = validGroupBase;
    const group = new Group(rest as any);
    await expect(group.validate()).rejects.toThrow();
  });

  it("rejects missing category", async () => {
    const { category: _c, ...rest } = validGroupBase;
    const group = new Group(rest as any);
    await expect(group.validate()).rejects.toThrow();
  });

  it("rejects missing price", async () => {
    const { price: _p, ...rest } = validGroupBase;
    const group = new Group(rest as any);
    await expect(group.validate()).rejects.toThrow();
  });

  it("rejects price below 100 (minimum)", async () => {
    const group = new Group({ ...validGroupBase, price: 99 });
    await expect(group.validate()).rejects.toThrow();
  });

  it("accepts price exactly at 100", async () => {
    const group = new Group({ ...validGroupBase, price: 100 });
    await expect(group.validate()).resolves.toBeUndefined();
  });

  it("rejects name shorter than 3 characters", async () => {
    const group = new Group({ ...validGroupBase, name: "AB" });
    await expect(group.validate()).rejects.toThrow();
  });

  it("rejects name longer than 160 characters", async () => {
    const group = new Group({ ...validGroupBase, name: "A".repeat(161) });
    await expect(group.validate()).rejects.toThrow();
  });

  it("rejects description shorter than 10 characters", async () => {
    const group = new Group({ ...validGroupBase, description: "Short" });
    await expect(group.validate()).rejects.toThrow();
  });

  it("rejects description longer than 5000 characters", async () => {
    const group = new Group({ ...validGroupBase, description: "A".repeat(5001) });
    await expect(group.validate()).rejects.toThrow();
  });

  it("rejects invalid visibility value", async () => {
    const group = new Group({ ...validGroupBase, visibility: "draft" as any });
    await expect(group.validate()).rejects.toThrow();
  });

  it("passes validation with all valid fields", async () => {
    const group = new Group(validGroupBase);
    await expect(group.validate()).resolves.toBeUndefined();
  });
});
