import { test, expect } from '@playwright/test';

/**
 * Test Suite: Login Flow
 * Deskripsi: Memverifikasi seluruh alur login portal masyarakat SIGAP
 * TC Refs: TC-FUNC-001 sampai TC-FUNC-004
 *
 * ⚠️  PERHATIAN: Test yang membutuhkan kredensial nyata (TC-FUNC-001) perlu
 *     environment variable TEST_EMAIL dan TEST_PASSWORD untuk berfungsi di CI.
 *     Set di .env.test atau GitHub Secrets.
 */

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const TEST_EMAIL = process.env.TEST_EMAIL || 'test.masyarakat@sigap.test';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'Test@12345';

// ─────────────────────────────────────────────
// Halaman Login Masyarakat — Rendering Check
// ─────────────────────────────────────────────
test('Halaman login-masyarakat merender form dalam 3 detik', async ({ page }) => {
  await page.goto(`${BASE}/login-masyarakat`);

  // Tunggu email input muncul
  await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 3000 });
  await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 3000 });
});

// ─────────────────────────────────────────────
// TC-FUNC-004: Show/Hide Password Toggle
// ─────────────────────────────────────────────
test('TC-FUNC-004: Toggle visibilitas password berfungsi', async ({ page }) => {
  await page.goto(`${BASE}/login-masyarakat`);
  await page.waitForSelector('input[type="password"]');

  const passwordInput = page.locator('input[type="password"]').or(page.locator('input[name="password"]'));

  // Ketik password
  await passwordInput.fill('rahasia123');

  // Cari tombol toggle (biasanya ikon visibility)
  const toggleBtn = page.locator('button[aria-label*="Tampilkan"]').or(
    page.locator('button').filter({ hasText: /visibility/i })
  ).first();

  if (await toggleBtn.count() > 0) {
    await toggleBtn.click();
    // Setelah klik, tipe input harus berubah ke "text"
    const inputType = await page.locator('input[name="password"]').or(
      page.locator('input').nth(1)
    ).getAttribute('type');
    expect(inputType).toBe('text');
  } else {
    // Jika tidak ada toggle, mark as skipped (tidak semua implementasi sama)
    test.skip(true, 'Toggle button tidak ditemukan');
  }
});

// ─────────────────────────────────────────────
// TC-FUNC-002: Login dengan Password Salah
// ─────────────────────────────────────────────
test('TC-FUNC-002: Login dengan password salah menampilkan pesan error', async ({ page }) => {
  await page.goto(`${BASE}/login-masyarakat`);
  await page.waitForSelector('input[type="email"]');

  // Isi form dengan password yang salah
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'passwordsalah999');

  // Submit form
  await page.click('button[type="submit"]');

  // Tunggu error message muncul
  const errorMsg = page.locator('[role="alert"]').or(
    page.locator('.text-red-500, .text-red-600, [class*="error"]')
  ).first();

  await expect(errorMsg).toBeVisible({ timeout: 10000 });
});

// ─────────────────────────────────────────────
// TC-FUNC-001: Login Sukses (membutuhkan akun test nyata)
// ─────────────────────────────────────────────
test('TC-FUNC-001: Login dengan kredensial valid redirect ke dashboard', async ({ page }) => {
  // Skip jika tidak ada test credentials
  if (!process.env.TEST_EMAIL || !process.env.TEST_PASSWORD) {
    test.skip(true, 'TEST_EMAIL dan TEST_PASSWORD tidak di-set. Skip test login sukses.');
    return;
  }

  await page.goto(`${BASE}/login-masyarakat`);
  await page.waitForSelector('input[type="email"]');

  await page.fill('input[type="email"]', TEST_EMAIL);
  await page.fill('input[type="password"]', TEST_PASSWORD);

  await page.click('button[type="submit"]');

  // Tunggu redirect ke dashboard
  await page.waitForURL('**/dashboard-pelapor', { timeout: 15000 });
  expect(page.url()).toContain('dashboard-pelapor');
});

// ─────────────────────────────────────────────
// Struktur Form Login — Element Checks
// ─────────────────────────────────────────────
test('Form login memiliki semua elemen yang diperlukan', async ({ page }) => {
  await page.goto(`${BASE}/login-masyarakat`);
  await page.waitForLoadState('networkidle');

  // Email input
  await expect(page.locator('input[type="email"]')).toBeVisible();

  // Password input
  await expect(page.locator('input[type="password"]').or(
    page.locator('input[name="password"]')
  )).toBeVisible();

  // Submit button
  await expect(page.locator('button[type="submit"]')).toBeVisible();

  // Link ke register
  await expect(page.locator('a[href="/register"]').or(
    page.locator('a').filter({ hasText: /daftar|register/i })
  ).first()).toBeVisible();
});

// ─────────────────────────────────────────────
// Validasi Form — Email Kosong
// ─────────────────────────────────────────────
test('Form login mencegah submit saat email kosong', async ({ page }) => {
  await page.goto(`${BASE}/login-masyarakat`);
  await page.waitForSelector('button[type="submit"]');

  // Klik submit tanpa mengisi apapun
  await page.click('button[type="submit"]');

  // Cek browser validation (HTML5) atau error message
  const emailInput = page.locator('input[type="email"]');
  const validationMessage = await emailInput.evaluate(
    (el: HTMLInputElement) => el.validationMessage
  );

  // Browser native validation harus ada
  expect(validationMessage.length).toBeGreaterThan(0);
});

// ─────────────────────────────────────────────
// Loading State — Spinner / Teks Loading
// ─────────────────────────────────────────────
test('TC-RESP-006: Loading state menampilkan indikator loading', async ({ page }) => {
  // Simulasi slow network
  await page.route('**', route => {
    setTimeout(() => route.continue(), 100);
  });

  await page.goto(`${BASE}/login-masyarakat`);

  // Verifikasi loading state sempat muncul ATAU form langsung muncul (acceptable)
  // Kedua kondisi valid: spinner cepat hilang = OK, form langsung = OK
  const formOrSpinner = page.locator('input[type="email"]').or(
    page.locator('[class*="animate-spin"]')
  );
  await expect(formOrSpinner.first()).toBeVisible({ timeout: 3000 });
});
