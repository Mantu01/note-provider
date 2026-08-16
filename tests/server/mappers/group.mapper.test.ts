import { describe, it, expect } from "vitest";
import { toPublicGroup, toAdminGroup } from "../../../src/server/mappers/group.mapper";

describe("toPublicGroup", () => {
  it("returns a full PublicGroup with notes", () => {
    const doc = {
      _id: "grp1",
      slug: "js-mastery",
      name: "JS Mastery",
      description: "Master JavaScript",
      category: { _id: "cat1", name: "Web Dev", slug: "web-dev", icon: "code" },
      price: 50000,
      compareAtPrice: 100000,
      coverImageUrl: "https://example.com/cover.jpg",
      isFeatured: true,
      notes: ["n1", "n2"],
      createdAt: new Date("2024-01-01"),
    };
    const notes = [
      { id: "n1", slug: "closure", title: "Closures" },
      { id: "n2", slug: "promises", title: "Promises" },
    ] as any;
    const result = toPublicGroup(doc, notes);
    expect(result).toEqual({
      id: "grp1",
      slug: "js-mastery",
      name: "JS Mastery",
      description: "Master JavaScript",
      category: { id: "cat1", name: "Web Dev", slug: "web-dev", icon: "code" },
      price: 50000,
      priceLabel: "₹500",
      compareAtPrice: 100000,
      coverImageUrl: "https://example.com/cover.jpg",
      noteCount: 2,
      notes,
      isFeatured: true,
      createdAt: "2024-01-01T00:00:00.000Z",
    });
  });

  it("returns a minimal PublicGroup without optional fields", () => {
    const doc = {
      _id: "grp1",
      slug: "basic",
      name: "Basic Group",
      description: "A basic group",
      category: { _id: "cat1", name: "Web Dev", slug: "web-dev", icon: null },
      price: 0,
      createdAt: new Date("2024-06-01"),
    };
    const result = toPublicGroup(doc);
    expect(result).toEqual({
      id: "grp1",
      slug: "basic",
      name: "Basic Group",
      description: "A basic group",
      category: { id: "cat1", name: "Web Dev", slug: "web-dev", icon: null },
      price: 0,
      priceLabel: "Free",
      compareAtPrice: null,
      coverImageUrl: null,
      noteCount: 0,
      notes: [],
      isFeatured: false,
      createdAt: "2024-06-01T00:00:00.000Z",
    });
  });

  it("handles doc without notes key", () => {
    const doc = {
      _id: "grp1",
      slug: "no-notes",
      name: "No Notes",
      description: "No notes",
      category: { _id: "cat1", name: "Test", slug: "test" },
      price: 0,
      createdAt: new Date("2024-01-01"),
    };
    const result = toPublicGroup(doc);
    expect(result.noteCount).toBe(0);
  });

  it("handles doc with numeric price", () => {
    const doc = {
      _id: "grp1",
      slug: "cheap",
      name: "Cheap Group",
      description: "Low price",
      category: { _id: "cat1", name: "Test", slug: "test" },
      price: 100,
      createdAt: new Date("2024-01-01"),
    };
    const result = toPublicGroup(doc);
    expect(result.price).toBe(100);
    expect(result.priceLabel).toBe("₹1");
  });

  it("handles non-object input gracefully", () => {
    const result = toPublicGroup(null);
    expect(result.id).toBe("");
    expect(result.slug).toBe("");
    expect(result.name).toBe("");
    expect(result.noteCount).toBe(0);
  });
});

describe("toAdminGroup", () => {
  it("returns a full AdminGroup with all fields", () => {
    const now = new Date("2024-01-01");
    const doc = {
      _id: "grp1",
      slug: "js-mastery",
      name: "JS Mastery",
      description: "Master JavaScript",
      category: { _id: "cat1", name: "Web Dev", slug: "web-dev", icon: "code" },
      price: 50000,
      compareAtPrice: 100000,
      coverImageUrl: "https://example.com/cover.jpg",
      coverImagePublicId: "covers/grp1",
      notes: [{ _id: "n1" }, { _id: "n2" }],
      visibility: "public",
      isFeatured: true,
      revenuePaise: 50000,
      purchaseCount: 5,
      createdBy: { _id: "adm1", name: "Admin" },
      updatedBy: { _id: "adm2", name: "Editor" },
      createdAt: now,
      updatedAt: now,
    };
    const notes = [
      { id: "n1", slug: "closure", title: "Closures" },
      { id: "n2", slug: "promises", title: "Promises" },
    ] as any;
    const result = toAdminGroup(doc, notes);
    expect(result).toEqual({
      id: "grp1",
      slug: "js-mastery",
      name: "JS Mastery",
      description: "Master JavaScript",
      category: { id: "cat1", name: "Web Dev", slug: "web-dev", icon: "code" },
      price: 50000,
      priceLabel: "₹500",
      compareAtPrice: 100000,
      coverImageUrl: "https://example.com/cover.jpg",
      noteCount: 2,
      notes,
      isFeatured: true,
      createdAt: "2024-01-01T00:00:00.000Z",
      visibility: "public",
      noteIds: ["n1", "n2"],
      coverImagePublicId: "covers/grp1",
      revenuePaise: 50000,
      purchaseCount: 5,
      createdBy: { id: "adm1", name: "Admin" },
      updatedBy: { id: "adm2", name: "Editor" },
      updatedAt: "2024-01-01T00:00:00.000Z",
    });
  });

  it("handles private visibility", () => {
    const now = new Date("2024-01-01");
    const doc = {
      _id: "grp1",
      slug: "private",
      name: "Private Group",
      description: "Private",
      category: { _id: "cat1", name: "Test", slug: "test" },
      price: 0,
      notes: [],
      visibility: "private",
      createdBy: null,
      updatedBy: null,
      createdAt: now,
      updatedAt: now,
    };
    const result = toAdminGroup(doc);
    expect(result.visibility).toBe("private");
    expect(result.createdBy).toBeNull();
    expect(result.updatedBy).toBeNull();
  });

  it("defaults visibility to public when not 'private'", () => {
    const now = new Date("2024-01-01");
    const doc = {
      _id: "grp1",
      slug: "public",
      name: "Public",
      description: "Public",
      category: { _id: "cat1", name: "Test", slug: "test" },
      price: 0,
      notes: [],
      visibility: "public",
      createdBy: null,
      updatedBy: null,
      createdAt: now,
      updatedAt: now,
    };
    const result = toAdminGroup(doc);
    expect(result.visibility).toBe("public");
  });

  it("handles doc with missing optional admin fields", () => {
    const now = new Date("2024-01-01");
    const doc = {
      _id: "grp1",
      slug: "no-admin",
      name: "No Admin",
      description: "No admin",
      category: { _id: "cat1", name: "Test", slug: "test" },
      price: 0,
      notes: [],
      visibility: "public",
      createdBy: undefined,
      updatedBy: undefined,
      createdAt: now,
      updatedAt: now,
    };
    const result = toAdminGroup(doc);
    expect(result.createdBy).toBeNull();
    expect(result.updatedBy).toBeNull();
  });

  it("handles non-object input gracefully", () => {
    const result = toAdminGroup(null);
    expect(result.id).toBe("");
    expect(result.slug).toBe("");
    expect(result.visibility).toBe("public");
  });
});
