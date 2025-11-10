const { test, expect } = require('@playwright/test');

const AUTH_ENABLED = process.env.E2E_AUTH === '1';

(AUTH_ENABLED ? test : test.skip)('user can favorite a garden when logged in', async ({ page }) => {
  // Precondition: logged-in state from fixtures OR programmatic login
  await page.goto('/gardens');
  // TODO: add data-testid="fav-btn" in your UI for stability, then:
  // const fav = page.getByTestId('fav-btn').first();
  // await expect(fav).toBeVisible();
  // await fav.click();
  // await expect(fav).toHaveText(/retirer|remove|unfavorite/i);
});
