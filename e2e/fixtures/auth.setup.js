const { test } = require('@playwright/test');

test('create auth state', async ({ page }) => {
  await page.goto('/login');                  // adjust if /connexion
  await page.getByLabel(/email/i).fill('demo@example.com');   // seed this user
  await page.getByLabel(/password|mot de passe/i).fill('demo1234');
  await page.getByRole('button', { name: /login|connexion/i }).click();
  await page.waitForURL(/\/(gardens|dashboard|profile)/);
  await page.context().storageState({ path: 'e2e/.auth/state.json' });
});
