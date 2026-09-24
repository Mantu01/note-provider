import {
  BookOpen,
  Download,
  Eye,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import type {
  ErrorCode,
  NoteLevel,
  NotePricingType,
  NoteSort,
  NoteVisibility,
  OrderSort,
  PaymentStatus,
  StatusType,
  UploadKind,
} from "./types";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const CURRENT_YEAR = new Date().getFullYear();

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
export const NOTE_SORTS = ["newest", "oldest", "price_asc", "price_desc", "popular", "title_asc"] as const satisfies readonly NoteSort[];
export const ORDER_SORTS = ["newest", "oldest", "amount_desc", "amount_asc"] as const satisfies readonly OrderSort[];

export const STATUS_CONFIG: Record<StatusType, Record<string, { label: string; className: string }>> = {
  payment: {
    paid: { label: "Paid", className: "border-success bg-success text-success-foreground" },
    created: { label: "Awaiting payment", className: "border-warning text-warning-foreground bg-warning/20" },
    failed: { label: "Failed", className: "border-destructive text-destructive bg-destructive/10" },
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
} as const;

export const ABOUT_VALUES = [
  { title: "Focused learning", text: "We curate the developer notes that help you learn faster without wasting time on fluff." },
  { title: "Clear structure", text: "Every note is designed to reduce confusion and make complex topics easier to revisit and retain." },
  { title: "Practical value", text: "We keep the experience useful, readable, and tailored to how real engineers study and build." },
] as const;

export const CONTACT_CHANNELS = [
  { title: "X (Twitter)", description: "Follow for updates, tips, and quick replies.", href: "https://x.com/Mantu_kumar91", icon: "MessageSquareText", label: "Follow on X" },
  { title: "GitHub", description: "Explore code references and open-source resources.", href: "https://github.com/Mantu01", icon: "Code2", label: "Explore GitHub" },
  { title: "YouTube", description: "Video tutorials and walkthroughs for notes topics.", href: "https://www.youtube.com/channel/UCgkZ2cdrKLz7dhnXnkDOAgQ", icon: "PlayCircle", label: "Watch on YouTube" },
  { title: "Instagram", description: "Behind-the-scenes, study tips, and new releases.", href: "https://www.instagram.com/programmer_area", icon: "Instagram", label: "Follow on Instagram" },
  { title: "Email", description: "For order help, delivery questions, and support requests.", href: `mailto:${SEO.contactEmail}`, icon: "Mail", label: "Send an email" },
] as const;

export const TERMS_OF_SERVICE_SECTIONS = [
  { id: "item-1", title: "1. Acceptance of Terms", content: `By purchasing notes or accessing digital materials from ${BRAND.name}, you agree to be bound by these Terms. If you do not accept these terms, please do not use our services.` },
  { id: "item-2", title: "2. Instant Digital Delivery & Access Policy", content: `Purchased study notes and bundles are delivered digitally and made available for instant download immediately upon successful payment. Unlimited downloads are provided during your initial 15-minute post-payment session on the order confirmation screen. Subsequent visits allow a single-use download via the order tracking page. We recommend saving and backing up your downloaded PDFs to your device promptly upon purchase.` },
  { id: "item-3", title: "3. Personal Educational Use License", content: `All purchased content is licensed exclusively for personal, non-commercial educational use. You are welcome to view, annotate, and print notes for your own learning. You may not resell, redistribute, publicly re-host, or commercially exploit any material without prior written authorization from ${BRAND.name}.` },
  { id: "item-4", title: "4. AI-Assisted Content Disclaimer", content: `<strong>Notes Provider utilizes modern AI-assisted tools to curate and structure study notes.</strong> While we prioritize technical rigor and clarity, material may occasionally contain inaccuracies or omissions. We advise cross-referencing with official documentation, course syllabi, and trusted textbooks.` },
  { id: "item-5", title: "5. Buyer Responsibility", content: `You are responsible for providing an accurate name and contact details during checkout to ensure smooth order tracking and receipt generation.` },
  { id: "item-6", title: "6. Limitation of Liability", content: `${BRAND.name} shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our study materials. Total aggregate liability for any order shall not exceed the price paid for that order.` },
  { id: "item-7", title: "7. Modifications to Terms", content: `We reserve the right to revise these Terms periodically. Continued use of our site following revisions signifies acceptance of the updated terms.` },
  { id: "item-8", title: "8. Governing Law", content: `These Terms are governed by and construed in accordance with the laws of India. Any legal proceedings shall be subject to the exclusive jurisdiction of the competent courts in India.` },
] as const;

export const PRIVACY_POLICY_SECTIONS = [
  { id: "item-1", title: "1. Information We Collect", content: `<strong>Personal Information:</strong> Buyer full name and email address provided during checkout. <strong>Payment Information:</strong> Handled entirely and securely by Razorpay. We do not store, process, or have access to your credit/debit card numbers, CVVs, netbanking credentials, or UPI PINs. <strong>Technical Data:</strong> IP address, user-agent details, and download timestamps to maintain download integrity and prevent unauthorized link sharing.` },
  { id: "item-2", title: "2. How We Use Your Data", content: `We use your information exclusively to process orders, generate transaction receipts, deliver digital study files, facilitate order lookup, and provide customer support. We never sell, rent, or trade your personal information.` },
  { id: "item-3", title: "3. Payment Gateway & Third Parties", content: `All payments are securely processed through <strong>Razorpay</strong> under strict PCI-DSS compliance. We share only transaction-necessary identifiers with Razorpay to verify payment status and prevent fraud.` },
  { id: "item-4", title: "4. Cookies & Local Storage", content: `We use essential browser cookies and local storage exclusively for session state, theme preferences, and security. We do not use intrusive third-party cross-site trackers.` },
  { id: "item-5", title: "5. Data Retention", content: `Order records and purchase verification data are retained for statutory accounting and customer support purposes. You may request deletion of non-essential records by contacting support.` },
  { id: "item-6", title: "6. Your Rights", content: `You have the right to request access to your purchase history, correct any erroneous personal details, or ask questions regarding your stored order records.` },
  { id: "item-7", title: "7. Data Security", content: `We enforce HTTPS SSL/TLS encryption across all endpoints, strict database access controls, and rate limiting to safeguard your data and maintain service availability.` },
  { id: "item-8", title: "8. Contact Us", content: `For privacy-related inquiries, reach out to our team at <a href="mailto:${SEO.contactEmail}" style="color:var(--primary);text-decoration:underline">${SEO.contactEmail}</a>.` },
] as const;

export const REFUND_POLICY_SECTIONS = [
  { id: "item-1", title: "1. Instant Digital Goods — All Sales Final", content: `Because study notes and bundles are digital goods available for immediate download upon payment confirmation, <strong>all purchases are final and non-refundable</strong>. Once an order is paid, download access is activated instantly, and cancellations cannot be processed.` },
  { id: "item-2", title: "2. Free Sample Previews & Free Notes", content: `We encourage every learner to review the sample preview PDF and detailed table of contents available on each note page before making a purchase. In addition, our catalogue features free study notes for immediate download to evaluate our quality.` },
  { id: "item-3", title: "3. Immediate Download Window & Single-Use Policy", content: `Immediately following payment completion, you are redirected to the order status screen with unlimited download access for 15 minutes. Subsequent access via our order lookup system provides a single-use download. Please ensure you download and securely save your files to your local device upon purchasing.` },
  { id: "item-4", title: "4. Exceptional Circumstances & Duplicate Payments", content: `If you encounter a verified technical anomaly — such as a duplicate charge for the identical item within minutes or an unresolvable server failure that prevented file delivery — please contact support with your order number and transaction proof. Valid duplicate charges will be refunded to the original payment source within 5–7 business days.` },
  { id: "item-5", title: "5. Payment Gateway Failures", content: `If a transaction fails or is declined by your bank during checkout, no funds are captured by ${BRAND.name}. In the rare event of an authorization hold by your bank, the funds will be automatically released back to your account as per standard banking processing windows.` },
  { id: "item-6", title: "6. Support Inquiries", content: `For assistance with payment verification or order download access, contact us at <a href="mailto:${SEO.contactEmail}" style="color:var(--primary);text-decoration:underline">${SEO.contactEmail}</a> with your order number. Our team typically responds within 24 hours.` },
] as const;

export const HOME_TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Secure payments" },
  { icon: Download, label: "Instant downloads" },
  { icon: Sparkles, label: "Curated notes" },
  { icon: BookOpen, label: "Human support" },
] satisfies Array<{ icon: React.ComponentType<{ className?: string }>; label: string }>;

export const HOME_FAQS = [
  ["When will I receive paid notes?", "Paid notes are available for instant download after successful payment."],
  ["How do free notes work?", "Free notes are available for immediate PDF download. No sign-up is required."],
  ["Which topics do you cover?", "We focus on web development, frontend, backend, DSA, DBMS, system design, and interview-prep topics."],
  ["Which payment methods can I use?", "Payments are securely processed by Razorpay and support its available Indian payment methods."],
  ["Can I get a refund?", "Digital notes are non-refundable after delivery. Please review the preview and description before paying."],
] as const;

export const HOME_STEPS = [
  { num: "01", title: "Browse", desc: "Explore our curated catalogue by topic.", Icon: BookOpen },
  { num: "02", title: "Preview", desc: "Review any note with a free sample PDF.", Icon: Eye },
  { num: "03", title: "Pay", desc: "Checkout securely via Razorpay.", Icon: ShoppingBag },
  { num: "04", title: "Download", desc: "Get your notes instantly after payment.", Icon: Download },
] satisfies Array<{ num: string; title: string; desc: string; Icon: React.ComponentType<{ className?: string }> }>;

export const HOME_STATS_CONFIG = [
  { label: "Notes", key: "totalNotes" as const },
  { label: "Topics", key: "totalCategories" as const },
  { label: "Downloads", key: "totalDownloads" as const },
  { label: "Learners", key: "happyLearners" as const },
] as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/notes", label: "Notes" },
  { href: "/groups", label: "Bundles" },
  { href: "/order/track", label: "Track Order" },
] as const;

