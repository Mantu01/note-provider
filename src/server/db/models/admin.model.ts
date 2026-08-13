import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const adminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    lastLoginAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
    isHead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type AdminDoc = InferSchemaType<typeof adminSchema> & {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Admin: Model<AdminDoc> =
  (models.Admin as Model<AdminDoc>) ?? model<AdminDoc>("Admin", adminSchema);
