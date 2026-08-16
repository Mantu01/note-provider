import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getAllAdmins,
  getAdminById,
  getAdminByEmail,
  createAdmin,
  updateLastLogin,
} from "../../../src/server/services/admin.service";
import * as AdminModel from "../../../src/server/db/models/admin.model";

vi.mock("../../../src/server/db/models/admin.model", () => ({
  Admin: {
    find: vi.fn(),
    findById: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    findByIdAndUpdate: vi.fn(),
  },
}));

const validObjectId = "65a1b2c3d4e5f6a7b8c9d0e1";
const mockAdmin = {
  _id: "adm1",
  name: "John Admin",
  email: "john@example.com",
  passwordHash: "hashed123",
  lastLoginAt: null,
  isActive: true,
  isHead: false,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

describe("getAllAdmins", () => {
  it("returns all admins sorted by createdAt ascending", async () => {
    const query = {
      sort: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([mockAdmin]),
    };
    vi.mocked(AdminModel.Admin.find).mockReturnValue(query as any);

    const result = await getAllAdmins();
    expect(AdminModel.Admin.find).toHaveBeenCalledWith({}, { passwordHash: 0 });
    expect(result).toEqual([mockAdmin]);
  });
});

describe("getAdminById", () => {
  it("returns an admin when found", async () => {
    const query = { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockAdmin) };
    vi.mocked(AdminModel.Admin.findById).mockReturnValue(query as any);

    const result = await getAdminById("adm1");
    expect(AdminModel.Admin.findById).toHaveBeenCalledWith("adm1", { passwordHash: 0 });
    expect(result).toEqual(mockAdmin);
  });

  it("returns null when admin not found", async () => {
    const query = { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(null) };
    vi.mocked(AdminModel.Admin.findById).mockReturnValue(query as any);

    const result = await getAdminById("nonexistent");
    expect(result).toBeNull();
  });
});

describe("getAdminByEmail", () => {
  it("performs case-insensitive lookup", async () => {
    const query = { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockAdmin) };
    vi.mocked(AdminModel.Admin.findOne).mockReturnValue(query as any);

    const result = await getAdminByEmail("John@Example.com");
    expect(AdminModel.Admin.findOne).toHaveBeenCalledWith(
      { email: "john@example.com" },
      { passwordHash: 0 },
    );
    expect(result).toEqual(mockAdmin);
  });

  it("returns null when admin not found", async () => {
    const query = { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(null) };
    vi.mocked(AdminModel.Admin.findOne).mockReturnValue(query as any);

    const result = await getAdminByEmail("unknown@example.com");
    expect(result).toBeNull();
  });
});

describe("createAdmin", () => {
  it("creates an admin with lowercase email", async () => {
    const created = { ...mockAdmin, email: "new@example.com" };
    vi.mocked(AdminModel.Admin.create).mockResolvedValue(created as any);

    const result = await createAdmin({
      name: "New Admin",
      email: "New@Example.com",
      passwordHash: "secret123",
    });
    expect(AdminModel.Admin.create).toHaveBeenCalledWith({
      name: "New Admin",
      email: "new@example.com",
      passwordHash: "secret123",
    });
    expect(result.email).toBe("new@example.com");
  });
});

describe("updateLastLogin", () => {
  it("updates the lastLoginAt field", async () => {
    const query = { exec: vi.fn().mockResolvedValue(mockAdmin) };
    vi.mocked(AdminModel.Admin.findByIdAndUpdate).mockReturnValue(query as any);

    await updateLastLogin("adm1");
    expect(AdminModel.Admin.findByIdAndUpdate).toHaveBeenCalledWith("adm1", {
      lastLoginAt: expect.any(Date),
    });
  });
});
