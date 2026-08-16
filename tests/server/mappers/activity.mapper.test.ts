import { describe, it, expect } from "vitest";
import { toAdminProfile, toAdminActivity } from "../../../src/server/mappers/activity.mapper";

describe("toAdminProfile", () => {
  it("returns a full AdminProfile from a complete document", () => {
    const now = new Date("2024-01-01");
    const doc = {
      _id: "adm1",
      name: "John Admin",
      email: "john@example.com",
      isHead: true,
      lastLoginAt: now,
      createdAt: now,
    };
    const result = toAdminProfile(doc);
    expect(result).toEqual({
      id: "adm1",
      name: "John Admin",
      email: "john@example.com",
      isHead: true,
      lastLoginAt: "2024-01-01T00:00:00.000Z",
      createdAt: "2024-01-01T00:00:00.000Z",
    });
  });

  it("handles null lastLoginAt", () => {
    const doc = {
      _id: "adm1",
      name: "New Admin",
      email: "new@example.com",
      isHead: false,
      lastLoginAt: null,
      createdAt: new Date("2024-01-01"),
    };
    const result = toAdminProfile(doc);
    expect(result.lastLoginAt).toBeNull();
    expect(result.isHead).toBe(false);
  });

  it("handles non-object input gracefully", () => {
    const result = toAdminProfile(null);
    expect(result.id).toBe("");
    expect(result.name).toBe("");
    expect(result.email).toBe("");
  });
});

describe("toAdminActivity", () => {
  it("returns a full AdminActivity with populated admin", () => {
    const now = new Date("2024-01-01");
    const doc = {
      _id: "act1",
      admin: { _id: "adm1", name: "John", email: "john@example.com" },
      action: "note.create",
      targetType: "note",
      targetId: "note1",
      targetLabel: "React Notes",
      description: "Created note",
      metadata: { changedFields: ["title"] },
      ipAddress: "1.2.3.4",
      createdAt: now,
    };
    const result = toAdminActivity(doc);
    expect(result).toEqual({
      id: "act1",
      admin: { id: "adm1", name: "John", email: "john@example.com" },
      action: "note.create",
      targetType: "note",
      targetId: "note1",
      targetLabel: "React Notes",
      description: "Created note",
      metadata: { changedFields: ["title"] },
      ipAddress: "1.2.3.4",
      createdAt: "2024-01-01T00:00:00.000Z",
    });
  });

  it("returns AdminActivity with ref admin (non-populated)", () => {
    const now = new Date("2024-01-01");
    const doc = {
      _id: "act1",
      admin: "adm1",
      action: "group.delete",
      targetType: null,
      targetId: null,
      targetLabel: null,
      description: "Deleted group",
      metadata: null,
      ipAddress: null,
      createdAt: now,
    };
    const result = toAdminActivity(doc);
    expect(result.admin).toEqual({ id: "adm1", name: "", email: "" });
    expect(result.targetType).toBeNull();
    expect(result.targetId).toBeNull();
    expect(result.targetLabel).toBeNull();
    expect(result.metadata).toBeNull();
    expect(result.ipAddress).toBeNull();
  });

  it("handles null admin", () => {
    const now = new Date("2024-01-01");
    const doc = {
      _id: "act1",
      admin: null,
      action: "admin.login",
      targetType: null,
      targetId: null,
      targetLabel: null,
      description: "Admin login",
      metadata: null,
      ipAddress: null,
      createdAt: now,
    };
    const result = toAdminActivity(doc);
    expect(result.admin.id).toBe("");
    expect(result.admin.name).toBe("");
    expect(result.admin.email).toBe("");
  });

  it("handles non-object input gracefully", () => {
    const result = toAdminActivity(null);
    expect(result.id).toBe("");
    expect(result.action).toBe("");
    expect(result.description).toBe("");
  });
});
