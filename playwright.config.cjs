// playwright.config.cjs
// CI-stable config: boots backend + Next, waits up to 2 min.
const { defineConfig, devices } = require('@playwright/test');

const PORT_FRONT = process.env.PORT_FRONT || 3000;
const PORT_BACK  = process.env.PORT_BACK  || 5001;

module.exports = defineConfig({
  timeout: 30_000,
  expect: { timeout: 5_000 },
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: `http://127.0.0.1:${PORT_FRONT}`,
    trace: 'retain-on-failure',
  },
  webServer: [
    // 1) Backend
    {
      command: 'node backend/server.js',
      port: PORT_BACK,
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
      env: {
        PORT: String(PORT_BACK),
        DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/jardin_e2e',
        NODE_ENV: 'test',
      },
    },
    // 2) Next.js
    {
      command: 'npm run build && npm start',
      cwd: process.cwd(), // run at repo root
      port: PORT_FRONT,
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
      env: {
        NEXT_PUBLIC_API_URL: `http://127.0.0.1:${PORT_BACK}`,
        NODE_ENV: 'test',
        PORT: String(PORT_FRONT),
        NEXT_TELEMETRY_DISABLED: '1',
      },
    },
  ],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
});
