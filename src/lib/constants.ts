import type {
  ErrorCode,
  FulfillmentStatus,
  NoteLevel,
  NotePricingType,
  NoteSort,
  NoteVisibility,
  OrderSort,
  PaymentStatus,
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
  defaultDescription: "Download free coding notes and browse premium developer resources covering web development, DSA, DBMS, backend, frontend, system design, and interview prep.",
  siteName: BRAND.name,
  locale: "en_IN",
  countryName: "India",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: `${BRAND.name} — Coding notes marketplace`,
  twitterCard: "summary_large_image",
  contactEmail: "support@notesprovider.com",
  faqs: [
    { question: "When will I receive paid notes?", answer: "Paid notes are available for instant download after successful payment." },
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

export const STATUS_CONFIG: Record<StatusType, Record<string, { label: string; className: string }>> = {
  payment: {
    paid: { label: "Paid", className: "border-success bg-success text-success-foreground" },
    created: { label: "Awaiting payment", className: "border-warning text-warning-foreground bg-warning/20" },
    failed: { label: "Failed", className: "border-destructive text-destructive bg-destructive/10" },
  },
  fulfillment: {
    pending: { label: "Pending", className: "border-warning text-warning-foreground bg-warning/20" },
    completed: { label: "Completed", className: "border-success bg-success text-success-foreground" },
    cancelled: { label: "Cancelled", className: "border-border text-muted-foreground bg-transparent" },
  },
  pricing: {
    free: { label: "Free", className: "border-success text-success bg-success/15" },
    paid: { label: "Paid", className: "border-accent text-accent-foreground bg-accent/20" },
  },
  level: {
    basics: { label: "Basics", className: "border-info text-info bg-transparent" },
    intermediate: { label: "Intermediate", className: "border-warning text-warning-foreground bg-transparent" },
    advance: { label: "Advanced", className: "border-destructive text-destructive bg-transparent" },
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

export const FULL_NAME_PATTERN = /^[\p{L}\s.'-]+$/u;

export const TERMS_OF_SERVICE_SECTIONS = [
  { id: "item-1", title: "1. Acceptance of Terms", content: `By creating an account or purchasing notes from ${BRAND.name}, you agree to be bound by these Terms. If you do not accept these terms, please do not use our services.` },
  { id: "item-2", title: "2. No Restrictions on PDF Use", content: `<strong>All PDF notes are provided with no usage restrictions.</strong> After purchase, you are free to use, modify, annotate, print, or share the content however you wish. There are no licensing limitations — once bought, the note belongs to you.` },
  { id: "item-3", title: "3. AI-Generated Content Disclaimer", content: `<strong>Notes Provider uses AI-assisted tools to generate and structure study material.</strong> While we strive for accuracy, technical content may contain errors, outdated information, or omissions. We recommend cross-referencing with official documentation, textbooks, or other trusted sources before relying on any material for exams, interviews, or production use.` },
  { id: "item-4", title: "4. Personal Use License", content: `All purchased content is licensed for personal, non-commercial use only. You may not redistribute, resell, or publish the notes publicly without prior written permission from Notes Provider.` },
  { id: "item-5", title: "5. Account Responsibility", content: `You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.` },
  { id: "item-6", title: "6. Limitation of Liability", content: `Notes Provider is not liable for any indirect, incidental, or consequential damages arising from the use of our notes. Our total liability shall not exceed the amount paid for the specific order in question.` },
  { id: "item-7", title: "7. Modifications to Terms", content: `We may update these Terms periodically. Continued use of the platform after changes constitutes acceptance of the revised terms.` },
  { id: "item-8", title: "8. Governing Law", content: `These Terms are governed by the laws of India. Any disputes shall be resolved in the courts located in India.` },
] as const;

export const PRIVACY_POLICY_SECTIONS = [
  { id: "item-1", title: "1. Information We Collect", content: `<strong>Personal data collected:</strong> Full name, email address, payment details (processed securely by Razorpay — we never store card numbers), IP address, and browser user-agent string. <strong>Technical data:</strong> Order history, download activity, and session cookies for authentication.` },
  { id: "item-2", title: "2. How We Use Your Data", content: `We use your information to process payments, deliver purchased notes, send order confirmations, improve our service, and respond to support requests. We do not sell, rent, or share your data with third parties except where required for payment processing (Razorpay) or legal compliance.` },
  { id: "item-3", title: "3. Data Sharing & Third Parties", content: `Payments are processed by <strong>Razorpay</strong> (India's leading payment gateway). Their privacy policy governs how they handle your payment data. We do not share personal data with any other third parties.` },
  { id: "item-4", title: "4. Cookies & Tracking", content: `We use essential cookies for authentication and session management. Analytics may be used to understand site usage patterns. You can disable cookies in your browser settings, though this may affect functionality.` },
  { id: "item-5", title: "5. Data Retention", content: `Order data is retained for up to <strong>3 years</strong> for accounting and support purposes. You may request deletion of your personal data at any time by contacting us.` },
  { id: "item-6", title: "6. Your Rights", content: `Under applicable data protection laws, you have the right to access, correct, delete, or port your personal data. Contact us using the details on our support page to exercise these rights.` },
  { id: "item-7", title: "7. Security Measures", content: `We implement industry-standard security measures including HTTPS encryption, secure server infrastructure, and restricted admin access. However, no system is entirely immune to breaches — please report any suspected security issues immediately.` },
  { id: "item-8", title: "8. Children's Privacy", content: `Our services are not directed at children under 13. We do not knowingly collect personal data from children. If you believe a child has provided data, contact us for immediate deletion.` },
  { id: "item-9", title: "9. Changes to This Policy", content: `We may update this Privacy Policy. Significant changes will be notified via email or a prominent notice on our website.` },
  { id: "item-10", title: "10. Contact Us", content: `For any privacy-related inquiries, reach out through our support channels.` },
] as const;

export const REFUND_POLICY_SECTIONS = [
  { id: "item-1", title: "1. All Sales Are Final", content: `Due to the digital nature of our products, <strong>all purchases are final and non-refundable once the digital material has been delivered</strong>. Please review the preview and product description carefully before completing your payment.` },
  { id: "item-2", title: "2. Pre-Purchase Verification", content: `<p>We strongly encourage reviewing the preview PDF available on every paid note page before purchasing. Free notes are available for immediate download so you can evaluate our quality and format risk-free.</p>` },
  { id: "item-3", title: "3. Technical Errors — Exceptional Refunds", content: `<p>If you experience a genuine technical issue — such as successful payment deduction but failure to receive your notes within 6 hours, or a double charge for the same order — please contact our support team immediately with your order number and payment screenshot. As a solo founder, I personally review each case and will issue a refund or re-deliver your files manually.</p>` },
  { id: "item-4", title: "4. Payment Failures", content: `If a payment fails during checkout, no money is deducted from your account. In rare cases where a bank reversal occurs, it may take 3–5 business days to reflect on your statement.` },
  { id: "item-5", title: "5. Cancellation Requests", content: `You may cancel an order before it has been fulfilled by contacting support. Once fulfillment is complete, cancellation is no longer possible and standard refund policy applies.` },
  { id: "item-6", title: "6. Intellectual Property", content: `All notes remain the intellectual property of Notes Provider. Purchasing grants you a personal license to use the content, not ownership of the copyright.` },
  { id: "item-7", title: "7. How to Request Support", content: `For any payment or delivery issues, contact us at <a href="mailto:support@notesprovider.com" style="color:var(--primary);text-decoration:underline">support@notesprovider.com</a> with your order number and transaction proof. Response time is typically within 24 hours.` },
] as const;

export const ABOUT_VALUES = [
  { title: "Focused learning", text: "We curate the developer notes that help you learn faster without wasting time on fluff." },
  { title: "Clear structure", text: "Every note is designed to reduce confusion and make complex topics easier to revisit and retain." },
  { title: "Practical value", text: "We keep the experience useful, readable, and tailored to how real engineers study and build." },
] as const;

export const CONTACT_CHANNELS = [
  { title: "X (Twitter)", description: "Follow for updates, tips, and quick replies.", href: "https://x.com/Mantu_kumar91", icon: "MessageSquareText", label: "Follow on X" },
  { title: "GitHub", description: "Explore code references and open-source resources.", href: "https://github.com/Mantu01", icon: "Code2", label: "Explore GitHub" },
  { title: "YouTube", description: "Video tutorials and walkthroughs for notes topics.", href: "https://www.youtube.com/channel/UCgkZ2cdrKLz7dhnXnkDOAgQ", icon: "PlayCircle", label: "Watch on YouTube" },
  { title: "Instagram", description: "Behind-the-scenes, study tips, and new releases.", href: "https://www.instagram.com/programmer_area", icon: "Mail", label: "Follow on Instagram" },
  { title: "Email", description: "For order help, delivery questions, and support requests.", href: `mailto:${SEO.contactEmail}`, icon: "Mail", label: "Send an email" },
] as const;
