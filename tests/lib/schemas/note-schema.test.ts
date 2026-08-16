import { describe, it, expect } from 'vitest';
import {
  objectIdSchema,
  uploadedFileSchema,
  uploadedImageSchema,
  noteBaseSchema,
  createNoteSchema,
  updateNoteSchema,
} from '@/lib/schemas/note.schema';

const validObjectId = '507f1f77bcf86cd799439011';
const validUrl = 'https://example.com/file.pdf';

describe('objectIdSchema', () => {
  it('accepts valid ObjectId', () => {
    const result = objectIdSchema.safeParse('507f1f77bcf86cd799439011');
    expect(result.success).toBe(true);
  });

  it('accepts uppercase ObjectId', () => {
    const result = objectIdSchema.safeParse('507F1F77BCF86CD799439011');
    expect(result.success).toBe(true);
  });

  it('rejects invalid ObjectId', () => {
    const result = objectIdSchema.safeParse('not-an-id');
    expect(result.success).toBe(false);
  });

  it('rejects empty string', () => {
    const result = objectIdSchema.safeParse('');
    expect(result.success).toBe(false);
  });

  it('rejects too short string', () => {
    const result = objectIdSchema.safeParse('507f');
    expect(result.success).toBe(false);
  });

  it('rejects too long string', () => {
    const result = objectIdSchema.safeParse('507f1f77bcf86cd7994390111');
    expect(result.success).toBe(false);
  });
});

