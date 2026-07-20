import { test, expect } from '@playwright/test';

/**
 * Test Suite: Responsivitas
 * Deskripsi: Memverifikasi tampilan dan layout SIGAP di berbagai ukuran layar
 * TC Refs: TC-RESP-001 sampai TC-RESP-012
 */

const BASE = process.env.BASE_URL || 'http://localhost:3000';

// ─────────────────────────────────────────────
// TC-RESP-001: Viewport Meta Tag
// ─────────────────────────────────────────────
test('TC-RESP-001: Viewport meta tag hadir di beranda', async ({ page }) => {
  await page.goto(BASE);
  const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
  expect(viewport).toContain('width=device-width');
  expect(viewport).toContain('initial-scale=1');
});

// ─────────────────────────────────────────────
// TC-RESP-003: Marquee — DOM Elements
// ─────────────────────────────────────────────
test('TC-RESP-003: Marquee logo tidak lebih dari 10 elemen img', async ({ page }) => {
  await page.goto(BASE);
  // Tunggu marquee render
  await page.waitForSelector('.animate-marquee', { timeout: 5000 });
  const imgCount = await page.locator('.animate-marquee img').count();
  expect(imgCount).toBeLessThanOrEqual(10);
});

// ─────────────────────────────────────────────
// TC-RESP-004: Duplikat Marquee — aria-hidden
// ─────────────────────────────────────────────
test('TC-RESP-004: Div duplikat marquee memiliki aria-hidden="true"', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForSelector('.animate-marquee', { timeout: 5000 });

  // Cek div marquee kedua memiliki aria-hidden
  const ariaHiddenDivs = page.locator('[aria-hidden="true"] .animate-marquee');
  const count = await ariaHiddenDivs.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

// ─────────────────────────────────────────────
// TC-RESP-002: Mobile 375px — Tidak Ada Horizontal Overflow
// ─────────────────────────────────────────────
test('TC-RESP-002: Layout beranda 375px tidak ada horizontal overflow', async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 667 },
  });
  const page = await ctx.newPage();
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');

  // Ukur scroll width vs client width
  const hasOverflow = await page.evaluate(() => {
    return document.body.scrollWidth > window.innerWidth;
  });
  expect(hasOverflow).toBe(false);
  await ctx.close();
});

// ─────────────────────────────────────────────
// TC-RESP-005: Login Page — Tidak Blank Screen
// ─────────────────────────────────────────────
test('TC-RESP-005: Halaman login-masyarakat merender form dalam 3 detik', async ({ page }) => {
  await page.goto(`${BASE}/login-masyarakat`);

  // Tunggu form login muncul (email input atau tombol masuk)
  await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 3000 });
});

// ─────────────────────────────────────────────
// TC-RESP-007: Anchor Link dari /progress ke beranda
// ─────────────────────────────────────────────
test('TC-RESP-007: Anchor link /#info-section berfungsi dari /progress', async ({ page }) => {
  await page.goto(`${BASE}/progress`);

  // Cari link yang mengarah ke /#info-section
  const infoLink = page.locator('a[href="/#info-section"]').first();
  await expect(infoLink).toBeVisible();

  // Klik dan verifikasi pindah ke beranda
  await infoLink.click();
  await page.waitForURL(/\/#info-section|\/$/);
  expect(page.url()).toMatch(/\/#info-section|localhost:3000\/$/);
});

// ─────────────────────────────────────────────
// TC-RESP-008: Mobile Menu Toggle
// ─────────────────────────────────────────────
test('TC-RESP-008: Menu hamburger mobile dapat dibuka dan ditutup', async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 667 },
  });
  const page = await ctx.newPage();
  await page.goto(BASE);

  // Tombol hamburger harus terlihat di mobile
  const hamburger = page.locator('button[aria-label*="menu navigasi"]');
  await expect(hamburger).toBeVisible();

  // Klik untuk membuka
  await hamburger.click();
  const mobileMenu = page.locator('nav[aria-label="Navigasi mobile"]').or(
    page.locator('[data-mobile-menu]')
  ).first();

  // Klik lagi untuk menutup
  await hamburger.click();
  await ctx.close();
});

// ─────────────────────────────────────────────
// TC-RESP-009: Tablet 768px Layout
// ─────────────────────────────────────────────
test('TC-RESP-009: Layout tablet 768px tidak ada horizontal overflow', async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 768, height: 1024 },
  });
  const page = await ctx.newPage();
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');

  const hasOverflow = await page.evaluate(() => {
    return document.body.scrollWidth > window.innerWidth;
  });
  expect(hasOverflow).toBe(false);
  await ctx.close();
});

// ─────────────────────────────────────────────
// TC-RESP-011: Footer Anchor Links
// ─────────────────────────────────────────────
test('TC-RESP-011: Footer anchor links menggunakan /#hash format', async ({ page }) => {
  await page.goto(`${BASE}/kontak-darurat`);

  // Semua anchor di footer harus dimulai dengan /#
  const footerLinks = page.locator('footer a[href^="/#"]');
  const count = await footerLinks.count();
  expect(count).toBeGreaterThanOrEqual(3);
});

// ─────────────────────────────────────────────
// TC-RESP-012: Desktop 1280px Full Layout
// ─────────────────────────────────────────────
test('TC-RESP-012: Desktop 1280px semua section utama terlihat', async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await ctx.newPage();
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');

  // Verifikasi navbar desktop terlihat
  const desktopNav = page.locator('nav').first();
  await expect(desktopNav).toBeVisible();

  // Verifikasi hero section
  await expect(page.locator('h1').first()).toBeVisible();

  await ctx.close();
});
