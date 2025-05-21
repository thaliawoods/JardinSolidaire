# Test info

- Name: Formulaire d’inscription >> ❌ Mot de passe non conforme
- Location: C:\Users\medin\Documents\projet_rncp1\JardinSolidaire\frontend\src\testsE2E\inscription.spec.js:34:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('text=Votre mot de passe ne respecte pas les critères de sécurité.')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('text=Votre mot de passe ne respecte pas les critères de sécurité.')

    at C:\Users\medin\Documents\projet_rncp1\JardinSolidaire\frontend\src\testsE2E\inscription.spec.js:43:101
```

# Page snapshot

```yaml
- navigation:
  - link "JardinSolidaire":
    - /url: /
  - link "J'ai un jardin":
    - /url: /ajouter-jardin
    - button "J'ai un jardin"
  - button "Je veux jardiner"
- heading "Bienvenue sur JardinSolidaire !" [level=2]
- paragraph: "Vous êtes sur le point de rejoindre une communauté qui fait pousser bien plus que des plantes : entraide, solidarité et sourires. 🌿🌻"
- text: Prénom
- textbox "Votre prénom": Test
- text: Nom
- textbox "Votre nom": User
- text: Adresse e-mail
- paragraph: "📩 Veillez à entrer une adresse valide : un e-mail de vérification vous sera envoyé."
- textbox "Votre adresse e-mail": test2@exemple.com
- text: Mot de passe
- paragraph: "🔒 Votre mot de passe doit contenir :"
- list:
  - listitem: Au moins 8 caractères
  - listitem: Une majuscule
  - listitem: Un chiffre
  - listitem: Un caractère spécial
- textbox "Votre mot de passe": abc
- button "Afficher"
- paragraph: ✔️ 8 caractères minimum
- paragraph: ✔️ Une majuscule
- paragraph: ✔️ Un chiffre
- paragraph: ✔️ Un caractère spécial
- text: Confirmez votre mot de passe
- textbox "Confirmez votre mot de passe": abc
- button "Afficher"
- text: Quel est votre rôle ?
- combobox:
  - option "-- Choisissez votre rôle --"
  - option "Je possède un jardin"
  - option "Je souhaite jardiner chez quelqu’un" [selected]
- button "S'inscrire"
- paragraph:
  - text: Déjà inscrit ?
  - link "Se connecter":
    - /url: /connexion
- paragraph: En vous inscrivant, vous contribuez à une plateforme bienveillante dédiée à la nature et au partage. 💚
- contentinfo:
  - link "Contact":
    - /url: /contact
  - link "Centre d'aide":
    - /url: /help
- button "Open Next.js Dev Tools":
  - img
- alert
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | const url = 'http://localhost:3000/inscription';
   4 |
   5 | test('Inscription avec données valides', async ({ page }) => {
   6 |   await page.goto('http://localhost:3000/inscription');
   7 |
   8 |   await page.fill('input[name="prenom"]', 'Test');
   9 |   await page.fill('input[name="nom"]', 'Utilisateur');
  10 |   await page.fill('input[name="email"]', 'test@exemple.com');
  11 |   await page.fill('input[name="password"]', 'Test123!');
  12 |   await page.fill('input[name="confirmPassword"]', 'Test123!');
  13 |   await page.selectOption('select[name="role"]', 'ami_du_vert');
  14 |
  15 |   await page.click('button[type="submit"]');
  16 |
  17 |   // Attendre le message de bienvenue ou un message d'erreur
  18 |   await expect(page.locator('text=Bienvenue')).toBeVisible();
  19 | });
  20 |
  21 | test.describe('Formulaire d’inscription', () => {
  22 |   test('✅ Inscription avec données valides', async ({ page }) => {
  23 |     await page.goto(url);
  24 |     await page.fill('input[name="prenom"]', 'Test');
  25 |     await page.fill('input[name="nom"]', 'User');
  26 |     await page.fill('input[name="email"]', 'test@exemple.com');
  27 |     await page.fill('input[name="password"]', 'Test123!');
  28 |     await page.fill('input[name="confirmPassword"]', 'Test123!');
  29 |     await page.selectOption('select[name="role"]', 'ami_du_vert');
  30 |     await page.click('button[type="submit"]');
  31 |     await expect(page.locator('text=Bienvenue')).toBeVisible();
  32 |   });
  33 |
  34 |   test('❌ Mot de passe non conforme', async ({ page }) => {
  35 |     await page.goto(url);
  36 |     await page.fill('input[name="prenom"]', 'Test');
  37 |     await page.fill('input[name="nom"]', 'User');
  38 |     await page.fill('input[name="email"]', 'test2@exemple.com');
  39 |     await page.fill('input[name="password"]', 'abc');
  40 |     await page.fill('input[name="confirmPassword"]', 'abc');
  41 |     await page.selectOption('select[name="role"]', 'ami_du_vert');
  42 |     await page.click('button[type="submit"]');
> 43 |     await expect(page.locator('text=Votre mot de passe ne respecte pas les critères de sécurité.')).toBeVisible();
     |                                                                                                     ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  44 |   });
  45 |
  46 |   test('❌ Mots de passe différents', async ({ page }) => {
  47 |     await page.goto(url);
  48 |     await page.fill('input[name="prenom"]', 'Test');
  49 |     await page.fill('input[name="nom"]', 'User');
  50 |     await page.fill('input[name="email"]', 'test3@exemple.com');
  51 |     await page.fill('input[name="password"]', 'Test123!');
  52 |     await page.fill('input[name="confirmPassword"]', 'Test1234!');
  53 |     await page.selectOption('select[name="role"]', 'ami_du_vert');
  54 |     await page.click('button[type="submit"]');
  55 |     await expect(page.locator('text=Les mots de passe ne correspondent pas')).toBeVisible();
  56 |   });
  57 | });
```