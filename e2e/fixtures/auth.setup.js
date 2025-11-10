const { test } = require('@playwright/test');

const AUTH_ENABLED = process.env.E2E_AUTH === '1';

// Skip in CI by default; enable locally with E2E_AUTH=1
(AUTH_ENABLED ? test : test.skip)('create auth state', async ({ page }) => {
  await page.goto('/login'); // or '/connexion' if that’s your route
  // TODO: wire programmatic login or seed a user (see note below)
});
