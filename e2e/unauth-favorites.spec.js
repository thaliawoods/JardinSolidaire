const { test, expect } = require('@playwright/test');

test('favorite buttons are hidden for anonymous users on /gardens', async ({ page }) => {
  await page.context().clearCookies();
  await page.goto('/gardens');

  // change this to data-testid if you add it (recommended!)
  const fav = page.getByRole('button', { name: /favori|favorite|ajouter aux favoris/i });
  const count = await fav.count();
  if (count > 0) await expect(fav).not.toBeVisible();
  else expect(count).toBe(0);
});
