import { test, expect } from '@playwright/test';

/**
 * Test Suite: SEO & Meta Tags
 * Deskripsi: Memverifikasi implementasi SEO pada SIGAP
 * TC Refs: TC-SEO-001 sampai TC-SEO-012
 */

const BASE = process.env.BASE_URL || 'http://localhost:3000';

// ─────────────────────────────────────────────
// TC-SEO-001: Title Tag Beranda
// ─────────────────────────────────────────────
test('TC-SEO-001: Beranda memiliki title yang benar', async ({ page }) => {
  await page.goto(BASE);
  const title = await page.title();
  expect(title).toContain('SIGAP');
});

// ─────────────────────────────────────────────
// TC-SEO-002: Meta Description Beranda
// ─────────────────────────────────────────────
test('TC-SEO-002: Beranda memiliki meta description (50-160 karakter)', async ({ page }) => {
  await page.goto(BASE);
  const description = await page.locator('meta[name="description"]').getAttribute('content');
  expect(description).toBeTruthy();
  expect(description!.length).toBeGreaterThanOrEqual(50);
  expect(description!.length).toBeLessThanOrEqual(160);
});

// ─────────────────────────────────────────────
// TC-SEO-003: Unique Titles per Page
// ─────────────────────────────────────────────
test('TC-SEO-003: Setiap halaman memiliki title yang unik', async ({ page }) => {
  const titles: Record<string, string> = {};

  const routes = ['/', '/progress', '/kontak-darurat', '/login-masyarakat'];

  for (const route of routes) {
    await page.goto(`${BASE}${route}`);
    titles[route] = await page.title();
  }

  // Semua title harus unik
  const uniqueTitles = new Set(Object.values(titles));
  expect(uniqueTitles.size).toBe(routes.length);
});

// ─────────────────────────────────────────────
// TC-SEO-004: Open Graph Tags
// ─────────────────────────────────────────────
test('TC-SEO-004: Beranda memiliki Open Graph tags yang lengkap', async ({ page }) => {
  await page.goto(BASE);

  const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
  const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
  const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
  const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');

  expect(ogTitle).toBeTruthy();
  expect(ogDescription).toBeTruthy();
  expect(ogImage).toBeTruthy();
  expect(ogType).toBe('website');
});

// ─────────────────────────────────────────────
// TC-SEO-005: Twitter Card Tags
// ─────────────────────────────────────────────
test('TC-SEO-005: Beranda memiliki Twitter Card tags', async ({ page }) => {
  await page.goto(BASE);

  const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
  const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');

  expect(twitterCard).toBeTruthy();
  expect(['summary', 'summary_large_image']).toContain(twitterCard);
  expect(twitterTitle).toBeTruthy();
});

// ─────────────────────────────────────────────
// TC-SEO-006: Sitemap.xml Accessible
// ─────────────────────────────────────────────
test('TC-SEO-006: Sitemap.xml dapat diakses dan berformat XML', async ({ page }) => {
  const response = await page.goto(`${BASE}/sitemap.xml`);
  expect(response?.status()).toBe(200);

  const contentType = response?.headers()['content-type'];
  expect(contentType).toContain('xml');

  // Periksa konten berisi URL utama
  const content = await page.content();
  expect(content).toContain('<loc>');
});

// ─────────────────────────────────────────────
// TC-SEO-007: Robots.txt Accessible
// ─────────────────────────────────────────────
test('TC-SEO-007: Robots.txt dapat diakses dan berisi directive benar', async ({ page }) => {
  const response = await page.goto(`${BASE}/robots.txt`);
  expect(response?.status()).toBe(200);

  const content = await page.content();
  // Verifikasi directive dasar
  expect(content).toContain('User-agent');
  expect(content).toContain('Sitemap');
});

// ─────────────────────────────────────────────
// TC-SEO-009: H1 Unik per Halaman
// ─────────────────────────────────────────────
test.describe('TC-SEO-009: Satu H1 per halaman yang relevan', () => {
  const pages = [
    { path: '/', expectedH1: /SIGAP/i },
    { path: '/progress', expectedH1: /Progres|Infrastruktur/i },
    { path: '/kontak-darurat', expectedH1: /Kontak|Darurat/i },
  ];

  for (const p of pages) {
    test(`H1 di ${p.path} relevan dengan konten`, async ({ page }) => {
      await page.goto(`${BASE}${p.path}`);
      await page.waitForLoadState('networkidle');

      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);

      const h1Text = await page.locator('h1').first().textContent();
      expect(h1Text).toMatch(p.expectedH1);
    });
  }
});

// ─────────────────────────────────────────────
// TC-SEO-011: Lang Attribute
// ─────────────────────────────────────────────
test('TC-SEO-011: HTML lang attribute bernilai "id"', async ({ page }) => {
  await page.goto(BASE);
  const lang = await page.locator('html').getAttribute('lang');
  expect(lang).toBe('id');
});

// ─────────────────────────────────────────────
// TC-SEO-008: Canonical URL
// ─────────────────────────────────────────────
test('TC-SEO-008: Canonical URL hadir', async ({ page }) => {
  await page.goto(BASE);
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(canonical).toBeTruthy();
  expect(canonical).toContain('sigap');
});

// ─────────────────────────────────────────────
// SEO: Tidak ada duplicate meta tags
// ─────────────────────────────────────────────
test('SEO: Tidak ada duplikasi meta description', async ({ page }) => {
  await page.goto(BASE);
  const descCount = await page.locator('meta[name="description"]').count();
  expect(descCount).toBe(1);
});
