import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('Page Ajouter un Jardin', () => {
  // Chemin vers un dossier fixtures contenant au moins 6 images de test
  const fixturesDir = path.resolve(__dirname, 'fixtures');
  const files = [
      path.join(fixturesDir, 'jardin 1.jpg'),
      path.join(fixturesDir, 'jardin 2.jpg'),
      path.join(fixturesDir, 'jardin 3.jpg'),
      path.join(fixturesDir, 'jardin 4.jpg'),
      path.join(fixturesDir, 'jardin 5.jpg'),
      path.join(fixturesDir, 'jardin 6.jpg'),
  ];

  test.beforeEach(async ({ page }) => {
    // Remplacez l’URL par le chemin réel de votre page
    await page.goto('http://localhost:3000/ajouter-jardin');
  });

  test('bloque l’ajout au-dessus de 5 photos et affiche une alerte', async ({ page }) => {
    // Prépare la gestion de la boîte de dialogue alert()
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    const fileInput = page.locator('input[type="file"]');
    // Tente d’uploader 6 fichiers en une seule fois
    await fileInput.setInputFiles(files);

    // On attend que l’alerte ait été capturée
    expect(alertMessage).toBe('Tu ne peux ajouter que 5 photos maximum.');

    // comme l’ajout est annulé, il n’y a **aucune** vignette
    await expect(page.locator('img[alt^="Photo"]')).toHaveCount(0);
  });

  test('ajoute correctement jusqu’à 5 photos sans alerte', async ({ page }) => {
  let alerted = false;
  page.on('dialog', () => { alerted = true; });

  const fileInput = page.locator('input[type="file"]');
  // On n’upload que 5 fichiers
  await fileInput.setInputFiles(files.slice(0, 5));

  expect(alerted).toBe(false);
  await expect(page.locator('img[alt^="Photo"]')).toHaveCount(5);
});


  test('permet de supprimer une photo via le bouton ✖', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');

    // Uploade 3 fichiers d’abord
    await fileInput.setInputFiles(files.slice(0, 3));
    const thumbs = page.locator('img[alt^="Photo"]');
    await expect(thumbs).toHaveCount(3);

    // Clique sur la croix de la deuxième vignette
    const removeButtons = page.locator('button:has-text("✖")');
    await removeButtons.nth(1).click();

    // On s’attend à 2 vignettes restantes
    await expect(thumbs).toHaveCount(2);

    // Vérifie qu’aucune alerte n’est apparue
    page.on('dialog', () => { throw new Error('Aucune alerte attendue'); });
  });

  test('soumet le formulaire et affiche une alerte de confirmation', async ({ page }) => {
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // Remplit quelques champs
    await page.fill('input[name="nom"]', 'Mon beau jardin');
    await page.fill('textarea[name="description"]', 'Un super potager');
    // On peut uploader moins de 5 pour tester le submit
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(files.slice(0, 2));

    // Clique sur "Ajouter mon jardin"
    await page.click('button:has-text("Ajouter mon jardin")');

    // Vérifie le message d’alerte
    expect(alertMessage).toBe('Jardin ajouté (simulation) !');
  });
});