import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const counterSchema = new Schema({
  key: { type: String, required: true, unique: true, index: true },
  seq: { type: Number, required: true, default: 0 },
});

export type CounterDoc = InferSchemaType<typeof counterSchema> & { _id: Schema.Types.ObjectId };

export const Counter: Model<CounterDoc> =
  (models.Counter as Model<CounterDoc>) ?? model<CounterDoc>("Counter", counterSchema);
