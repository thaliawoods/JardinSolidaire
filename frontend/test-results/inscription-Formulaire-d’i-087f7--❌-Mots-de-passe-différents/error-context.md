# Test info

- Name: Formulaire d’inscription >> ❌ Mots de passe différents
- Location: C:\Users\medin\Documents\projet_rncp1\JardinSolidaire\frontend\src\testsE2E\inscription.spec.js:18:7

# Error details

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="prenom"]')

    at C:\Users\medin\Documents\projet_rncp1\JardinSolidaire\frontend\src\testsE2E\inscription.spec.js:20:16
```

# Page snapshot

```yaml
- text: Internal Server Error
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | const url = 'http://localhost:3000/inscription';
   4 |
   5 | test.describe('Formulaire d’inscription', () => {
   6 |   test('✅ Inscription avec données valides', async ({ page }) => {
   7 |     await page.goto(url);
   8 |     await page.fill('input[name="prenom"]', 'Test');
   9 |     await page.fill('input[name="nom"]', 'User');
  10 |     await page.fill('input[name="email"]', 'test@exemple.com');
  11 |     await page.fill('input[name="password"]', 'Test123!');
  12 |     await page.fill('input[name="confirmPassword"]', 'Test123!');
  13 |     await page.selectOption('select[name="role"]', 'ami_du_vert');
  14 |     await page.click('button[type="submit"]');
  15 |     await expect(page.locator('text=Bienvenue')).toBeVisible();
  16 |   });
  17 |
  18 |   test('❌ Mots de passe différents', async ({ page }) => {
  19 |     await page.goto(url);
> 20 |     await page.fill('input[name="prenom"]', 'Test');
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  21 |     await page.fill('input[name="nom"]', 'User');
  22 |     await page.fill('input[name="email"]', 'test3@exemple.com');
  23 |     await page.fill('input[name="password"]', 'Test123!');
  24 |     await page.fill('input[name="confirmPassword"]', 'Test1234!');
  25 |     await page.selectOption('select[name="role"]', 'ami_du_vert');
  26 |     await page.click('button[type="submit"]');
  27 |     await expect(page.locator('text=Les mots de passe ne correspondent pas')).toBeVisible();
  28 |   });
  29 | });
```