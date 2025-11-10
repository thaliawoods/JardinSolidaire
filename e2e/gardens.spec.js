const { test, expect } = require('@playwright/test');

test('gardens list shows at least one garden, and detail loads', async ({ page }) => {
  await page.goto('/gardens');

  // Prefer stable selectors: add data-testid="garden-card" in your JSX if possible.
  const firstLink = page.locator('a[href^="/gardens/"]').first();
  await expect(firstLink).toBeVisible();

  const href = await firstLink.getAttribute('href');
  await page.goto(href);

  const title = page.getByRole('heading').first();
  await expect(title).toBeVisible();
});
