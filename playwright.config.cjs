const { defineConfig, devices } = require('@playwright/test');

const isCI = !!process.env.CI;
const PORT_FRONT = String(process.env.PORT_FRONT || 3000);
const PORT_BACK  = String(process.env.PORT_BACK  || 5001);

module.exports = defineConfig({
  timeout: 30_000,
  expect: { timeout: 5_000 },
  retries: isCI ? 1 : 0,
  use: {
    baseURL: `http://127.0.0.1:${PORT_FRONT}`,
    trace: 'retain-on-failure',
  },

  // ⬇️ Start API from /backend and Next from /frontend
  webServer: [
    {
      command: `bash -lc 'cd backend && node server.js'`,
      url: `http://127.0.0.1:${PORT_BACK}`,
      timeout: 120_000,
      reuseExistingServer: !isCI,
      env: {
        PORT: PORT_BACK,
        DATABASE_URL:
          process.env.DATABASE_URL ||
          'postgresql://postgres:postgres@localhost:5432/jardin_e2e',
        NODE_ENV: 'test',
      },
    },
    {
      command: `bash -lc 'cd frontend && npx next dev -p ${PORT_FRONT} .'`,
      url: `http://127.0.0.1:${PORT_FRONT}`,
      timeout: 120_000,
      reuseExistingServer: !isCI,
      env: {
        NEXT_PUBLIC_API_URL: `http://127.0.0.1:${PORT_BACK}`,
        NODE_ENV: 'test',
        PORT: PORT_FRONT,
        NEXT_TELEMETRY_DISABLED: '1',
      },
    },
  ],

  projects: [
    { name: 'chromium',      use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
});
