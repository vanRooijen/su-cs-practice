const WINDOW_SESSION_DB_NAME = 'su-cs-practice-window-session';
const WINDOW_SESSION_DB_VERSION = 1;
const CHECKPOINT_STORE = 'checkpoint';
const DELTA_STORE = 'deltas';
const CHECKPOINT_ID = 'latest';

const DEFAULT_CHECKPOINT_INTERVAL = 40;
const DEFAULT_FLUSH_DELAY_MS = 220;
const DEFAULT_IDLE_TIMEOUT_MS = 1200;

function isRecord(value) {
  return Boolean(value) && typeof value === 'object';
}

function toPositiveWindowId(value) {
  const numeric = Number(value);
  return Number.isInteger(numeric) && numeric > 0 ? numeric : null;
}

function normalizePath(path, appId) {
  if (typeof path !== 'string') {
    return `/${appId}`;
  }

  const trimmed = path.trim();
  if (!trimmed) {
    return `/${appId}`;
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function cloneBounds(bounds, fallback = null) {
  const fallbackBounds = fallback ?? { x: 0, y: 0, width: 640, height: 420 };

  return {
    x: Number.isFinite(bounds?.x) ? Math.round(bounds.x) : fallbackBounds.x,
    y: Number.isFinite(bounds?.y) ? Math.round(bounds.y) : fallbackBounds.y,
    width: Number.isFinite(bounds?.width) ? Math.max(1, Math.round(bounds.width)) : fallbackBounds.width,
    height: Number.isFinite(bounds?.height) ? Math.max(1, Math.round(bounds.height)) : fallbackBounds.height,
  };
}

function cloneHistory(history, path, subroute, routeKey) {
  const entryCandidates = Array.isArray(history?.entries) ? history.entries : [];
  const entries = [];

  for (const entry of entryCandidates) {
    if (typeof entry?.path !== 'string' || !entry.path) {
      continue;
    }

    entries.push({
      path: entry.path,
      subroute: typeof entry?.subroute === 'string' ? entry.subroute : '',
      routeKey:
        typeof entry?.routeKey === 'string' && entry.routeKey.trim()
          ? entry.routeKey
          : `${entry.path}::${typeof entry?.subroute === 'string' ? entry.subroute : ''}`,
    });
  }

  if (!entries.length) {
    entries.push({
      path,
      subroute,
      routeKey,
    });
  }

  const indexCandidate = Number(history?.index);
  const index = Number.isInteger(indexCandidate)
    ? Math.max(0, Math.min(indexCandidate, entries.length - 1))
    : entries.length - 1;

  return {
    entries,
    index,
  };
}

function cloneWindow(windowLike, fallbackWindowId) {
  const appId = typeof windowLike?.appId === 'string' ? windowLike.appId : null;
  if (!appId) {
    return null;
  }

  const windowId = toPositiveWindowId(windowLike?.windowId) ?? fallbackWindowId;
  if (!windowId) {
    return null;
  }

  const subroute = typeof windowLike?.subroute === 'string' ? windowLike.subroute : '';
  const path = normalizePath(windowLike?.path, appId);
  const routeKey =
    typeof windowLike?.routeKey === 'string' && windowLike.routeKey.trim() ? windowLike.routeKey : `${appId}::${path}`;

  const bounds = cloneBounds(windowLike?.bounds);
  const restoreBounds = cloneBounds(windowLike?.restoreBounds, bounds);
  const history = cloneHistory(windowLike?.history, path, subroute, routeKey);

  return {
    windowId,
    appId,
    title: typeof windowLike?.title === 'string' ? windowLike.title : appId,
    path,
    subroute,
    routeKey,
    routeLabel: typeof windowLike?.routeLabel === 'string' ? windowLike.routeLabel : path,
    hasSidebar: Boolean(windowLike?.hasSidebar),
    showWindowHistoryNavigation: Boolean(windowLike?.showWindowHistoryNavigation),
    isSidebarCollapsed: Boolean(windowLike?.isSidebarCollapsed),
    isMinimized: Boolean(windowLike?.isMinimized),
    isMaximized: Boolean(windowLike?.isMaximized),
    bounds,
    restoreBounds,
    history,
    createdAt: Number.isFinite(windowLike?.createdAt) ? windowLike.createdAt : Date.now(),
    lastFocusedAt: Number.isFinite(windowLike?.lastFocusedAt) ? windowLike.lastFocusedAt : Date.now(),
  };
}

function cloneWorkspaceRect(workspaceRect) {
  return {
    width: Number.isFinite(workspaceRect?.width) ? Math.max(1, Math.round(workspaceRect.width)) : 1200,
    height: Number.isFinite(workspaceRect?.height) ? Math.max(1, Math.round(workspaceRect.height)) : 720,
  };
}

function cloneLastRoute(lastRoute) {
  if (!isRecord(lastRoute) || typeof lastRoute?.path !== 'string') {
    return null;
  }

  return {
    appId: typeof lastRoute?.appId === 'string' ? lastRoute.appId : null,
    path: lastRoute.path,
    subroute: typeof lastRoute?.subroute === 'string' ? lastRoute.subroute : '',
    routeKey: typeof lastRoute?.routeKey === 'string' ? lastRoute.routeKey : `${lastRoute.appId ?? 'desktop'}::${lastRoute.path}`,
  };
}

function arraysEqual(left, right) {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      return false;
    }
  }

  return true;
}

