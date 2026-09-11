import { describe, it, expect } from "vitest";
import { Admin } from "../../../src/server/db/models/admin.model";

describe("Admin model — schema structure", () => {
  it("has all required schema fields", () => {
    const schema = Admin.schema;
    expect(schema.path("email")).toBeDefined();
    expect(schema.path("passwordHash")).toBeDefined();
    expect(schema.path("name")).toBeDefined();
    expect(schema.path("isActive")).toBeDefined();
    expect(schema.path("isHead")).toBeDefined();
    expect(schema.path("lastLoginAt")).toBeDefined();
  });

  it("email is required, unique, lowercase, trimmed", () => {
    const emailPath = Admin.schema.path("email") as any;
    expect(emailPath.isRequired).toBe(true);
    expect(emailPath.options.unique).toBe(true);
    expect(emailPath.options.lowercase).toBe(true);
    expect(emailPath.options.trim).toBe(true);
    expect(emailPath.options.index).toBe(true);
  });

  it("name has correct min/max length constraints", () => {
    const namePath = Admin.schema.path("name") as any;
    expect(namePath.isRequired).toBe(true);
    expect(namePath.options.trim).toBe(true);
    expect(namePath.options.minlength).toBe(2);
    expect(namePath.options.maxlength).toBe(60);
  });

  it("passwordHash is select:false (never returned in queries)", () => {
    const path = Admin.schema.path("passwordHash") as any;
    expect(path.options.select).toBe(false);
    expect(path.isRequired).toBe(true);
  });

  it("lastLoginAt defaults to null", () => {
    const path = Admin.schema.path("lastLoginAt") as any;
    expect(path.defaultValue).toBeNull();
  });

  it("isActive defaults to true", () => {
    const path = Admin.schema.path("isActive") as any;
    expect(path.defaultValue).toBe(true);
  });

  it("isHead defaults to false", () => {
    const path = Admin.schema.path("isHead") as any;
    expect(path.defaultValue).toBe(false);
  });

  it("has timestamps enabled", () => {
    expect(Admin.schema.options.timestamps).toBe(true);
  });

  it("has index on email field", () => {
    const indexes = Admin.schema.indexes();
    const emailIndex = (indexes as any[]).find(([k]: [Record<string, number>, unknown]) => k.email);
    expect(emailIndex).toBeDefined();
  });
});

describe("Admin model — document instantiation", () => {
  it("creates valid admin with correct defaults", async () => {
    const admin = new Admin({
      email: "admin@example.com",
      passwordHash: "hashed",
      name: "Test Admin",
    });
    expect(admin.isActive).toBe(true);
    expect(admin.isHead).toBe(false);
    expect(admin.lastLoginAt).toBeNull();
    expect(admin._id).toBeDefined();
  });

  it("lowercases email on instantiation", async () => {
    const admin = new Admin({
      email: "ADMIN@EXAMPLE.COM",
      passwordHash: "hashed",
      name: "Test Admin",
    });
    expect(admin.email).toBe("admin@example.com");
  });

  it("trims whitespace from email", async () => {
    const admin = new Admin({
      email: "  test@example.com  ",
      passwordHash: "hashed",
      name: "Test Admin",
    });
    expect(admin.email).toBe("test@example.com");
  });

  it("trims whitespace from name", async () => {
    const admin = new Admin({
      email: "test@example.com",
      passwordHash: "hashed",
      name: "  Test Admin  ",
    });
    expect(admin.name).toBe("Test Admin");
  });

  it("allows setting isHead to true", async () => {
    const admin = new Admin({
      email: "head@example.com",
      passwordHash: "hashed",
      name: "Head Admin",
      isHead: true,
    });
    expect(admin.isHead).toBe(true);
  });

  it("allows deactivating admin via isActive=false", async () => {
    const admin = new Admin({
      email: "inactive@example.com",
      passwordHash: "hashed",
      name: "Inactive Admin",
      isActive: false,
    });
    expect(admin.isActive).toBe(false);
  });

  it("allows setting lastLoginAt to a date", async () => {
    const loginDate = new Date("2024-01-01T00:00:00Z");
    const admin = new Admin({
      email: "user@example.com",
      passwordHash: "hashed",
      name: "Active User",
      lastLoginAt: loginDate,
    });
    expect(admin.lastLoginAt).toEqual(loginDate);
  });
});

describe("Admin model — validation", () => {
  it("rejects missing email", async () => {
    const admin = new Admin({
      passwordHash: "hashed",
      name: "Test Admin",
    } as any);
    await expect(admin.validate()).rejects.toThrow();
  });

  it("rejects missing passwordHash", async () => {
    const admin = new Admin({
      email: "test@example.com",
      name: "Test Admin",
    } as any);
    await expect(admin.validate()).rejects.toThrow();
  });

  it("rejects missing name", async () => {
    const admin = new Admin({
      email: "test@example.com",
      passwordHash: "hashed",
    } as any);
    await expect(admin.validate()).rejects.toThrow();
  });

  it("rejects name shorter than 2 characters", async () => {
    const admin = new Admin({
      email: "test@example.com",
      passwordHash: "hashed",
      name: "A",
    });
    await expect(admin.validate()).rejects.toThrow();
  });

  it("rejects name longer than 60 characters", async () => {
    const admin = new Admin({
      email: "test@example.com",
      passwordHash: "hashed",
      name: "A".repeat(61),
    });
    await expect(admin.validate()).rejects.toThrow();
  });

  it("accepts name at minimum length (2 chars)", async () => {
    const admin = new Admin({
      email: "test@example.com",
      passwordHash: "hashed",
      name: "Al",
    });
    await expect(admin.validate()).resolves.toBeUndefined();
  });

  it("accepts name at maximum length (60 chars)", async () => {
    const admin = new Admin({
      email: "test@example.com",
      passwordHash: "hashed",
      name: "A".repeat(60),
    });
    await expect(admin.validate()).resolves.toBeUndefined();
  });

  it("passes validation with all required fields", async () => {
    const admin = new Admin({
      email: "valid@example.com",
      passwordHash: "hashed-password",
      name: "Valid Admin",
    });
    await expect(admin.validate()).resolves.toBeUndefined();
  });
});
