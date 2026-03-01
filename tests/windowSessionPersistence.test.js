import assert from 'node:assert/strict';
import test from 'node:test';

import {
  applyWindowSessionDelta,
  createWindowSessionDelta,
  serializeWindowManagerSnapshot,
} from '../src/lib/window/windowSessionPersistence.js';

function makeWindow(windowId, path, overrides = {}) {
  const appId = path.split('/').filter(Boolean)[0] ?? 'home';
  const subroute = path.split('/').filter(Boolean).slice(1).join('/');
  const routeKey = `${appId}::${path}`;

  return {
    windowId,
    appId,
    title: appId,
    path,
    subroute,
    routeKey,
    routeLabel: subroute || appId,
    hasSidebar: true,
    showWindowHistoryNavigation: true,
    isSidebarCollapsed: false,
    isMinimized: false,
    isMaximized: false,
    bounds: { x: 32, y: 32, width: 700, height: 500 },
    restoreBounds: { x: 32, y: 32, width: 700, height: 500 },
    history: {
      entries: [{ path, subroute, routeKey }],
      index: 0,
    },
    createdAt: 1,
    lastFocusedAt: 2,
    ...overrides,
  };
}

function makeSnapshot() {
  const windows = {
    1: makeWindow(1, '/people/staff'),
    2: makeWindow(2, '/reader/help'),
  };

  return {
    windows,
    windowOrder: [1, 2],
    focusedWindowId: 2,
    nextWindowId: 3,
    workspaceRect: { width: 1200, height: 800 },
    lastRoute: {
      appId: 'reader',
      path: '/reader/help',
      subroute: 'help',
      routeKey: 'reader::/reader/help',
    },
  };
}

test('createWindowSessionDelta returns null for unchanged snapshots', () => {
  const snapshot = makeSnapshot();
  const delta = createWindowSessionDelta(snapshot, snapshot);

  assert.equal(delta, null);
});

test('createWindowSessionDelta + applyWindowSessionDelta reconstruct state changes', () => {
  const previous = makeSnapshot();
  const next = makeSnapshot();

  next.windows[1] = makeWindow(1, '/people/students', {
    bounds: { x: 160, y: 120, width: 760, height: 520 },
    restoreBounds: { x: 160, y: 120, width: 760, height: 520 },
    history: {
      entries: [
        { path: '/people/staff', subroute: 'staff', routeKey: 'people::/people/staff' },
        { path: '/people/students', subroute: 'students', routeKey: 'people::/people/students' },
      ],
      index: 1,
    },
  });
  next.focusedWindowId = 1;
  next.lastRoute = {
    appId: 'people',
    path: '/people/students',
    subroute: 'students',
    routeKey: 'people::/people/students',
  };
  next.workspaceRect = { width: 1280, height: 860 };

  const delta = createWindowSessionDelta(previous, next);
  assert.ok(delta, 'expected a patch delta');
  assert.equal(delta.kind, 'patch');

  const reconstructed = applyWindowSessionDelta(previous, delta);
  const expected = serializeWindowManagerSnapshot(next);

  assert.deepEqual(reconstructed, expected);
});

test('createWindowSessionDelta creates replace payload when no previous snapshot exists', () => {
  const next = makeSnapshot();
  const delta = createWindowSessionDelta(null, next);

  assert.equal(delta.kind, 'replace');

  const reconstructed = applyWindowSessionDelta(null, delta);
  assert.deepEqual(reconstructed, serializeWindowManagerSnapshot(next));
});
