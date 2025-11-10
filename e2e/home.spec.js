const { test, expect } = require('@playwright/test');

test('home loads and has a visible header or primary CTA', async ({ page }) => {
  await page.goto('/');
  // Be tolerant to your actual hero/header wording:
  const hasHeader = await page.getByRole('heading').first().isVisible().catch(() => false);
  expect(hasHeader).toBeTruthy();
});
