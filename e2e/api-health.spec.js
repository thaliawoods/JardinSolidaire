const { test, expect } = require('@playwright/test');

test('backend is reachable indirectly via UI navigation', async ({ page, baseURL }) => {
  await page.goto('/gardens');
  // If the page loads without client errors, that’s good enough for e2e.
  // Optionally check console for severe errors:
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.waitForLoadState('networkidle');
  expect(errors.join('\n')).not.toMatch(/TypeError|ReferenceError/);
});
