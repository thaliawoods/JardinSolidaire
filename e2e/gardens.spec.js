const { test, expect } = require('@playwright/test');

test('gardens list shows at least one garden, and detail loads', async ({ page }) => {
  await page.goto('/gardens', { waitUntil: 'domcontentloaded' });

  const jardinsTab = page.getByRole('tab', { name: /jardins/i });
  if (await jardinsTab.count()) {
    await jardinsTab.first().click();
  }

  const cards = page.locator('[data-testid="garden-card"], a[href^="/gardens/"]');

  await cards.first().waitFor({ state: 'attached', timeout: 10_000 });

  const first = cards.first();
  await first.scrollIntoViewIfNeeded().catch(() => {});

  const href = await first.getAttribute('href').catch(() => null);
  if (href) {
    await page.goto(href);
  } else {
    await first.click({ trial: true }).catch(() => {});
    await first.click();
  }

  const heading = page.getByRole('heading').first();
  await expect(heading).toBeVisible({ timeout: 10_000 });
});



