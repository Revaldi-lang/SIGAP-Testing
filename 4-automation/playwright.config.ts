import { defineConfig, devices } from '@playwright/test';

/**
 * Konfigurasi Playwright untuk SIGAP QA Automation
 * Referensi: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  // Jalankan test secara paralel
  fullyParallel: true,

  // Gagalkan CI jika ada test.only yang tertinggal
  forbidOnly: !!process.env.CI,

  // Retry di CI
  retries: process.env.CI ? 2 : 0,

  // Worker di CI, local gunakan semua CPU
  workers: process.env.CI ? 1 : undefined,

  // Reporter: HTML report untuk review, line untuk CI
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  // Shared settings untuk semua project
  use: {
    // URL dasar — gunakan production atau localhost
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Rekam trace pada retry pertama
    trace: 'on-first-retry',

    // Screenshot saat fail
    screenshot: 'only-on-failure',

    // Video saat fail
    video: 'retain-on-failure',

    // Locale Indonesia
    locale: 'id-ID',

    // Timezone WIB
    timezoneId: 'Asia/Jakarta',
  },

  // Global timeout
  timeout: 30_000,

  // Assertion timeout
  expect: {
    timeout: 5_000,
  },

  // Konfigurasi project untuk berbagai browser & viewport
  projects: [
    // --- Desktop Browsers ---
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit-desktop',
      use: { ...devices['Desktop Safari'] },
    },

    // --- Mobile Viewports ---
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },

    // --- Tablet ---
    {
      name: 'tablet-ipad',
      use: { ...devices['iPad (gen 7)'] },
    },
  ],

  // Setup server lokal (opsional — uncomment jika test di lokal)
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
