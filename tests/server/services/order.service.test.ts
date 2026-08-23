import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createOrder,
  getOrderById,
  getOrderByNumber,
  fulfillOrder,
  deleteOrder,
} from "../../../src/server/services/order.service";
import * as OrderModel from "../../../src/server/db/models/order.model";
import * as NoteModel from "../../../src/server/db/models/note.model";
import * as GroupModel from "../../../src/server/db/models/group.model";
import * as ActivityService from "../../../src/server/services/activity.service";
import * as OrderNumberLib from "../../../src/server/lib/order-number";
import * as RazorpayLib from "../../../src/server/lib/razorpay";
import * as Errors from "../../../src/server/lib/errors";

vi.mock("../../../src/server/db/models/order.model", () => ({
  Order: {
    findById: vi.fn(),
    findOne: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("../../../src/server/db/models/note.model", () => ({
  Note: {
    findOne: vi.fn(),
  },
}));

vi.mock("../../../src/server/db/models/group.model", () => ({
  Group: {
    findOne: vi.fn(),
  },
}));

vi.mock("../../../src/server/services/activity.service", () => ({
  logActivity: vi.fn(),
}));

vi.mock("../../../src/server/lib/order-number", () => ({
  generateOrderNumber: vi.fn(),
}));

vi.mock("../../../src/server/lib/razorpay", () => ({
  createRazorpayOrder: vi.fn(),
}));

vi.mock("../../../src/server/lib/errors", () => ({
  AppError: {
    notFound: vi.fn((entity: string) => new Error(`${entity} not found`)),
    validation: vi.fn((fields: any, msg: string) => new Error(msg)),
    internal: vi.fn((msg: string) => new Error(msg)),
  },
}));

const validObjectId = "507f1f77bcf86cd799439011";
const mockCtx = {
  ip: "1.2.3.4",
  userAgent: "Mozilla/5.0",
  admin: { _id: validObjectId, name: "Admin" },
};

const mockOrder = {
  _id: "ord1",
  orderNumber: "NP-20240101-0001",
  itemType: "note",
  amount: 50000,
  paymentStatus: "paid",
  fulfillmentStatus: "pending",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

describe("createOrder", () => {
  it("creates an order for a note", async () => {
    vi.mocked(OrderNumberLib.generateOrderNumber).mockResolvedValue("NP-20240101-0001");
    vi.mocked(NoteModel.Note.findOne).mockReturnValue(
      { select: vi.fn().mockReturnThis(), lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue({ _id: "note1", title: "React" }) } as any,
    );
    vi.mocked(RazorpayLib.createRazorpayOrder).mockResolvedValue({ id: "rzp_order1" });
    vi.mocked(OrderModel.Order.create).mockResolvedValue(mockOrder as any);

    const result = await createOrder(
      { fullName: "John", consentAccepted: true },
      "react-notes",
      "note",
      50000,
      mockCtx,
    );

    expect(result.order).toEqual(mockOrder);
    expect(result.razorpayOrderId).toBe("rzp_order1");
    expect(RazorpayLib.createRazorpayOrder).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 50000, receipt: "NP-20240101-0001" }),
    );
  });

  it("creates an order for a group", async () => {
    vi.mocked(OrderNumberLib.generateOrderNumber).mockResolvedValue("NP-20240101-0002");
    vi.mocked(GroupModel.Group.findOne).mockReturnValue(
      { select: vi.fn().mockReturnThis(), lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue({ _id: "grp1", name: "JS Bundle", notes: ["n1", "n2"] }) } as any,
    );
    vi.mocked(RazorpayLib.createRazorpayOrder).mockResolvedValue({ id: "rzp_order2" });
    vi.mocked(OrderModel.Order.create).mockResolvedValue({ ...mockOrder, itemType: "group" } as any);

    const result = await createOrder(
      { fullName: "Jane", consentAccepted: true },
      "js-bundle",
      "group",
      100000,
      mockCtx,
    );

    expect(result.order.itemType).toBe("group");
  });

  it("throws not found when note item does not exist", async () => {
    vi.mocked(OrderNumberLib.generateOrderNumber).mockResolvedValue("NP-20240101-0001");
    vi.mocked(NoteModel.Note.findOne).mockReturnValue(
      { select: vi.fn().mockReturnThis(), lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(null) } as any,
    );
    (vi.mocked(Errors.AppError.notFound) as any).mockImplementation(() => new Error("Item not found"));

    await expect(
      createOrder(
        { fullName: "John", consentAccepted: true },
        "missing",
        "note",
        50000,
        mockCtx,
      ),
    ).rejects.toThrow("Item not found");
  });

  it("throws not found when group item does not exist", async () => {
    vi.mocked(OrderNumberLib.generateOrderNumber).mockResolvedValue("NP-20240101-0001");
    vi.mocked(GroupModel.Group.findOne).mockReturnValue(
      { select: vi.fn().mockReturnThis(), lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(null) } as any,
    );
    (vi.mocked(Errors.AppError.notFound) as any).mockImplementation(() => new Error("Item not found"));

    await expect(
      createOrder(
        { fullName: "John", consentAccepted: true },
        "missing",
        "group",
        50000,
        mockCtx,
      ),
    ).rejects.toThrow("Item not found");
  });
});

describe("getOrderById", () => {
  it("returns an order when found", async () => {
    vi.mocked(OrderModel.Order.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockOrder) } as any,
    );

    const result = await getOrderById("ord1");
    expect(result).toEqual(mockOrder);
  });

  it("returns null when order not found", async () => {
    vi.mocked(OrderModel.Order.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(null) } as any,
    );

    const result = await getOrderById("nonexistent");
    expect(result).toBeNull();
  });
});

