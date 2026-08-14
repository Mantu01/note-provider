import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { NOTE_LEVELS, NOTE_PRICING_TYPES, NOTE_VISIBILITIES } from "@/lib/constants";

const noteSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 160 },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true, minlength: 10, maxlength: 5000 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    level: { type: String, enum: NOTE_LEVELS, required: true, index: true },
    visibility: { type: String, enum: NOTE_VISIBILITIES, default: "public", index: true },
    pricingType: { type: String, enum: NOTE_PRICING_TYPES, required: true, index: true },
    price: { type: Number, required: true, min: 0, default: 0 },
    compareAtPrice: { type: Number, default: null, min: 0 },
    fullFileUrl: { type: String, required: true },
    fullFilePublicId: { type: String, required: true },
    fullFileBytes: { type: Number, required: true },
    previewFileUrl: { type: String, default: null },
    previewFilePublicId: { type: String, default: null },
    previewFileBytes: { type: Number, default: null },
    coverImageUrl: { type: String, default: null },
    coverImagePublicId: { type: String, default: null },
    pageCount: { type: Number, default: null },
    tags: { type: [String], default: [], index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    downloadCount: { type: Number, default: 0 },
    purchaseCount: { type: Number, default: 0 },
    revenuePaise: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
  },
  { timestamps: true },
);

noteSchema.index({ visibility: 1, createdAt: -1 });
noteSchema.index({ category: 1, level: 1, pricingType: 1 });
noteSchema.index({ price: 1 });
noteSchema.index({ isFeatured: -1, createdAt: -1 });
noteSchema.index(
  { title: "text", description: "text", tags: "text" },
  { weights: { title: 3, tags: 2, description: 1 }, name: "note_search_index" },
);

export type NoteDoc = InferSchemaType<typeof noteSchema> & {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Note: Model<NoteDoc> =
  (models.Note as Model<NoteDoc>) ?? model<NoteDoc>("Note", noteSchema);
