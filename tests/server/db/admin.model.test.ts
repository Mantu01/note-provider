import { describe, it, expect } from "vitest";
import { Admin } from "../../../src/server/db/models/admin.model";

describe("Admin model", () => {
  it("has correct schema fields", () => {
    const schema = Admin.schema;
    expect(schema.path("email")).toBeDefined();
    expect(schema.path("passwordHash")).toBeDefined();
    expect(schema.path("name")).toBeDefined();
    expect(schema.path("isActive")).toBeDefined();
    expect(schema.path("isHead")).toBeDefined();
    expect(schema.path("lastLoginAt")).toBeDefined();
  });

  it("validates email is lowercase unique string", () => {
    const emailPath = Admin.schema.path("email") as any;
    expect(emailPath.isRequired).toBe(true);
    expect(emailPath.options.unique).toBe(true);
    expect(emailPath.options.lowercase).toBe(true);
    expect(emailPath.options.trim).toBe(true);
  });

  it("validates name min/max length", () => {
    const namePath = Admin.schema.path("name") as any;
    expect(namePath.isRequired).toBe(true);
    expect(namePath.options.trim).toBe(true);
    expect(namePath.options.minlength).toBe(2);
    expect(namePath.options.maxlength).toBe(60);
  });

  it("defaults passwordHash to select false", () => {
    const path = Admin.schema.path("passwordHash") as any;
    expect(path.options.select).toBe(false);
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
      email: "admin@example.com",
      passwordHash: "hashed",
      name: "Test Admin",
    });
    expect(admin.isActive).toBe(true);
    expect(admin.isHead).toBe(false);
    expect(admin.lastLoginAt).toBeNull();
  });

  it("lowercases email on instantiation", async () => {
    const admin = new Admin({
      email: "ADMIN@EXAMPLE.COM",
      passwordHash: "hashed",
      name: "Test Admin",
    });
    expect(admin.email).toBe("admin@example.com");
  });

  it("trims whitespace from email and name", async () => {
    const admin = new Admin({
      email: "  test@example.com  ",
      passwordHash: "hashed",
      name: "  Test Admin  ",
    });
    expect(admin.email).toBe("test@example.com");
    expect(admin.name).toBe("Test Admin");
  });

  it("validates email required field", async () => {
    const admin = new Admin({
      passwordHash: "hashed",
      name: "Test Admin",
    } as any);
    await expect(admin.validate()).rejects.toThrow();
  });

  it("validates passwordHash required field", async () => {
    const admin = new Admin({
      email: "test@example.com",
      name: "Test Admin",
    } as any);
    await expect(admin.validate()).rejects.toThrow();
  });

  it("validates name required field", async () => {
    const admin = new Admin({
      email: "test@example.com",
      passwordHash: "hashed",
    } as any);
    await expect(admin.validate()).rejects.toThrow();
  });
});