function boundsEqual(left, right) {
  return (
    left.x === right.x &&
    left.y === right.y &&
    left.width === right.width &&
    left.height === right.height
  );
}

function historyEqual(left, right) {
  if (left.index !== right.index || left.entries.length !== right.entries.length) {
    return false;
  }

  for (let index = 0; index < left.entries.length; index += 1) {
    const leftEntry = left.entries[index];
    const rightEntry = right.entries[index];
    if (
      leftEntry.path !== rightEntry.path ||
      leftEntry.subroute !== rightEntry.subroute ||
      leftEntry.routeKey !== rightEntry.routeKey
    ) {
      return false;
    }
  }

  return true;
}

function windowsEqual(left, right) {
  return (
    left.windowId === right.windowId &&
    left.appId === right.appId &&
    left.title === right.title &&
    left.path === right.path &&
    left.subroute === right.subroute &&
    left.routeKey === right.routeKey &&
    left.routeLabel === right.routeLabel &&
    left.hasSidebar === right.hasSidebar &&
    left.showWindowHistoryNavigation === right.showWindowHistoryNavigation &&
    left.isSidebarCollapsed === right.isSidebarCollapsed &&
    left.isMinimized === right.isMinimized &&
    left.isMaximized === right.isMaximized &&
    left.createdAt === right.createdAt &&
    left.lastFocusedAt === right.lastFocusedAt &&
    boundsEqual(left.bounds, right.bounds) &&
    boundsEqual(left.restoreBounds, right.restoreBounds) &&
    historyEqual(left.history, right.history)
  );
}

export function serializeWindowManagerSnapshot(snapshotLike) {
  const next = {
    windows: {},
    windowOrder: [],
    focusedWindowId: null,
    nextWindowId: 1,
    workspaceRect: cloneWorkspaceRect(snapshotLike?.workspaceRect),
    lastRoute: cloneLastRoute(snapshotLike?.lastRoute),
  };

  const windows = isRecord(snapshotLike?.windows) ? snapshotLike.windows : {};
  const rawOrder = Array.isArray(snapshotLike?.windowOrder) ? snapshotLike.windowOrder : [];
  const seen = new Set();

  for (const rawWindowId of rawOrder) {
    const windowId = toPositiveWindowId(rawWindowId);
    if (!windowId || seen.has(windowId)) {
      continue;
    }

    const candidate = windows[windowId] ?? windows[String(windowId)];
    const cloned = cloneWindow(candidate, windowId);
    if (!cloned) {
      continue;
    }

    next.windows[windowId] = cloned;
    next.windowOrder.push(windowId);
    seen.add(windowId);
  }

  for (const [rawWindowId, candidate] of Object.entries(windows)) {
    const windowId = toPositiveWindowId(rawWindowId);
    if (!windowId || seen.has(windowId)) {
      continue;
    }

    const cloned = cloneWindow(candidate, windowId);
    if (!cloned) {
      continue;
    }

    next.windows[windowId] = cloned;
    next.windowOrder.push(windowId);
    seen.add(windowId);
  }

  const focusedWindowId = toPositiveWindowId(snapshotLike?.focusedWindowId);
  next.focusedWindowId = focusedWindowId && next.windows[focusedWindowId] ? focusedWindowId : null;

  const nextWindowId = toPositiveWindowId(snapshotLike?.nextWindowId);
  const maxWindowId = next.windowOrder.reduce((highest, id) => Math.max(highest, id), 0);
  next.nextWindowId = nextWindowId ? Math.max(nextWindowId, maxWindowId + 1) : maxWindowId + 1;

  return next;
}

