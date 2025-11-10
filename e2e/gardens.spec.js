// e2e/gardens.spec.js
const { test, expect } = require('@playwright/test');

test('gardens list shows at least one garden, and detail loads', async ({ page }) => {
  await page.goto('/gardens', { waitUntil: 'domcontentloaded' });

  // If there’s a "Jardins" tab on mobile, tap it.
  const jardinsTab = page.getByRole('tab', { name: /jardins/i });
  if (await jardinsTab.count()) {
    await jardinsTab.first().click();
  }

  // Prefer a stable test id if present; otherwise fall back to the href selector.
  const cards = page.locator('[data-testid="garden-card"], a[href^="/gardens/"]');

  // Wait for at least one card to be in the DOM.
  await cards.first().waitFor({ state: 'attached', timeout: 10_000 });

  // On small viewports the first card may be offscreen: scroll it into view.
  const first = cards.first();
  await first.scrollIntoViewIfNeeded().catch(() => {});

  // Don’t assert visible on mobile; just click or follow href.
  const href = await first.getAttribute('href').catch(() => null);
  if (href) {
    await page.goto(href);
  } else {
    await first.click({ trial: true }).catch(() => {}); // probe
    await first.click();
  }

  // Detail page should show a heading (title) or calendar section.
  const heading = page.getByRole('heading').first();
  await expect(heading).toBeVisible({ timeout: 10_000 });
});
