import { describe, it, expect } from "vitest";
import { Order } from "../../../src/server/db/models/order.model";
import { PURCHASE_ITEM_TYPES, ORDER_CURRENCY, PAYMENT_STATUSES, FULFILLMENT_STATUSES } from "../../../src/lib/constants";

const validOrderBase = {
  orderNumber: "NP-20240101-0001",
  itemType: "note" as const,
  amount: 50000,
  itemSnapshot: {
    title: "React Notes",
    slug: "react-notes",
    price: 50000,
    noteIds: [],
    coverImageUrl: null,
  },
  buyer: {
    fullName: "John Doe",
    consentAccepted: true,
    ipAddress: null,
    userAgent: null,
  },
  razorpayOrderId: "rzp_test_order_123",
};

describe("Order model — schema structure", () => {
  it("has all expected schema fields", () => {
    const schema = Order.schema;
    expect(schema.path("orderNumber")).toBeDefined();
    expect(schema.path("itemType")).toBeDefined();
    expect(schema.path("note")).toBeDefined();
    expect(schema.path("group")).toBeDefined();
    expect(schema.path("itemSnapshot")).toBeDefined();
    expect(schema.path("amount")).toBeDefined();
    expect(schema.path("currency")).toBeDefined();
    expect(schema.path("buyer")).toBeDefined();
    expect(schema.path("razorpayOrderId")).toBeDefined();
    expect(schema.path("razorpayPaymentId")).toBeDefined();
    expect(schema.path("razorpaySignature")).toBeDefined();
    expect(schema.path("paymentMethod")).toBeDefined();
    expect(schema.path("paymentStatus")).toBeDefined();
    expect(schema.path("fulfillmentStatus")).toBeDefined();
    expect(schema.path("failureReason")).toBeDefined();
    expect(schema.path("adminNote")).toBeDefined();
    expect(schema.path("paidAt")).toBeDefined();
    expect(schema.path("completedAt")).toBeDefined();
    expect(schema.path("completedBy")).toBeDefined();
  });

  it("orderNumber is required, unique, indexed", () => {
    const path = Order.schema.path("orderNumber") as any;
    expect(path.isRequired).toBe(true);
    expect(path.options.unique).toBe(true);
    expect(path.options.index).toBe(true);
  });

  it("itemType enum contains all PURCHASE_ITEM_TYPES", () => {
    const path = Order.schema.path("itemType") as any;
    expect(path.isRequired).toBe(true);
    for (const type of PURCHASE_ITEM_TYPES) {
      expect(path.enumValues).toContain(type);
    }
  });

  it("paymentStatus enum contains all PAYMENT_STATUSES with correct default", () => {
    const path = Order.schema.path("paymentStatus") as any;
    for (const status of PAYMENT_STATUSES) {
      expect(path.enumValues).toContain(status);
    }
    expect(path.defaultValue).toBe("created");
    expect(path.options.index).toBe(true);
  });

  it("fulfillmentStatus enum contains all FULFILLMENT_STATUSES with correct default", () => {
    const path = Order.schema.path("fulfillmentStatus") as any;
    for (const status of FULFILLMENT_STATUSES) {
      expect(path.enumValues).toContain(status);
    }
    expect(path.defaultValue).toBe("pending");
    expect(path.options.index).toBe(true);
  });

  it("amount is required with min of 0", () => {
    const path = Order.schema.path("amount") as any;
    expect(path.isRequired).toBe(true);
    expect(path.options.min).toBe(0);
  });

  it("currency defaults to ORDER_CURRENCY (INR)", () => {
    expect((Order.schema.path("currency") as any).defaultValue).toBe(ORDER_CURRENCY);
    expect(ORDER_CURRENCY).toBe("INR");
  });

  it("razorpayOrderId is required, unique, sparse, indexed", () => {
    const path = Order.schema.path("razorpayOrderId") as any;
    expect(path.isRequired).toBe(true);
    expect(path.options.unique).toBe(true);
    expect(path.options.sparse).toBe(true);
    expect(path.options.index).toBe(true);
  });

  it("razorpayPaymentId is indexed", () => {
    const path = Order.schema.path("razorpayPaymentId") as any;
    expect(path.options.index).toBe(true);
  });

  it("buyer subdocument has correct fields", () => {
    const buyerSchema = Order.schema.path("buyer") as any;
    expect(buyerSchema.schema.path("fullName")).toBeDefined();
    expect(buyerSchema.schema.path("consentAccepted")).toBeDefined();
    expect(buyerSchema.schema.path("ipAddress")).toBeDefined();
    expect(buyerSchema.schema.path("userAgent")).toBeDefined();
  });

  it("buyer.fullName is required with length limits", () => {
    const buyerSchema = Order.schema.path("buyer") as any;
    const namePath = buyerSchema.schema.path("fullName") as any;
    expect(namePath.isRequired).toBe(true);
    expect(namePath.options.trim).toBe(true);
    expect(namePath.options.minlength).toBe(2);
    expect(namePath.options.maxlength).toBe(80);
  });

  it("buyer.consentAccepted is required", () => {
    const buyerSchema = Order.schema.path("buyer") as any;
    expect(buyerSchema.schema.path("consentAccepted").isRequired).toBe(true);
  });

  it("itemSnapshot subdocument has required fields", () => {
    const snapshotSchema = Order.schema.path("itemSnapshot") as any;
    expect(snapshotSchema.schema.paths.title.isRequired).toBe(true);
    expect(snapshotSchema.schema.paths.slug.isRequired).toBe(true);
    expect(snapshotSchema.schema.paths.price.isRequired).toBe(true);
    expect(snapshotSchema.schema.paths.noteIds).toBeDefined();
    expect(snapshotSchema.schema.paths.coverImageUrl).toBeDefined();
  });

  it("adminNote has maxlength of 1000", () => {
    const path = Order.schema.path("adminNote") as any;
    expect(path.options.maxlength).toBe(1000);
  });

  it("has composite index on paymentStatus+fulfillmentStatus+createdAt", () => {
    const indexes = Order.schema.indexes();
    const compIndex = (indexes as any[]).find(
      ([k]: [Record<string, number>, unknown]) => k.paymentStatus && k.fulfillmentStatus && k.createdAt,
    );
    expect(compIndex).toBeDefined();
  });

  it("has createdAt descending index", () => {
    const indexes = Order.schema.indexes();
    const dateIndex = (indexes as any[]).find(
      ([k]: [Record<string, number>, unknown]) => k.createdAt === -1 && Object.keys(k).length === 1,
    );
    expect(dateIndex).toBeDefined();
  });

  it("has timestamps enabled", () => {
    expect(Order.schema.options.timestamps).toBe(true);
  });

  it("buyer and itemSnapshot have _id:false (no subdocument IDs)", () => {
    const buyerSchema = Order.schema.path("buyer") as any;
    const snapshotSchema = Order.schema.path("itemSnapshot") as any;
    expect(buyerSchema.schema.options._id).toBe(false);
    expect(snapshotSchema.schema.options._id).toBe(false);
  });
});

