import { describe, it, expect } from 'vitest';
import {
  BRAND,
  SEO,
  NOTE_VISIBILITIES,
  NOTE_LEVELS,
  NOTE_PRICING_TYPES,
  PURCHASE_ITEM_TYPES,
  PAYMENT_STATUSES,
  FULFILLMENT_STATUSES,
  SOCIAL_PLATFORMS,
  NOTE_SORTS,
  ORDER_SORTS,
  UPLOAD_KINDS,
  ACTIVITY_TARGET_TYPES,
  ADMIN_ACTIVITY_ACTIONS,
  NOTE_LEVEL_LABELS,
  PRICING_TYPE_LABELS,
  PAYMENT_STATUS_LABELS,
  FULFILLMENT_STATUS_LABELS,
  SOCIAL_PLATFORM_LABELS,
  STATUS_CONFIG,
  ERROR_STATUS,
  DEFAULT_PAGE_LIMIT,
  ADMIN_PAGE_LIMIT,
  MAX_PAGE_LIMIT,
  DELIVERY_ETA_HOURS,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  LEADS_EXPORT_MAX_ROWS,
  MIN_PAID_PRICE_PAISE,
  ORDER_CURRENCY,
  SIGNED_URL_TTL_SECONDS,
  UPLOAD_LIMITS,
  RATE_LIMITS,
  SOCIAL_HANDLE_PATTERNS,
  FULL_NAME_PATTERN,
  PRIVACY_POLICY_SECTIONS,
  TERMS_OF_SERVICE_SECTIONS,
  REFUND_POLICY_SECTIONS,
  ABOUT_VALUES,
  CONTACT_CHANNELS,
} from '../../src/lib/constants';

describe('BRAND', () => {
  it('has correct brand name', () => {
    expect(BRAND.name).toBe('Notes Provider');
  });

  it('has a tagline', () => {
    expect(typeof BRAND.tagline).toBe('string');
    expect(BRAND.tagline.length).toBeGreaterThan(0);
  });

  it('has a description', () => {
    expect(typeof BRAND.description).toBe('string');
    expect(BRAND.description.length).toBeGreaterThan(0);
  });
});

describe('SEO', () => {
  it('has default title with brand name', () => {
    expect(SEO.defaultTitle).toContain(BRAND.name);
  });

  it('has default description', () => {
    expect(typeof SEO.defaultDescription).toBe('string');
    expect(SEO.defaultDescription.length).toBeGreaterThan(0);
  });

  it('has correct site name', () => {
    expect(SEO.siteName).toBe(BRAND.name);
  });

  it('has locale set to en_IN', () => {
    expect(SEO.locale).toBe('en_IN');
  });

  it('has country name', () => {
    expect(SEO.countryName).toBe('India');
  });

  it('has correct og image dimensions', () => {
    expect(SEO.ogImageWidth).toBe(1200);
    expect(SEO.ogImageHeight).toBe(630);
  });

  it('has og image alt text with brand name', () => {
    expect(SEO.ogImageAlt).toContain(BRAND.name);
  });

  it('has twitter card set to summary_large_image', () => {
    expect(SEO.twitterCard).toBe('summary_large_image');
  });

  it('has social handles', () => {
    expect(SEO.socialHandles.length).toBe(3);
    expect(SEO.socialHandles[0].platform).toBe('twitter');
    expect(SEO.socialHandles[1].platform).toBe('youtube');
    expect(SEO.socialHandles[2].platform).toBe('instagram');
  });

  it('has contact email', () => {
    expect(SEO.contactEmail).toBe('support@notesprovider.com');
  });

  it('has FAQs', () => {
    expect(SEO.faqs.length).toBe(6);
    SEO.faqs.forEach((faq) => {
      expect(typeof faq.question).toBe('string');
      expect(typeof faq.answer).toBe('string');
      expect(faq.question.length).toBeGreaterThan(0);
    });
  });
});

