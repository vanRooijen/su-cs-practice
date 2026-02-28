import assert from 'node:assert/strict';
import test from 'node:test';

import { parsePath } from '../src/lib/navigation/historyRouter.js';
import { createWindowManagerStore } from '../src/lib/window/windowManagerStore.js';

function makeRoute(path, appId, subroute) {
  return {
    path,
    appId,
    subroute,
    routeKey: `${appId}::${path}`,
    openMode: 'match',
  };
}

test('restored window bounds are clamped after workspace shrink', () => {
  const store = createWindowManagerStore();

  store.setWorkspaceRect({ width: 1200, height: 800 });
  store.applyRoute(makeRoute('/people/staff', 'people', 'staff'));

  const firstSnapshot = store.getSnapshot();
  const windowId = firstSnapshot.focusedWindowId;
  assert.ok(windowId, 'expected a focused window after route apply');

  store.toggleMaximize(windowId);
  store.setWorkspaceRect({ width: 600, height: 400 });
  store.toggleMaximize(windowId);

  const snapshot = store.getSnapshot();
  const restored = snapshot.windows[windowId];

  assert.ok(restored, 'expected restored window to still exist');
  assert.equal(restored.isMaximized, false);
  assert.ok(restored.bounds.x >= 0);
  assert.ok(restored.bounds.y >= 0);
  assert.ok(restored.bounds.width <= snapshot.workspaceRect.width);
  assert.ok(restored.bounds.height <= snapshot.workspaceRect.height);
});

test('unknown app routes open not-found windows instead of forcing home', () => {
  const store = createWindowManagerStore();
  const parsed = parsePath('/missing-app/docs');

  store.applyRoute({
    ...parsed,
    path: parsed.canonicalPath,
    openMode: 'match',
  });

  const snapshot = store.getSnapshot();
  const windowId = snapshot.focusedWindowId;
  const openedWindow = snapshot.windows[windowId];

  assert.ok(openedWindow, 'expected a window for unknown route');
  assert.equal(openedWindow.appId, 'not-found');
  assert.equal(openedWindow.title, 'Not Found');
  assert.equal(openedWindow.path, '/missing-app/docs');
});

test('getDefaultPathForApp falls back to home for unknown app ids', () => {
  const store = createWindowManagerStore();

  assert.equal(store.getDefaultPathForApp('reader'), '/reader/articles');
  assert.equal(store.getDefaultPathForApp('does-not-exist'), '/home');
});