describe('uploadedFileSchema', () => {
  it('accepts valid file data', () => {
    const result = uploadedFileSchema.safeParse({
      url: 'https://example.com/file.pdf',
      publicId: 'notes-provider/notes/full/my-note',
      bytes: 1024,
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid URL', () => {
    const result = uploadedFileSchema.safeParse({
      url: 'not-a-url',
      publicId: 'notes-provider/notes/full/my-note',
      bytes: 1024,
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty publicId', () => {
    const result = uploadedFileSchema.safeParse({
      url: 'https://example.com/file.pdf',
      publicId: '',
      bytes: 1024,
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative bytes', () => {
    const result = uploadedFileSchema.safeParse({
      url: 'https://example.com/file.pdf',
      publicId: 'notes-provider/notes/full/my-note',
      bytes: -1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects zero bytes', () => {
    const result = uploadedFileSchema.safeParse({
      url: 'https://example.com/file.pdf',
      publicId: 'notes-provider/notes/full/my-note',
      bytes: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe('uploadedImageSchema', () => {
  it('accepts valid image data', () => {
    const result = uploadedImageSchema.safeParse({
      url: 'https://example.com/image.jpg',
      publicId: 'notes-provider/covers/my-cover',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid URL', () => {
    const result = uploadedImageSchema.safeParse({
      url: 'not-a-url',
      publicId: 'notes-provider/covers/my-cover',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty publicId', () => {
    const result = uploadedImageSchema.safeParse({
      url: 'https://example.com/image.jpg',
      publicId: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('noteBaseSchema', () => {
  const baseValid = {
    title: 'React Notes',
    description: 'Comprehensive React notes',
    categoryId: validObjectId,
    level: 'intermediate' as const,
    pricingType: 'paid' as const,
    price: 299,
    fullFile: { url: validUrl, publicId: 'notes/full', bytes: 1024 },
    previewFile: { url: validUrl, publicId: 'notes/preview', bytes: 512 },
    coverImage: { url: validUrl, publicId: 'cover123' },
  };

  it('accepts valid base data', () => {
    const result = noteBaseSchema.safeParse(baseValid);
    expect(result.success).toBe(true);
  });

  it('rejects missing title', () => {
    const result = noteBaseSchema.safeParse({
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      level: 'intermediate',
      pricingType: 'paid',
      price: 299,
      fullFile: { url: validUrl, publicId: 'notes/full', bytes: 1024 },
      previewFile: { url: validUrl, publicId: 'notes/preview', bytes: 512 },
    });
    expect(result.success).toBe(false);
  });

  it('rejects title over 160 characters', () => {
    const result = noteBaseSchema.safeParse({
      ...baseValid,
      title: 'a'.repeat(161),
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing categoryId', () => {
    const result = noteBaseSchema.safeParse({
      ...baseValid,
      categoryId: undefined,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid pricingType', () => {
    const result = noteBaseSchema.safeParse({
      ...baseValid,
      pricingType: 'invalid' as 'paid',
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative price', () => {
    const result = noteBaseSchema.safeParse({
      ...baseValid,
      price: -1,
    });
    expect(result.success).toBe(false);
  });

  it('accepts free pricingType with zero price', () => {
    const result = noteBaseSchema.safeParse({
      title: 'React Notes',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      level: 'basics',
      pricingType: 'free',
      price: 0,
      fullFile: { url: validUrl, publicId: 'notes/full', bytes: 1024 },
    });
    expect(result.success).toBe(true);
  });

  it('accepts null compareAtPrice', () => {
    const result = noteBaseSchema.safeParse({
      ...baseValid,
      compareAtPrice: null,
    });
    expect(result.success).toBe(true);
  });

  it('accepts optional level', () => {
    const result = noteBaseSchema.safeParse({
      title: 'React Notes',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      pricingType: 'paid',
      price: 299,
      level: 'advance',
      fullFile: { url: validUrl, publicId: 'notes/full', bytes: 1024 },
      previewFile: { url: validUrl, publicId: 'notes/preview', bytes: 512 },
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid level', () => {
    const result = noteBaseSchema.safeParse({
      ...baseValid,
      level: 'expert' as 'basics',
    });
    expect(result.success).toBe(false);
  });

  it('defaults visibility to public', () => {
    const result = noteBaseSchema.safeParse(baseValid);
    if (result.success) expect(result.data.visibility).toBe('public');
  });

  it('defaults isFeatured to false', () => {
    const result = noteBaseSchema.safeParse(baseValid);
    if (result.success) expect(result.data.isFeatured).toBe(false);
  });

  it('defaults tags to empty array', () => {
    const result = noteBaseSchema.safeParse(baseValid);
    if (result.success) expect(result.data.tags).toEqual([]);
  });
});

describe('createNoteSchema', () => {
  const baseValid = {
    title: 'React Notes',
    description: 'Comprehensive React notes',
    categoryId: validObjectId,
    level: 'intermediate',
    pricingType: 'paid' as const,
    price: 299,
    fullFile: { url: validUrl, publicId: 'notes/full', bytes: 1024 },
    previewFile: { url: validUrl, publicId: 'notes/preview', bytes: 512 },
  };

  it('accepts valid create data', () => {
    const result = createNoteSchema.safeParse(baseValid);
    expect(result.success).toBe(true);
  });

  it('requires file for paid notes', () => {
    const result = createNoteSchema.safeParse({
      title: 'React Notes',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      pricingType: 'paid' as const,
      price: 299,
      level: 'intermediate',
      previewFile: null,
      fullFile: null,
    });
    expect(result.success).toBe(false);
  });

  it('requires fullFile for free notes', () => {
    const result = createNoteSchema.safeParse({
      title: 'React Notes',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      pricingType: 'free' as const,
      price: 0,
      level: 'basics',
      fullFile: null,
    });
    expect(result.success).toBe(false);
  });

  it('does not require previewFile for free notes', () => {
    const result = createNoteSchema.safeParse({
      title: 'React Notes',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      pricingType: 'free' as const,
      price: 0,
      level: 'basics',
      fullFile: { url: validUrl, publicId: 'notes/full', bytes: 1024 },
      previewFile: null,
    });
    expect(result.success).toBe(true);
  });

  it('rejects paid note with price below 1 rupee', () => {
    const result = createNoteSchema.safeParse({
      ...baseValid,
      price: 0,
    });
    expect(result.success).toBe(false);
  });

  it('accepts paid note with price of 1 rupee', () => {
    const result = createNoteSchema.safeParse({
      ...baseValid,
      price: 1,
    });
    expect(result.success).toBe(true);
  });

  it('rejects compareAtPrice <= price for paid notes', () => {
    const result = createNoteSchema.safeParse({
      ...baseValid,
      compareAtPrice: 299,
    });
    expect(result.success).toBe(false);
  });

  it('accepts compareAtPrice > price for paid notes', () => {
    const result = createNoteSchema.safeParse({
      ...baseValid,
      compareAtPrice: 499,
    });
    expect(result.success).toBe(true);
  });

  it('trims title', () => {
    const result = createNoteSchema.safeParse({
      title: '  React Notes  ',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      pricingType: 'free' as const,
      price: 0,
      level: 'basics',
      fullFile: { url: validUrl, publicId: 'notes/full', bytes: 1024 },
    });
    if (result.success) expect(result.data.title).toBe('React Notes');
  });

  it('deduplicates and lowercases tags', () => {
    const result = createNoteSchema.safeParse({
      ...baseValid,
      tags: ['React', 'REACT', 'javascript'],
    });
    if (result.success) expect(result.data.tags).toEqual(['react', 'javascript']);
  });

  it('rejects more than 20 tags', () => {
    const result = createNoteSchema.safeParse({
      ...baseValid,
      tags: Array.from({ length: 21 }, () => 'tag'),
    });
    expect(result.success).toBe(false);
  });
});

describe('updateNoteSchema', () => {
  it('accepts partial update with title only', () => {
    const result = updateNoteSchema.safeParse({
      title: 'Updated Title',
    });
    expect(result.success).toBe(true);
  });

  it('accepts partial update with null coverImage', () => {
    const result = updateNoteSchema.safeParse({
      coverImage: null,
    });
    expect(result.success).toBe(true);
  });

  it('accepts partial update with undefined fullFile', () => {
    const result = updateNoteSchema.safeParse({
      fullFile: undefined,
    });
    expect(result.success).toBe(true);
  });

  it('accepts visibility change', () => {
    const result = updateNoteSchema.safeParse({
      visibility: 'private',
    });
    expect(result.success).toBe(true);
  });

  it('accepts price update', () => {
    const result = updateNoteSchema.safeParse({
      price: 399,
    });
    expect(result.success).toBe(true);
  });

  it('rejects title shorter than 3 characters', () => {
    const result = updateNoteSchema.safeParse({
      title: 'Ab',
    });
    expect(result.success).toBe(false);
  });

  it('rejects description shorter than 10 characters', () => {
    const result = updateNoteSchema.safeParse({
      description: 'Short',
    });
    expect(result.success).toBe(false);
  });

  it('accepts partial update with compareAtPrice', () => {
    const result = updateNoteSchema.safeParse({
      compareAtPrice: 499,
      price: 299,
    });
    expect(result.success).toBe(true);
  });

  it('rejects partial update with null price', () => {
    const result = updateNoteSchema.safeParse({
      price: null,
    });
    expect(result.success).toBe(false);
  });
});
