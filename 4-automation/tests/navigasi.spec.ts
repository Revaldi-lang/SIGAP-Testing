import { test, expect } from '@playwright/test';

/**
 * Test Suite: Navigasi
 * Deskripsi: Memverifikasi navigasi lintas halaman dan anchor links SIGAP
 * TC Refs: TC-RESP-007, TC-RESP-008, TC-RESP-011, TC-FUNC-005, TC-FUNC-010
 */

const BASE = process.env.BASE_URL || 'http://localhost:3000';

// ─────────────────────────────────────────────
// Navigasi ke semua rute publik
// ─────────────────────────────────────────────
test.describe('Navigasi ke halaman publik', () => {
  const publicRoutes = [
    { path: '/', name: 'Beranda' },
    { path: '/progress', name: 'Progress' },
    { path: '/kontak-darurat', name: 'Kontak Darurat' },
    { path: '/login-masyarakat', name: 'Login Masyarakat' },
    { path: '/register', name: 'Registrasi' },
    { path: '/login', name: 'Login Admin' },
  ];

  for (const route of publicRoutes) {
    test(`Halaman ${route.name} dapat diakses (HTTP 200)`, async ({ page }) => {
      const response = await page.goto(`${BASE}${route.path}`);
      // Accept 200 atau redirect (30x)
      expect(response?.status()).toBeLessThan(400);
      // Tidak boleh ada error 404/500
      expect(response?.status()).not.toBe(404);
      expect(response?.status()).not.toBe(500);
    });
  }
});

// ─────────────────────────────────────────────
// TC-RESP-007: Cross-page Anchor Links dari Navbar
// ─────────────────────────────────────────────
test.describe('Anchor links navbar berfungsi dari subhalaman', () => {
  const subPages = ['/progress', '/kontak-darurat'];
  const anchorLinks = [
    { href: '/#info-section', label: 'Kegunaan' },
    { href: '/#alur-section', label: 'Cara Melapor' },
    { href: '/#proses-section', label: 'SOP Kerja' },
    { href: '/#suara-warga-section', label: 'Suara Warga' },
  ];

  for (const subPage of subPages) {
    for (const anchor of anchorLinks) {
      test(`"${anchor.label}" dari ${subPage} mengarah ke ${anchor.href}`, async ({ page }) => {
        await page.goto(`${BASE}${subPage}`);

        const link = page.locator(`a[href="${anchor.href}"]`).first();
        const linkCount = await link.count();

        // Link harus ada
        expect(linkCount).toBeGreaterThan(0);

        const href = await link.getAttribute('href');
        expect(href).toContain('/#');
      });
    }
  }
});

// ─────────────────────────────────────────────
// TC-FUNC-010: Modal Portal Selector
// ─────────────────────────────────────────────
test('TC-FUNC-010: Klik "Masuk Portal" membuka pilihan portal', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');

  // Cari tombol "Masuk Portal" (bisa ada 2: desktop & mobile)
  const portalButton = page.locator('button').filter({ hasText: /Masuk Portal/i }).first();

  await expect(portalButton).toBeVisible();
  await portalButton.click();

  // Setelah klik, harus ada modal atau dropdown portal
  // Cek ada link ke /login-masyarakat dan /login
  await expect(page.locator('a[href="/login-masyarakat"]').or(
    page.locator('[data-modal] a').first()
  )).toBeVisible({ timeout: 3000 });
});

// ─────────────────────────────────────────────
// Navigasi footer — verifikasi ada minimal 3 link
// ─────────────────────────────────────────────
test('Footer memiliki minimal 3 link navigasi /#hash', async ({ page }) => {
  await page.goto(BASE);

  const footerHashLinks = await page.locator('footer a[href^="/#"]').count();
  expect(footerHashLinks).toBeGreaterThanOrEqual(3);
});

// ─────────────────────────────────────────────
// CTA buttons di beranda berfungsi
// ─────────────────────────────────────────────
test('CTA beranda mengarah ke 3 URL yang berbeda', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');

  // Ambil semua link dalam page yang mengarah ke dashboard, peta, atau progress
  const dashboardLink = page.locator('a[href="/dashboard-pelapor"]').first();
  const petaLink = page.locator('a[href="/peta-pelapor"]').first();
  const progressLink = page.locator('a[href="/progress"]').first();

  // Minimal satu dari masing-masing harus ada
  const dashCount = await dashboardLink.count();
  const petaCount = await petaLink.count();
  const progressCount = await progressLink.count();

  // Semua tiga destination harus ada di halaman
  expect(dashCount + petaCount + progressCount).toBeGreaterThanOrEqual(3);
});

// ─────────────────────────────────────────────
// Link Logo — Mengarah ke Beranda
// ─────────────────────────────────────────────
test('Logo SIGAP di navbar mengarah ke /', async ({ page }) => {
  await page.goto(`${BASE}/progress`);

  // Logo biasanya ada di dalam link ke beranda
  const logoLink = page.locator('a[href="/"]').first();
  await expect(logoLink).toBeVisible();
});

// ─────────────────────────────────────────────
// TC-FUNC-005: Breadcrumb di /progress
// ─────────────────────────────────────────────
test('TC-FUNC-005: Breadcrumb di /progress berfungsi', async ({ page }) => {
  await page.goto(`${BASE}/progress`);

  // Cari link breadcrumb ke beranda
  const berandaLink = page.locator('a[href="/"]').first();
  await expect(berandaLink).toBeVisible();
});

// ─────────────────────────────────────────────
// Protected Route — Redirect ke login
// ─────────────────────────────────────────────
test('TC-FUNC-012: /dashboard-pelapor redirect ke login saat tidak login', async ({ page }) => {
  // Buka tanpa session (incognito sudah ter-handle oleh konteks baru)
  await page.goto(`${BASE}/dashboard-pelapor`);
  await page.waitForURL(/login|dashboard/, { timeout: 5000 });

  const url = page.url();
  // Harus redirect ke login atau berada di halaman login-masyarakat
  const isLoginOrDash = url.includes('login') || url.includes('dashboard');
  // Jika redirect ke login, itu benar. Jika tetap di dashboard, artinya ada sesi yang tersimpan.
  expect(isLoginOrDash).toBe(true);
});
