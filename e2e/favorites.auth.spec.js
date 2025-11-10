const { test, expect } = require('@playwright/test');

test('user can favorite a garden when logged in', async ({ page }) => {
  await page.goto('/gardens');
  const firstCard = page.locator('a[href^="/gardens/"]').first();
  await firstCard.click();

  // Use a stable selector if you add data-testid="fav-btn"
  const fav = page.getByRole('button', { name: /favori|favorite/i }).first();
  await expect(fav).toBeVisible();
  await fav.click();
  // assert the UI toggles (icon/label) — tweak to your app:
  await expect(fav).toHaveText(/retirer|remove|unfavorite/i);
});
