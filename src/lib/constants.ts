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
  tagline: "Premium study notes, instantly.",
  description: "Curated, exam-ready notes crafted for serious learners.",
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
