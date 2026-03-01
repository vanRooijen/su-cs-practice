import { expect, test } from '@playwright/test';

test('topbar navigation opens People and focuses it', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/home$/);
  await expect(page.locator('.sidebar-entry')).toHaveCount(1);

  await page.getByRole('button', { name: /^people$/i }).click();

  await expect(page).toHaveURL(/\/people$/);
  await expect(page.locator('.sidebar-entry')).toHaveCount(2);
  await expect(page.locator('.sidebar-entry[data-focused="true"] strong')).toHaveText('People');
});

test('open in new window creates an additional Reader window', async ({ page }) => {
  await page.goto('/reader/articles');

  await expect(page).toHaveURL(/\/reader\/articles$/);
  await expect(page.locator('.sidebar-entry')).toHaveCount(1);

  await page.locator('a[data-open-in-new-window="true"]').first().click();

  await expect(page).toHaveURL(/\/reader\//);
  await expect(page.locator('.sidebar-entry')).toHaveCount(2);
  await expect(page.locator('.app-window')).toHaveCount(2);
  await expect(page.locator('.sidebar-entry[data-focused="true"] strong')).toHaveText('Reader');
});

test('invalid routes are redirected to error app and logged', async ({ page }) => {
  await page.goto('/broken-app/demo');

  await expect(page).toHaveURL(/\/error\/app-not-found$/);
  await expect(page.locator('.error-context')).toContainText('App not found: /broken-app/demo');
  await expect(page.locator('.error-history li')).toHaveCount(1);

  await page.getByRole('button', { name: 'Clear Log' }).click();
  await expect(page.locator('.error-history li')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Clear Log' })).toBeDisabled();
});
