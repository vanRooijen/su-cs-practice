import assert from 'node:assert/strict';
import test from 'node:test';

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

test('desktop root route minimizes windows and clears focus', () => {
  const store = createWindowManagerStore();

  store.applyRoute(makeRoute('/people/staff', 'people', 'staff'));
  store.applyRoute(makeRoute('/reader/help', 'reader', 'help'));
  store.applyRoute({
    path: '/',
    appId: null,
    subroute: '',
    routeKey: 'desktop::/',
    openMode: 'match',
  });

  const snapshot = store.getSnapshot();

  assert.equal(snapshot.focusedWindowId, null);
  assert.equal(snapshot.windowOrder.length, 2);
  assert.ok(snapshot.windowOrder.every((windowId) => snapshot.windows[windowId]?.isMinimized === true));
});

test('getDefaultPathForApp falls back to home for unknown app ids', () => {
  const store = createWindowManagerStore();

  assert.equal(store.getDefaultPathForApp('reader'), '/reader/articles');
  assert.equal(store.getDefaultPathForApp('does-not-exist'), '/home');
});

test('closing the final focused window suggests desktop root path', () => {
  const store = createWindowManagerStore();

  store.applyRoute(makeRoute('/people/staff', 'people', 'staff'));
  const { focusedWindowId } = store.getSnapshot();
  assert.ok(focusedWindowId, 'expected a focused window');

  const suggestedPath = store.closeWindow(focusedWindowId, '/people/staff');

  assert.equal(suggestedPath, '/');
  assert.equal(store.getSnapshot().focusedWindowId, null);
});

test('window history limit is isolated per window instance', () => {
  const store = createWindowManagerStore();

  store.applyRoute(makeRoute('/reader/articles', 'reader', 'articles'));
  const readerWindowId = store.getSnapshot().focusedWindowId;
  assert.ok(readerWindowId, 'expected reader window to be created');

  store.applyRoute(makeRoute('/people/staff', 'people', 'staff'));
  const peopleWindowId = store.getSnapshot().focusedWindowId;
  assert.ok(peopleWindowId, 'expected people window to be created');
  assert.notEqual(readerWindowId, peopleWindowId);

  for (let index = 0; index < 14; index += 1) {
    const subroute = `articles/entry-${index}`;
    store.applyRoute(makeRoute(`/reader/${subroute}`, 'reader', subroute));
  }

  const snapshot = store.getSnapshot();
  const readerWindow = snapshot.windows[readerWindowId];
  const peopleWindow = snapshot.windows[peopleWindowId];

  assert.ok(readerWindow, 'expected reader window to remain');
  assert.ok(peopleWindow, 'expected people window to remain');
  assert.equal(readerWindow.history.entries.length, 10);
  assert.equal(peopleWindow.history.entries.length, 1);
  assert.equal(peopleWindow.history.entries[0].path, '/people/staff');
});