describe('Enum constants', () => {
  it('NOTE_VISIBILITIES has correct values', () => {
    expect(NOTE_VISIBILITIES).toEqual(['public', 'private']);
  });

  it('NOTE_LEVELS has correct values', () => {
    expect(NOTE_LEVELS).toEqual(['basics', 'intermediate', 'advance']);
  });

  it('NOTE_PRICING_TYPES has correct values', () => {
    expect(NOTE_PRICING_TYPES).toEqual(['free', 'paid']);
  });

  it('PURCHASE_ITEM_TYPES has correct values', () => {
    expect(PURCHASE_ITEM_TYPES).toEqual(['note', 'group']);
  });

  it('PAYMENT_STATUSES has correct values', () => {
    expect(PAYMENT_STATUSES).toEqual(['created', 'paid', 'failed']);
  });

  it('FULFILLMENT_STATUSES has correct values', () => {
    expect(FULFILLMENT_STATUSES).toEqual(['pending', 'completed', 'cancelled']);
  });

  it('SOCIAL_PLATFORMS has correct values', () => {
    expect(SOCIAL_PLATFORMS).toEqual(['instagram', 'whatsapp', 'email']);
  });

  it('NOTE_SORTS has correct values', () => {
    expect(NOTE_SORTS).toEqual(['newest', 'oldest', 'price_asc', 'price_desc', 'popular', 'title_asc']);
  });

  it('ORDER_SORTS has correct values', () => {
    expect(ORDER_SORTS).toEqual(['newest', 'oldest', 'amount_desc', 'amount_asc']);
  });

  it('UPLOAD_KINDS has correct values', () => {
    expect(UPLOAD_KINDS).toEqual(['note_full', 'note_preview', 'cover']);
  });
});

describe('Activity constants', () => {
  it('ACTIVITY_TARGET_TYPES has correct values', () => {
    expect(ACTIVITY_TARGET_TYPES).toEqual(['note', 'group', 'category', 'order', 'admin']);
  });

  it('ADMIN_ACTIVITY_ACTIONS has correct values', () => {
    expect(ADMIN_ACTIVITY_ACTIONS).toContain('admin.register');
    expect(ADMIN_ACTIVITY_ACTIONS).toContain('note.create');
    expect(ADMIN_ACTIVITY_ACTIONS).toContain('group.delete');
    expect(ADMIN_ACTIVITY_ACTIONS).toContain('order.update_fulfillment');
    expect(ADMIN_ACTIVITY_ACTIONS).toContain('category.create');
  });
});

describe('Label maps', () => {
  it('NOTE_LEVEL_LABELS has all level labels', () => {
    expect(NOTE_LEVEL_LABELS.basics).toBe('Basics');
    expect(NOTE_LEVEL_LABELS.intermediate).toBe('Intermediate');
    expect(NOTE_LEVEL_LABELS.advance).toBe('Advanced');
  });

  it('PRICING_TYPE_LABELS has all pricing labels', () => {
    expect(PRICING_TYPE_LABELS.free).toBe('Free');
    expect(PRICING_TYPE_LABELS.paid).toBe('Paid');
  });

  it('PAYMENT_STATUS_LABELS has all payment labels', () => {
    expect(PAYMENT_STATUS_LABELS.created).toBe('Awaiting payment');
    expect(PAYMENT_STATUS_LABELS.paid).toBe('Paid');
    expect(PAYMENT_STATUS_LABELS.failed).toBe('Failed');
  });

  it('FULFILLMENT_STATUS_LABELS has all fulfillment labels', () => {
    expect(FULFILLMENT_STATUS_LABELS.pending).toBe('Pending');
    expect(FULFILLMENT_STATUS_LABELS.completed).toBe('Completed');
    expect(FULFILLMENT_STATUS_LABELS.cancelled).toBe('Cancelled');
  });

  it('SOCIAL_PLATFORM_LABELS has all platform labels', () => {
    expect(SOCIAL_PLATFORM_LABELS.instagram).toBe('Instagram');
    expect(SOCIAL_PLATFORM_LABELS.whatsapp).toBe('WhatsApp');
    expect(SOCIAL_PLATFORM_LABELS.email).toBe('Email');
  });
});

