import { describe, it, expect, vi } from "vitest";
import { Admin } from "../../../src/server/db/models/admin.model";
import type { AdminDoc } from "../../../src/server/db/models/admin.model";

describe("Admin model", () => {
  it("has correct schema fields", () => {
    const schema = Admin.schema;
    expect(schema.path("name")).toBeDefined();
    expect(schema.path("email")).toBeDefined();
    expect(schema.path("passwordHash")).toBeDefined();
    expect(schema.path("lastLoginAt")).toBeDefined();
    expect(schema.path("isActive")).toBeDefined();
    expect(schema.path("isHead")).toBeDefined();
    expect(schema.path("createdAt")).toBeDefined();
    expect(schema.path("updatedAt")).toBeDefined();
  });

  it("validates email is lowercase unique string", () => {
    const emailPath = Admin.schema.path("email") as any;
    expect(emailPath.isRequired).toBe(true);
    expect(emailPath.options.unique).toBe(true);
    expect(emailPath.options.index).toBe(true);
    expect(emailPath.options.lowercase).toBe(true);
    expect(emailPath.options.trim).toBe(true);
  });

  it("validates name min/max length", () => {
    const namePath = Admin.schema.path("name") as any;
    expect(namePath.isRequired).toBe(true);
    expect(namePath.options.minlength).toBe(2);
    expect(namePath.options.maxlength).toBe(60);
    expect(namePath.options.trim).toBe(true);
  });

  it("defaults passwordHash to select false", () => {
    const pwPath = Admin.schema.path("passwordHash") as any;
    expect(pwPath.options.select).toBe(false);
  });

  it("defaults lastLoginAt to null", () => {
    const path = Admin.schema.path("lastLoginAt") as any;
    expect(path.defaultValue).toBeNull();
  });

  it("defaults isActive to true", () => {
    const path = Admin.schema.path("isActive") as any;
    expect(path.defaultValue).toBe(true);
  });

  it("defaults isHead to false", () => {
    const path = Admin.schema.path("isHead") as any;
    expect(path.defaultValue).toBe(false);
  });

  it("enables timestamps", () => {
    expect(Admin.schema.options.timestamps).toBe(true);
  });

  it("creates a valid admin document", async () => {
    const admin = new Admin({
      name: "Test Admin",
      email: "test@example.com",
      passwordHash: "hashed123",
    });
    expect(admin.name).toBe("Test Admin");
    expect(admin.email).toBe("test@example.com");
    expect(admin.isActive).toBe(true);
    expect(admin.isHead).toBe(false);
    expect(admin.lastLoginAt).toBeNull();
    expect(admin._id).toBeDefined();
  });
});
