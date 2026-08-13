export type PurchaseNotificationProps = {
  type: "purchase_notification";
  orderNumber: string;
  itemTitle: string;
  itemType: "note" | "group";
  amountLabel: string;
  buyerName: string;
  socialPlatform: string;
  socialHandle: string;
  paidAt: string;
  paymentMethod: string;
  adminOrderUrl: string;
};

export type TemplateProps = PurchaseNotificationProps;

export function getTemplate(props: TemplateProps): string {
  if (props.type === "purchase_notification") {
    return renderPurchaseNotificationTemplate(props);
  }
  return "";
}

function renderPurchaseNotificationTemplate(props: PurchaseNotificationProps): string {
  const itemTypeLabel = props.itemType === "group" ? "Bundle" : "Note";
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Purchase Alert - ${props.orderNumber}</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#0f172a;padding:40px 10px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#1e293b;border-radius:12px;border:1px solid #334155;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.5);">
          <tr>
            <td style="background:linear-gradient(135deg, #059669 0%, #ea580c 100%);padding:28px 32px;text-align:left;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Notes Provider</h1>
              <p style="margin:4px 0 0 0;color:#e2e8f0;font-size:14px;opacity:0.9;">🎉 New Payment Received!</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <div style="background-color:#0f172a;border-radius:8px;padding:20px;border-left:4px solid #10b981;margin-bottom:24px;">
                <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;margin-bottom:4px;">Amount Paid</div>
                <div style="font-size:32px;font-weight:800;color:#10b981;">${props.amountLabel}</div>
              </div>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:8px 0;color:#94a3b8;font-size:14px;width:140px;">Order Number:</td>
                  <td style="padding:8px 0;color:#f8fafc;font-size:14px;font-weight:600;">${props.orderNumber}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#94a3b8;font-size:14px;">Item Sold:</td>
                  <td style="padding:8px 0;color:#f8fafc;font-size:14px;font-weight:600;">${props.itemTitle} (${itemTypeLabel})</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#94a3b8;font-size:14px;">Buyer Name:</td>
                  <td style="padding:8px 0;color:#f8fafc;font-size:14px;font-weight:600;">${props.buyerName}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#94a3b8;font-size:14px;">Social Handle:</td>
                  <td style="padding:8px 0;color:#f97316;font-size:14px;font-weight:700;">${props.socialPlatform.toUpperCase()}: ${props.socialHandle}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#94a3b8;font-size:14px;">Payment Method:</td>
                  <td style="padding:8px 0;color:#f8fafc;font-size:14px;">${props.paymentMethod}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#94a3b8;font-size:14px;">Paid At:</td>
                  <td style="padding:8px 0;color:#f8fafc;font-size:14px;">${props.paidAt}</td>
                </tr>
              </table>

              <div style="text-align:center;margin-top:32px;padding-top:24px;border-top:1px solid #334155;">
                <a href="${props.adminOrderUrl}" style="display:inline-block;background-color:#f97316;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 28px;border-radius:8px;box-shadow:0 4px 12px rgba(249,115,22,0.3);">
                  View Order & Fulfill Notes
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color:#0f172a;padding:20px;text-align:center;color:#64748b;font-size:12px;">
              Notes Provider Admin Notification System
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
