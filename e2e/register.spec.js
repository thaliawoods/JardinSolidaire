const { test, expect } = require('@playwright/test');

async function gotoFirstWorking(page, paths) {
  for (const p of paths) {
    const resp = await page.goto(p);
    // consider navigation "ok" if not 404/500 and page rendered something
    const status = resp?.status?.() ?? 200;
    if (status < 400) return p;
  }
  throw new Error(`None of these routes worked: ${paths.join(', ')}`);
}

test('registration form renders inputs', async ({ page }) => {
  // Try the likely routes your app might use
  const tried = [
    '/register',
    '/inscription',
    '/signup',
    '/auth/register',
    '/fr/register',
    '/fr/inscription',
  ];
  const used = await gotoFirstWorking(page, tried);

  // Accept several possible headings
  const heading = page.getByRole('heading', {
    name: /inscription|register|créer un compte|créez votre compte|sign up/i,
  });

  // If no accessible heading text, fall back to just "any heading visible"
  const headingVisible = await heading.isVisible().catch(() => false);
  if (!headingVisible) {
    await expect(page.getByRole('heading').first()).toBeVisible();
  } else {
    await expect(heading).toBeVisible();
  }

  // Email field: prefer label, fallback to input[type=email] or placeholder
  const emailByLabel = page.getByLabel(/email|e-mail|courriel/i);
  const hasEmailLabel = await emailByLabel.count();
  if (hasEmailLabel) {
    await expect(emailByLabel.first()).toBeVisible();
  } else {
    const emailByType = page.locator('input[type="email"]');
    const emailByPlaceholder = page.getByPlaceholder(/email|e-mail|courriel/i);
    const anyEmail =
      (await emailByType.count()) ||
      (await emailByPlaceholder.count());
    expect(anyEmail, 'Email input not found').toBeGreaterThan(0);
  }

  // Password field: prefer label, fallback to input[type=password] or placeholder
  const pwdByLabel = page.getByLabel(/mot de passe|password/i);
  const hasPwdLabel = await pwdByLabel.count();
  if (hasPwdLabel) {
    await expect(pwdByLabel.first()).toBeVisible();
  } else {
    const pwdByType = page.locator('input[type="password"]');
    const pwdByPlaceholder = page.getByPlaceholder(/mot de passe|password/i);
    const anyPwd =
      (await pwdByType.count()) ||
      (await pwdByPlaceholder.count());
    expect(anyPwd, 'Password input not found').toBeGreaterThan(0);
  }

  // Submit CTA: tolerate FR/EN wording
  const submit = page.getByRole('button', {
    name: /inscription|s'inscrire|créer|create|register|sign up/i,
  });
  const hasSubmit = await submit.count();
  if (hasSubmit) {
    await expect(submit.first()).toBeVisible();
  } else {
    // fallback: any submit button
    const anySubmit = page.locator('button[type="submit"]');
    await expect(anySubmit.first()).toBeVisible();
  }

  // Optional log for debugging
  console.log(`✅ Registration page checked at: ${used}`);
});
