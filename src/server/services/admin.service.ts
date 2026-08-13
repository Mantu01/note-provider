import { Admin, type AdminDoc } from "../db/models/admin.model";

import { AppError } from "../lib/errors";

export async function getAllAdmins(): Promise<AdminDoc[]> {
  return Admin.find({}, { passwordHash: 0 })
    .sort({ createdAt: 1 })
    .lean()
    .exec();
}

export async function getAdminById(id: string): Promise<AdminDoc | null> {
  return Admin.findById(id, { passwordHash: 0 }).lean().exec();
}

export async function getAdminByEmail(email: string): Promise<AdminDoc | null> {
  return Admin.findOne({ email: email.toLowerCase() }, { passwordHash: 0 }).lean().exec();
}

export async function createAdmin(input: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<AdminDoc> {
  return Admin.create({
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
  });
}

export async function updateLastLogin(adminId: string): Promise<void> {
  await Admin.findByIdAndUpdate(adminId, { lastLoginAt: new Date() }).exec();
}
