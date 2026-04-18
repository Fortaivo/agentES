import { test, expect } from '@playwright/test';

test.describe('Empire Strike UI smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /EMPIRE STRIKE/i })).toBeVisible();
    await page.getByRole('button', { name: /ENTRAR AL IMPERIO/i }).click();
    await expect(page.getByText('Tierras Doradas').first()).toBeVisible();
  });

  test('sidebar navigates through every section without crashing', async ({ page }) => {
    const nav: (string | RegExp)[] = [
      'Mi Imperio',
      'Mi Ejército',
      'Últimas Alianzas',
      'Conquistas',
      'Mapa Mundial',
      /Mover Héroes/,
      /Mover Tropas/,
      'Monturas',
      'Espionaje',
      'Política',
      'Comercio',
      'Carromato',
      'Prisión',
      'Mi Clan',
      'Rosvo',
      /Fundar ciudad/,
      /Doghell/,
      /Quests/,
      'Combate',
      'Rankings',
      /Imperios Agente/,
      'Perfil',
      'Rubíes',
    ];

    for (const name of nav) {
      await page.getByRole('button', { name }).first().click();
      await expect(page.getByText('Tierras Doradas').first()).toBeVisible();
    }
  });
});