describe("getOrderByNumber", () => {
  it("returns an order when found", async () => {
    vi.mocked(OrderModel.Order.findOne).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockOrder) } as any,
    );

    const result = await getOrderByNumber("NP-20240101-0001");
    expect(result).toEqual(mockOrder);
  });

  it("returns null when order not found", async () => {
    vi.mocked(OrderModel.Order.findOne).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(null) } as any,
    );

    const result = await getOrderByNumber("NP-999999-9999");
    expect(result).toBeNull();
  });
});

describe("fulfillOrder", () => {
  it("fulfills an order with completed status", async () => {
    const updated = { ...mockOrder, fulfillmentStatus: "completed", completedAt: new Date(), completedBy: validObjectId };
    vi.mocked(OrderModel.Order.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockOrder) } as any,
    );
    vi.mocked(OrderModel.Order.findByIdAndUpdate).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(updated) } as any,
    );

    const result = await fulfillOrder("ord1", { fulfillmentStatus: "completed" }, mockCtx as any);
    expect(result.fulfillmentStatus).toBe("completed");
    expect(ActivityService.logActivity).toHaveBeenCalledWith(
      expect.objectContaining({ action: "order.update_fulfillment" }),
    );
  });

  it("throws not found when order does not exist", async () => {
    vi.mocked(OrderModel.Order.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(null) } as any,
    );
    (vi.mocked(Errors.AppError.notFound) as any).mockImplementation(() => new Error("Order not found"));

    await expect(fulfillOrder("nonexistent", { fulfillmentStatus: "completed" }, mockCtx as any)).rejects.toThrow(
      "Order not found",
    );
  });

  it("throws validation when order is not paid", async () => {
    const unpaidOrder = { ...mockOrder, paymentStatus: "created" };
    vi.mocked(OrderModel.Order.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(unpaidOrder) } as any,
    );
    (vi.mocked(Errors.AppError.validation) as any).mockImplementation(() => new Error("Cannot fulfil an order that has not been paid."));

    await expect(
      fulfillOrder("ord1", { fulfillmentStatus: "completed" }, mockCtx as any),
    ).rejects.toThrow("Cannot fulfil an order that has not been paid.");
  });

  it("clears completedAt when fulfillment status is not completed", async () => {
    const updated = { ...mockOrder, fulfillmentStatus: "cancelled", completedAt: null, completedBy: null };
    vi.mocked(OrderModel.Order.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockOrder) } as any,
    );
    vi.mocked(OrderModel.Order.findByIdAndUpdate).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(updated) } as any,
    );

    const result = await fulfillOrder("ord1", { fulfillmentStatus: "cancelled" }, mockCtx as any);
    expect(result.fulfillmentStatus).toBe("cancelled");
    expect(result.completedAt).toBeNull();
  });

  it("updates adminNote when provided", async () => {
    const updated = { ...mockOrder, adminNote: "Delivered via WhatsApp" };
    vi.mocked(OrderModel.Order.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockOrder) } as any,
    );
    vi.mocked(OrderModel.Order.findByIdAndUpdate).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(updated) } as any,
    );

    const result = await fulfillOrder("ord1", { adminNote: "Delivered via WhatsApp" }, mockCtx as any);
    expect(result.adminNote).toBe("Delivered via WhatsApp");
  });

  it("throws internal error when findByIdAndUpdate returns null", async () => {
    vi.mocked(OrderModel.Order.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockOrder) } as any,
    );
    vi.mocked(OrderModel.Order.findByIdAndUpdate).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(null) } as any,
    );
    (vi.mocked(Errors.AppError.internal) as any).mockImplementation(() => new Error("Failed to update order"));

    await expect(
      fulfillOrder("ord1", { fulfillmentStatus: "completed" }, mockCtx as any),
    ).rejects.toThrow("Failed to update order");
  });
});

describe("deleteOrder", () => {
  it("deletes an order successfully", async () => {
    vi.mocked(OrderModel.Order.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(mockOrder) } as any,
    );
    vi.mocked(OrderModel.Order.findByIdAndDelete).mockReturnValue(
      { exec: vi.fn().mockResolvedValue(undefined) } as any,
    );

    const result = await deleteOrder("ord1", mockCtx as any);
    expect(result.deleted).toBe(true);
    expect(ActivityService.logActivity).toHaveBeenCalledWith(
      expect.objectContaining({ action: "order.delete" }),
    );
  });

  it("throws not found when order does not exist", async () => {
    vi.mocked(OrderModel.Order.findById).mockReturnValue(
      { lean: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue(null) } as any,
    );
    (vi.mocked(Errors.AppError.notFound) as any).mockImplementation(() => new Error("Order not found"));

    await expect(deleteOrder("nonexistent", mockCtx as any)).rejects.toThrow("Order not found");
  });
});