export const MOBILE_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/notes", label: "Notes" },
  { href: "/groups", label: "Bundles" },
  { href: "/order/track", label: "Track Order" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
export const NOTE_LEVEL_LABELS: Record<NoteLevel, string> = { basics: "Basics", intermediate: "Intermediate", advance: "Advanced" };
export const NOTE_SORT_LABELS: Record<NoteSort, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  price_asc: "Price: low to high",
  price_desc: "Price: high to low",
  popular: "Most popular",
  title_asc: "Title: A–Z",
};

export const ERROR_STATUS: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400, PAYMENT_ERROR: 402, UNAUTHORIZED: 401, FORBIDDEN: 403,
  NOT_FOUND: 404, CONFLICT: 409, PAYLOAD_TOO_LARGE: 413, UNSUPPORTED_MEDIA_TYPE: 415,
  RATE_LIMITED: 429, INTERNAL_ERROR: 500,
};

export const DEFAULT_PAGE_LIMIT = 12;
export const MAX_PAGE_LIMIT = 48;
export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 604800;
export const LEADS_EXPORT_MAX_ROWS = 10000;
export const MIN_PAID_PRICE_PAISE = 100;
export const ORDER_CURRENCY = "INR" as const;
export const SIGNED_URL_TTL_SECONDS = 60;
export const UPLOAD_LIMITS: Record<UploadKind, { maxBytes: number; mimeTypes: readonly string[]; folder: string }> = {
  note_full: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf"], folder: "notes-provider/notes/full" },
  note_preview: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf"], folder: "notes-provider/notes/preview" },
  cover: { maxBytes: 5 * 1024 * 1024, mimeTypes: ["image/png", "image/jpeg", "image/webp"], folder: "notes-provider/covers" },
};
