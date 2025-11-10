const { test } = require('@playwright/test');
const AUTH_ENABLED = process.env.E2E_AUTH === '1';

// Skip in CI by default
(AUTH_ENABLED ? test : test.skip)('create auth state', async ({ page }) => {
  await page.goto('/login'); // adjust if /connexion
  // TODO: implement when we enable auth in CI
});
