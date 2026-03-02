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

test('closeAllWindowsGlobal clears every window and focus while preserving workspace bounds', () => {
  const store = createWindowManagerStore();
  store.setWorkspaceRect({ width: 1333, height: 777 });
  store.applyRoute(makeRoute('/people/staff', 'people', 'staff'));
  store.applyRoute(makeRoute('/reader/help', 'reader', 'help'));

  const before = store.getSnapshot();
  assert.equal(before.windowOrder.length, 2);

  store.closeAllWindowsGlobal();
  const after = store.getSnapshot();

  assert.equal(after.windowOrder.length, 0);
  assert.equal(Object.keys(after.windows).length, 0);
  assert.equal(after.focusedWindowId, null);
  assert.equal(after.nextWindowId, before.nextWindowId);
  assert.deepEqual(after.workspaceRect, before.workspaceRect);
});

test('closeOwnedWindows only removes windows owned by this runtime', () => {
  const sourceStore = createWindowManagerStore();
  sourceStore.applyRoute(makeRoute('/people/staff', 'people', 'staff'));
  sourceStore.applyRoute(makeRoute('/reader/help', 'reader', 'help', { openMode: 'new-window' }));

  const restoredStore = createWindowManagerStore();
  restoredStore.hydratePersistedState(sourceStore.getSnapshot());
  restoredStore.applyRoute(makeRoute('/home', 'home', '', { openMode: 'new-window' }));

  const before = restoredStore.getSnapshot();
  const localRuntimeId = restoredStore.getRuntimeId();
  const ownedIdsBefore = before.windowOrder.filter((windowId) => before.windows[windowId]?.ownerRuntimeId === localRuntimeId);
  const foreignIdsBefore = before.windowOrder.filter((windowId) => before.windows[windowId]?.ownerRuntimeId !== localRuntimeId);
  assert.ok(ownedIdsBefore.length > 0, 'expected at least one local window');
  assert.ok(foreignIdsBefore.length > 0, 'expected at least one foreign window');

  restoredStore.closeOwnedWindows();
  const after = restoredStore.getSnapshot();

  const ownedIdsAfter = after.windowOrder.filter((windowId) => after.windows[windowId]?.ownerRuntimeId === localRuntimeId);
  const foreignIdsAfter = after.windowOrder.filter((windowId) => after.windows[windowId]?.ownerRuntimeId !== localRuntimeId);
  assert.equal(ownedIdsAfter.length, 0);
  assert.equal(foreignIdsAfter.length, foreignIdsBefore.length);
  assert.equal(after.focusedWindowId, null);
});

test('closeWindowsOwnedByOthers removes foreign windows while keeping local windows', () => {
  const sourceStore = createWindowManagerStore();
  sourceStore.applyRoute(makeRoute('/people/staff', 'people', 'staff'));
  sourceStore.applyRoute(makeRoute('/reader/help', 'reader', 'help', { openMode: 'new-window' }));

  const restoredStore = createWindowManagerStore();
  restoredStore.hydratePersistedState(sourceStore.getSnapshot());
  restoredStore.applyRoute(makeRoute('/home', 'home', '', { openMode: 'new-window' }));

  const before = restoredStore.getSnapshot();
  const localRuntimeId = restoredStore.getRuntimeId();
  const ownedIdsBefore = before.windowOrder.filter((windowId) => before.windows[windowId]?.ownerRuntimeId === localRuntimeId);
  const foreignIdsBefore = before.windowOrder.filter((windowId) => before.windows[windowId]?.ownerRuntimeId !== localRuntimeId);
  assert.ok(ownedIdsBefore.length > 0, 'expected at least one local window');
  assert.ok(foreignIdsBefore.length > 0, 'expected at least one foreign window');

  restoredStore.closeWindowsOwnedByOthers();
  const after = restoredStore.getSnapshot();

  const ownedIdsAfter = after.windowOrder.filter((windowId) => after.windows[windowId]?.ownerRuntimeId === localRuntimeId);
  const foreignIdsAfter = after.windowOrder.filter((windowId) => after.windows[windowId]?.ownerRuntimeId !== localRuntimeId);
  assert.equal(ownedIdsAfter.length, ownedIdsBefore.length);
  assert.equal(foreignIdsAfter.length, 0);
  assert.ok(after.focusedWindowId, 'expected a focused local window');
  assert.equal(after.windows[after.focusedWindowId].ownerRuntimeId, localRuntimeId);
});

