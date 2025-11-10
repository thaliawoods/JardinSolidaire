// playwright.config.cjs
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
  // 🔒 Use an absolute path so there's zero ambiguity
  testDir: path.join(__dirname, 'e2e'),

  // 🔎 Force a simple pattern (only *.spec.js)
  testMatch: '**/*.spec.js',

  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  webServer: [
    {
      command: 'cd backend && npm run dev',
      port: 5001,
      reuseExistingServer: true,
      env: {
        DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/jardin'
      }
    },
    {
      command: 'npm run dev', // Next dev at root
      port: 3000,
      reuseExistingServer: true
    }
  ],

projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  // runs once to produce storage state
  { name: 'setup-auth', testMatch: /fixtures\/auth\.setup\.js/ },
  // any tests that require login end with .auth.spec.js
  {
    name: 'chromium-auth',
    use: { ...devices['Desktop Chrome'], storageState: 'e2e/.auth/state.json' },
    testMatch: /.*\.auth\.spec\.js$/,
    dependencies: ['setup-auth']
  },
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } }
]
});
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },

  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10_000,
    ignoreHTTPSErrors: true,
  },

  // Start prod-like servers (not `next dev`)
  webServer: [
    {
      command: 'node server.js',
      port: 5001,
      reuseExistingServer: true,
      cwd: 'backend',
      timeout: 120_000
    },
    {
      command: 'NEXT_PUBLIC_API_URL=http://localhost:5001 npm run start',
      port: 3000,
      reuseExistingServer: true,
      timeout: 120_000
    }
  ],

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
    // Only include auth project locally
    ...(process.env.E2E_AUTH === '1'
      ? [{ name: 'setup-auth', use: { ...devices['Desktop Chrome'] } }]
      : [])
  ],
});
