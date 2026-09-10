import { describe, it, expect } from "vitest";
import { Order } from "../../../src/server/db/models/order.model";
import { PURCHASE_ITEM_TYPES, ORDER_CURRENCY, PAYMENT_STATUSES, FULFILLMENT_STATUSES } from "../../../src/lib/constants";

describe("Order model", () => {
  it("has correct schema fields", () => {
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

  it("validates orderNumber unique indexed", () => {
    const onPath = Order.schema.path("orderNumber") as any;
    expect(onPath.isRequired).toBe(true);
    expect(onPath.options.unique).toBe(true);
    expect(onPath.options.index).toBe(true);
  });

  it("validates itemType enum", () => {
    const itemPath = Order.schema.path("itemType") as any;
    expect(itemPath.isRequired).toBe(true);
    expect(itemPath.enumValues).toContain(PURCHASE_ITEM_TYPES[0]);
  });

  it("validates paymentStatus enum with default", () => {
    const psPath = Order.schema.path("paymentStatus") as any;
    expect(psPath.enumValues).toContain("created");
    expect(psPath.enumValues).toContain("paid");
    expect(psPath.enumValues).toContain("failed");
    expect(psPath.defaultValue).toBe("created");
    expect(psPath.options.index).toBe(true);
  });

  it("validates fulfillmentStatus enum with default", () => {
    const fsPath = Order.schema.path("fulfillmentStatus") as any;
    expect(fsPath.enumValues).toContain("pending");
    expect(fsPath.enumValues).toContain("completed");
    expect(fsPath.enumValues).toContain("cancelled");
    expect(fsPath.defaultValue).toBe("pending");
    expect(fsPath.options.index).toBe(true);
  });

  it("validates amount min 0", () => {
    const amountPath = Order.schema.path("amount") as any;
    expect(amountPath.isRequired).toBe(true);
    expect(amountPath.options.min).toBe(0);
  });

  it("defaults currency to ORDER_CURRENCY", () => {
    expect((Order.schema.path("currency") as any).defaultValue).toBe(ORDER_CURRENCY);
  });

  it("validates razorpayOrderId unique sparse", () => {
    const rzpPath = Order.schema.path("razorpayOrderId") as any;
    expect(rzpPath.isRequired).toBe(true);
    expect(rzpPath.options.unique).toBe(true);
    expect(rzpPath.options.sparse).toBe(true);
    expect(rzpPath.options.index).toBe(true);
  });

  it("validates buyer subdocument", () => {
    const buyerSchema = Order.schema.path("buyer") as any;
    expect(buyerSchema.schema.path("fullName")).toBeDefined();
    expect(buyerSchema.schema.path("consentAccepted")).toBeDefined();
    expect(buyerSchema.schema.path("ipAddress")).toBeDefined();
    expect(buyerSchema.schema.path("userAgent")).toBeDefined();
    expect(buyerSchema.schema.path("consentAccepted").isRequired).toBe(true);
  });

  it("validates itemSnapshot subdocument", () => {
    const snapshotSchema = Order.schema.path("itemSnapshot") as any;
    expect(snapshotSchema.schema.paths.title.isRequired).toBe(true);
    expect(snapshotSchema.schema.paths.slug.isRequired).toBe(true);
    expect(snapshotSchema.schema.paths.price.isRequired).toBe(true);
    expect(snapshotSchema.schema.paths.noteIds).toBeDefined();
    expect(snapshotSchema.schema.paths.coverImageUrl).toBeDefined();
  });

  it("has composite index on paymentStatus + fulfillmentStatus + createdAt", () => {
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

  it("enables timestamps", () => {
    expect(Order.schema.options.timestamps).toBe(true);
  });

  it("creates a valid order document", async () => {
    const order = new Order({
      orderNumber: "NP-20240101-0001",
      itemType: "note",
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
      razorpayOrderId: "raze_order_123",
    });
    expect(order.currency).toBe("INR");
    expect(order.paymentStatus).toBe("created");
    expect(order.fulfillmentStatus).toBe("pending");
    expect(order.paidAt).toBeNull();
    expect(order.completedAt).toBeNull();
    expect(order.failureReason).toBeNull();
  });

  it("validates orderNumber is required", async () => {
    const order = new Order({
      itemType: "note",
      amount: 50000,
      itemSnapshot: { title: "React", slug: "react", price: 50000, noteIds: [] },
      buyer: { fullName: "John", consentAccepted: true },
      razorpayOrderId: "rp_123",
    } as any);
    await expect(order.validate()).rejects.toThrow();
  });

  it("validates itemType is required", async () => {
    const order = new Order({
      orderNumber: "NP-2024-0001",
      amount: 50000,
      itemSnapshot: { title: "React", slug: "react", price: 50000, noteIds: [] },
      buyer: { fullName: "John", consentAccepted: true },
      razorpayOrderId: "rp_123",
    } as any);
    await expect(order.validate()).rejects.toThrow();
  });

  it("validates amount is required", async () => {
    const order = new Order({
      orderNumber: "NP-2024-0001",
      itemType: "note",
      itemSnapshot: { title: "React", slug: "react", price: 50000, noteIds: [] },
      buyer: { fullName: "John", consentAccepted: true },
      razorpayOrderId: "rp_123",
    } as any);
    await expect(order.validate()).rejects.toThrow();
  });

  it("validates itemSnapshot is required", async () => {
    const order = new Order({
      orderNumber: "NP-2024-0001",
      itemType: "note",
      amount: 50000,
      buyer: { fullName: "John", consentAccepted: true },
      razorpayOrderId: "rp_123",
    } as any);
    await expect(order.validate()).rejects.toThrow();
  });

  it("validates buyer is required", async () => {
    const order = new Order({
      orderNumber: "NP-2024-0001",
      itemType: "note",
      amount: 50000,
      itemSnapshot: { title: "React", slug: "react", price: 50000, noteIds: [] },
      razorpayOrderId: "rp_123",
    } as any);
    await expect(order.validate()).rejects.toThrow();
  });

  it("validates razorpayOrderId is required", async () => {
    const order = new Order({
      orderNumber: "NP-2024-0001",
      itemType: "note",
      amount: 50000,
      itemSnapshot: { title: "React", slug: "react", price: 50000, noteIds: [] },
      buyer: { fullName: "John", consentAccepted: true },
    } as any);
    await expect(order.validate()).rejects.toThrow();
  });

  it("validates buyer.fullName is required", async () => {
    const order = new Order({
      orderNumber: "NP-2024-0001",
      itemType: "note",
      amount: 50000,
      itemSnapshot: { title: "React", slug: "react", price: 50000, noteIds: [] },
      buyer: { consentAccepted: true } as any,
      razorpayOrderId: "rp_123",
    });
    await expect(order.validate()).rejects.toThrow();
  });

  it("validates buyer.consentAccepted is required", async () => {
    const order = new Order({
      orderNumber: "NP-2024-0001",
      itemType: "note",
      amount: 50000,
      itemSnapshot: { title: "React", slug: "react", price: 50000, noteIds: [] },
      buyer: { fullName: "John" } as any,
      razorpayOrderId: "rp_123",
    });
    await expect(order.validate()).rejects.toThrow();
  });

  it("defaults note and group to null", async () => {
    const order = new Order({
      orderNumber: "NP-2024-0001",
      itemType: "note",
      amount: 50000,
      itemSnapshot: { title: "React", slug: "react", price: 50000, noteIds: [] },
      buyer: { fullName: "John", consentAccepted: true },
      razorpayOrderId: "rp_123",
    });
    expect(order.note).toBeNull();
    expect(order.group).toBeNull();
  });

  it("defaults razorpayPaymentId fields to null", async () => {
    const order = new Order({
      orderNumber: "NP-2024-0001",
      itemType: "note",
      amount: 50000,
      itemSnapshot: { title: "React", slug: "react", price: 50000, noteIds: [] },
      buyer: { fullName: "John", consentAccepted: true },
      razorpayOrderId: "rp_123",
    });
    expect(order.razorpayPaymentId).toBeNull();
    expect(order.razorpaySignature).toBeNull();
    expect(order.paymentMethod).toBeNull();
  });

  it("defaults completion fields to null", async () => {
    const order = new Order({
      orderNumber: "NP-2024-0001",
      itemType: "note",
      amount: 50000,
      itemSnapshot: { title: "React", slug: "react", price: 50000, noteIds: [] },
      buyer: { fullName: "John", consentAccepted: true },
      razorpayOrderId: "rp_123",
    });
    expect(order.adminNote).toBeNull();
    expect(order.paidAt).toBeNull();
    expect(order.completedAt).toBeNull();
    expect(order.completedBy).toBeNull();
  });

  it("supports note item type", async () => {
    const order = new Order({
      orderNumber: "NP-2024-0002",
      itemType: "note",
      note: "507f1f77bcf86cd799439011",
      amount: 29900,
      itemSnapshot: { title: "React", slug: "react", price: 29900, noteIds: ["507f1f77bcf86cd799439011"] },
      buyer: { fullName: "Alice", consentAccepted: true },
      razorpayOrderId: "rp_note_1",
    });
    expect(order.itemType).toBe("note");
    expect((order.note as any).toString()).toBe("507f1f77bcf86cd799439011");
    expect(order.group).toBeNull();
  });

  it("supports group item type", async () => {
    const order = new Order({
      orderNumber: "NP-2024-0003",
      itemType: "group",
      group: "507f1f77bcf86cd799439012",
      amount: 99900,
      itemSnapshot: { title: "Bundle", slug: "bundle", price: 99900, noteIds: [] },
      buyer: { fullName: "Bob", consentAccepted: true },
      razorpayOrderId: "rp_group_1",
    });
    expect(order.itemType).toBe("group");
    expect((order.group as any).toString()).toBe("507f1f77bcf86cd799439012");
    expect(order.note).toBeNull();
  });

  it("validates paymentStatus enum values", () => {
    for (const status of PAYMENT_STATUSES) {
      expect(["created", "paid", "failed"]).toContain(status);
    }
  });

  it("validates fulfillmentStatus enum values", () => {
    for (const status of FULFILLMENT_STATUSES) {
      expect(["pending", "completed", "cancelled"]).toContain(status);
    }
  });

  it("validates purchase item types", () => {
    for (const type of PURCHASE_ITEM_TYPES) {
      expect(["note", "group"]).toContain(type);
    }
  });
});
