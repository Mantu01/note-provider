import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { NOTE_VISIBILITIES } from "@/lib/constants";

const groupSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 160 },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true, minlength: 10, maxlength: 5000 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    price: { type: Number, required: true, min: 100 },
    compareAtPrice: { type: Number, default: null, min: 0 },
    notes: { type: [{ type: Schema.Types.ObjectId, ref: "Note" }], default: [] },
    coverImageUrl: { type: String, default: null },
    coverImagePublicId: { type: String, default: null },
    visibility: { type: String, enum: NOTE_VISIBILITIES, default: "public", index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    purchaseCount: { type: Number, default: 0 },
    revenuePaise: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
  },
  { timestamps: true },
);

groupSchema.index({ visibility: 1, createdAt: -1 });
groupSchema.index({ category: 1, visibility: 1 });
groupSchema.index({ isFeatured: -1, createdAt: -1 });

export type GroupDoc = InferSchemaType<typeof groupSchema> & {
  _id: import("mongoose").Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Group: Model<GroupDoc> = (models.Group as Model<GroupDoc>) ?? model<GroupDoc>("Group", groupSchema);
