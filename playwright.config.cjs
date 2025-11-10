// Root config for CI + local
const { defineConfig, devices } = require('@playwright/test');

const isCI = !!process.env.CI;

module.exports = defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  retries: isCI ? 1 : 0,
  reporter: isCI ? [['list'], ['html']] : [['list'], ['html']],

  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    actionTimeout: 10_000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],

  // Start API first, then frontend. Use build output (npm run build in CI step).
  webServer: [
    {
      // run backend from repo root
      command: 'bash -lc "cd backend && node server.js"',
      port: 5001,
      timeout: 120_000,
      reuseExistingServer: !isCI,
      env: {
        DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/jardin',
        NODE_ENV: 'test',
      },
    },
    {
      command: 'npm run start', // Next "start" (after build)
      port: 3000,
      timeout: 120_000,
      reuseExistingServer: !isCI,
      env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001',
        NODE_ENV: 'test',
      },
    },
  ],
});
