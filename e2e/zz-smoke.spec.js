const { test, expect } = require('@playwright/test');

test('loads home and finds a heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading').first()).toBeVisible();
});