describe("Order model — document instantiation", () => {
  it("creates valid order with correct defaults", async () => {
    const order = new Order(validOrderBase);
    expect(order.currency).toBe("INR");
    expect(order.paymentStatus).toBe("created");
    expect(order.fulfillmentStatus).toBe("pending");
    expect(order.paidAt).toBeNull();
    expect(order.completedAt).toBeNull();
    expect(order.completedBy).toBeNull();
    expect(order.note).toBeNull();
    expect(order.group).toBeNull();
    expect(order.razorpayPaymentId).toBeNull();
    expect(order.razorpaySignature).toBeNull();
    expect(order.paymentMethod).toBeNull();
    expect(order.failureReason).toBeNull();
    expect(order.adminNote).toBeNull();
  });

  it("accepts note item type with note reference", async () => {
    const order = new Order({
      ...validOrderBase,
      orderNumber: "NP-20240101-0002",
      itemType: "note",
      note: "507f1f77bcf86cd799439011",
      razorpayOrderId: "rzp_note_order_1",
    });
    expect(order.itemType).toBe("note");
    expect((order.note as any).toString()).toBe("507f1f77bcf86cd799439011");
    expect(order.group).toBeNull();
  });

  it("accepts group item type with group reference", async () => {
    const order = new Order({
      ...validOrderBase,
      orderNumber: "NP-20240101-0003",
      itemType: "group",
      group: "507f1f77bcf86cd799439012",
      razorpayOrderId: "rzp_group_order_1",
      itemSnapshot: { ...validOrderBase.itemSnapshot, noteIds: ["507f1f77bcf86cd799439011"] },
    });
    expect(order.itemType).toBe("group");
    expect((order.group as any).toString()).toBe("507f1f77bcf86cd799439012");
    expect(order.note).toBeNull();
  });

  it("supports all payment statuses", async () => {
    for (const status of PAYMENT_STATUSES) {
      const order = new Order({ ...validOrderBase, razorpayOrderId: `rzp_${status}`, paymentStatus: status });
      expect(order.paymentStatus).toBe(status);
    }
  });

  it("supports all fulfillment statuses", async () => {
    for (const status of FULFILLMENT_STATUSES) {
      const order = new Order({ ...validOrderBase, razorpayOrderId: `rzp_fulfill_${status}`, fulfillmentStatus: status });
      expect(order.fulfillmentStatus).toBe(status);
    }
  });

  it("supports all purchase item types", async () => {
    for (const type of PURCHASE_ITEM_TYPES) {
      const order = new Order({ ...validOrderBase, razorpayOrderId: `rzp_type_${type}`, itemType: type });
      expect(order.itemType).toBe(type);
    }
  });

  it("allows setting paidAt and completedAt dates", async () => {
    const paidAt = new Date("2024-01-01T12:00:00Z");
    const completedAt = new Date("2024-01-01T12:05:00Z");
    const order = new Order({
      ...validOrderBase,
      paymentStatus: "paid",
      fulfillmentStatus: "completed",
      paidAt,
      completedAt,
    });
    expect(order.paidAt).toEqual(paidAt);
    expect(order.completedAt).toEqual(completedAt);
  });

  it("allows setting adminNote", async () => {
    const order = new Order({ ...validOrderBase, adminNote: "Manually verified payment" });
    expect(order.adminNote).toBe("Manually verified payment");
  });

  it("allows setting razorpayPaymentId and signature", async () => {
    const order = new Order({
      ...validOrderBase,
      razorpayPaymentId: "pay_123456",
      razorpaySignature: "sig_abcdef",
      paymentMethod: "upi",
    });
    expect(order.razorpayPaymentId).toBe("pay_123456");
    expect(order.razorpaySignature).toBe("sig_abcdef");
    expect(order.paymentMethod).toBe("upi");
  });

  it("allows setting failureReason", async () => {
    const order = new Order({
      ...validOrderBase,
      paymentStatus: "failed",
      failureReason: "Payment declined by bank",
    });
    expect(order.failureReason).toBe("Payment declined by bank");
  });

  it("itemSnapshot stores note IDs correctly", async () => {
    const order = new Order({
      ...validOrderBase,
      itemType: "group",
      itemSnapshot: {
        title: "Bundle",
        slug: "bundle",
        price: 99900,
        noteIds: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
        coverImageUrl: "https://example.com/cover.jpg",
      },
    });
    expect(order.itemSnapshot.noteIds.length).toBe(2);
    expect(order.itemSnapshot.coverImageUrl).toBe("https://example.com/cover.jpg");
  });

  it("buyer fields are stored correctly", async () => {
    const order = new Order({
      ...validOrderBase,
      buyer: {
        fullName: "Jane Smith",
        consentAccepted: true,
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
      },
    });
    expect(order.buyer.fullName).toBe("Jane Smith");
    expect(order.buyer.consentAccepted).toBe(true);
    expect(order.buyer.ipAddress).toBe("192.168.1.1");
    expect(order.buyer.userAgent).toBe("Mozilla/5.0");
  });
});

