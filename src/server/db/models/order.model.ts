import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { FULFILLMENT_STATUSES, ORDER_CURRENCY, PAYMENT_STATUSES, PURCHASE_ITEM_TYPES } from "@/lib/constants";

const itemSnapshotSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    price: { type: Number, required: true },
    noteIds: { type: [{ type: Schema.Types.ObjectId, ref: "Note" }], default: [] },
    coverImageUrl: { type: String, default: null },
  },
  { _id: false },
);

const buyerSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    consentAccepted: { type: Boolean, required: true },
    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    itemType: { type: String, enum: PURCHASE_ITEM_TYPES, required: true },
    note: { type: Schema.Types.ObjectId, ref: "Note", default: null },
    group: { type: Schema.Types.ObjectId, ref: "Group", default: null },
    itemSnapshot: { type: itemSnapshotSchema, required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: ORDER_CURRENCY },
    buyer: { type: buyerSchema, required: true },
    razorpayOrderId: { type: String, required: true, unique: true, sparse: true, index: true },
    razorpayPaymentId: { type: String, default: null, index: true },
    razorpaySignature: { type: String, default: null },
    paymentMethod: { type: String, default: null },
    paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: "created", index: true },
    fulfillmentStatus: { type: String, enum: FULFILLMENT_STATUSES, default: "pending", index: true },
    failureReason: { type: String, default: null },
    adminNote: { type: String, default: null, maxlength: 1000 },
    paidAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    completedBy: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
  },
  { timestamps: true },
);

orderSchema.index({ paymentStatus: 1, fulfillmentStatus: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });

export type OrderDoc = InferSchemaType<typeof orderSchema> & {
  _id: import("mongoose").Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Order: Model<OrderDoc> = (models.Order as Model<OrderDoc>) ?? model<OrderDoc>("Order", orderSchema);