function createEmptySnapshot() {
  return {
    windows: {},
    windowOrder: [],
    focusedWindowId: null,
    nextWindowId: 1,
    workspaceRect: { width: 1200, height: 720 },
    lastRoute: null,
  };
}

export function createWindowSessionDelta(previousSnapshot, nextSnapshot) {
  const next = serializeWindowManagerSnapshot(nextSnapshot);
  if (!previousSnapshot) {
    return {
      kind: 'replace',
      snapshot: next,
    };
  }

  const previous = serializeWindowManagerSnapshot(previousSnapshot);
  const delta = {
    kind: 'patch',
  };
  let hasChanges = false;

  if (previous.focusedWindowId !== next.focusedWindowId) {
    delta.focusedWindowId = next.focusedWindowId;
    hasChanges = true;
  }

  if (previous.nextWindowId !== next.nextWindowId) {
    delta.nextWindowId = next.nextWindowId;
    hasChanges = true;
  }

  if (
    previous.workspaceRect.width !== next.workspaceRect.width ||
    previous.workspaceRect.height !== next.workspaceRect.height
  ) {
    delta.workspaceRect = { ...next.workspaceRect };
    hasChanges = true;
  }

  const previousLastRoute = previous.lastRoute ? JSON.stringify(previous.lastRoute) : '';
  const nextLastRoute = next.lastRoute ? JSON.stringify(next.lastRoute) : '';
  if (previousLastRoute !== nextLastRoute) {
    delta.lastRoute = next.lastRoute ? { ...next.lastRoute } : null;
    hasChanges = true;
  }

  if (!arraysEqual(previous.windowOrder, next.windowOrder)) {
    delta.windowOrder = [...next.windowOrder];
    hasChanges = true;
  }

  const upsertedWindows = {};
  for (const [windowId, nextWindow] of Object.entries(next.windows)) {
    const previousWindow = previous.windows[windowId];
    if (!previousWindow || !windowsEqual(previousWindow, nextWindow)) {
      upsertedWindows[windowId] = cloneWindow(nextWindow, Number(windowId));
    }
  }

  if (Object.keys(upsertedWindows).length) {
    delta.upsertedWindows = upsertedWindows;
    hasChanges = true;
  }

  const removedWindowIds = Object.keys(previous.windows)
    .map((windowId) => Number(windowId))
    .filter((windowId) => !next.windows[windowId] && !next.windows[String(windowId)]);

  if (removedWindowIds.length) {
    delta.removedWindowIds = removedWindowIds;
    hasChanges = true;
  }

  return hasChanges ? delta : null;
}

export function applyWindowSessionDelta(snapshotLike, delta) {
  if (!delta) {
    return serializeWindowManagerSnapshot(snapshotLike ?? createEmptySnapshot());
  }

  if (delta.kind === 'replace') {
    return serializeWindowManagerSnapshot(delta.snapshot);
  }

  const next = serializeWindowManagerSnapshot(snapshotLike ?? createEmptySnapshot());
  if (delta.kind !== 'patch') {
    return next;
  }

  if ('focusedWindowId' in delta) {
    next.focusedWindowId = toPositiveWindowId(delta.focusedWindowId);
  }

  if ('nextWindowId' in delta) {
    const nextWindowId = toPositiveWindowId(delta.nextWindowId);
    if (nextWindowId) {
      next.nextWindowId = nextWindowId;
    }
  }

  if (isRecord(delta.workspaceRect)) {
    next.workspaceRect = cloneWorkspaceRect(delta.workspaceRect);
  }

  if ('lastRoute' in delta) {
    next.lastRoute = cloneLastRoute(delta.lastRoute);
  }

  if (Array.isArray(delta.windowOrder)) {
    const order = [];
    const seen = new Set();
    for (const rawWindowId of delta.windowOrder) {
      const windowId = toPositiveWindowId(rawWindowId);
      if (!windowId || seen.has(windowId)) {
        continue;
      }

      order.push(windowId);
      seen.add(windowId);
    }
    next.windowOrder = order;
  }

  if (isRecord(delta.upsertedWindows)) {
    for (const [rawWindowId, rawWindow] of Object.entries(delta.upsertedWindows)) {
      const windowId = toPositiveWindowId(rawWindowId);
      if (!windowId) {
        continue;
      }

      const cloned = cloneWindow(rawWindow, windowId);
      if (!cloned) {
        continue;
      }

      next.windows[windowId] = cloned;
      if (!next.windowOrder.includes(windowId)) {
        next.windowOrder.push(windowId);
      }
    }
  }

  if (Array.isArray(delta.removedWindowIds)) {
    for (const rawWindowId of delta.removedWindowIds) {
      const windowId = toPositiveWindowId(rawWindowId);
      if (!windowId) {
        continue;
      }

      delete next.windows[windowId];
      next.windowOrder = next.windowOrder.filter((id) => id !== windowId);
      if (next.focusedWindowId === windowId) {
        next.focusedWindowId = null;
      }
    }
  }

  next.windowOrder = next.windowOrder.filter((windowId) => Boolean(next.windows[windowId]));

  const maxWindowId = next.windowOrder.reduce((highest, id) => Math.max(highest, id), 0);
  next.nextWindowId = Math.max(next.nextWindowId, maxWindowId + 1);

  if (next.focusedWindowId && !next.windows[next.focusedWindowId]) {
    next.focusedWindowId = null;
  }

  return next;
}