test('claimWindowsOwnedByInactiveRuntimes reclaims orphaned windows after hydrate', () => {
  const sourceStore = createWindowManagerStore();
  sourceStore.applyRoute(makeRoute('/people/staff', 'people', 'staff'));
  sourceStore.applyRoute(makeRoute('/reader/help', 'reader', 'help', { openMode: 'new-window' }));

  const persisted = sourceStore.getSnapshot();
  const restoredStore = createWindowManagerStore();
  restoredStore.hydratePersistedState(persisted);

  const before = restoredStore.getSnapshot();
  const localRuntimeId = restoredStore.getRuntimeId();
  assert.equal(before.focusedWindowId, null);
  assert.ok(
    before.windowOrder.every((windowId) => before.windows[windowId]?.ownerRuntimeId !== localRuntimeId),
    'expected all hydrated windows to be foreign-owned before reclaim',
  );

  restoredStore.claimWindowsOwnedByInactiveRuntimes([]);
  const after = restoredStore.getSnapshot();

  assert.ok(
    after.windowOrder.every((windowId) => after.windows[windowId]?.ownerRuntimeId === localRuntimeId),
    'expected all windows to be locally owned after reclaim',
  );
  assert.ok(after.focusedWindowId, 'expected focus to be restored after reclaim');
  assert.equal(after.windows[after.focusedWindowId].ownerRuntimeId, localRuntimeId);
});

test('claimWindowsOwnedByInactiveRuntimes preserves windows owned by active runtimes', () => {
  const sourceStore = createWindowManagerStore();
  sourceStore.applyRoute(makeRoute('/people/staff', 'people', 'staff'));
  sourceStore.applyRoute(makeRoute('/reader/help', 'reader', 'help', { openMode: 'new-window' }));

  const persisted = sourceStore.getSnapshot();
  const restoredStore = createWindowManagerStore();
  restoredStore.hydratePersistedState(persisted);

  const before = restoredStore.getSnapshot();
  const localRuntimeId = restoredStore.getRuntimeId();
  const foreignOwnerRuntimeId = before.windows[before.windowOrder[0]]?.ownerRuntimeId;
  assert.ok(foreignOwnerRuntimeId, 'expected hydrated windows to have a foreign owner runtime id');
  assert.notEqual(foreignOwnerRuntimeId, localRuntimeId);

  restoredStore.claimWindowsOwnedByInactiveRuntimes([foreignOwnerRuntimeId]);
  const after = restoredStore.getSnapshot();

  assert.equal(after.focusedWindowId, null);
  assert.ok(
    after.windowOrder.every((windowId) => after.windows[windowId]?.ownerRuntimeId === foreignOwnerRuntimeId),
    'expected windows to remain foreign-owned while owner runtime is active',
  );
});

test('claimWindowsOwnedByInactiveRuntimes can restrict claims to explicit runtime ids', () => {
  const sourceStore = createWindowManagerStore();
  sourceStore.applyRoute(makeRoute('/people/staff', 'people', 'staff'));
  sourceStore.applyRoute(makeRoute('/reader/help', 'reader', 'help', { openMode: 'new-window' }));

  const persisted = sourceStore.getSnapshot();
  const restoredStore = createWindowManagerStore();
  restoredStore.hydratePersistedState(persisted);

  const before = restoredStore.getSnapshot();
  const foreignOwnerRuntimeId = before.windows[before.windowOrder[0]]?.ownerRuntimeId;
  assert.ok(foreignOwnerRuntimeId, 'expected foreign owner runtime id');

  restoredStore.claimWindowsOwnedByInactiveRuntimes([], []);
  let after = restoredStore.getSnapshot();
  assert.equal(after.focusedWindowId, null);
  assert.ok(
    after.windowOrder.every((windowId) => after.windows[windowId]?.ownerRuntimeId === foreignOwnerRuntimeId),
    'expected no claim when reclaimable set is empty',
  );

  restoredStore.claimWindowsOwnedByInactiveRuntimes([], [foreignOwnerRuntimeId]);
  after = restoredStore.getSnapshot();
  const localRuntimeId = restoredStore.getRuntimeId();
  assert.ok(
    after.windowOrder.every((windowId) => after.windows[windowId]?.ownerRuntimeId === localRuntimeId),
    'expected claim when runtime id is explicitly reclaimable',
  );
});

