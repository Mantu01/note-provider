import { describe, it, expect } from "vitest";
import { toPublicOrder, toAdminOrder, toAdminLead } from "../../../src/server/mappers/order.mapper";

describe("toPublicOrder", () => {
  it("returns a full PublicOrder from a complete document", () => {
    const doc = {
      _id: "ord1",
      orderNumber: "NP-20240101-0001",
      itemType: "note",
      amount: 50000,
      paymentStatus: "paid",
      fulfillmentStatus: "pending",
      itemSnapshot: { title: "React Notes", slug: "react-notes", price: 50000, noteIds: [] },
      buyer: { fullName: "John Doe", socialPlatform: "instagram", socialHandle: "@johndoe" },
      createdAt: new Date("2024-01-01"),
      paidAt: new Date("2024-01-01T10:00:00Z"),
      completedAt: null,
    };
    const result = toPublicOrder(doc);
    expect(result).toEqual({
      id: "ord1",
      orderNumber: "NP-20240101-0001",
      itemType: "note",
      itemTitle: "React Notes",
      itemSlug: "react-notes",
      amount: 50000,
      amountLabel: "₹500",
      currency: "INR",
      paymentStatus: "paid",
      fulfillmentStatus: "pending",
      buyer: {
        fullName: "John Doe",
        socialPlatform: "instagram",
        socialHandleMasked: "@jo***oe",
      },
      deliveryEtaHours: 6,
      createdAt: "2024-01-01T00:00:00.000Z",
      paidAt: "2024-01-01T10:00:00.000Z",
      completedAt: null,
    });
  });

  it("returns a group type order", () => {
    const doc = {
      _id: "ord1",
      orderNumber: "NP-20240101-0001",
      itemType: "group",
      amount: 100000,
      paymentStatus: "created",
      fulfillmentStatus: "pending",
      itemSnapshot: { title: "JS Bundle", slug: "js-bundle", price: 100000, noteIds: ["n1", "n2"] },
      buyer: { fullName: "Jane", socialPlatform: "whatsapp", socialHandle: "9876543210" },
      createdAt: new Date("2024-01-01"),
      paidAt: null,
      completedAt: null,
    };
    const result = toPublicOrder(doc);
    expect(result.itemType).toBe("group");
    expect(result.itemTitle).toBe("JS Bundle");
  });

  it("masks social handle for email platform", () => {
    const doc = {
      _id: "ord1",
      orderNumber: "NP-20240101-0001",
      itemType: "note",
      amount: 0,
      paymentStatus: "paid",
      fulfillmentStatus: "completed",
      itemSnapshot: { title: "Free Note", slug: "free", price: 0, noteIds: [] },
      buyer: { fullName: "Test", socialPlatform: "email", socialHandle: "test@example.com" },
      createdAt: new Date("2024-01-01"),
      paidAt: new Date(),
      completedAt: new Date(),
    };
    const result = toPublicOrder(doc);
    expect(result.buyer.socialHandleMasked).toContain("@example.com");
  });

  it("handles doc with missing buyer fields", () => {
    const doc = {
      _id: "ord1",
      orderNumber: "NP-20240101-0001",
      itemType: "note",
      amount: 0,
      paymentStatus: "created",
      fulfillmentStatus: "pending",
      itemSnapshot: { title: "Test", slug: "test", price: 0, noteIds: [] },
      buyer: {},
      createdAt: new Date("2024-01-01"),
      paidAt: null,
      completedAt: null,
    };
    const result = toPublicOrder(doc);
    expect(result.buyer.fullName).toBe("");
    expect(result.buyer.socialPlatform).toBe("");
    expect(result.buyer.socialHandleMasked).toBe("");
  });

  it("handles non-object input gracefully", () => {
    const result = toPublicOrder(null);
    expect(result.id).toBe("");
    expect(result.orderNumber).toBe("");
    expect(result.itemType).toBe("note");
  });
});

