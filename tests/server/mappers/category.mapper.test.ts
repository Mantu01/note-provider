import { describe, it, expect } from "vitest";
import {
  toCategoryRef,
  toAdminRef,
  toPublicCategory,
  toAdminCategory,
} from "../../../src/server/mappers/category.mapper";

describe("toCategoryRef", () => {
  it("returns a CategoryRef from a populated document", () => {
    const doc = {
      _id: "cat1",
      name: "Web Development",
      slug: "web-dev",
      icon: "code",
    };
    const result = toCategoryRef(doc);
    expect(result).toEqual({
      id: "cat1",
      name: "Web Development",
      slug: "web-dev",
      icon: "code",
    });
  });

  it("returns a CategoryRef with empty fields from a string id", () => {
    const result = toCategoryRef("cat1");
    expect(result).toEqual({
      id: "cat1",
      name: "",
      slug: "",
      icon: null,
    });
  });

  it("returns a CategoryRef with empty fields for null", () => {
    const result = toCategoryRef(null);
    expect(result).toEqual({
      id: "",
      name: "",
      slug: "",
      icon: null,
    });
  });
});

describe("toAdminRef", () => {
  it("returns an AdminRef from a populated document", () => {
    const doc = { _id: "adm1", name: "John" };
    const result = toAdminRef(doc);
    expect(result).toEqual({ id: "adm1", name: "John" });
  });

  it("returns null for null", () => {
    expect(toAdminRef(null)).toBeNull();
  });

  it("returns null for a string", () => {
    expect(toAdminRef("adm1")).toBeNull();
  });
});

describe("toPublicCategory", () => {
  it("returns a full PublicCategory from a complete document", () => {
    const doc = {
      _id: "cat1",
      name: "Web Development",
      slug: "web-dev",
      description: "Learn web dev",
      icon: "code",
      subjects: [
        { _id: "s1", name: "React", slug: "react", order: 1, isActive: true },
        { _id: "s2", name: "Vue", slug: "vue", order: 2, isActive: false },
      ],
    };
    const result = toPublicCategory(doc, 5);
    expect(result).toEqual({
      id: "cat1",
      name: "Web Development",
      slug: "web-dev",
      description: "Learn web dev",
      icon: "code",
      subjects: [
        { id: "s1", name: "React", slug: "react", order: 1, isActive: true },
        { id: "s2", name: "Vue", slug: "vue", order: 2, isActive: false },
      ],
      noteCount: 5,
    });
  });

  it("returns a minimal PublicCategory with default noteCount", () => {
    const doc = { _id: "cat1", name: "DSA", slug: "dsa" };
    const result = toPublicCategory(doc);
    expect(result).toEqual({
      id: "cat1",
      name: "DSA",
      slug: "dsa",
      description: null,
      icon: null,
      subjects: [],
      noteCount: 0,
    });
  });

  it("handles subjects with isActive defaulting to true when absent", () => {
    const doc = {
      _id: "cat1",
      name: "Backend",
      slug: "backend",
      subjects: [{ _id: "s1", name: "Node", slug: "node", order: 0 }],
    };
    const result = toPublicCategory(doc);
    expect(result.subjects[0].isActive).toBe(true);
  });

  it("handles non-object input gracefully", () => {
    const result = toPublicCategory(null);
    expect(result.id).toBe("");
    expect(result.name).toBe("");
    expect(result.subjects).toEqual([]);
  });

  it("handles doc without subjects key", () => {
    const doc = { _id: "cat1", name: "Test", slug: "test" };
    const result = toPublicCategory(doc);
    expect(result.subjects).toEqual([]);
  });
});

describe("toAdminCategory", () => {
  it("returns a full AdminCategory from a complete document", () => {
    const now = new Date();
    const doc = {
      _id: "cat1",
      name: "Web Development",
      slug: "web-dev",
      description: "Learn web dev",
      icon: "code",
      order: 1,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    const result = toAdminCategory(doc, 10, 3);
    expect(result).toEqual({
      id: "cat1",
      name: "Web Development",
      slug: "web-dev",
      description: "Learn web dev",
      icon: "code",
      subjects: [],
      noteCount: 10,
      order: 1,
      isActive: true,
      groupCount: 3,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
  });

  it("defaults isActive to true when absent", () => {
    const doc = { _id: "cat1", name: "Test", slug: "test" };
    const result = toAdminCategory(doc);
    expect(result.isActive).toBe(true);
  });

  it("handles non-object input gracefully", () => {
    const result = toAdminCategory(null);
    expect(result.id).toBe("");
    expect(result.name).toBe("");
  });
});
