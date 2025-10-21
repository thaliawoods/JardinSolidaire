import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'src/testsE2E',     
  timeout: 30 * 1000,         
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,            
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10 * 1000,
    ignoreHTTPSErrors: true,
  },

  webServer: [
    {
      command: 'cd ../backend && npm run dev',
      port:    5001,
      reuseExistingServer: true,
      env: {
          DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/jardin'
        }
    },
    {
      command: 'npm run dev',       
      port:    3000,
      reuseExistingServer: true,
    },
  ],


  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html']] : [['list'], ['html']],
});
