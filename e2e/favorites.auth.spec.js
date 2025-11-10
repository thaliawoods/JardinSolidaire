const { test, expect } = require('@playwright/test');
const AUTH_ENABLED = process.env.E2E_AUTH === '1';

(AUTH_ENABLED ? test : test.skip)('user can favorite a garden when logged in', async ({ page }) => {
  await page.goto('/gardens');
  // TODO: add data-testid="fav-btn" in UI then assert toggle
});
