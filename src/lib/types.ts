export type NoteVisibility = "public" | "private";
export type NoteLevel = "basics" | "intermediate" | "advance";
export type NotePricingType = "free" | "paid";
export type PurchaseItemType = "note" | "group";
export type PaymentStatus = "created" | "paid" | "failed";
export type FulfillmentStatus = "pending" | "completed" | "cancelled";
export type SocialPlatform = "instagram" | "whatsapp" | "email";

export type AdminActivityAction =
  | "admin.register"
  | "admin.login"
  | "admin.logout"
  | "note.create"
  | "note.update"
  | "note.delete"
  | "group.create"
  | "group.update"
  | "group.delete"
  | "category.create"
  | "category.update"
  | "category.delete"
  | "order.update_fulfillment"
  | "order.add_note"
  | "order.delete";

export type ActivityTargetType = "note" | "group" | "category" | "order" | "admin";

export type NoteSort =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "popular"
  | "title_asc";

export type OrderSort = "newest" | "oldest" | "amount_desc" | "amount_asc";

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "PAYLOAD_TOO_LARGE"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "RATE_LIMITED"
  | "PAYMENT_ERROR"
  | "INTERNAL_ERROR";

export type UploadKind = "note_full" | "note_preview" | "cover";

export type StatusType = "payment" | "fulfillment" | "pricing" | "level";

export type NotesQuery = {
  page?: number;
  limit?: number;
  q?: string;
  category?: string[];
  level?: string[];
  subject?: string[];
  tags?: string[];
  pricing?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  sort?: NoteSort;
  featured?: boolean;
};

export type GroupsQuery = {
  page?: number;
  limit?: number;
  q?: string;
  category?: string[];
  featured?: boolean;
};

export type CategoryRef = { id: string; name: string; slug: string; icon: string | null };

export type SubjectItem = { id: string; name: string; slug: string; order: number; isActive: boolean };

export type AdminRef = { id: string; name: string };

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type ApiSuccess<T> = { success: true; data: T };

export type ApiFailure = {
  success: false;
  error: { code: ErrorCode; message: string; fields?: Record<string, string> };
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export type PaginatedData<T> = { items: T[]; pagination: Pagination };

export type PublicNote = {
  id: string;
  slug: string;
  title: string;
  description: string;
  subject: string;
  subjectSlug: string;
  level: NoteLevel;
  category: CategoryRef;
  pricingType: NotePricingType;
  price: number;
  priceLabel: string;
  compareAtPrice: number | null;
  coverImageUrl: string | null;
  pageCount: number | null;
  fileSizeLabel: string | null;
  isLocked: boolean;
  hasPreview: boolean;
  tags: string[];
  isFeatured: boolean;
  downloadCount: number;
  purchaseCount: number;
  createdAt: string;
  updatedAt: string;
};

export type PublicGroup = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: CategoryRef;
  price: number;
  priceLabel: string;
  compareAtPrice: number | null;
  coverImageUrl: string | null;
  noteCount: number;
  notes: PublicNote[];
  isFeatured: boolean;
  createdAt: string;
};

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  subjects: SubjectItem[];
  noteCount: number;
};

export type PublicOrder = {
  id: string;
  orderNumber: string;
  itemType: PurchaseItemType;
  itemTitle: string;
  itemSlug: string;
  amount: number;
  amountLabel: string;
  currency: "INR";
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  buyer: { fullName: string; socialPlatform: SocialPlatform; socialHandleMasked: string };
  deliveryEtaHours: 6;
  createdAt: string;
  paidAt: string | null;
  completedAt: string | null;
};

export type CheckoutOrderResponse = {
  orderId: string;
  orderNumber: string;
  razorpayOrderId: string;
  razorpayKeyId: string;
  amount: number;
  currency: "INR";
  itemTitle: string;
  buyer: { fullName: string; contact: string; email: string };
};

export type AdminNote = PublicNote & {
  visibility: NoteVisibility;
  fullFileUrl: string | null;
  fullFilePublicId: string | null;
  fullFileBytes: number;
  previewFileUrl: string | null;
  previewFilePublicId: string | null;
  previewFileBytes: number | null;
  coverImagePublicId: string | null;
  createdBy: AdminRef | null;
  updatedBy: AdminRef | null;
};

