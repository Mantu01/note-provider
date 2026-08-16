import type {
  ErrorCode,
  FulfillmentStatus,
  NoteLevel,
  NotePricingType,
  NoteSort,
  NoteVisibility,
  OrderSort,
  PaymentStatus,
  SocialPlatform,
  StatusType,
  UploadKind,
} from "./types";

export const BRAND = {
  name: "Notes Provider",
  tagline: "Developer notes that actually help you build.",
  description: "Curated coding notes for web development, DSA, DBMS, backend, frontend, system design, and interview prep.",
} as const;

export const SEO = {
  defaultTitle: `${BRAND.name} — Coding Notes for Web Dev, DSA, DBMS, Backend, Frontend & System Design`,
  defaultDescription: "Download free coding notes and browse premium developer resources covering web development, DSA, DBMS, backend, frontend, system design, and interview prep. Delivered to your Instagram, WhatsApp, or email.",
  siteName: BRAND.name,
  locale: "en_IN",
  countryName: "India",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: `${BRAND.name} — Coding notes marketplace`,
  twitterCard: "summary_large_image",
  socialHandles: [
    { platform: "twitter", url: "https://x.com", handle: "@notesprovider" },
    { platform: "youtube", url: "https://youtube.com", handle: "" },
    { platform: "instagram", url: "https://instagram.com", handle: "" },
  ] as const,
  contactEmail: "support@notesprovider.com",
  faqs: [
    { question: "When will I receive paid notes?", answer: "Paid notes are delivered to your selected Instagram, WhatsApp, or email handle within 4–6 hours of a successful payment." },
    { question: "How do free notes work?", answer: "Free notes are available for immediate PDF download. No sign-up is required." },
    { question: "Can I preview a paid note?", answer: "Yes. Paid notes include a preview so you can check the structure and depth before buying." },
    { question: "Which topics do you cover?", answer: "We cover web development, frontend, backend, DSA, DBMS, system design, coding patterns, and interview-focused topics." },
    { question: "Which payment methods can I use?", answer: "Payments are securely processed by Razorpay and support UPI, cards, net banking, and wallets." },
    { question: "Can I get a refund?", answer: "Digital notes are non-refundable after delivery. Please review the preview and description before paying." },
  ] as const,
} as const;

export const NOTE_VISIBILITIES = ["public", "private"] as const satisfies readonly NoteVisibility[];
export const NOTE_LEVELS = ["basics", "intermediate", "advance"] as const satisfies readonly NoteLevel[];
export const NOTE_PRICING_TYPES = ["free", "paid"] as const satisfies readonly NotePricingType[];
export const PURCHASE_ITEM_TYPES = ["note", "group"] as const;
export const PAYMENT_STATUSES = ["created", "paid", "failed"] as const satisfies readonly PaymentStatus[];
export const FULFILLMENT_STATUSES = ["pending", "completed", "cancelled"] as const satisfies readonly FulfillmentStatus[];
export const SOCIAL_PLATFORMS = ["instagram", "whatsapp", "email"] as const satisfies readonly SocialPlatform[];
export const NOTE_SORTS = ["newest", "oldest", "price_asc", "price_desc", "popular", "title_asc"] as const satisfies readonly NoteSort[];
export const ORDER_SORTS = ["newest", "oldest", "amount_desc", "amount_asc"] as const satisfies readonly OrderSort[];
export const UPLOAD_KINDS = ["note_full", "note_preview", "cover"] as const satisfies readonly UploadKind[];

export const ACTIVITY_TARGET_TYPES = ["note", "group", "category", "order", "admin"] as const;
export const ADMIN_ACTIVITY_ACTIONS = [
  "admin.register",
  "admin.login",
  "admin.logout",
  "note.create",
  "note.update",
  "note.delete",
  "group.create",
  "group.update",
  "group.delete",
  "category.create",
  "category.update",
  "category.delete",
  "order.update_fulfillment",
  "order.add_note",
  "order.delete",
] as const;