describe("toAdminOrder", () => {
  it("returns a full AdminOrder from a complete document", () => {
    const doc = {
      _id: "ord1",
      orderNumber: "NP-20240101-0001",
      itemType: "note",
      amount: 50000,
      paymentStatus: "paid",
      fulfillmentStatus: "completed",
      itemSnapshot: { title: "React Notes", slug: "react-notes", price: 50000, noteIds: ["n1"] },
      buyer: {
        fullName: "John Doe",
        socialPlatform: "instagram",
        socialHandle: "@johndoe",
        consentAccepted: true,
        ipAddress: "1.2.3.4",
        userAgent: "Mozilla/5.0",
      },
      razorpayOrderId: "order_abc",
      razorpayPaymentId: "pay_xyz",
      razorpaySignature: "sig123",
      paymentMethod: "upi",
      failureReason: null,
      adminNote: "Delivered manually",
      completedBy: { _id: "adm1", name: "Admin" },
      note: { _id: "n1" },
      createdAt: new Date("2024-01-01"),
      paidAt: new Date("2024-01-01T10:00:00Z"),
      completedAt: new Date("2024-01-01T12:00:00Z"),
      updatedAt: new Date("2024-01-01T12:00:00Z"),
    };
    const result = toAdminOrder(doc);
    expect(result.razorpayOrderId).toBe("order_abc");
    expect(result.razorpayPaymentId).toBe("pay_xyz");
    expect(result.razorpaySignature).toBe("sig123");
    expect(result.paymentMethod).toBe("upi");
    expect(result.failureReason).toBeNull();
    expect(result.adminNote).toBe("Delivered manually");
    expect(result.buyerFull.fullName).toBe("John Doe");
    expect(result.buyerFull.socialHandle).toBe("@johndoe");
    expect(result.buyerFull.ipAddress).toBe("1.2.3.4");
    expect(result.buyerFull.userAgent).toBe("Mozilla/5.0");
    expect(result.item.id).toBe("n1");
    expect(result.item.type).toBe("note");
    expect(result.completedBy).toEqual({ id: "adm1", name: "Admin" });
  });

  it("handles group item type", () => {
    const doc = {
      _id: "ord1",
      orderNumber: "NP-20240101-0001",
      itemType: "group",
      amount: 100000,
      paymentStatus: "paid",
      fulfillmentStatus: "pending",
      itemSnapshot: { title: "JS Bundle", slug: "js-bundle", price: 100000, noteIds: ["n1", "n2"] },
      buyer: { fullName: "Test", socialPlatform: "whatsapp", socialHandle: "9876543210" },
      note: null,
      group: { _id: "grp1" },
      createdAt: new Date("2024-01-01"),
      paidAt: new Date(),
      completedAt: null,
      updatedAt: new Date("2024-01-01"),
    };
    const result = toAdminOrder(doc);
    expect(result.item.type).toBe("group");
    expect(result.item.id).toBe("grp1");
    expect(result.item.noteIds).toEqual(["n1", "n2"]);
  });

  it("handles itemRef as a string id", () => {
    const doc = {
      _id: "ord1",
      orderNumber: "NP-20240101-0001",
      itemType: "note",
      amount: 0,
      paymentStatus: "created",
      fulfillmentStatus: "pending",
      itemSnapshot: { title: "Test", slug: "test", price: 0, noteIds: [] },
      buyer: { fullName: "Test", socialPlatform: "email", socialHandle: "a@b.com" },
      note: "string-id",
      createdAt: new Date("2024-01-01"),
      paidAt: null,
      completedAt: null,
      updatedAt: new Date("2024-01-01"),
    };
    const result = toAdminOrder(doc);
    expect(result.item.id).toBe("string-id");
  });

  it("handles null completedBy", () => {
    const doc = {
      _id: "ord1",
      orderNumber: "NP-20240101-0001",
      itemType: "note",
      amount: 0,
      paymentStatus: "created",
      fulfillmentStatus: "pending",
      itemSnapshot: { title: "Test", slug: "test", price: 0, noteIds: [] },
      buyer: { fullName: "Test", socialPlatform: "email", socialHandle: "a@b.com" },
      completedBy: null,
      createdAt: new Date("2024-01-01"),
      paidAt: null,
      completedAt: null,
      updatedAt: new Date("2024-01-01"),
    };
    const result = toAdminOrder(doc);
    expect(result.completedBy).toBeNull();
  });

  it("handles missing optional razorpay fields", () => {
    const doc = {
      _id: "ord1",
      orderNumber: "NP-20240101-0001",
      itemType: "note",
      amount: 0,
      paymentStatus: "created",
      fulfillmentStatus: "pending",
      itemSnapshot: { title: "Test", slug: "test", price: 0, noteIds: [] },
      buyer: { fullName: "Test", socialPlatform: "email", socialHandle: "a@b.com" },
      createdAt: new Date("2024-01-01"),
      paidAt: null,
      completedAt: null,
      updatedAt: new Date("2024-01-01"),
    };
    const result = toAdminOrder(doc);
    expect(result.razorpayOrderId).toBe("");
    expect(result.razorpayPaymentId).toBeNull();
    expect(result.razorpaySignature).toBeNull();
    expect(result.paymentMethod).toBeNull();
    expect(result.failureReason).toBeNull();
    expect(result.adminNote).toBeNull();
  });
});

describe("toAdminLead", () => {
  it("returns a full AdminLead from a complete document", () => {
    const doc = {
      _id: "ord1",
      orderNumber: "NP-20240101-0001",
      amount: 50000,
      paymentStatus: "paid",
      fulfillmentStatus: "pending",
      itemSnapshot: { title: "React Notes", slug: "react-notes", price: 50000 },
      buyer: { fullName: "John Doe", socialPlatform: "instagram", socialHandle: "@johndoe" },
      createdAt: new Date("2024-01-01"),
    };
    const result = toAdminLead(doc);
    expect(result).toEqual({
      id: "ord1",
      orderId: "ord1",
      orderNumber: "NP-20240101-0001",
      fullName: "John Doe",
      socialPlatform: "instagram",
      socialHandle: "@johndoe",
      itemTitle: "React Notes",
      amount: 50000,
      amountLabel: "₹500",
      paymentStatus: "paid",
      fulfillmentStatus: "pending",
      createdAt: "2024-01-01T00:00:00.000Z",
    });
  });

  it("handles email platform", () => {
    const doc = {
      _id: "ord1",
      orderNumber: "NP-20240101-0001",
      amount: 0,
      paymentStatus: "created",
      fulfillmentStatus: "pending",
      itemSnapshot: { title: "Free Note", slug: "free" },
      buyer: { fullName: "Test", socialPlatform: "email", socialHandle: "test@example.com" },
      createdAt: new Date("2024-01-01"),
    };
    const result = toAdminLead(doc);
    expect(result.socialPlatform).toBe("email");
    expect(result.socialHandle).toBe("test@example.com");
  });

  it("handles non-object input gracefully", () => {
    const result = toAdminLead(null);
    expect(result.id).toBe("");
    expect(result.orderId).toBe("");
    expect(result.fullName).toBe("");
    expect(result.amount).toBe(0);
  });
});
