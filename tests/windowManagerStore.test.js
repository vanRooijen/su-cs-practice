import assert from 'node:assert/strict';
import test from 'node:test';

import { createWindowManagerStore } from '../src/lib/window/windowManagerStore.js';

function makeRoute(path, appId, subroute, options = {}) {
  const { openMode = 'match' } = options;

  return {
    path,
    appId,
    subroute,
    routeKey: `${appId}::${path}`,
    openMode,
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

test('closeAllWindows clears every window and focus while preserving workspace bounds', () => {
  const store = createWindowManagerStore();
  store.setWorkspaceRect({ width: 1333, height: 777 });
  store.applyRoute(makeRoute('/people/staff', 'people', 'staff'));
  store.applyRoute(makeRoute('/reader/help', 'reader', 'help'));

  const before = store.getSnapshot();
  assert.equal(before.windowOrder.length, 2);

  store.closeAllWindows();
  const after = store.getSnapshot();

  assert.equal(after.windowOrder.length, 0);
  assert.equal(Object.keys(after.windows).length, 0);
  assert.equal(after.focusedWindowId, null);
  assert.equal(after.nextWindowId, before.nextWindowId);
  assert.deepEqual(after.workspaceRect, before.workspaceRect);
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

test('applyRoute is a strict no-op for unchanged focused route', () => {
  const store = createWindowManagerStore();
  const route = makeRoute('/people/staff', 'people', 'staff');

  store.applyRoute(route);
  const before = store.getSnapshot();
  const beforeFocusedId = before.focusedWindowId;
  assert.ok(beforeFocusedId, 'expected focused window');

  store.applyRoute(route);
  const after = store.getSnapshot();

  assert.equal(after, before);
  assert.equal(after.windows[beforeFocusedId].history.entries.length, 1);
});

test('route navigation prefers exact route window match before app fallback strategy', () => {
  const store = createWindowManagerStore();

  store.applyRoute(makeRoute('/reader/articles', 'reader', 'articles'));
  const firstWindowId = store.getSnapshot().focusedWindowId;
  assert.ok(firstWindowId, 'expected first reader window');

  store.applyRoute(makeRoute('/reader/help', 'reader', 'help', { openMode: 'new-window' }));
  const secondWindowId = store.getSnapshot().focusedWindowId;
  assert.ok(secondWindowId, 'expected second reader window');
  assert.notEqual(firstWindowId, secondWindowId);

  store.applyRoute(makeRoute('/reader/articles', 'reader', 'articles'));
  const snapshot = store.getSnapshot();

  assert.equal(snapshot.focusedWindowId, firstWindowId);
  assert.equal(snapshot.windows[firstWindowId].path, '/reader/articles');
  assert.equal(snapshot.windows[secondWindowId].path, '/reader/help');
});

test('sidebar activation minimizes focused window and restores it on second activation', () => {
  const store = createWindowManagerStore();

  store.applyRoute(makeRoute('/people/staff', 'people', 'staff'));
  const peopleWindowId = store.getSnapshot().focusedWindowId;
  assert.ok(peopleWindowId, 'expected people window');

  store.applyRoute(makeRoute('/reader/help', 'reader', 'help'));
  const readerWindowId = store.getSnapshot().focusedWindowId;
  assert.ok(readerWindowId, 'expected reader window');
  assert.notEqual(readerWindowId, peopleWindowId);

  store.activateWindowFromSidebar(readerWindowId);
  let snapshot = store.getSnapshot();
  assert.equal(snapshot.windows[readerWindowId].isMinimized, true);
  assert.equal(snapshot.focusedWindowId, peopleWindowId);

  store.activateWindowFromSidebar(readerWindowId);
  snapshot = store.getSnapshot();
  assert.equal(snapshot.windows[readerWindowId].isMinimized, false);
  assert.equal(snapshot.focusedWindowId, readerWindowId);
});

test('moveWindow clamps coordinates to workspace and no-ops for unchanged bounds', () => {
  const store = createWindowManagerStore();
  store.setWorkspaceRect({ width: 900, height: 600 });
  store.applyRoute(makeRoute('/people/staff', 'people', 'staff'));

  const windowId = store.getSnapshot().focusedWindowId;
  assert.ok(windowId, 'expected focused window');

  store.moveWindow(windowId, { x: -200, y: 9999 });
  const moved = store.getSnapshot();
  const bounds = moved.windows[windowId].bounds;

  assert.equal(bounds.x, 0);
  assert.ok(bounds.y <= moved.workspaceRect.height - bounds.height);

  store.moveWindow(windowId, { x: bounds.x, y: bounds.y });
  const afterNoOp = store.getSnapshot();
  assert.equal(afterNoOp, moved);
});

test('resizeWindow respects workspace boundaries and minimum dimensions', () => {
  const store = createWindowManagerStore();
  store.setWorkspaceRect({ width: 900, height: 600 });
  store.applyRoute(makeRoute('/people/staff', 'people', 'staff'));

  const windowId = store.getSnapshot().focusedWindowId;
  assert.ok(windowId, 'expected focused window');

  const initial = store.getSnapshot().windows[windowId].bounds;
  store.resizeWindow(windowId, {
    edge: 'se',
    deltaX: 5000,
    deltaY: 5000,
    startBounds: initial,
  });

  let snapshot = store.getSnapshot();
  let bounds = snapshot.windows[windowId].bounds;
  assert.ok(bounds.width <= snapshot.workspaceRect.width);
  assert.ok(bounds.height <= snapshot.workspaceRect.height);

  store.resizeWindow(windowId, {
    edge: 'nw',
    deltaX: 5000,
    deltaY: 5000,
    startBounds: bounds,
  });

  snapshot = store.getSnapshot();
  bounds = snapshot.windows[windowId].bounds;
  assert.ok(bounds.width >= 420);
  assert.ok(bounds.height >= 280);
  assert.ok(bounds.x >= 0);
  assert.ok(bounds.y >= 0);
});

test('stepWindowHistory returns target paths and stops at boundaries', () => {
  const store = createWindowManagerStore();

  store.applyRoute(makeRoute('/reader/articles', 'reader', 'articles'));
  const windowId = store.getSnapshot().focusedWindowId;
  assert.ok(windowId, 'expected reader window');

  store.applyRoute(makeRoute('/reader/help', 'reader', 'help'));
  let snapshot = store.getSnapshot();
  assert.equal(snapshot.windows[windowId].history.entries.length, 2);
  assert.equal(snapshot.windows[windowId].history.index, 1);

  const backPath = store.stepWindowHistory(windowId, 'back');
  snapshot = store.getSnapshot();
  assert.equal(backPath, '/reader/articles');
  assert.equal(snapshot.windows[windowId].path, '/reader/articles');
  assert.equal(snapshot.windows[windowId].history.index, 0);

  const secondBackPath = store.stepWindowHistory(windowId, 'back');
  assert.equal(secondBackPath, null);

  const forwardPath = store.stepWindowHistory(windowId, 'forward');
  snapshot = store.getSnapshot();
  assert.equal(forwardPath, '/reader/help');
  assert.equal(snapshot.windows[windowId].path, '/reader/help');
  assert.equal(snapshot.windows[windowId].history.index, 1);

  const secondForwardPath = store.stepWindowHistory(windowId, 'forward');
  assert.equal(secondForwardPath, null);
});

test('toggleSidebar is a no-op for apps without sidebars', () => {
  const store = createWindowManagerStore();
  store.applyRoute(makeRoute('/home', 'home', ''));

  const windowId = store.getSnapshot().focusedWindowId;
  assert.ok(windowId, 'expected focused home window');

  const before = store.getSnapshot();
  store.toggleSidebar(windowId);
  const after = store.getSnapshot();
  assert.equal(after, before);
});

test('toggleMinimize minimizes unfocused windows without a focus-first click', () => {
  const store = createWindowManagerStore();

  store.applyRoute(makeRoute('/people/staff', 'people', 'staff'));
  const peopleWindowId = store.getSnapshot().focusedWindowId;
  assert.ok(peopleWindowId, 'expected people window');

  store.applyRoute(makeRoute('/reader/help', 'reader', 'help'));
  const readerWindowId = store.getSnapshot().focusedWindowId;
  assert.ok(readerWindowId, 'expected reader window');
  assert.notEqual(peopleWindowId, readerWindowId);

  store.toggleMinimize(peopleWindowId);
  let snapshot = store.getSnapshot();
  assert.equal(snapshot.windows[peopleWindowId].isMinimized, true);
  assert.equal(snapshot.focusedWindowId, readerWindowId);

  store.toggleMinimize(peopleWindowId);
  snapshot = store.getSnapshot();
  assert.equal(snapshot.windows[peopleWindowId].isMinimized, false);
  assert.equal(snapshot.focusedWindowId, peopleWindowId);
});

test('hydratePersistedState restores z-order, focus, and window metadata', () => {
  const sourceStore = createWindowManagerStore();
  sourceStore.setWorkspaceRect({ width: 1400, height: 900 });

  sourceStore.applyRoute(makeRoute('/people/staff', 'people', 'staff'));
  const peopleWindowId = sourceStore.getSnapshot().focusedWindowId;
  assert.ok(peopleWindowId, 'expected people window');

  sourceStore.applyRoute(makeRoute('/reader/help', 'reader', 'help', { openMode: 'new-window' }));
  const readerWindowId = sourceStore.getSnapshot().focusedWindowId;
  assert.ok(readerWindowId, 'expected reader window');

  sourceStore.moveWindow(peopleWindowId, { x: 128, y: 88 });
  sourceStore.activateWindowFromSidebar(peopleWindowId);
  sourceStore.activateWindowFromSidebar(peopleWindowId);

  const persistedSnapshot = sourceStore.getSnapshot();

  const restoredStore = createWindowManagerStore();
  const restoredFocusedPath = restoredStore.hydratePersistedState(persistedSnapshot);
  const restoredSnapshot = restoredStore.getSnapshot();

  assert.equal(restoredSnapshot.windowOrder.length, 2);
  assert.deepEqual(restoredSnapshot.windowOrder, persistedSnapshot.windowOrder);
  assert.equal(restoredSnapshot.focusedWindowId, readerWindowId);
  assert.equal(restoredFocusedPath, '/reader/help');
  assert.equal(restoredSnapshot.windows[peopleWindowId].isMinimized, true);
  assert.equal(restoredSnapshot.windows[readerWindowId].path, '/reader/help');
  assert.equal(restoredSnapshot.windows[peopleWindowId].bounds.x, 128);
  assert.equal(restoredSnapshot.windows[peopleWindowId].bounds.y, 88);
});
