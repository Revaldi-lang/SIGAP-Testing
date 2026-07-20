import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Test Suite: Aksesibilitas (a11y)
 * Deskripsi: Memverifikasi aksesibilitas SIGAP sesuai WCAG 2.1 Level AA
 * TC Refs: TC-A11Y-001 sampai TC-A11Y-015
 * Tools: axe-core via @axe-core/playwright
 */

const BASE = process.env.BASE_URL || 'http://localhost:3000';

// ─────────────────────────────────────────────
// TC-A11Y-001 & TC-A11Y-010: Ikon Tanpa Aria-Hidden
// ─────────────────────────────────────────────
test('TC-A11Y-001: Semua ikon Material Symbols dekoratif memiliki aria-hidden', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');

  // Cari semua ikon tanpa aria-hidden yang TIDAK berada di dalam elemen aria-hidden
  const iconsWithoutAriaHidden = await page.evaluate(() => {
    const icons = Array.from(document.querySelectorAll('.material-symbols-outlined'));
    return icons
      .filter(el => {
        // Skip jika element ini atau parentnya memiliki aria-hidden
        let node: Element | null = el;
        while (node) {
          if (node.getAttribute('aria-hidden') === 'true') return false;
          node = node.parentElement;
        }
        return true;
      })
      .filter(el => !el.hasAttribute('aria-hidden'))
      .map(el => el.textContent?.trim());
  });

  expect(iconsWithoutAriaHidden.length).toBe(0);
});

// ─────────────────────────────────────────────
// TC-A11Y-002: Aria-Label Hamburger Button
// ─────────────────────────────────────────────
test('TC-A11Y-002: Tombol hamburger memiliki aria-label', async ({ page, viewport }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(BASE);

  const hamburger = page.locator('button[aria-label]').filter({
    hasText: /menu|close/i,
  }).or(
    page.locator('button[aria-expanded]')
  ).first();

  const ariaLabel = await hamburger.getAttribute('aria-label');
  expect(ariaLabel).toBeTruthy();
  expect(ariaLabel?.length).toBeGreaterThan(3);
});

// ─────────────────────────────────────────────
// TC-A11Y-004: Satu H1 per Halaman
// ─────────────────────────────────────────────
test.describe('TC-A11Y-004: Tepat satu H1 per halaman', () => {
  const pages = [
    { path: '/', name: 'Beranda' },
    { path: '/progress', name: 'Progress' },
    { path: '/kontak-darurat', name: 'Kontak Darurat' },
  ];

  for (const p of pages) {
    test(`Halaman ${p.name} memiliki tepat 1 H1`, async ({ page }) => {
      await page.goto(`${BASE}${p.path}`);
      await page.waitForLoadState('networkidle');
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });
  }
});

// ─────────────────────────────────────────────
// TC-A11Y-005: Alt Text pada Gambar Informatif
// ─────────────────────────────────────────────
test('TC-A11Y-005: Gambar informatif memiliki alt text', async ({ page }) => {
  await page.goto(BASE);

  // Cari gambar yang tidak dalam area aria-hidden dan tidak memiliki alt
  const imgsWithoutAlt = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img'))
      .filter(img => {
        // Skip jika dalam aria-hidden
        let node: Element | null = img;
        while (node) {
          if (node.getAttribute('aria-hidden') === 'true') return false;
          node = node.parentElement;
        }
        return true;
      })
      .filter(img => img.alt === undefined || img.alt === null)
      .map(img => img.src);
  });

  expect(imgsWithoutAlt.length).toBe(0);
});