describe('STATUS_CONFIG', () => {
  it('has payment status config', () => {
    expect(STATUS_CONFIG.payment.paid.label).toBe('Paid');
    expect(STATUS_CONFIG.payment.paid.className).toContain('bg-success');
    expect(STATUS_CONFIG.payment.created.label).toBe('Awaiting payment');
    expect(STATUS_CONFIG.payment.failed.label).toBe('Failed');
  });

  it('has fulfillment status config', () => {
    expect(STATUS_CONFIG.fulfillment.pending.label).toBe('Pending');
    expect(STATUS_CONFIG.fulfillment.completed.label).toBe('Completed');
    expect(STATUS_CONFIG.fulfillment.cancelled.label).toBe('Cancelled');
  });

  it('has pricing status config', () => {
    expect(STATUS_CONFIG.pricing.free.label).toBe('Free');
    expect(STATUS_CONFIG.pricing.paid.label).toBe('Paid');
  });

  it('has level status config', () => {
    expect(STATUS_CONFIG.level.basics.label).toBe('Basics');
    expect(STATUS_CONFIG.level.intermediate.label).toBe('Intermediate');
    expect(STATUS_CONFIG.level.advance.label).toBe('Advanced');
  });

  it('has all four status types', () => {
    expect(Object.keys(STATUS_CONFIG)).toEqual(['payment', 'fulfillment', 'pricing', 'level']);
  });
});

describe('ERROR_STATUS', () => {
  it('maps VALIDATION_ERROR to 400', () => {
    expect(ERROR_STATUS.VALIDATION_ERROR).toBe(400);
  });

  it('maps PAYMENT_ERROR to 402', () => {
    expect(ERROR_STATUS.PAYMENT_ERROR).toBe(402);
  });

  it('maps UNAUTHORIZED to 401', () => {
    expect(ERROR_STATUS.UNAUTHORIZED).toBe(401);
  });

  it('maps FORBIDDEN to 403', () => {
    expect(ERROR_STATUS.FORBIDDEN).toBe(403);
  });

  it('maps NOT_FOUND to 404', () => {
    expect(ERROR_STATUS.NOT_FOUND).toBe(404);
  });

  it('maps CONFLICT to 409', () => {
    expect(ERROR_STATUS.CONFLICT).toBe(409);
  });

  it('maps PAYLOAD_TOO_LARGE to 413', () => {
    expect(ERROR_STATUS.PAYLOAD_TOO_LARGE).toBe(413);
  });

  it('maps UNSUPPORTED_MEDIA_TYPE to 415', () => {
    expect(ERROR_STATUS.UNSUPPORTED_MEDIA_TYPE).toBe(415);
  });

  it('maps RATE_LIMITED to 429', () => {
    expect(ERROR_STATUS.RATE_LIMITED).toBe(429);
  });

  it('maps INTERNAL_ERROR to 500', () => {
    expect(ERROR_STATUS.INTERNAL_ERROR).toBe(500);
  });
});

describe('Page and session constants', () => {
  it('has correct page limits', () => {
    expect(DEFAULT_PAGE_LIMIT).toBe(12);
    expect(ADMIN_PAGE_LIMIT).toBe(20);
    expect(MAX_PAGE_LIMIT).toBe(48);
  });

  it('has correct delivery ETA', () => {
    expect(DELIVERY_ETA_HOURS).toBe(6);
  });

  it('has correct admin session constants', () => {
    expect(ADMIN_SESSION_COOKIE).toBe('np_admin_session');
    expect(ADMIN_SESSION_MAX_AGE_SECONDS).toBe(604800);
  });
});