function hasIndexedDb() {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
  });
}

function transactionToPromise(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB transaction failed'));
    transaction.onabort = () => reject(transaction.error ?? new Error('IndexedDB transaction aborted'));
  });
}

function openWindowSessionDb() {
  if (!hasIndexedDb()) {
    return Promise.resolve(null);
  }

  const request = window.indexedDB.open(WINDOW_SESSION_DB_NAME, WINDOW_SESSION_DB_VERSION);

  request.onupgradeneeded = () => {
    const database = request.result;

    if (!database.objectStoreNames.contains(CHECKPOINT_STORE)) {
      database.createObjectStore(CHECKPOINT_STORE, { keyPath: 'id' });
    }

    if (!database.objectStoreNames.contains(DELTA_STORE)) {
      database.createObjectStore(DELTA_STORE, { keyPath: 'revision' });
    }
  };

  return requestToPromise(request);
}

async function readPersistedSession(db) {
  const checkpointTx = db.transaction(CHECKPOINT_STORE, 'readonly');
  const checkpointStore = checkpointTx.objectStore(CHECKPOINT_STORE);
  const checkpoint = await requestToPromise(checkpointStore.get(CHECKPOINT_ID));
  await transactionToPromise(checkpointTx);

  if (!checkpoint?.snapshot) {
    return {
      snapshot: null,
      revision: 0,
      checkpointRevision: 0,
    };
  }

  const checkpointRevision = Number.isInteger(checkpoint.revision) ? checkpoint.revision : 0;
  let snapshot = serializeWindowManagerSnapshot(checkpoint.snapshot);
  let revision = checkpointRevision;

  const deltaTx = db.transaction(DELTA_STORE, 'readonly');
  const deltaStore = deltaTx.objectStore(DELTA_STORE);
  const range = IDBKeyRange.lowerBound(checkpointRevision + 1);
  const deltaRecords = await requestToPromise(deltaStore.getAll(range));
  await transactionToPromise(deltaTx);

  for (const record of deltaRecords ?? []) {
    const recordRevision = Number(record?.revision);
    if (!Number.isInteger(recordRevision) || recordRevision <= revision) {
      continue;
    }

    snapshot = applyWindowSessionDelta(snapshot, record.delta);
    revision = recordRevision;
  }

  return {
    snapshot,
    revision,
    checkpointRevision,
  };
}

async function writeDelta(db, revision, delta) {
  const tx = db.transaction(DELTA_STORE, 'readwrite');
  const store = tx.objectStore(DELTA_STORE);
  store.put({
    revision,
    delta,
    writtenAt: Date.now(),
  });
  await transactionToPromise(tx);
}

async function writeCheckpoint(db, revision, snapshot) {
  const tx = db.transaction([CHECKPOINT_STORE, DELTA_STORE], 'readwrite');
  const checkpointStore = tx.objectStore(CHECKPOINT_STORE);
  const deltaStore = tx.objectStore(DELTA_STORE);

  checkpointStore.put({
    id: CHECKPOINT_ID,
    revision,
    snapshot,
    writtenAt: Date.now(),
  });
  deltaStore.clear();

  await transactionToPromise(tx);
}

function createNoopController() {
  return {
    restoredFocusedPath: null,
    flush: async () => {},
    destroy: () => {},
  };
}

function waitForIdle(timeoutMs) {
  if (typeof window === 'undefined' || typeof window.requestIdleCallback !== 'function') {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    window.requestIdleCallback(() => resolve(), { timeout: timeoutMs });
  });
}