test('reconcileOwnership clears offline marker without auto-restoring minimized windows', () => {
  const sourceStore = createWindowManagerStore();
  sourceStore.applyRoute(makeRoute('/people/staff', 'people', 'staff'));
  sourceStore.applyRoute(makeRoute('/reader/help', 'reader', 'help', { openMode: 'new-window' }));

  const persisted = sourceStore.getSnapshot();
  const restoredStore = createWindowManagerStore();
  restoredStore.hydratePersistedState(persisted);

  const foreignOwnerRuntimeId = restoredStore.getSnapshot().windows[restoredStore.getSnapshot().windowOrder[0]]?.ownerRuntimeId;
  assert.ok(foreignOwnerRuntimeId, 'expected foreign owner runtime id');

  restoredStore.reconcileOwnership([]);
  let snapshot = restoredStore.getSnapshot();
  assert.ok(snapshot.windowOrder.every((windowId) => snapshot.windows[windowId]?.isMinimized === true));
  assert.ok(snapshot.windowOrder.every((windowId) => snapshot.windows[windowId]?.minimizeReason === 'offline'));
  assert.equal(snapshot.focusedWindowId, null);

  restoredStore.reconcileOwnership([foreignOwnerRuntimeId]);
  snapshot = restoredStore.getSnapshot();

  assert.ok(snapshot.windowOrder.every((windowId) => snapshot.windows[windowId]?.isMinimized === true));
  assert.ok(snapshot.windowOrder.every((windowId) => snapshot.windows[windowId]?.minimizeReason === null));
  assert.equal(snapshot.focusedWindowId, null);
});

test('claimWindowsOwnedByInactiveRuntimes keeps reclaimed offline windows minimized', () => {
  const sourceStore = createWindowManagerStore();
  sourceStore.applyRoute(makeRoute('/people/staff', 'people', 'staff'));
  sourceStore.applyRoute(makeRoute('/reader/help', 'reader', 'help', { openMode: 'new-window' }));

  const persisted = sourceStore.getSnapshot();
  const restoredStore = createWindowManagerStore();
  restoredStore.hydratePersistedState(persisted);
  restoredStore.reconcileOwnership([]);
  restoredStore.claimWindowsOwnedByInactiveRuntimes([]);

  const snapshot = restoredStore.getSnapshot();
  const localRuntimeId = restoredStore.getRuntimeId();

  assert.ok(snapshot.windowOrder.every((windowId) => snapshot.windows[windowId]?.ownerRuntimeId === localRuntimeId));
  assert.ok(snapshot.windowOrder.every((windowId) => snapshot.windows[windowId]?.isMinimized === true));
  assert.ok(snapshot.windowOrder.every((windowId) => snapshot.windows[windowId]?.minimizeReason === null));
  assert.equal(snapshot.focusedWindowId, null);
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

test('applyRoute does not auto-steal foreign-owned windows for route matches', () => {
  const sourceStore = createWindowManagerStore();
  sourceStore.applyRoute(makeRoute('/reader/help', 'reader', 'help'));

  const persisted = sourceStore.getSnapshot();
  const restoredStore = createWindowManagerStore();
  restoredStore.hydratePersistedState(persisted);

  const before = restoredStore.getSnapshot();
  const foreignWindowId = before.windowOrder[0];
  const foreignOwnerRuntimeId = before.windows[foreignWindowId]?.ownerRuntimeId;
  const localRuntimeId = restoredStore.getRuntimeId();
  assert.ok(foreignWindowId, 'expected foreign-owned window');
  assert.ok(foreignOwnerRuntimeId && foreignOwnerRuntimeId !== localRuntimeId, 'expected foreign owner');
  assert.equal(before.focusedWindowId, null);

  restoredStore.applyRoute(makeRoute('/reader/help', 'reader', 'help'));
  const after = restoredStore.getSnapshot();

  const localOwnedWindowIds = after.windowOrder.filter((windowId) => after.windows[windowId]?.ownerRuntimeId === localRuntimeId);
  const foreignOwnedWindowIds = after.windowOrder.filter((windowId) => after.windows[windowId]?.ownerRuntimeId !== localRuntimeId);

  assert.equal(localOwnedWindowIds.length, 1);
  assert.equal(foreignOwnedWindowIds.length, 1);
  assert.equal(after.windows[localOwnedWindowIds[0]].path, '/reader/help');
  assert.equal(after.windows[foreignOwnedWindowIds[0]].ownerRuntimeId, foreignOwnerRuntimeId);
  assert.equal(after.focusedWindowId, localOwnedWindowIds[0]);
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
  assert.equal(restoredSnapshot.focusedWindowId, null);
  assert.equal(restoredFocusedPath, null);
  assert.equal(restoredSnapshot.windows[peopleWindowId].isMinimized, true);
  assert.equal(restoredSnapshot.windows[readerWindowId].path, '/reader/help');
  assert.equal(restoredSnapshot.windows[peopleWindowId].bounds.x, 128);
  assert.equal(restoredSnapshot.windows[peopleWindowId].bounds.y, 88);
});