describe('Business constants', () => {
  it('has correct business constants', () => {
    expect(LEADS_EXPORT_MAX_ROWS).toBe(10000);
    expect(MIN_PAID_PRICE_PAISE).toBe(100);
    expect(ORDER_CURRENCY).toBe('INR');
    expect(SIGNED_URL_TTL_SECONDS).toBe(60);
  });
});

describe('UPLOAD_LIMITS', () => {
  it('has note_full limit of 50MB', () => {
    expect(UPLOAD_LIMITS.note_full.maxBytes).toBe(50 * 1024 * 1024);
    expect(UPLOAD_LIMITS.note_full.mimeTypes).toEqual(['application/pdf']);
    expect(UPLOAD_LIMITS.note_full.folder).toBe('notes-provider/notes/full');
  });

  it('has note_preview limit of 20MB', () => {
    expect(UPLOAD_LIMITS.note_preview.maxBytes).toBe(20 * 1024 * 1024);
    expect(UPLOAD_LIMITS.note_preview.mimeTypes).toEqual(['application/pdf']);
    expect(UPLOAD_LIMITS.note_preview.folder).toBe('notes-provider/notes/preview');
  });

  it('has cover limit of 5MB with image MIME types', () => {
    expect(UPLOAD_LIMITS.cover.maxBytes).toBe(5 * 1024 * 1024);
    expect(UPLOAD_LIMITS.cover.mimeTypes).toEqual(['image/png', 'image/jpeg', 'image/webp']);
    expect(UPLOAD_LIMITS.cover.folder).toBe('notes-provider/covers');
  });
});

describe('RATE_LIMITS', () => {
  it('has adminLogin rate limit', () => {
    expect(RATE_LIMITS.adminLogin.limit).toBe(5);
    expect(RATE_LIMITS.adminLogin.windowMs).toBe(10 * 60 * 1000);
  });

  it('has adminRegister rate limit', () => {
    expect(RATE_LIMITS.adminRegister.limit).toBe(3);
    expect(RATE_LIMITS.adminRegister.windowMs).toBe(60 * 60 * 1000);
  });

  it('has createOrder rate limit', () => {
    expect(RATE_LIMITS.createOrder.limit).toBe(10);
    expect(RATE_LIMITS.createOrder.windowMs).toBe(10 * 60 * 1000);
  });

  it('has noteDownload rate limit', () => {
    expect(RATE_LIMITS.noteDownload.limit).toBe(30);
    expect(RATE_LIMITS.noteDownload.windowMs).toBe(10 * 60 * 1000);
  });
});

