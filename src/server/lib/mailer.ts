import nodemailer from "nodemailer";
import { connectDB } from "../db/connect";
import { Admin } from "../db/models/admin.model";
import { getTemplate } from "./templates";
import { formatPrice, formatDateTime } from "@/lib/format";

interface MailProps {
  templateProps: import("./templates").TemplateProps;
  to: string | string[];
  subject: string;
}

const auth = {
  user: process.env.MAIL_USERNAME,
  pass: process.env.MAIL_PASSWORD,
};

const productionConfig = {
  service: process.env.MAIL_SERVICE,
  auth,
};

const developmentConfig = {
  host: process.env.MAIL_PROVIDER,
  port: Number(process.env.MAIL_PORT),
  auth,
};

const isProduction = process.env.NODE_ENV === "production";
const config = isProduction ? productionConfig : developmentConfig;

const transport = nodemailer.createTransport(config);

export async function sendMail(props: MailProps) {
  const { templateProps, to, subject } = props;
  try {
    const mailTemplate = getTemplate(templateProps);
    const recipients = Array.isArray(to) ? to.join(", ") : to;
    const res = await transport.sendMail({
      from: process.env.MAIL_USERNAME,
      to: recipients,
      subject,
      html: mailTemplate,
    });
    return res;
  } catch (error) {
    console.error("[Mailer Error]:", error);
    return null;
  }
}

export async function notifyAdminsOnPurchase(order: {
  _id: unknown;
  orderNumber: string;
  itemType: "note" | "group";
  amount: number;
  paymentMethod?: string | null;
  paidAt?: Date | string | null;
  itemSnapshot?: { title?: string; slug?: string };
  buyer?: { fullName?: string };
}) {
  try {
    const activeAdmins = await Admin.find({ isActive: true }).select("email").lean().exec();
    if (!activeAdmins || activeAdmins.length === 0) return;

    const adminEmails = activeAdmins.flatMap((a) => (a.email ? [a.email] : []));
    if (adminEmails.length === 0) return;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const orderId = String(order._id);
    const adminOrderUrl = `${baseUrl}/admin/orders?orderId=${orderId}`;

    const paidAtFormatted = order.paidAt ? formatDateTime(String(order.paidAt)) : formatDateTime(new Date().toISOString());

    await sendMail({
      to: adminEmails,
      subject: `🎉 New Order Received! #${order.orderNumber} (${formatPrice(order.amount)})`,
      templateProps: {
        type: "purchase_notification",
        orderNumber: order.orderNumber,
        itemTitle: order.itemSnapshot?.title ?? "Notes Product",
        itemType: order.itemType,
        amountLabel: formatPrice(order.amount),
        buyerName: order.buyer?.fullName ?? "Customer",
        paidAt: paidAtFormatted,
        paymentMethod: order.paymentMethod ?? "Online Payment",
        adminOrderUrl,
      },
    });
  } catch (error) {
    console.error("[notifyAdminsOnPurchase Error]:", error);
  }
}