// ─────────────────────────────────────────────
// TC-A11Y-006: Statistik Semantik (dl/dt/dd)
// ─────────────────────────────────────────────
test('TC-A11Y-006: Section statistik menggunakan elemen semantik dl', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');

  // Verifikasi ada dl dengan statistik
  const dlWithStats = page.locator('dl[aria-label*="Statistik"]');
  const count = await dlWithStats.count();
  expect(count).toBeGreaterThanOrEqual(1);

  // Verifikasi dl berisi dt dan dd
  const dtCount = await dlWithStats.locator('dt').count();
  const ddCount = await dlWithStats.locator('dd').count();
  expect(dtCount).toBeGreaterThanOrEqual(1);
  expect(ddCount).toBeGreaterThanOrEqual(1);
});

// ─────────────────────────────────────────────
// TC-A11Y-008: Keyboard Navigation
// ─────────────────────────────────────────────
test('TC-A11Y-008: Elemen interaktif dapat difocus dengan keyboard', async ({ page }) => {
  await page.goto(`${BASE}/login-masyarakat`);
  await page.waitForLoadState('networkidle');

  // Tab ke email input
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  // Verifikasi ada elemen yang terfocus
  const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
  expect(['INPUT', 'BUTTON', 'A']).toContain(focusedElement);
});

// ─────────────────────────────────────────────
// TC-A11Y-011: CTA Links — Berbeda URL
// ─────────────────────────────────────────────
test('TC-A11Y-011: Tiga CTA card mengarah ke URL yang berbeda', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');

  // Dapatkan semua link di section info (CTA cards)
  const ctaLinks = await page.locator('section a[href]').evaluateAll(links =>
    links
      .map(link => link.getAttribute('href'))
      .filter(href => href && href.startsWith('/'))
  );

  // Verifikasi ada minimal 3 link berbeda
  const uniqueLinks = [...new Set(ctaLinks)];
  expect(uniqueLinks.length).toBeGreaterThanOrEqual(3);

  // Pastikan tidak semua mengarah ke satu URL yang sama
  const allSame = ctaLinks.every(link => link === ctaLinks[0]);
  expect(allSame).toBe(false);
});

// ─────────────────────────────────────────────
// TC-A11Y-013: Landmark Regions
// ─────────────────────────────────────────────
test('TC-A11Y-013: Halaman memiliki landmark HTML5 (nav, main, footer)', async ({ page }) => {
  await page.goto(BASE);

  expect(await page.locator('nav').count()).toBeGreaterThanOrEqual(1);
  expect(await page.locator('main').count()).toBe(1);
  expect(await page.locator('footer').count()).toBe(1);
});

// ─────────────────────────────────────────────
// TC-A11Y-015: axe-core Automated Scan
// ─────────────────────────────────────────────
test.describe('TC-A11Y-015: axe-core scan — tidak ada critical/serious violations', () => {
  const pagesToTest = [
    { path: '/', name: 'Beranda' },
    { path: '/progress', name: 'Progress' },
    { path: '/kontak-darurat', name: 'Kontak Darurat' },
  ];

  for (const p of pagesToTest) {
    test(`axe-core: ${p.name} (${p.path})`, async ({ page }) => {
      await page.goto(`${BASE}${p.path}`);
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // Filter hanya critical dan serious
      const criticalViolations = results.violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
      );

      if (criticalViolations.length > 0) {
        console.log('Violations found:');
        criticalViolations.forEach(v => {
          console.log(`  - [${v.impact}] ${v.id}: ${v.description}`);
          v.nodes.forEach(n => console.log(`    Node: ${n.html}`));
        });
      }

      expect(criticalViolations.length).toBe(0);
    });
  }
});

// ─────────────────────────────────────────────
// BONUS: Full axe-core scan untuk login page
// ─────────────────────────────────────────────
test('axe-core: Login Masyarakat tidak ada critical violations', async ({ page }) => {
  await page.goto(`${BASE}/login-masyarakat`);
  // Tunggu form muncul
  await page.waitForSelector('input[type="email"]', { timeout: 5000 });

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  const criticalViolations = results.violations.filter(
    v => v.impact === 'critical' || v.impact === 'serious'
  );

  expect(criticalViolations.length).toBe(0);
});
