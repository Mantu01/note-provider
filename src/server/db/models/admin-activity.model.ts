import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { ACTIVITY_TARGET_TYPES, ADMIN_ACTIVITY_ACTIONS } from "@/lib/constants";

const adminActivitySchema = new Schema(
  {
    admin: { type: Schema.Types.ObjectId, ref: "Admin", required: true, index: true },
    action: { type: String, enum: ADMIN_ACTIVITY_ACTIONS, required: true, index: true },
    targetType: { type: String, enum: [...ACTIVITY_TARGET_TYPES, null], default: null },
    targetId: { type: Schema.Types.ObjectId, default: null },
    targetLabel: { type: String, default: null },
    description: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: null },
    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },
  },
  { timestamps: true },
);

adminActivitySchema.index({ createdAt: -1 });
adminActivitySchema.index({ admin: 1, createdAt: -1 });

export type AdminActivityDoc = InferSchemaType<typeof adminActivitySchema> & {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const AdminActivity: Model<AdminActivityDoc> =
  (models.AdminActivity as Model<AdminActivityDoc>) ??
  model<AdminActivityDoc>("AdminActivity", adminActivitySchema);
