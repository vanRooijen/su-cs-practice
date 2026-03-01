import { expect, test } from '@playwright/test';

function focusedWindow(page) {
  return page.locator('.app-window[data-focused="true"]');
}

test('reader window history controls navigate between in-window entries', async ({ page }) => {
  await page.goto('/reader/articles');

  await expect(page).toHaveURL(/\/reader\/articles$/);
  await page.locator('aside').getByRole('link', { name: 'Help' }).click();
  await expect(page).toHaveURL(/\/reader\/help$/);

  await focusedWindow(page).getByRole('button', { name: 'Back in app' }).click();
  await expect(page).toHaveURL(/\/reader\/articles$/);

  await focusedWindow(page).getByRole('button', { name: 'Forward in app' }).click();
  await expect(page).toHaveURL(/\/reader\/help$/);
});

test('browser back and forward focus existing windows without duplicating them', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/home$/);

  await page.getByRole('button', { name: /^people$/i }).click();
  await expect(page).toHaveURL(/\/people$/);

  await page.getByRole('button', { name: /^article$/i }).click();
  await expect(page).toHaveURL(/\/reader\/articles$/);
  await expect(page.locator('.sidebar-entry')).toHaveCount(3);

  await page.goBack();
  await expect(page).toHaveURL(/\/people$/);
  await expect(page.locator('.sidebar-entry')).toHaveCount(3);
  await expect(page.locator('.entry-main[data-focused="true"] strong')).toHaveText('People');

  await page.goForward();
  await expect(page).toHaveURL(/\/reader\/articles$/);
  await expect(page.locator('.sidebar-entry')).toHaveCount(3);
  await expect(page.locator('.entry-main[data-focused="true"] strong')).toHaveText('Reader');
});

test('context menu can open a link in a new window', async ({ page }) => {
  await page.goto('/people/staff');
  await expect(page.locator('.sidebar-entry')).toHaveCount(1);

  await page.getByRole('link', { name: 'Students' }).first().click({ button: 'right' });
  await expect(page.getByRole('menu', { name: 'Site context menu' })).toBeVisible();
  await page.getByRole('menuitem', { name: 'Open Link in New Window' }).click();

  await expect(page).toHaveURL(/\/people\/students$/);
  await expect(page.locator('.sidebar-entry')).toHaveCount(2);
  await expect(page.locator('.app-window')).toHaveCount(2);
  await expect(page.locator('.entry-main[data-focused="true"] small')).toContainText('Students');
});

test('context menu help action routes to reader help', async ({ page }) => {
  await page.goto('/people/staff');

  await page.locator('.workspace').click({ button: 'right', position: { x: 12, y: 12 } });
  await expect(page.getByRole('menu', { name: 'Site context menu' })).toBeVisible();
  await page.getByRole('menuitem', { name: 'Help' }).click();

  await expect(page).toHaveURL(/\/reader\/help$/);
  await expect(page.locator('.entry-main[data-focused="true"] strong')).toHaveText('Reader');
});

test('window controls handle minimize, maximize, restore, and close lifecycle', async ({ page }) => {
  await page.goto('/people/staff');
  await expect(page).toHaveURL(/\/people\/staff$/);

  await focusedWindow(page).getByRole('button', { name: 'Minimize window' }).click();
  await expect(page).toHaveURL(/\/people\/staff$/);
  await expect(page.locator('.entry-main[data-focused="true"]')).toHaveCount(0);
  await expect(page.locator('.sidebar-entry small')).toContainText(['(minimized)']);

  await page.locator('.entry-main').first().click();
  await expect(page.locator('.entry-main[data-focused="true"] strong')).toHaveText('People');

  await focusedWindow(page).getByRole('button', { name: 'Maximize window' }).click();
  await expect(focusedWindow(page).locator('.resize-handle')).toHaveCount(0);

  await focusedWindow(page).getByRole('button', { name: 'Maximize window' }).click();
  await expect(focusedWindow(page).locator('.resize-handle')).toHaveCount(8);

  await focusedWindow(page).getByRole('button', { name: 'Close window' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('.sidebar-entry')).toHaveCount(0);
  await expect(page.locator('.app-window')).toHaveCount(0);
});

test('invalid reader paths redirect to path-not-found and can clear the error log', async ({ page }) => {
  await page.goto('/reader/articles/not-a-real-entry');

  await expect(page).toHaveURL(/\/error\/path-not-found$/);
  await expect(page.locator('.error-context')).toContainText(
    'Path not found: /reader/articles/not-a-real-entry',
  );
  await expect(page.locator('.error-history li')).toHaveCount(1);

  await page.getByRole('button', { name: 'Clear Log' }).click();
  await expect(page.locator('.error-history li')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Clear Log' })).toBeDisabled();
});

test('trailing slash app routes are canonicalized in-browser', async ({ page }) => {
  await page.goto('/people/staff/');
  await expect(page).toHaveURL(/\/people\/staff$/);
});
