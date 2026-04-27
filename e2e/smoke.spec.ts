import { expect, test } from '@playwright/test';

test('root redirects to /es and renders the newsprint masthead', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.url()).toMatch(/\/es$/);
  await expect(page.getByRole('heading', { name: /MADRID/ })).toBeVisible();
  await expect(page.getByText('DIARIO DE LA NOCHE')).toBeVisible();
});

test('English landing renders the newsprint front page', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByText('DIARIO DE LA NOCHE')).toBeVisible();
  await expect(page.getByRole('link', { name: /Aceptar el caso/ })).toBeVisible();
});

test('unknown localized route shows custom not-found', async ({ page }) => {
  const response = await page.goto('/es/does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByText('Esta calle no existe')).toBeVisible();
});

test('game page mounts the bar interior scene', async ({ page }) => {
  await page.goto('/es/game');
  await expect(page.getByRole('img', { name: /Lienzo del juego/i })).toBeVisible();
});
