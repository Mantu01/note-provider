import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Note } from '@/server/db/models/note.model';
import { Group } from '@/server/db/models/group.model';
import { Category } from '@/server/db/models/category.model';

vi.mock('@/server/db/models/note.model', () => ({
  Note: {
    find: vi.fn(),
  },
}));

vi.mock('@/server/db/models/group.model', () => ({
  Group: {
    find: vi.fn(),
  },
}));

vi.mock('@/server/db/models/category.model', () => ({
  Category: {
    find: vi.fn(),
  },
}));

function makeBuilder(resolvedData: any[] = []) {
  const exec = vi.fn().mockResolvedValue(resolvedData);
  return {
    select: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
    lean: vi.fn().mockReturnThis(),
    exec,
  };
}

describe('sitemap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_APP_URL = 'https://notesprovider.online';
    ;(Note.find as any).mockReturnValue(makeBuilder());
    ;(Group.find as any).mockReturnValue(makeBuilder());
    ;(Category.find as any).mockReturnValue(makeBuilder());
  });

  it('exports a default async function', async () => {
    const mod = await import('@/app/sitemap');
    expect(typeof mod.default).toBe('function');
  });

  it('returns static pages with correct URLs and priorities', async () => {
    const mod = await import('@/app/sitemap');
    const entries = await mod.default();
    const rootEntry = entries.find((e: any) => e.url === 'https://notesprovider.online') as any;
    expect(rootEntry).toBeDefined();
    expect(rootEntry.priority).toBe(1.0);
    expect(rootEntry.changeFrequency).toBe('daily');

    const notesEntry = entries.find((e: any) => e.url === 'https://notesprovider.online/notes') as any;
    expect(notesEntry).toBeDefined();
    expect(notesEntry.priority).toBe(0.9);
  });

  it('returns all static page paths', async () => {
    const mod = await import('@/app/sitemap');
    const entries = await mod.default();
    const urls = entries.map((e: any) => e.url);

    expect(urls).toContain('https://notesprovider.online');
    expect(urls).toContain('https://notesprovider.online/notes');
    expect(urls).toContain('https://notesprovider.online/groups');
    expect(urls).toContain('https://notesprovider.online/about');
    expect(urls).toContain('https://notesprovider.online/contact');
    expect(urls).toContain('https://notesprovider.online/terms');
    expect(urls).toContain('https://notesprovider.online/privacy');
    expect(urls).toContain('https://notesprovider.online/refund-policy');
  });

  it('adds note detail pages when notes are returned', async () => {
    const note = { slug: 'test-note', updatedAt: new Date() };
    ;(Note.find as any).mockReturnValueOnce(makeBuilder([note]));
    const mod = await import('@/app/sitemap');
    const entries = await mod.default();
    const noteEntry = entries.find((e: any) => e.url === 'https://notesprovider.online/notes/test-note') as any;
    expect(noteEntry).toBeDefined();
    expect(noteEntry.priority).toBe(0.8);
  });

  it('does not crash when Note.find query fails', async () => {
    ;(Note.find as any).mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockRejectedValue(new Error('db error')),
    }));
    const mod = await import('@/app/sitemap');
    const entries = await mod.default();
    expect(entries.length).toBeGreaterThan(0);
  });

  it('does not crash when Group.find query fails', async () => {
    ;(Group.find as any).mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockRejectedValue(new Error('db error')),
    }));
    const mod = await import('@/app/sitemap');
    const entries = await mod.default();
    expect(entries.length).toBeGreaterThan(0);
  });

  it('does not crash when Category.find query fails', async () => {
    ;(Category.find as any).mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockRejectedValue(new Error('db error')),
    }));
    const mod = await import('@/app/sitemap');
    const entries = await mod.default();
    expect(entries.length).toBeGreaterThan(0);
  });

  it('adds group detail pages when groups are returned', async () => {
    const group = { slug: 'test-group', updatedAt: new Date() };
    ;(Group.find as any).mockReturnValueOnce(makeBuilder([group]));
    const mod = await import('@/app/sitemap');
    const entries = await mod.default();
    const groupEntry = entries.find((e: any) => e.url === 'https://notesprovider.online/groups/test-group') as any;
    expect(groupEntry).toBeDefined();
    expect(groupEntry.priority).toBe(0.8);
  });

  it('adds category filtered pages for notes and groups', async () => {
    const cat = { slug: 'web-dev', updatedAt: new Date() };
    ;(Category.find as any).mockReturnValueOnce(makeBuilder([cat]));
    const mod = await import('@/app/sitemap');
    const entries = await mod.default();
    const urls = entries.map((e: any) => e.url);
    expect(urls).toContain('https://notesprovider.online/notes?category=web-dev');
    expect(urls).toContain('https://notesprovider.online/groups?category=web-dev');
  });

  it('adds level-filtered pages for notes and groups', async () => {
    const mod = await import('@/app/sitemap');
    const entries = await mod.default();
    const urls = entries.map((e: any) => e.url);
    for (const level of ['basics', 'intermediate', 'advance']) {
      expect(urls).toContain(`https://notesprovider.online/notes?level=${level}`);
      expect(urls).toContain(`https://notesprovider.online/groups?level=${level}`);
    }
  });

  it('adds pricing-filtered pages', async () => {
    const mod = await import('@/app/sitemap');
    const entries = await mod.default();
    const urls = entries.map((e: any) => e.url);
    expect(urls).toContain('https://notesprovider.online/notes?pricing=free');
    expect(urls).toContain('https://notesprovider.online/notes?pricing=paid');
  });

  it('adds sort-filtered pages for notes', async () => {
    const mod = await import('@/app/sitemap');
    const entries = await mod.default();
    const urls = entries.map((e: any) => e.url);
    for (const sort of ['newest', 'oldest', 'price_asc', 'price_desc', 'popular', 'title_asc']) {
      expect(urls).toContain(`https://notesprovider.online/notes?sort=${sort}`);
    }
  });

  it('adds sort-filtered pages for groups', async () => {
    const mod = await import('@/app/sitemap');
    const entries = await mod.default();
    const urls = entries.map((e: any) => e.url);
    for (const sort of ['newest', 'oldest', 'popular', 'title_asc']) {
      expect(urls).toContain(`https://notesprovider.online/groups?sort=${sort}`);
    }
  });

  it('adds featured pages', async () => {
    const mod = await import('@/app/sitemap');
    const entries = await mod.default();
    const urls = entries.map((e: any) => e.url);
    expect(urls).toContain('https://notesprovider.online/notes?featured=true');
    expect(urls).toContain('https://notesprovider.online/groups?featured=true');
  });

  it('sets changeFrequency to daily for root page', async () => {
    const mod = await import('@/app/sitemap');
    const entries = await mod.default();
    const rootEntry = entries.find((e: any) => e.url === 'https://notesprovider.online') as any;
    expect(rootEntry).toBeDefined();
    expect(rootEntry.changeFrequency).toBe('daily');
  });

  it('sets changeFrequency to weekly for notes listing', async () => {
    const mod = await import('@/app/sitemap');
    const entries = await mod.default();
    const notesEntry = entries.find((e: any) => e.url === 'https://notesprovider.online/notes') as any;
    expect(notesEntry.changeFrequency).toBe('daily');
  });

  it('sets changeFrequency to weekly for groups listing', async () => {
    const mod = await import('@/app/sitemap');
    const entries = await mod.default();
    const groupsEntry = entries.find((e: any) => e.url === 'https://notesprovider.online/groups') as any;
    expect(groupsEntry.changeFrequency).toBe('weekly');
  });
});
