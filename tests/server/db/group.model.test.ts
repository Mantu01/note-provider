import { describe, it, expect } from "vitest";
import { Group } from "../../../src/server/db/models/group.model";

describe("Group model", () => {
  it("has correct schema fields", () => {
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

  it("validates name constraints", () => {
    const namePath = Group.schema.path("name") as any;
    expect(namePath.isRequired).toBe(true);
    expect(namePath.options.trim).toBe(true);
    expect(namePath.options.minlength).toBe(3);
    expect(namePath.options.maxlength).toBe(160);
  });

  it("validates slug constraints", () => {
    const slugPath = Group.schema.path("slug") as any;
    expect(slugPath.isRequired).toBe(true);
    expect(slugPath.options.unique).toBe(true);
    expect(slugPath.options.index).toBe(true);
  });

  it("validates price min 100", () => {
    const pricePath = Group.schema.path("price") as any;
    expect(pricePath.isRequired).toBe(true);
    expect(pricePath.options.min).toBe(100);
  });

  it("validates visibility enum", () => {
    const visibilityPath = Group.schema.path("visibility") as any;
    expect(visibilityPath.enumValues).toContain("public");
    expect(visibilityPath.defaultValue).toBe("public");
    expect(visibilityPath.options.index).toBe(true);
  });

  it("validates notes is array of ObjectIds", () => {
    const notesPath = Group.schema.path("notes") as any;
    expect(notesPath.instance).toBe("Array");
    expect(notesPath.defaultValue()).toEqual([]);
  });

  it("defaults purchaseCount and revenuePaise to 0", () => {
    const purchasePath = Group.schema.path("purchaseCount") as any;
    const revenuePath = Group.schema.path("revenuePaise") as any;
    expect(purchasePath.defaultValue).toBe(0);
    expect(revenuePath.defaultValue).toBe(0);
  });

  it("defaults isFeatured to false", () => {
    const path = Group.schema.path("isFeatured") as any;
    expect(path.defaultValue).toBe(false);
    expect(path.options.index).toBe(true);
  });

  it("enables timestamps", () => {
    expect(Group.schema.options.timestamps).toBe(true);
  });

  it("has custom indexes", () => {
    const indexes = Group.schema.indexes();
    const indexKeys = indexes.map(([k]: [Record<string, number>, unknown]) => k);
    expect(indexKeys.some((k: Record<string, number>) => k.visibility && k.createdAt)).toBe(true);
    expect(indexKeys.some((k: Record<string, number>) => k.category && k.visibility)).toBe(true);
    expect(indexKeys.some((k: Record<string, number>) => k.isFeatured && k.createdAt)).toBe(true);
  });

  it("creates a valid group document", async () => {
    const group = new Group({
      name: "JS Bundle",
      slug: "js-bundle",
      description: "Master JavaScript",
      category: "507f1f77bcf86cd799439011",
      price: 500,
    });
    expect(group.name).toBe("JS Bundle");
    expect(group.price).toBe(500);
    expect(group.visibility).toBe("public");
    expect(group.notes).toEqual([]);
    expect(group.isFeatured).toBe(false);
    expect(group.purchaseCount).toBe(0);
    expect(group.revenuePaise).toBe(0);
  });
});
