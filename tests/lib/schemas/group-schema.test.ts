import { describe, it, expect } from 'vitest';
import { groupBaseSchema, createGroupSchema, updateGroupSchema } from '@/lib/schemas/group.schema';

const validObjectId = '507f1f77bcf86cd799439011';
const anotherValidObjectId = '507f1f77bcf86cd799439012';

describe('groupBaseSchema', () => {
  it('accepts valid base data with all required fields', () => {
    const result = groupBaseSchema.safeParse({
      name: 'React Notes Bundle',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      price: 299,
      noteIds: [validObjectId],
    });
    expect(result.success).toBe(true);
  });

  it('rejects name shorter than 3 characters', () => {
    const result = groupBaseSchema.safeParse({
      name: 'Re',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      price: 299,
      noteIds: [validObjectId],
    });
    expect(result.success).toBe(false);
  });

  it('rejects name longer than 160 characters', () => {
    const result = groupBaseSchema.safeParse({
      name: 'a'.repeat(161),
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      price: 299,
      noteIds: [validObjectId],
    });
    expect(result.success).toBe(false);
  });

  it('rejects description shorter than 10 characters', () => {
    const result = groupBaseSchema.safeParse({
      name: 'React Notes',
      description: 'Short',
      categoryId: validObjectId,
      price: 299,
      noteIds: [validObjectId],
    });
    expect(result.success).toBe(false);
  });

  it('rejects description longer than 5000 characters', () => {
    const result = groupBaseSchema.safeParse({
      name: 'React Notes',
      description: 'a'.repeat(5001),
      categoryId: validObjectId,
      price: 299,
      noteIds: [validObjectId],
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid categoryId', () => {
    const result = groupBaseSchema.safeParse({
      name: 'React Notes',
      description: 'Comprehensive React notes',
      categoryId: 'invalid-id',
      price: 299,
      noteIds: [validObjectId],
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative price', () => {
    const result = groupBaseSchema.safeParse({
      name: 'React Notes',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      price: -1,
      noteIds: [validObjectId],
    });
    expect(result.success).toBe(false);
  });

  it('accepts null compareAtPrice', () => {
    const result = groupBaseSchema.safeParse({
      name: 'React Notes',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      price: 299,
      compareAtPrice: null,
      noteIds: [validObjectId],
    });
    expect(result.success).toBe(true);
  });

  it('accepts compareAtPrice higher than price', () => {
    const result = groupBaseSchema.safeParse({
      name: 'React Notes',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      price: 299,
      compareAtPrice: 499,
      noteIds: [validObjectId],
    });
    expect(result.success).toBe(true);
  });

  it('rejects compareAtPrice equal to price', () => {
    const result = createGroupSchema.safeParse({
      name: 'React Notes',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      price: 299,
      compareAtPrice: 299,
      noteIds: [validObjectId],
    });
    expect(result.success).toBe(false);
  });

  it('rejects null description', () => {
    const result = groupBaseSchema.safeParse({
      name: 'React Notes',
      description: null,
      categoryId: validObjectId,
      price: 299,
      noteIds: [validObjectId],
    });
    expect(result.success).toBe(false);
  });

  it('accepts null coverImage', () => {
    const result = groupBaseSchema.safeParse({
      name: 'React Notes',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      price: 299,
      coverImage: null,
      noteIds: [validObjectId],
    });
    expect(result.success).toBe(true);
  });

  it('accepts valid coverImage', () => {
    const result = groupBaseSchema.safeParse({
      name: 'React Notes',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      price: 299,
      coverImage: { url: 'https://example.com/cover.jpg', publicId: 'cover123' },
      noteIds: [validObjectId],
    });
    expect(result.success).toBe(true);
  });

  it('accepts empty noteIds rejection (min 1)', () => {
    const result = groupBaseSchema.safeParse({
      name: 'React Notes',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      price: 299,
      noteIds: [],
    });
    expect(result.success).toBe(false);
  });
});

describe('createGroupSchema', () => {
  it('accepts valid create data', () => {
    const result = createGroupSchema.safeParse({
      name: 'React Notes Bundle',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      price: 299,
      noteIds: [validObjectId],
    });
    expect(result.success).toBe(true);
  });

  it('requires at least one noteId', () => {
    const result = createGroupSchema.safeParse({
      name: 'React Notes Bundle',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      price: 299,
      noteIds: [],
    });
    expect(result.success).toBe(false);
  });

  it('accepts exactly 200 unique noteIds', () => {
    const noteIds = Array.from({ length: 200 }, (_, i) => {
      const hex = i.toString(16).padStart(12, '0');
      return '507f1f77bcf8' + hex;
    });
    const result = createGroupSchema.safeParse({
      name: 'React Notes Bundle',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      price: 299,
      noteIds,
    });
    expect(result.success).toBe(true);
  });

  it('rejects more than 200 noteIds', () => {
    const noteIds = Array.from({ length: 201 }, () => validObjectId);
    const result = createGroupSchema.safeParse({
      name: 'React Notes Bundle',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      price: 299,
      noteIds,
    });
    expect(result.success).toBe(false);
  });

  it('rejects duplicate noteIds', () => {
    const result = createGroupSchema.safeParse({
      name: 'React Notes Bundle',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      price: 299,
      noteIds: [validObjectId, validObjectId],
    });
    expect(result.success).toBe(false);
  });

  it('trims name', () => {
    const result = createGroupSchema.safeParse({
      name: '  React Notes Bundle  ',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      price: 299,
      noteIds: [validObjectId],
    });
    if (result.success) expect(result.data.name).toBe('React Notes Bundle');
  });

  it('rejects price below 1 rupee', () => {
    const result = createGroupSchema.safeParse({
      name: 'React Notes Bundle',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      price: 0.5,
      noteIds: [validObjectId],
    });
    expect(result.success).toBe(false);
  });

  it('accepts price of exactly 1 rupee', () => {
    const result = createGroupSchema.safeParse({
      name: 'React Notes Bundle',
      description: 'Comprehensive React notes',
      categoryId: validObjectId,
      price: 1,
      noteIds: [validObjectId],
    });
    expect(result.success).toBe(true);
  });
});

describe('updateGroupSchema', () => {
  it('accepts partial update with name only', () => {
    const result = updateGroupSchema.safeParse({
      name: 'Updated Name',
    });
    expect(result.success).toBe(true);
  });

  it('accepts partial update with description only', () => {
    const result = updateGroupSchema.safeParse({
      description: 'Updated description text',
    });
    expect(result.success).toBe(true);
  });

  it('accepts partial update with price only', () => {
    const result = updateGroupSchema.safeParse({
      price: 399,
    });
    expect(result.success).toBe(true);
  });

  it('accepts partial update with coverImage', () => {
    const result = updateGroupSchema.safeParse({
      coverImage: { url: 'https://example.com/new.jpg', publicId: 'new-cover' },
    });
    expect(result.success).toBe(true);
  });

  it('accepts partial update with null coverImage', () => {
    const result = updateGroupSchema.safeParse({
      coverImage: null,
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid price', () => {
    const result = updateGroupSchema.safeParse({
      price: -1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty name', () => {
    const result = updateGroupSchema.safeParse({
      name: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty description', () => {
    const result = updateGroupSchema.safeParse({
      description: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects duplicate noteIds', () => {
    const result = updateGroupSchema.safeParse({
      noteIds: [validObjectId, validObjectId],
    });
    expect(result.success).toBe(false);
  });

  it('accepts empty object', () => {
    const result = updateGroupSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('accepts partial update with visibility', () => {
    const result = updateGroupSchema.safeParse({
      visibility: 'private',
    });
    expect(result.success).toBe(true);
  });

  it('accepts partial update with isFeatured', () => {
    const result = updateGroupSchema.safeParse({
      isFeatured: true,
    });
    expect(result.success).toBe(true);
  });
});