export const NOTE_LEVEL_LABELS: Record<NoteLevel, string> = { basics: "Basics", intermediate: "Intermediate", advance: "Advanced" };
export const PRICING_TYPE_LABELS: Record<NotePricingType, string> = { free: "Free", paid: "Paid" };
export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = { created: "Awaiting payment", paid: "Paid", failed: "Failed" };
export const FULFILLMENT_STATUS_LABELS: Record<FulfillmentStatus, string> = { pending: "Pending", completed: "Completed", cancelled: "Cancelled" };
export const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> = { instagram: "Instagram", whatsapp: "WhatsApp", email: "Email" };

export const STATUS_CONFIG: Record<StatusType, Record<string, { label: string; className: string }>> = {
  payment: {
    paid: { label: "Paid", className: "border-success bg-success text-success-foreground" },
    created: { label: "Awaiting payment", className: "border-warning/30 bg-warning/20 text-warning-foreground" },
    failed: { label: "Failed", className: "border-destructive/30 bg-destructive/10 text-destructive" },
  },
  fulfillment: {
    pending: { label: "Pending", className: "border-warning/30 bg-warning/20 text-warning-foreground" },
    completed: { label: "Completed", className: "border-success bg-success text-success-foreground" },
    cancelled: { label: "Cancelled", className: "border-border bg-transparent text-muted-foreground" },
  },
  pricing: {
    free: { label: "Free", className: "border-success/30 bg-success/15 text-success" },
    paid: { label: "Paid", className: "border-accent/30 bg-accent/20 text-accent-foreground" },
  },
  level: {
    basics: { label: "Basics", className: "border-info/40 bg-transparent text-info" },
    intermediate: { label: "Intermediate", className: "border-warning/40 bg-transparent text-warning-foreground" },
    advance: { label: "Advanced", className: "border-destructive/40 bg-transparent text-destructive" },
  },
};

export const ERROR_STATUS: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  PAYMENT_ERROR: 402,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
};

export const DEFAULT_PAGE_LIMIT = 12;
export const ADMIN_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 48;
export const DELIVERY_ETA_HOURS = 6 as const;
export const ADMIN_SESSION_COOKIE = "np_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 604800;

export const LEADS_EXPORT_MAX_ROWS = 10000;
export const MIN_PAID_PRICE_PAISE = 100;
export const ORDER_CURRENCY = "INR" as const;
export const SIGNED_URL_TTL_SECONDS = 60;

export const UPLOAD_LIMITS: Record<UploadKind, { maxBytes: number; mimeTypes: readonly string[]; folder: string }> = {
  note_full: { maxBytes: 50 * 1024 * 1024, mimeTypes: ["application/pdf"], folder: "notes-provider/notes/full" },
  note_preview: { maxBytes: 20 * 1024 * 1024, mimeTypes: ["application/pdf"], folder: "notes-provider/notes/preview" },
  cover: { maxBytes: 5 * 1024 * 1024, mimeTypes: ["image/png", "image/jpeg", "image/webp"], folder: "notes-provider/covers" },
};

export const RATE_LIMITS = {
  adminLogin: { limit: 5, windowMs: 10 * 60 * 1000 },
  adminRegister: { limit: 3, windowMs: 60 * 60 * 1000 },
  createOrder: { limit: 10, windowMs: 10 * 60 * 1000 },
  noteDownload: { limit: 30, windowMs: 10 * 60 * 1000 },
} as const;

export const SOCIAL_HANDLE_PATTERNS: Record<SocialPlatform, RegExp> = {
  instagram: /^@?[a-zA-Z0-9._]{1,30}$/,
  whatsapp: /^(?:\+?91|0)?[6-9]\d{9}$/,
  email: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
};