export type AdminGroup = PublicGroup & {
  visibility: NoteVisibility;
  noteIds: string[];
  coverImagePublicId: string | null;
  revenuePaise: number;
  purchaseCount: number;
  createdBy: AdminRef | null;
  updatedBy: AdminRef | null;
  updatedAt: string;
};

export type AdminCategory = PublicCategory & {
  order: number;
  isActive: boolean;
  groupCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminOrder = PublicOrder & {
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  paymentMethod: string | null;
  failureReason: string | null;
  buyerFull: {
    fullName: string;
    socialPlatform: SocialPlatform;
    socialHandle: string;
    consentAccepted: true;
    ipAddress: string | null;
    userAgent: string | null;
  };
  item: {
    id: string;
    type: PurchaseItemType;
    slug: string;
    title: string;
    noteIds: string[];
  };
  adminNote: string | null;
  completedBy: AdminRef | null;
  updatedAt: string;
};

export type AdminLead = {
  id: string;
  orderId: string;
  orderNumber: string;
  fullName: string;
  socialPlatform: SocialPlatform;
  socialHandle: string;
  itemTitle: string;
  amount: number;
  amountLabel: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  createdAt: string;
};

export type AdminProfile = {
  id: string;
  name: string;
  email: string;
  isHead: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

export type AdminActivity = {
  id: string;
  admin: { id: string; name: string; email: string };
  action: AdminActivityAction;
  targetType: ActivityTargetType | null;
  targetId: string | null;
  targetLabel: string | null;
  description: string;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
};

export type OrderSummary = {
  totalRevenuePaise: number;
  paidCount: number;
  pendingFulfillmentCount: number;
  failedCount: number;
};

export type DashboardStats = {
  revenue: {
    totalPaise: number;
    totalLabel: string;
    todayPaise: number;
    todayLabel: string;
    last30DaysPaise: number;
    last30DaysLabel: string;
  };
  orders: {
    total: number;
    paid: number;
    failed: number;
    pendingFulfillment: number;
    completed: number;
    today: number;
  };
  catalog: {
    totalNotes: number;
    freeNotes: number;
    paidNotes: number;
    totalGroups: number;
    totalCategories: number;
  };
  leads: { total: number; today: number };
  revenueSeries: { date: string; revenuePaise: number; orders: number }[];
  topNotes: {
    id: string;
    title: string;
    slug: string;
    purchaseCount: number;
    revenuePaise: number;
    revenueLabel: string;
  }[];
  categoryBreakdown: { name: string; noteCount: number; revenuePaise: number }[];
  recentOrders: AdminOrder[];
  recentActivities: AdminActivity[];
};

export type NoteDetailResponse = {
  note: PublicNote;
  relatedNotes: PublicNote[];
  groups: PublicGroup[];
};

export type GroupDetailResponse = {
  group: PublicGroup;
  relatedGroups: PublicGroup[];
};

export type FiltersResponse = {
  categories: { name: string; slug: string; count: number }[];
  levels: { value: NoteLevel; label: string; count: number }[];
  subjects: { value: string; count: number }[];
  tags: { value: string; count: number }[];
  priceRange: { minPaise: number; maxPaise: number };
  pricing: { value: NotePricingType; count: number }[];
};

export type HomeResponse = {
  featuredNotes: PublicNote[];
  latestNotes: PublicNote[];
  freeNotes: PublicNote[];
  featuredGroups: PublicGroup[];
  categories: PublicCategory[];
  stats: {
    totalNotes: number;
    totalCategories: number;
    totalDownloads: number;
    happyLearners: number;
  };
};

export type UploadResponse = {
  url: string;
  publicId: string;
  bytes: number;
  sizeLabel: string;
  format: string;
  pageCount: number | null;
  resourceType: "auto" | "image";
};

export type NoteDeleteResponse = {
  deleted: true;
  affectedGroups: { id: string; name: string; slug: string; hiddenBecauseEmpty: boolean }[];
};
