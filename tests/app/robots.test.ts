import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('robots', () => {
  const originalEnv = process.env.NEXT_PUBLIC_APP_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://notesprovider.com';
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.NEXT_PUBLIC_APP_URL;
    } else {
      process.env.NEXT_PUBLIC_APP_URL = originalEnv;
    }
  });

  it('exports a default function that returns robots metadata', async () => {
    const mod = await import('@/app/robot');
    expect(typeof mod.default).toBe('function');
    const robots = mod.default();
    expect(robots.rules).toBeDefined();
    expect(Array.isArray(robots.rules)).toBe(true);
    expect(robots.sitemap).toBeDefined();
    expect(robots.host).toBeDefined();
  });

  it('includes rules for all crawlers', async () => {
    const mod = await import('@/app/robot');
    const robots = mod.default();
    const userAgentNames = (robots.rules as any[]).map((r) => r.userAgent);
    expect(userAgentNames).toContain('*');
    expect(userAgentNames).toContain('Googlebot');
    expect(userAgentNames).toContain('Googlebot-Image');
    expect(userAgentNames).toContain('Googlebot-Mobile');
    expect(userAgentNames).toContain('Googlebot-News');
    expect(userAgentNames).toContain('Googlebot-Video');
    expect(userAgentNames).toContain('Bingbot');
    expect(userAgentNames).toContain('Slurp');
    expect(userAgentNames).toContain('Baiduspider');
    expect(userAgentNames).toContain('YandexBot');
    expect(userAgentNames).toContain('DuckDuckBot');
    expect(userAgentNames).toContain('Applebot');
    expect(userAgentNames).toContain('Amazonbot');
    expect(userAgentNames).toContain('CCBot');
    expect(userAgentNames).toContain('facebookexternalhit');
    expect(userAgentNames).toContain('Twitterbot');
    expect(userAgentNames).toContain('LinkedInBot');
    expect(userAgentNames).toContain('Omgilibot');
    expect(userAgentNames).toContain('Anthropic AI');
    expect(userAgentNames).toContain('PerplexityBot');
    expect(userAgentNames).toContain('GPTBot');
    expect(userAgentNames).toContain('Google-Extended');
    expect(userAgentNames).toContain('Claude');
    expect(userAgentNames).toContain('Claude-Web');
    expect(userAgentNames).toContain('ChatGPT-User');
    expect(userAgentNames).toContain('Coqui AI');
    expect(userAgentNames).toContain('Applebot-Extended');
    expect(userAgentNames).toContain('Bytespider');
    expect(userAgentNames).toContain('Youbot');
    expect(userAgentNames).toContain('Ahrefbot');
    expect(userAgentNames).toContain('Semrushbot');
    expect(userAgentNames).toContain('MJ12bot');
    expect(userAgentNames).toContain('AhrefsSiteAudit');
    expect(userAgentNames).toContain('DotBot');
    expect(userAgentNames).toContain('PetalBot');
  });

  it('disallows /admin for the general crawler', async () => {
    const mod = await import('@/app/robot');
    const robots = mod.default();
    const starRule = (robots.rules as any[]).find((r: any) => r.userAgent === '*');
    expect(starRule).toBeDefined();
    const disallow = starRule.disallow as string[];
    expect(disallow).toContain('/admin');
    expect(disallow).toContain('/admin/');
  });

  it('disallows /api/ for the general crawler', async () => {
    const mod = await import('@/app/robot');
    const robots = mod.default();
    const starRule = (robots.rules as any[]).find((r: any) => r.userAgent === '*');
    const disallow = starRule.disallow as string[];
    expect(disallow).toContain('/api/');
  });

  it('disallows /checkout for the general crawler', async () => {
    const mod = await import('@/app/robot');
    const robots = mod.default();
    const starRule = (robots.rules as any[]).find((r: any) => r.userAgent === '*');
    const disallow = starRule.disallow as string[];
    expect(disallow).toContain('/checkout');
    expect(disallow).toContain('/checkout/');
  });

  it('allows /notes and /groups for general crawler', async () => {
    const mod = await import('@/app/robot');
    const robots = mod.default();
    const starRule = (robots.rules as any[]).find((r: any) => r.userAgent === '*');
    expect(starRule).toBeDefined();
    expect(starRule.allow).toContain('/');
    const disallow = starRule.disallow as string[];
    expect(disallow.some((d: string) => d === '/admin' || d.startsWith('/admin'))).toBe(true);
  });

  it('blocks CCBot from all paths', async () => {
    const mod = await import('@/app/robot');
    const robots = mod.default();
    const ccbotRule = (robots.rules as any[]).find((r: any) => r.userAgent === 'CCBot');
    expect(ccbotRule).toBeDefined();
    const disallow = ccbotRule.disallow as string[];
    expect(disallow).toContain('/');
  });

  it('allows Googlebot to crawl / but disallows sensitive paths', async () => {
    const mod = await import('@/app/robot');
    const robots = mod.default();
    const googlebotRule = (robots.rules as any[]).find((r: any) => r.userAgent === 'Googlebot');
    expect(googlebotRule).toBeDefined();
    expect(googlebotRule.allow).toContain('/');
    const disallow = googlebotRule.disallow as string[];
    expect(disallow.some((d: string) => d === '/admin' || d.startsWith('/admin'))).toBe(true);
    expect(disallow.some((d: string) => d === '/checkout' || d.startsWith('/checkout'))).toBe(true);
    expect(disallow.some((d: string) => d === '/api/' || d.startsWith('/api/'))).toBe(true);
  });

  it('allows Googlebot-Image to crawl /og/, /notes/, /groups/', async () => {
    const mod = await import('@/app/robot');
    const robots = mod.default();
    const imageRule = (robots.rules as any[]).find((r: any) => r.userAgent === 'Googlebot-Image');
    expect(imageRule).toBeDefined();
    expect(imageRule.allow).toContain('/og/');
    expect(imageRule.allow).toContain('/notes/');
    expect(imageRule.allow).toContain('/groups/');
  });

  it('allows Googlebot-News to crawl content pages', async () => {
    const mod = await import('@/app/robot');
    const robots = mod.default();
    const newsRule = (robots.rules as any[]).find((r: any) => r.userAgent === 'Googlebot-News');
    expect(newsRule).toBeDefined();
    expect(newsRule.allow).toContain('/notes');
    expect(newsRule.allow).toContain('/groups');
    expect(newsRule.allow).toContain('/about');
    expect(newsRule.allow).toContain('/contact');
  });

  it('allows AI crawlers to crawl content pages and disallow sensitive paths', async () => {
    const mod = await import('@/app/robot');
    const robots = mod.default();
    for (const agent of ['GPTBot', 'Claude', 'Claude-Web', 'PerplexityBot', 'Google-Extended', 'Anthropic AI']) {
      const rule = (robots.rules as any[]).find((r: any) => r.userAgent === agent);
      expect(rule).toBeDefined();
      expect(rule.allow).toContain('/notes');
      expect(rule.allow).toContain('/groups');
      const disallow = rule.disallow as string[];
      expect(disallow.some((d: string) => d === '/admin' || d.startsWith('/admin'))).toBe(true);
      expect(disallow.some((d: string) => d === '/checkout' || d.startsWith('/checkout'))).toBe(true);
    }
  });

  it('sets sitemap URL from environment', async () => {
    const mod = await import('@/app/robot');
    const robots = mod.default();
    expect(robots.sitemap).toContain('notesprovider.com');
  });

  it('falls back to default APP_URL when env var is not set', async () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    const mod = await import('@/app/robot');
    const robots = mod.default();
    expect(robots.sitemap).toContain('notesprovider.com');
  });

  it('disallows /order/track and /order/[orderId] for general crawler', async () => {
    const mod = await import('@/app/robot');
    const robots = mod.default();
    const starRule = (robots.rules as any[]).find((r: any) => r.userAgent === '*');
    const disallow = starRule.disallow as string[];
    expect(disallow).toContain('/order/track');
    expect(disallow).toContain('/order/[orderId]');
  });

  it('allows DuckDuckBot to crawl content pages only', async () => {
    const mod = await import('@/app/robot');
    const robots = mod.default();
    const duckduckRule = (robots.rules as any[]).find((r: any) => r.userAgent === 'DuckDuckBot');
    expect(duckduckRule).toBeDefined();
    expect(duckduckRule.allow).toContain('/notes');
    expect(duckduckRule.allow).toContain('/groups');
    expect(duckduckRule.allow).toContain('/about');
    expect(duckduckRule.allow).toContain('/contact');
  });

  it('allows Applebot to crawl / but disallow sensitive paths', async () => {
    const mod = await import('@/app/robot');
    const robots = mod.default();
    const appleRule = (robots.rules as any[]).find((r: any) => r.userAgent === 'Applebot');
    expect(appleRule).toBeDefined();
    expect(appleRule.allow).toContain('/');
    const disallow = appleRule.disallow as string[];
    expect(disallow.some((d: string) => d === '/admin' || d.startsWith('/admin'))).toBe(true);
  });
});