describe('SOCIAL_HANDLE_PATTERNS', () => {
  it('instagram pattern matches valid handles', () => {
    expect(SOCIAL_HANDLE_PATTERNS.instagram.test('@johndoe')).toBe(true);
    expect(SOCIAL_HANDLE_PATTERNS.instagram.test('johndoe')).toBe(true);
    expect(SOCIAL_HANDLE_PATTERNS.instagram.test('john.doe')).toBe(true);
    expect(SOCIAL_HANDLE_PATTERNS.instagram.test('john_doe')).toBe(true);
  });

  it('instagram pattern rejects handles with special characters', () => {
    expect(SOCIAL_HANDLE_PATTERNS.instagram.test('john@doe')).toBe(false);
    expect(SOCIAL_HANDLE_PATTERNS.instagram.test('john doe')).toBe(false);
  });

  it('instagram pattern rejects handles that are too long', () => {
    expect(SOCIAL_HANDLE_PATTERNS.instagram.test('a'.repeat(31))).toBe(false);
  });

  it('whatsapp pattern matches valid indian numbers with +91', () => {
    expect(SOCIAL_HANDLE_PATTERNS.whatsapp.test('+919876543210')).toBe(true);
  });

  it('whatsapp pattern matches valid indian numbers without +91', () => {
    expect(SOCIAL_HANDLE_PATTERNS.whatsapp.test('9876543210')).toBe(true);
  });

  it('whatsapp pattern matches valid indian numbers with 0 prefix', () => {
    expect(SOCIAL_HANDLE_PATTERNS.whatsapp.test('09876543210')).toBe(true);
  });

  it('whatsapp pattern rejects numbers starting with digit outside 6-9 after removing prefix', () => {
    expect(SOCIAL_HANDLE_PATTERNS.whatsapp.test('+915876543210')).toBe(false);
  });

  it('whatsapp pattern rejects numbers that are too short', () => {
    expect(SOCIAL_HANDLE_PATTERNS.whatsapp.test('987654321')).toBe(false);
  });

  it('email pattern matches valid emails', () => {
    expect(SOCIAL_HANDLE_PATTERNS.email.test('user@example.com')).toBe(true);
    expect(SOCIAL_HANDLE_PATTERNS.email.test('first.last@domain.org')).toBe(true);
  });

  it('email pattern rejects invalid emails', () => {
    expect(SOCIAL_HANDLE_PATTERNS.email.test('not-an-email')).toBe(false);
    expect(SOCIAL_HANDLE_PATTERNS.email.test('user@')).toBe(false);
    expect(SOCIAL_HANDLE_PATTERNS.email.test('@example.com')).toBe(false);
  });
});

describe('FULL_NAME_PATTERN', () => {
  it('matches valid full names with letters and spaces', () => {
    expect(FULL_NAME_PATTERN.test('John Doe')).toBe(true);
  });

  it('matches names with apostrophes', () => {
    expect(FULL_NAME_PATTERN.test("John O'Brien")).toBe(true);
  });

  it('matches names with periods', () => {
    expect(FULL_NAME_PATTERN.test('J. Robert Oppenheimer')).toBe(true);
  });

  it('matches names with hyphens', () => {
    expect(FULL_NAME_PATTERN.test('Mary-Jane Watson')).toBe(true);
  });

  it('rejects names with numbers', () => {
    expect(FULL_NAME_PATTERN.test('John123')).toBe(false);
  });

  it('rejects names with special characters', () => {
    expect(FULL_NAME_PATTERN.test('John@Doe')).toBe(false);
  });
});

describe('Policy sections', () => {
  it('has privacy policy sections', () => {
    expect(PRIVACY_POLICY_SECTIONS.length).toBe(3);
    expect(PRIVACY_POLICY_SECTIONS[0].id).toBe('item-1');
  });

  it('has terms of service sections', () => {
    expect(TERMS_OF_SERVICE_SECTIONS.length).toBe(3);
    expect(TERMS_OF_SERVICE_SECTIONS[0].id).toBe('item-1');
  });

  it('has refund policy sections', () => {
    expect(REFUND_POLICY_SECTIONS.length).toBe(4);
    expect(REFUND_POLICY_SECTIONS[0].id).toBe('item-1');
  });
});

describe('ABOUT_VALUES', () => {
  it('has three values', () => {
    expect(ABOUT_VALUES.length).toBe(3);
  });

  it('each value has title and text', () => {
    ABOUT_VALUES.forEach((value) => {
      expect(typeof value.title).toBe('string');
      expect(typeof value.text).toBe('string');
    });
  });
});

describe('CONTACT_CHANNELS', () => {
  it('has three contact channels', () => {
    expect(CONTACT_CHANNELS.length).toBe(3);
  });

  it('each channel has required properties', () => {
    CONTACT_CHANNELS.forEach((channel) => {
      expect(typeof channel.title).toBe('string');
      expect(typeof channel.description).toBe('string');
      expect(typeof channel.href).toBe('string');
      expect(typeof channel.icon).toBe('string');
      expect(typeof channel.label).toBe('string');
    });
  });
});