describe("Order model — validation", () => {
  it("rejects missing orderNumber", async () => {
    const { orderNumber: _n, ...rest } = validOrderBase;
    const order = new Order(rest as any);
    await expect(order.validate()).rejects.toThrow();
  });

  it("rejects missing itemType", async () => {
    const { itemType: _i, ...rest } = validOrderBase;
    const order = new Order(rest as any);
    await expect(order.validate()).rejects.toThrow();
  });

  it("rejects missing amount", async () => {
    const { amount: _a, ...rest } = validOrderBase;
    const order = new Order(rest as any);
    await expect(order.validate()).rejects.toThrow();
  });

  it("rejects missing itemSnapshot", async () => {
    const { itemSnapshot: _s, ...rest } = validOrderBase;
    const order = new Order(rest as any);
    await expect(order.validate()).rejects.toThrow();
  });

  it("rejects missing buyer", async () => {
    const { buyer: _b, ...rest } = validOrderBase;
    const order = new Order(rest as any);
    await expect(order.validate()).rejects.toThrow();
  });

  it("rejects missing razorpayOrderId", async () => {
    const { razorpayOrderId: _r, ...rest } = validOrderBase;
    const order = new Order(rest as any);
    await expect(order.validate()).rejects.toThrow();
  });

  it("rejects missing buyer.fullName", async () => {
    const order = new Order({
      ...validOrderBase,
      buyer: { consentAccepted: true } as any,
    });
    await expect(order.validate()).rejects.toThrow();
  });

  it("rejects missing buyer.consentAccepted", async () => {
    const order = new Order({
      ...validOrderBase,
      buyer: { fullName: "John" } as any,
    });
    await expect(order.validate()).rejects.toThrow();
  });

  it("rejects amount below 0", async () => {
    const order = new Order({ ...validOrderBase, amount: -1 });
    await expect(order.validate()).rejects.toThrow();
  });

  it("accepts amount of 0 (free orders)", async () => {
    const order = new Order({ ...validOrderBase, amount: 0 });
    await expect(order.validate()).resolves.toBeUndefined();
  });

  it("rejects invalid itemType value", async () => {
    const order = new Order({ ...validOrderBase, itemType: "bundle" as any });
    await expect(order.validate()).rejects.toThrow();
  });

  it("rejects invalid paymentStatus value", async () => {
    const order = new Order({ ...validOrderBase, paymentStatus: "processing" as any });
    await expect(order.validate()).rejects.toThrow();
  });

  it("rejects invalid fulfillmentStatus value", async () => {
    const order = new Order({ ...validOrderBase, fulfillmentStatus: "in-progress" as any });
    await expect(order.validate()).rejects.toThrow();
  });

  it("rejects buyer.fullName shorter than 2 characters", async () => {
    const order = new Order({ ...validOrderBase, buyer: { fullName: "J", consentAccepted: true } });
    await expect(order.validate()).rejects.toThrow();
  });

  it("rejects buyer.fullName longer than 80 characters", async () => {
    const order = new Order({ ...validOrderBase, buyer: { fullName: "A".repeat(81), consentAccepted: true } });
    await expect(order.validate()).rejects.toThrow();
  });

  it("rejects adminNote longer than 1000 characters", async () => {
    const order = new Order({ ...validOrderBase, adminNote: "A".repeat(1001) });
    await expect(order.validate()).rejects.toThrow();
  });

  it("accepts adminNote at exactly 1000 characters", async () => {
    const order = new Order({ ...validOrderBase, adminNote: "A".repeat(1000) });
    await expect(order.validate()).resolves.toBeUndefined();
  });

  it("passes validation with all required fields", async () => {
    const order = new Order(validOrderBase);
    await expect(order.validate()).resolves.toBeUndefined();
  });

  it("passes validation for all payment status transitions", async () => {
    for (const status of PAYMENT_STATUSES) {
      const order = new Order({ ...validOrderBase, razorpayOrderId: `rzp_val_${status}`, paymentStatus: status });
      await expect(order.validate()).resolves.toBeUndefined();
    }
  });

  it("passes validation for all fulfillment status values", async () => {
    for (const status of FULFILLMENT_STATUSES) {
      const order = new Order({ ...validOrderBase, razorpayOrderId: `rzp_fval_${status}`, fulfillmentStatus: status });
      await expect(order.validate()).resolves.toBeUndefined();
    }
  });
});

describe("Order model — constant validation", () => {
  it("PAYMENT_STATUSES contains exactly: created, paid, failed", () => {
    expect(PAYMENT_STATUSES).toContain("created");
    expect(PAYMENT_STATUSES).toContain("paid");
    expect(PAYMENT_STATUSES).toContain("failed");
    expect(PAYMENT_STATUSES.length).toBe(3);
  });

  it("FULFILLMENT_STATUSES contains exactly: pending, completed, cancelled", () => {
    expect(FULFILLMENT_STATUSES).toContain("pending");
    expect(FULFILLMENT_STATUSES).toContain("completed");
    expect(FULFILLMENT_STATUSES).toContain("cancelled");
    expect(FULFILLMENT_STATUSES.length).toBe(3);
  });

  it("PURCHASE_ITEM_TYPES contains exactly: note, group", () => {
    expect(PURCHASE_ITEM_TYPES).toContain("note");
    expect(PURCHASE_ITEM_TYPES).toContain("group");
    expect(PURCHASE_ITEM_TYPES.length).toBe(2);
  });

  it("ORDER_CURRENCY is INR", () => {
    expect(ORDER_CURRENCY).toBe("INR");
  });
});