export const FULL_NAME_PATTERN = /^[\p{L}\s.'-]+$/u;

export const PRIVACY_POLICY_SECTIONS = [
  { id: "item-1", title: "1. Information Collection", content: "We take your privacy seriously. This Privacy Policy describes how we collect, use, and protect your personal information. We collect information you provide directly to us, such as when you create an account, make a purchase, or communicate with us." },
  { id: "item-2", title: "2. Use of Information", content: "We use this information to process transactions, send order confirmations, and respond to customer service requests." },
  { id: "item-3", title: "3. Data Sharing", content: "We do not sell your personal information to third parties. Your data is strictly used for the provision of our services and to enhance your experience." },
] as const;

export const TERMS_OF_SERVICE_SECTIONS = [
  { id: "item-1", title: "1. General Agreement", content: "By accessing or using our services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services." },
  { id: "item-2", title: "2. Personal Use Only", content: "Our study notes are provided for personal, non-commercial use only. You may not distribute, modify, or resell any materials purchased from this platform." },
  { id: "item-3", title: "3. Final Sales & Termination", content: "All sales are final unless otherwise specified in our refund policy. We reserve the right to terminate access for violation of these terms." },
] as const;

export const REFUND_POLICY_SECTIONS = [
  { id: "item-1", title: "1. Digital Goods Policy", content: `Due to the digital nature of the products sold on ${BRAND.name} (PDF study notes, revision guides, and note bundles) which are delivered directly to your social handle or email, <strong>all sales are non-refundable once the digital material has been delivered.</strong>` },
  { id: "item-2", title: "2. Previewing Before Purchase", content: `<p style="margin-bottom:12px">To ensure complete satisfaction before making a payment:</p><ul style="list-style:disc;padding-left:20px;margin:0"><li>Every paid note features a downloadable <strong>Preview PDF</strong> allowing you to assess structure, contents, and readability.</li><li>Note detail pages specify exact page counts, covered topics, subjects, and skill levels.</li><li>Free study notes are available for immediate download without payment so you can evaluate our content quality beforehand.</li></ul>` },
  { id: "item-3", title: "3. Non-Delivery & Exceptional Assistance", content: `<p style="margin-bottom:12px">While completed orders are final, we ensure every customer receives what they paid for:</p><ul style="list-style:disc;padding-left:20px;margin:0"><li><strong>Delivery Delay:</strong> If you have not received your study notes within 6 hours of payment confirmation, please check your Instagram Message Requests, WhatsApp chats, or Email Spam folder.</li><li><strong>Unfulfilled Orders:</strong> If your order has not been delivered due to an incorrect handle submission or system oversight, contact support with your order number. We will verify payment and resend your files immediately.</li><li><strong>Double Charge / Duplicate Payment:</strong> If you were accidentally charged twice for the same transaction via Razorpay, any excess payment will be refunded to your original payment source.</li></ul>` },
  { id: "item-4", title: "4. How to Request Assistance", content: `<p style="margin-bottom:12px">If you experience any issues with order delivery or payment status, reach out to our support team with your order number and transaction proof:</p><a href="/contact" style="color:var(--primary);text-decoration:underline;font-weight:500">Contact Support Team →</a>` },
] as const;

export const ABOUT_VALUES = [
  { title: "Focused learning", text: "We curate the developer notes that help you learn faster without wasting time on fluff." },
  { title: "Clear structure", text: "Every note is designed to reduce confusion and make complex topics easier to revisit and retain." },
  { title: "Practical value", text: "We keep the experience useful, readable, and tailored to how real engineers study and build." },
] as const;

export const CONTACT_CHANNELS = [
  { title: "X (Twitter)", description: "Quick updates, support replies, and announcements.", href: "https://x.com", icon: "MessageSquareText", label: "Follow on X" },
  { title: "GitHub", description: "Code references, resources, and project-driven learning material.", href: "https://github.com", icon: "Code2", label: "Explore GitHub" },
  { title: "Email", description: "For order help, delivery questions, and support requests.", href: `mailto:${SEO.contactEmail}`, icon: "Mail", label: "Send an email" },
] as const;
