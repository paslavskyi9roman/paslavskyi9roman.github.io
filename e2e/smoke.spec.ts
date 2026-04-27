import { expect, test } from '@playwright/test';

test('root redirects to /es and renders landing', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.url()).toMatch(/\/es$/);
  await expect(page.getByRole('heading', { name: 'Madrid Noir' })).toBeVisible();
});

test('English landing renders English copy', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByText('Spanish Detective RPG')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Enter the Case' })).toBeVisible();
});

test('unknown localized route shows custom not-found', async ({ page }) => {
  const response = await page.goto('/es/does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByText('Esta calle no existe')).toBeVisible();
});

test('game page mounts the canvas region', async ({ page }) => {
  await page.goto('/es/game');
  await expect(page.getByRole('img', { name: /Lienzo del juego/i })).toBeVisible();
});