export async function createWindowSessionPersistence(windowManager, options = {}) {
  if (
    !windowManager ||
    typeof windowManager.subscribe !== 'function' ||
    typeof windowManager.getSnapshot !== 'function' ||
    typeof windowManager.hydratePersistedState !== 'function'
  ) {
    return createNoopController();
  }

  const checkpointInterval = Number.isInteger(options.checkpointInterval)
    ? Math.max(1, options.checkpointInterval)
    : DEFAULT_CHECKPOINT_INTERVAL;
  const flushDelayMs = Number.isFinite(options.flushDelayMs)
    ? Math.max(0, Math.floor(options.flushDelayMs))
    : DEFAULT_FLUSH_DELAY_MS;
  const idleTimeoutMs = Number.isFinite(options.idleTimeoutMs)
    ? Math.max(50, Math.floor(options.idleTimeoutMs))
    : DEFAULT_IDLE_TIMEOUT_MS;

  const db = await openWindowSessionDb();
  if (!db) {
    return createNoopController();
  }

  let restoredFocusedPath = null;
  let lastRevision = 0;
  let lastCheckpointRevision = 0;
  let lastPersistedSnapshot = null;

  try {
    const restored = await readPersistedSession(db);
    if (restored.snapshot) {
      restoredFocusedPath = windowManager.hydratePersistedState(restored.snapshot);
    }
    lastRevision = restored.revision;
    lastCheckpointRevision = restored.checkpointRevision;
  } catch {
    // Ignore restore failures and continue with in-memory state only.
  }

  lastPersistedSnapshot = serializeWindowManagerSnapshot(windowManager.getSnapshot());

  let flushTimerId = 0;
  let pendingSnapshot = null;
  let flushInFlight = false;
  let isDestroyed = false;
  let unsubscribe = null;

  async function flushPending({ force = false } = {}) {
    if (flushInFlight || !pendingSnapshot) {
      return;
    }

    flushInFlight = true;

    try {
      while (pendingSnapshot) {
        const snapshotToPersist = pendingSnapshot;
        pendingSnapshot = null;

        if (!force) {
          await waitForIdle(idleTimeoutMs);
        }

        if (!lastRevision) {
          const initialRevision = 1;
          await writeCheckpoint(db, initialRevision, snapshotToPersist);
          lastPersistedSnapshot = snapshotToPersist;
          lastRevision = initialRevision;
          lastCheckpointRevision = initialRevision;
          continue;
        }

        const delta = createWindowSessionDelta(lastPersistedSnapshot, snapshotToPersist);
        if (!delta) {
          lastPersistedSnapshot = snapshotToPersist;
          continue;
        }

        const nextRevision = lastRevision + 1;
        await writeDelta(db, nextRevision, delta);
        lastPersistedSnapshot = snapshotToPersist;
        lastRevision = nextRevision;

        if (lastRevision - lastCheckpointRevision >= checkpointInterval) {
          await writeCheckpoint(db, lastRevision, snapshotToPersist);
          lastCheckpointRevision = lastRevision;
        }
      }
    } catch {
      // Ignore write failures and continue with in-memory state.
    } finally {
      flushInFlight = false;
    }
  }

  function scheduleFlush(delay = flushDelayMs) {
    if (isDestroyed || flushTimerId) {
      return;
    }

    flushTimerId = window.setTimeout(() => {
      flushTimerId = 0;
      void flushPending();
    }, delay);
  }

  function onPageHide() {
    void flushPending({ force: true });
  }

  function onVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      void flushPending({ force: true });
    }
  }

  unsubscribe = windowManager.subscribe((snapshot) => {
    if (isDestroyed) {
      return;
    }

    pendingSnapshot = serializeWindowManagerSnapshot(snapshot);
    scheduleFlush();
  });

  window.addEventListener('pagehide', onPageHide);
  document.addEventListener('visibilitychange', onVisibilityChange);

  async function destroy() {
    if (isDestroyed) {
      return;
    }

    isDestroyed = true;

    if (flushTimerId) {
      window.clearTimeout(flushTimerId);
      flushTimerId = 0;
    }

    window.removeEventListener('pagehide', onPageHide);
    document.removeEventListener('visibilitychange', onVisibilityChange);

    if (typeof unsubscribe === 'function') {
      unsubscribe();
      unsubscribe = null;
    }

    if (!pendingSnapshot) {
      pendingSnapshot = serializeWindowManagerSnapshot(windowManager.getSnapshot());
    }

    await flushPending({ force: true });
    db.close();
  }

  return {
    restoredFocusedPath,
    flush: () => flushPending({ force: true }),
    destroy: () => {
      void destroy();
    },
  };
}
