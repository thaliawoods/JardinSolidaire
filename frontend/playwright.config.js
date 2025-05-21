// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'src/testsE2E',      // où vivent vos specs
  timeout: 30 * 1000,           // 30s par test max
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,             // mode sans interface
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10 * 1000,
    ignoreHTTPSErrors: true,
  },

  // → Lance d'abord votre backend puis votre frontend
  webServer: [
    {
      command: 'cd backend && npm run dev',
      port: 5000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'cd frontend && npm run dev',
      port: 3000,
      reuseExistingServer: !process.env.CI,
    }
  ],

  // Forcer Playwright à attendre que le front soit up
  // avant de lancer les tests
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html']] : [['list'], ['html']],
});
