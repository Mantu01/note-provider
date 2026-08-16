import { describe, it, expect } from 'vitest';
import { categoryBaseSchema, createCategorySchema, updateCategorySchema, subjectSchema } from '@/lib/schemas/category.schema';

describe('subjectSchema', () => {
  it('accepts valid subject', () => {
    const result = subjectSchema.safeParse({
      name: 'React',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = subjectSchema.safeParse({
      name: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects name over 100 characters', () => {
    const result = subjectSchema.safeParse({
      name: 'a'.repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it('accepts optional id', () => {
    const result = subjectSchema.safeParse({
      id: '507f1f77bcf86cd799439011',
      name: 'React',
    });
    expect(result.success).toBe(true);
  });

  it('defaults order to 0', () => {
    const result = subjectSchema.safeParse({ name: 'React' });
    if (result.success) expect(result.data.order).toBe(0);
  });

  it('defaults isActive to true', () => {
    const result = subjectSchema.safeParse({ name: 'React' });
    if (result.success) expect(result.data.isActive).toBe(true);
  });
});

describe('categoryBaseSchema', () => {
  it('accepts valid base data', () => {
    const result = categoryBaseSchema.safeParse({
      name: 'Frontend',
      description: 'Frontend development notes',
      order: 0,
      isActive: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejects name shorter than 2 characters', () => {
    const result = categoryBaseSchema.safeParse({
      name: 'F',
    });
    expect(result.success).toBe(false);
  });

  it('rejects name over 60 characters', () => {
    const result = categoryBaseSchema.safeParse({
      name: 'a'.repeat(61),
    });
    expect(result.success).toBe(false);
  });

  it('accepts null description', () => {
    const result = categoryBaseSchema.safeParse({
      name: 'Frontend',
      description: null,
    });
    expect(result.success).toBe(true);
  });

  it('accepts null icon', () => {
    const result = categoryBaseSchema.safeParse({
      name: 'Frontend',
      icon: null,
    });
    expect(result.success).toBe(true);
  });

  it('rejects icon over 60 characters', () => {
    const result = categoryBaseSchema.safeParse({
      name: 'Frontend',
      icon: 'a'.repeat(61),
    });
    expect(result.success).toBe(false);
  });

  it('defaults order to 0', () => {
    const result = categoryBaseSchema.safeParse({ name: 'Frontend' });
    if (result.success) expect(result.data.order).toBe(0);
  });

  it('defaults isActive to true', () => {
    const result = categoryBaseSchema.safeParse({ name: 'Frontend' });
    if (result.success) expect(result.data.isActive).toBe(true);
  });

  it('defaults subjects to empty array', () => {
    const result = categoryBaseSchema.safeParse({ name: 'Frontend' });
    if (result.success) expect(result.data.subjects).toEqual([]);
  });
});

describe('createCategorySchema', () => {
  it('accepts valid create data', () => {
    const result = createCategorySchema.safeParse({
      name: 'Frontend',
      description: 'Frontend development notes',
    });
    expect(result.success).toBe(true);
  });

  it('requires name', () => {
    const result = createCategorySchema.safeParse({
      description: 'Frontend development notes',
    });
    expect(result.success).toBe(false);
  });

  it('trims name', () => {
    const result = createCategorySchema.safeParse({
      name: '  Frontend  ',
    });
    if (result.success) expect(result.data.name).toBe('Frontend');
  });

  it('accepts subjects array', () => {
    const result = createCategorySchema.safeParse({
      name: 'Frontend',
      subjects: [{ name: 'React' }, { name: 'Vue' }],
    });
    expect(result.success).toBe(true);
  });

  it('accepts slug', () => {
    const result = createCategorySchema.safeParse({
      name: 'Frontend',
      slug: 'frontend',
    });
    expect(result.success).toBe(true);
  });
});

describe('updateCategorySchema', () => {
  it('accepts partial update', () => {
    const result = updateCategorySchema.safeParse({
      name: 'Updated Frontend',
    });
    expect(result.success).toBe(true);
  });

  it('accepts isActive false', () => {
    const result = updateCategorySchema.safeParse({
      isActive: false,
    });
    expect(result.success).toBe(true);
  });

  it('accepts isActive true', () => {
    const result = updateCategorySchema.safeParse({
      isActive: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = updateCategorySchema.safeParse({
      name: '',
    });
    expect(result.success).toBe(false);
  });

  it('accepts null description', () => {
    const result = updateCategorySchema.safeParse({
      description: null,
    });
    expect(result.success).toBe(true);
  });

  it('accepts null icon', () => {
    const result = updateCategorySchema.safeParse({
      icon: null,
    });
    expect(result.success).toBe(true);
  });
});
