import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendMail, notifyAdminsOnPurchase } from "../../../src/server/lib/mailer";
import * as TemplatesLib from "../../../src/server/lib/templates";
import * as AdminModel from "../../../src/server/db/models/admin.model";
import * as FormatLib from "../../../src/lib/format";

const { mockSendMail } = vi.hoisted(() => ({
  mockSendMail: vi.fn(),
}));

vi.mock("../../../src/server/lib/templates", () => ({
  getTemplate: vi.fn(),
}));

vi.mock("../../../src/server/db/models/admin.model", () => ({
  Admin: {
    find: vi.fn(),
  },
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: () => ({
      sendMail: mockSendMail,
    }),
  },
}));

const originalEnv = { ...process.env };

describe("mailer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.MAIL_USERNAME = "test@example.com";
    process.env.MAIL_PASSWORD = "secret";
    process.env.MAIL_SERVICE = "gmail";
    process.env.MAIL_PROVIDER = "smtp.example.com";
    process.env.MAIL_PORT = "587";
    
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    mockSendMail.mockReset();
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  describe("sendMail", () => {
    it("sends email successfully", async () => {
      mockSendMail.mockResolvedValue({ messageId: "abc123" });
      vi.mocked(TemplatesLib.getTemplate).mockReturnValue("<html>Email</html>");

      const result = await sendMail({
        templateProps: {
          type: "purchase_notification",
          orderNumber: "NP-001",
          itemTitle: "Note",
          itemType: "note",
          amountLabel: "₹100",
          buyerName: "John",
          socialPlatform: "email",
          socialHandle: "john@example.com",
          paidAt: "2024-01-01",
          paymentMethod: "UPI",
          adminOrderUrl: "http://localhost:3000/admin/orders?orderId=1",
        },
        to: "admin@example.com",
        subject: "New Order",
      });

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: "test@example.com",
          to: "admin@example.com",
          subject: "New Order",
          html: "<html>Email</html>",
        }),
      );
      expect(result).toEqual({ messageId: "abc123" });
    });

    it("joins array recipients with comma", async () => {
      mockSendMail.mockResolvedValue({ messageId: "xyz" });
      vi.mocked(TemplatesLib.getTemplate).mockReturnValue("<html>Test</html>");

      await sendMail({
        templateProps: {
          type: "purchase_notification",
          orderNumber: "NP-001",
          itemTitle: "Note",
          itemType: "note",
          amountLabel: "₹100",
          buyerName: "John",
          socialPlatform: "email",
          socialHandle: "john@example.com",
          paidAt: "2024-01-01",
          paymentMethod: "UPI",
          adminOrderUrl: "http://localhost:3000/admin/orders?orderId=1",
        },
        to: ["a@b.com", "c@d.com"],
        subject: "Multi",
      });

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({ to: "a@b.com, c@d.com" }),
      );
    });

    it("returns null when sendMail throws an error", async () => {
      mockSendMail.mockRejectedValue(new Error("SMTP error"));
      vi.mocked(TemplatesLib.getTemplate).mockReturnValue("<html>Error</html>");

      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const result = await sendMail({
        templateProps: {
          type: "purchase_notification",
          orderNumber: "NP-001",
          itemTitle: "Note",
          itemType: "note",
          amountLabel: "₹100",
          buyerName: "John",
          socialPlatform: "email",
          socialHandle: "john@example.com",
          paidAt: "2024-01-01",
          paymentMethod: "UPI",
          adminOrderUrl: "http://localhost:3000/admin/orders?orderId=1",
        },
        to: "fail@example.com",
        subject: "Fail",
      });

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith("[Mailer Error]:", expect.any(Error));
      consoleErrorSpy.mockRestore();
    });

    it("calls getTemplate with correct props", async () => {
      mockSendMail.mockResolvedValue({ messageId: "ok" });

      const props = {
        type: "purchase_notification" as const,
        orderNumber: "NP-999",
        itemTitle: "React Notes",
        itemType: "note" as const,
        amountLabel: "₹299",
        buyerName: "Alice",
        socialPlatform: "instagram",
        socialHandle: "@alice",
        paidAt: "2024-06-15",
        paymentMethod: "Card",
        adminOrderUrl: "http://localhost:3000/admin/orders?orderId=999",
      };

      await sendMail({
        templateProps: props,
        to: "test@test.com",
        subject: "Order alert",
      });

      expect(TemplatesLib.getTemplate).toHaveBeenCalledWith(props);
    });
  });

  describe("notifyAdminsOnPurchase", () => {
    it("sends notification when active admins exist", async () => {
      vi.mocked(AdminModel.Admin.find).mockReturnValue(
        {
          select: vi.fn().mockReturnThis(),
          lean: vi.fn().mockReturnThis(),
          exec: vi.fn().mockResolvedValue([
            { email: "admin1@example.com" },
            { email: "admin2@example.com" },
          ]),
        } as any,
      );

      mockSendMail.mockResolvedValue({ messageId: "sent" });

      const order = {
        _id: "ord1",
        orderNumber: "NP-20240101-0001",
        itemType: "note" as const,
        amount: 50000,
        paymentMethod: "UPI",
        paidAt: new Date("2024-01-01T10:00:00Z"),
        itemSnapshot: { title: "React Notes", slug: "react-notes" },
        buyer: { fullName: "John Doe", socialPlatform: "whatsapp", socialHandle: "9876543210" },
      };

      await notifyAdminsOnPurchase(order as any);

      expect(AdminModel.Admin.find).toHaveBeenCalledWith({ isActive: true });
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "admin1@example.com, admin2@example.com",
          subject: expect.stringContaining("NP-20240101-0001"),
          html: expect.any(String),
        }),
      );
    });

    it("skips when no active admins exist", async () => {
      vi.mocked(AdminModel.Admin.find).mockReturnValue(
        {
          select: vi.fn().mockReturnThis(),
          lean: vi.fn().mockReturnThis(),
          exec: vi.fn().mockResolvedValue([]),
        } as any,
      );

      const order = {
        _id: "ord1",
        orderNumber: "NP-001",
        itemType: "group" as const,
        amount: 10000,
        itemSnapshot: { title: "JS Bundle" },
      };

      await notifyAdminsOnPurchase(order as any);
      expect(mockSendMail).not.toHaveBeenCalled();
    });

    it("filters out admins with no email", async () => {
      vi.mocked(AdminModel.Admin.find).mockReturnValue(
        {
          select: vi.fn().mockReturnThis(),
          lean: vi.fn().mockReturnThis(),
          exec: vi.fn().mockResolvedValue([
            { email: "" },
            { email: null },
            { email: "valid@example.com" },
          ]),
        } as any,
      );

      mockSendMail.mockResolvedValue({ messageId: "ok" });

      const order = {
        _id: "ord1",
        orderNumber: "NP-001",
        itemType: "note" as const,
        amount: 5000,
        itemSnapshot: { title: "Test Note" },
      };

      await notifyAdminsOnPurchase(order as any);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({ to: "valid@example.com" }),
      );
    });

    it("skips when all admin emails are empty", async () => {
      vi.mocked(AdminModel.Admin.find).mockReturnValue(
        {
          select: vi.fn().mockReturnThis(),
          lean: vi.fn().mockReturnThis(),
          exec: vi.fn().mockResolvedValue([
            { email: "" },
            { email: null },
          ]),
        } as any,
      );

      const order = {
        _id: "ord1",
        orderNumber: "NP-001",
        itemType: "note" as const,
        amount: 5000,
        itemSnapshot: { title: "Test Note" },
      };

      await notifyAdminsOnPurchase(order as any);
      expect(mockSendMail).not.toHaveBeenCalled();
    });

    it("uses default baseUrl when NEXT_PUBLIC_APP_URL is not set", async () => {
      delete process.env.NEXT_PUBLIC_APP_URL;

      vi.mocked(AdminModel.Admin.find).mockReturnValue(
        {
          select: vi.fn().mockReturnThis(),
          lean: vi.fn().mockReturnThis(),
          exec: vi.fn().mockResolvedValue([{ email: "admin@example.com" }]),
        } as any,
      );

      mockSendMail.mockResolvedValue({ messageId: "ok" });

      const order = {
        _id: "ord1",
        orderNumber: "NP-001",
        itemType: "note" as const,
        amount: 5000,
        itemSnapshot: { title: "Test Note" },
      };

      await notifyAdminsOnPurchase(order as any);
      expect(mockSendMail).toHaveBeenCalled();
    });

    it("formats paidAt correctly when provided as string ISO", async () => {
      vi.mocked(AdminModel.Admin.find).mockReturnValue(
        {
          select: vi.fn().mockReturnThis(),
          lean: vi.fn().mockReturnThis(),
          exec: vi.fn().mockResolvedValue([{ email: "admin@example.com" }]),
        } as any,
      );

      mockSendMail.mockResolvedValue({ messageId: "ok" });
      const formatDateTimeSpy = vi.spyOn(FormatLib, "formatDateTime").mockReturnValue("2024-01-01 10:00:00");

      const order = {
        _id: "ord1",
        orderNumber: "NP-001",
        itemType: "note" as const,
        amount: 5000,
        paidAt: "2024-01-01T10:00:00.000Z",
        itemSnapshot: { title: "Test Note" },
      };

      await notifyAdminsOnPurchase(order as any);
      expect(formatDateTimeSpy).toHaveBeenCalledWith("2024-01-01T10:00:00.000Z");
      formatDateTimeSpy.mockRestore();
    });

    it("uses current time when paidAt is not provided", async () => {
      vi.mocked(AdminModel.Admin.find).mockReturnValue(
        {
          select: vi.fn().mockReturnThis(),
          lean: vi.fn().mockReturnThis(),
          exec: vi.fn().mockResolvedValue([{ email: "admin@example.com" }]),
        } as any,
      );

      mockSendMail.mockResolvedValue({ messageId: "ok" });
      vi.spyOn(FormatLib, "formatDateTime").mockReturnValue("now");

      const order = {
        _id: "ord1",
        orderNumber: "NP-001",
        itemType: "group" as const,
        amount: 10000,
        itemSnapshot: { title: "Bundle" },
      };

      await notifyAdminsOnPurchase(order as any);
      expect(FormatLib.formatDateTime).toHaveBeenCalled();
    });

    it("uses defaults for missing buyer fields", async () => {
      vi.mocked(AdminModel.Admin.find).mockReturnValue(
        {
          select: vi.fn().mockReturnThis(),
          lean: vi.fn().mockReturnThis(),
          exec: vi.fn().mockResolvedValue([{ email: "admin@example.com" }]),
        } as any,
      );

      mockSendMail.mockResolvedValue({ messageId: "ok" });
      vi.mocked(TemplatesLib.getTemplate).mockReturnValue("<html>Customer: Customer, handle: N/A, Online Payment</html>");

      const order = {
        _id: "ord1",
        orderNumber: "NP-001",
        itemType: "note" as const,
        amount: 5000,
        itemSnapshot: {},
      };

      await notifyAdminsOnPurchase(order as any);
      const calls = mockSendMail.mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      const html = calls[0][0].html as string;
      expect(html).toContain("Customer");
      expect(html).toContain("handle");
      expect(html).toContain("N/A");
      expect(html).toContain("Online Payment");
    });

    it("handles order with null paidAt", async () => {
      vi.mocked(AdminModel.Admin.find).mockReturnValue(
        {
          select: vi.fn().mockReturnThis(),
          lean: vi.fn().mockReturnThis(),
          exec: vi.fn().mockResolvedValue([{ email: "admin@example.com" }]),
        } as any,
      );

      mockSendMail.mockResolvedValue({ messageId: "ok" });

      const order = {
        _id: "ord1",
        orderNumber: "NP-001",
        itemType: "note" as const,
        amount: 5000,
        paidAt: null,
        itemSnapshot: { title: "Test" },
      };

      await notifyAdminsOnPurchase(order as any);
      expect(mockSendMail).toHaveBeenCalled();
    });

    it("logs errors without throwing", async () => {
      vi.mocked(AdminModel.Admin.find).mockReturnValue(
        {
          select: vi.fn().mockReturnThis(),
          lean: vi.fn().mockReturnThis(),
          exec: vi.fn().mockRejectedValue(new Error("DB failure")),
        } as any,
      );

      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      await expect(notifyAdminsOnPurchase({} as any)).resolves.toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[notifyAdminsOnPurchase Error]:",
        expect.any(Error),
      );
      consoleErrorSpy.mockRestore();
    });

    it("includes correct adminOrderUrl in call", async () => {
      vi.mocked(AdminModel.Admin.find).mockReturnValue(
        {
          select: vi.fn().mockReturnThis(),
          lean: vi.fn().mockReturnThis(),
          exec: vi.fn().mockResolvedValue([{ email: "admin@example.com" }]),
        } as any,
      );

      mockSendMail.mockResolvedValue({ messageId: "ok" });

      await notifyAdminsOnPurchase({
        _id: "ord99",
        orderNumber: "NP-TEST",
        itemType: "note" as const,
        amount: 3000,
        itemSnapshot: { title: "Test Note" },
        buyer: { fullName: "Buyer" },
      } as any);

      const calls = mockSendMail.mock.calls;
      expect(calls[0][0].to).toBe("admin@example.com");
    });

    it("skips notification when activeAdmins is falsy", async () => {
      vi.mocked(AdminModel.Admin.find).mockReturnValue(
        {
          select: vi.fn().mockReturnThis(),
          lean: vi.fn().mockReturnThis(),
          exec: vi.fn().mockResolvedValue(null as any),
        } as any,
      );

      const order = {
        _id: "ord1",
        orderNumber: "NP-001",
        itemType: "note" as const,
        amount: 5000,
      } as any;

      await notifyAdminsOnPurchase(order);
      expect(mockSendMail).not.toHaveBeenCalled();
    });
  });
});
