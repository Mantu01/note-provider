import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const subjectSubSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
    slug: { type: String, required: true, trim: true, lowercase: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true, timestamps: true },
);

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, minlength: 2, maxlength: 60 },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: null, maxlength: 300 },
    icon: { type: String, default: null },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    subjects: { type: [subjectSubSchema], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
  },
  { timestamps: true },
);

categorySchema.index({ order: 1, name: 1 });

export type CategoryDoc = InferSchemaType<typeof categorySchema> & {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Category: Model<CategoryDoc> =
  (models.Category as Model<CategoryDoc>) ?? model<CategoryDoc>("Category", categorySchema);
