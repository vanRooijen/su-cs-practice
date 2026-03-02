const WINDOW_SESSION_DB_NAME = 'su-cs-practice-window-session';
const WINDOW_SESSION_DB_VERSION = 4;
const CHECKPOINT_STORE = 'checkpoint';
const CHECKPOINT_ID = 'latest';
const LEGACY_META_STORE = 'meta';
const LEGACY_WORKSPACE_STORE = 'workspaces';

const DEFAULT_FLUSH_DELAY_MS = 220;
const DEFAULT_IDLE_TIMEOUT_MS = 1200;
const SESSION_SYNC_PROTOCOL = 'su-cs-window-sync-v1';
const SESSION_SYNC_CHANNEL_NAME = 'su-cs-window-sync';
const PRESENCE_PROTOCOL = 'su-cs-owner-presence-v1';
const PRESENCE_CHANNEL_NAME = 'su-cs-owner-presence';
const SYNC_SCOPE_STORAGE_KEY = 'su-cs-window-sync-scope';
const SESSION_CLEAR_MARKER_STORAGE_KEY = 'su-cs-window-session-cleared-at';
const PRESENCE_HEARTBEAT_MS = 4000;
const PRESENCE_STALE_MS = 12000;
const DEFAULT_OWNER_RECLAIM_GRACE_MS = 700;
const DEFAULT_SYNC_BROADCAST_DELAY_MS = 48;
const IS_DEV = (() => {
  try {
    return Boolean(import.meta?.env?.DEV);
  } catch {
    return false;
  }
})();

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
  const minimizeReason =
    windowLike?.minimizeReason === 'user' || windowLike?.minimizeReason === 'offline' ? windowLike.minimizeReason : null;
  const ownerRuntimeId =
    typeof windowLike?.ownerRuntimeId === 'string' && windowLike.ownerRuntimeId.trim() ? windowLike.ownerRuntimeId : null;

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
    minimizeReason,
    ownerRuntimeId,
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
    left.minimizeReason === right.minimizeReason &&
    left.ownerRuntimeId === right.ownerRuntimeId &&
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

function sanitizeWindowIdList(rawList) {
  if (!Array.isArray(rawList)) {
    return [];
  }

  const ids = [];
  const seen = new Set();

  for (const rawId of rawList) {
    const windowId = toPositiveWindowId(rawId);
    if (!windowId || seen.has(windowId)) {
      continue;
    }

    ids.push(windowId);
    seen.add(windowId);
  }

  return ids;
}

function sanitizeSharedWindowDelta(rawUpsertedWindows) {
  if (!isRecord(rawUpsertedWindows)) {
    return null;
  }

  const upsertedWindows = {};

  for (const [rawWindowId, candidate] of Object.entries(rawUpsertedWindows)) {
    const windowId = toPositiveWindowId(rawWindowId);
    if (!windowId) {
      continue;
    }

    const cloned = cloneWindow(candidate, windowId);
    if (!cloned) {
      continue;
    }

    upsertedWindows[windowId] = cloned;
  }

  return Object.keys(upsertedWindows).length ? upsertedWindows : null;
}

function sanitizeSharedDelta(deltaLike) {
  if (!isRecord(deltaLike)) {
    return null;
  }

  if (deltaLike.kind !== 'patch') {
    return null;
  }

  const next = {
    kind: 'patch',
  };
  let hasChanges = false;

  if ('nextWindowId' in deltaLike) {
    const nextWindowId = toPositiveWindowId(deltaLike.nextWindowId);
    if (nextWindowId) {
      next.nextWindowId = nextWindowId;
      hasChanges = true;
    }
  }

  if ('windowOrder' in deltaLike) {
    const windowOrder = sanitizeWindowIdList(deltaLike.windowOrder);
    next.windowOrder = windowOrder;
    hasChanges = true;
  }

  const upsertedWindows = sanitizeSharedWindowDelta(deltaLike.upsertedWindows);
  if (upsertedWindows) {
    next.upsertedWindows = upsertedWindows;
    hasChanges = true;
  }

  if ('removedWindowIds' in deltaLike) {
    const removedWindowIds = sanitizeWindowIdList(deltaLike.removedWindowIds);
    next.removedWindowIds = removedWindowIds;
    hasChanges = true;
  }

  return hasChanges ? next : null;
}

function createSharedWindowSessionDelta(previousSnapshot, nextSnapshot) {
  return sanitizeSharedDelta(createWindowSessionDelta(previousSnapshot, nextSnapshot));
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

function hasBroadcastChannel() {
  return typeof window !== 'undefined' && typeof window.BroadcastChannel === 'function';
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

function createOpaqueId(prefix) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  const randomPart = Math.random().toString(36).slice(2, 12);
  const timestamp = Date.now().toString(36);
  return `${prefix}-${timestamp}-${randomPart}`;
}

function resolveSyncScopeId() {
  if (typeof window === 'undefined') {
    return 'scope-server';
  }

  try {
    const existing = window.localStorage.getItem(SYNC_SCOPE_STORAGE_KEY);
    if (typeof existing === 'string' && existing.trim()) {
      return existing;
    }

    const created = createOpaqueId('scope');
    window.localStorage.setItem(SYNC_SCOPE_STORAGE_KEY, created);
    return created;
  } catch {
    return 'scope-fallback';
  }
}

function readSessionClearedAt() {
  if (typeof window === 'undefined') {
    return 0;
  }

  try {
    const value = Number(window.localStorage.getItem(SESSION_CLEAR_MARKER_STORAGE_KEY) ?? '');
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

function shouldRestoreSnapshot(restoredSnapshot, sessionClearedAt) {
  if (!restoredSnapshot?.snapshot) {
    return false;
  }

  if (!Number.isFinite(sessionClearedAt) || sessionClearedAt <= 0) {
    return true;
  }

  const persistedAt = Number(restoredSnapshot.writtenAt);
  return Number.isFinite(persistedAt) && persistedAt > sessionClearedAt;
}

export function markWindowSessionCleared(clearedAt = Date.now()) {
  if (typeof window === 'undefined') {
    return;
  }

  const normalizedClearedAt = Number.isFinite(clearedAt) && clearedAt > 0 ? Math.floor(clearedAt) : Date.now();

  try {
    window.localStorage.setItem(SESSION_CLEAR_MARKER_STORAGE_KEY, String(normalizedClearedAt));
  } catch {
    // Ignore marker write failures and keep in-memory close-all semantics.
  }
}

function openWindowSessionDb() {
  if (!hasIndexedDb()) {
    return Promise.resolve(null);
  }

  const request = window.indexedDB.open(WINDOW_SESSION_DB_NAME, WINDOW_SESSION_DB_VERSION);

  request.onupgradeneeded = () => {
    const database = request.result;

    if (database.objectStoreNames.contains(LEGACY_META_STORE)) {
      database.deleteObjectStore(LEGACY_META_STORE);
    }

    if (database.objectStoreNames.contains(LEGACY_WORKSPACE_STORE)) {
      database.deleteObjectStore(LEGACY_WORKSPACE_STORE);
    }

    if (!database.objectStoreNames.contains(CHECKPOINT_STORE)) {
      database.createObjectStore(CHECKPOINT_STORE, { keyPath: 'id' });
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
      writtenAt: 0,
    };
  }

  return {
    snapshot: serializeWindowManagerSnapshot(checkpoint.snapshot),
    writtenAt: Number.isFinite(checkpoint.writtenAt) ? checkpoint.writtenAt : 0,
  };
}

async function writeCheckpoint(db, revision, snapshot) {
  const tx = db.transaction(CHECKPOINT_STORE, 'readwrite');
  const checkpointStore = tx.objectStore(CHECKPOINT_STORE);

  checkpointStore.put({
    id: CHECKPOINT_ID,
    revision,
    snapshot,
    writtenAt: Date.now(),
  });

  await transactionToPromise(tx);
}

function createNoopController() {
  const health = {
    restoreFailures: 0,
    writeFailures: 0,
    lastRestoreFailureAt: 0,
    lastWriteFailureAt: 0,
    lastRestoreFailureMessage: '',
    lastWriteFailureMessage: '',
  };

  return {
    restoredFocusedPath: null,
    flush: async () => {},
    destroy: async () => {},
    getHealth: () => ({ ...health }),
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

  const flushDelayMs = Number.isFinite(options.flushDelayMs)
    ? Math.max(0, Math.floor(options.flushDelayMs))
    : DEFAULT_FLUSH_DELAY_MS;
  const idleTimeoutMs = Number.isFinite(options.idleTimeoutMs)
    ? Math.max(50, Math.floor(options.idleTimeoutMs))
    : DEFAULT_IDLE_TIMEOUT_MS;
  const presenceHeartbeatMs = Number.isFinite(options.presenceHeartbeatMs)
    ? Math.max(500, Math.floor(options.presenceHeartbeatMs))
    : PRESENCE_HEARTBEAT_MS;
  const presenceStaleMs = Number.isFinite(options.presenceStaleMs)
    ? Math.max(presenceHeartbeatMs + 300, Math.floor(options.presenceStaleMs))
    : PRESENCE_STALE_MS;
  const ownerReclaimGraceMs = Number.isFinite(options.ownerReclaimGraceMs)
    ? Math.max(120, Math.floor(options.ownerReclaimGraceMs))
    : DEFAULT_OWNER_RECLAIM_GRACE_MS;
  const restoreOnStart = options.restoreOnStart !== false;
  const requestPeerStateOnStart = options.requestPeerStateOnStart !== false;
  const runtimeIdCandidate = typeof windowManager.getRuntimeId === 'function' ? windowManager.getRuntimeId() : '';
  const runtimeId =
    typeof runtimeIdCandidate === 'string' && runtimeIdCandidate.trim()
      ? runtimeIdCandidate
      : createOpaqueId('runtime');
  const syncScopeId = resolveSyncScopeId();

  const db = await openWindowSessionDb();
  if (!db) {
    return createNoopController();
  }

  let restoredFocusedPath = null;
  let lastPersistedSnapshot = null;
  let localSyncSequence = 0;
  let hasSeenInitialSubscription = false;
  let suppressBroadcastOnce = false;
  let isDestroyed = false;
  let isHydratingRemote = false;
  const health = {
    restoreFailures: 0,
    writeFailures: 0,
    lastRestoreFailureAt: 0,
    lastWriteFailureAt: 0,
    lastRestoreFailureMessage: '',
    lastWriteFailureMessage: '',
  };

  function noteRestoreFailure(error) {
    health.restoreFailures += 1;
    health.lastRestoreFailureAt = Date.now();
    health.lastRestoreFailureMessage = error instanceof Error ? error.message : String(error ?? 'unknown-error');

    if (IS_DEV && typeof console !== 'undefined') {
      console.warn('[window-session] restore failed; continuing with in-memory state.', error);
    }
  }

  function noteWriteFailure(error) {
    health.writeFailures += 1;
    health.lastWriteFailureAt = Date.now();
    health.lastWriteFailureMessage = error instanceof Error ? error.message : String(error ?? 'unknown-error');

    if (IS_DEV && typeof console !== 'undefined') {
      console.warn('[window-session] write failed; continuing with in-memory state.', error);
    }
  }

  if (restoreOnStart) {
    try {
      const restored = await readPersistedSession(db);
      if (shouldRestoreSnapshot(restored, readSessionClearedAt())) {
        suppressBroadcastOnce = true;
        restoredFocusedPath = windowManager.hydratePersistedState(localizeSnapshotForHydration(restored.snapshot));
      }
    } catch (error) {
      noteRestoreFailure(error);
    }
  }

  lastPersistedSnapshot = serializeWindowManagerSnapshot(windowManager.getSnapshot());

  let flushTimerId = 0;
  let broadcastTimerId = 0;
  let heartbeatTimerId = 0;
  let staleSweepTimerId = 0;
  let ownerReclaimTimerId = 0;
  let pendingSnapshot = null;
  let flushInFlight = false;
  let unsubscribe = null;
  let syncChannel = null;
  let presenceChannel = null;
  const activeRuntimeSeenAt = new Map([[runtimeId, Date.now()]]);
  const latestRemoteSequence = new Map();
  let latestLocalSnapshotForSync = lastPersistedSnapshot;
  let lastBroadcastSnapshotForSync = lastPersistedSnapshot;

  function localizeSnapshotForHydration(snapshotLike) {
    const normalized = serializeWindowManagerSnapshot(snapshotLike ?? createEmptySnapshot());
    const localWorkspaceRect = windowManager.getSnapshot()?.workspaceRect;

    if (isRecord(localWorkspaceRect)) {
      normalized.workspaceRect = cloneWorkspaceRect(localWorkspaceRect);
    }

    return normalized;
  }

  function activeRuntimeIds(now = Date.now()) {
    const activeIds = new Set([runtimeId]);

    for (const [candidateRuntimeId, seenAt] of activeRuntimeSeenAt.entries()) {
      if (candidateRuntimeId === runtimeId) {
        continue;
      }

      if (!Number.isFinite(seenAt) || now - seenAt > presenceStaleMs) {
        continue;
      }

      activeIds.add(candidateRuntimeId);
    }

    return activeIds;
  }

  function reconcileOwnershipFromPresence() {
    if (typeof windowManager.reconcileOwnership !== 'function') {
      return;
    }

    try {
      windowManager.reconcileOwnership(activeRuntimeIds());
    } catch {
      // Ignore runtime reconciliation failures.
    }
  }

  function touchRuntimePresence(otherRuntimeId, seenAt = Date.now()) {
    if (typeof otherRuntimeId !== 'string' || !otherRuntimeId.trim() || otherRuntimeId === runtimeId) {
      return;
    }

    const previous = activeRuntimeSeenAt.get(otherRuntimeId);
    if (Number.isFinite(previous) && previous >= seenAt) {
      return;
    }

    activeRuntimeSeenAt.set(otherRuntimeId, seenAt);
    reconcileOwnershipFromPresence();
  }

  function reclaimOrphanedWindows() {
    if (typeof windowManager.claimWindowsOwnedByInactiveRuntimes !== 'function') {
      return;
    }

    try {
      windowManager.claimWindowsOwnedByInactiveRuntimes(activeRuntimeIds());
    } catch {
      // Ignore orphan-claim failures.
    }
  }

  function scheduleOrphanReclaim() {
    if (isDestroyed || ownerReclaimTimerId) {
      return;
    }

    ownerReclaimTimerId = window.setTimeout(() => {
      ownerReclaimTimerId = 0;
      if (isDestroyed) {
        return;
      }

      reclaimOrphanedWindows();
      reconcileOwnershipFromPresence();
    }, ownerReclaimGraceMs);
  }

  function pruneStaleRuntimes(now = Date.now()) {
    let removed = false;

    for (const [candidateRuntimeId, seenAt] of activeRuntimeSeenAt.entries()) {
      if (candidateRuntimeId === runtimeId) {
        continue;
      }

      if (!Number.isFinite(seenAt) || now - seenAt <= presenceStaleMs) {
        continue;
      }

      activeRuntimeSeenAt.delete(candidateRuntimeId);
      removed = true;
    }

    if (removed) {
      reclaimOrphanedWindows();
      reconcileOwnershipFromPresence();
    }
  }

  function postPresence(type) {
    if (!presenceChannel || isDestroyed) {
      return;
    }

    try {
      presenceChannel.postMessage({
        protocol: PRESENCE_PROTOCOL,
        type,
        scopeId: syncScopeId,
        runtimeId,
        sentAt: Date.now(),
      });
    } catch {
      // Ignore cross-tab presence send failures.
    }
  }

  function postSyncMessage(kind, payload = {}) {
    if (!syncChannel || isDestroyed) {
      return;
    }

    localSyncSequence += 1;

    try {
      syncChannel.postMessage({
        protocol: SESSION_SYNC_PROTOCOL,
        kind,
        scopeId: syncScopeId,
        runtimeId,
        sequence: localSyncSequence,
        sentAt: Date.now(),
        ...payload,
      });
    } catch {
      // Ignore cross-tab sync send failures.
    }
  }

  function postSnapshot(snapshot) {
    if (!snapshot) {
      return;
    }

    postSyncMessage('snapshot', { snapshot });
  }

  function postDelta(delta) {
    if (!delta) {
      return;
    }

    postSyncMessage('delta', { delta });
  }

  function flushSyncBroadcast(options = {}) {
    const allowWhenDestroyed = options.allowWhenDestroyed === true;
    if ((!allowWhenDestroyed && isDestroyed) || !syncChannel) {
      return;
    }

    const sharedDelta = createSharedWindowSessionDelta(lastBroadcastSnapshotForSync, latestLocalSnapshotForSync);
    if (!sharedDelta) {
      lastBroadcastSnapshotForSync = latestLocalSnapshotForSync;
      return;
    }

    postDelta(sharedDelta);
    lastBroadcastSnapshotForSync = latestLocalSnapshotForSync;
  }

  function scheduleSyncBroadcast(delay = DEFAULT_SYNC_BROADCAST_DELAY_MS) {
    if (isDestroyed || !syncChannel || broadcastTimerId) {
      return;
    }

    broadcastTimerId = window.setTimeout(() => {
      broadcastTimerId = 0;
      flushSyncBroadcast();
    }, delay);
  }

  function flushSyncBroadcastNow(options = {}) {
    const allowWhenDestroyed = options.allowWhenDestroyed === true;
    if ((!allowWhenDestroyed && isDestroyed) || !syncChannel) {
      return;
    }

    if (broadcastTimerId) {
      window.clearTimeout(broadcastTimerId);
      broadcastTimerId = 0;
    }

    latestLocalSnapshotForSync = serializeWindowManagerSnapshot(windowManager.getSnapshot());
    flushSyncBroadcast({ allowWhenDestroyed });
  }

  function requestPeerState() {
    if (!syncChannel || isDestroyed) {
      return;
    }

    try {
      syncChannel.postMessage({
        protocol: SESSION_SYNC_PROTOCOL,
        kind: 'state-request',
        scopeId: syncScopeId,
        runtimeId,
        sentAt: Date.now(),
      });
    } catch {
      // Ignore sync request failures.
    }
  }

  function applyRemoteSnapshot(snapshotLike, sourceRuntimeId) {
    if (!snapshotLike || isDestroyed) {
      return;
    }

    if (typeof sourceRuntimeId === 'string' && sourceRuntimeId.trim()) {
      touchRuntimePresence(sourceRuntimeId, Date.now());
    }

    const localized = localizeSnapshotForHydration(snapshotLike);
    const currentSnapshot = windowManager.getSnapshot();
    if (Array.isArray(currentSnapshot?.windowOrder) && currentSnapshot.windowOrder.length > 0) {
      return;
    }

    suppressBroadcastOnce = true;
    isHydratingRemote = true;
    try {
      windowManager.hydratePersistedState(localized);
    } catch {
      // Ignore malformed remote snapshots.
    } finally {
      isHydratingRemote = false;
    }
  }

  function applyRemoteDelta(deltaLike, sourceRuntimeId) {
    if (!deltaLike || isDestroyed) {
      return;
    }

    if (typeof sourceRuntimeId === 'string' && sourceRuntimeId.trim()) {
      touchRuntimePresence(sourceRuntimeId, Date.now());
    }

    const sharedDelta = sanitizeSharedDelta(deltaLike);
    if (!sharedDelta) {
      return;
    }

    const currentSnapshot = windowManager.getSnapshot();
    const mergedSnapshot = applyWindowSessionDelta(currentSnapshot, sharedDelta);
    if (isRecord(currentSnapshot?.workspaceRect)) {
      mergedSnapshot.workspaceRect = cloneWorkspaceRect(currentSnapshot.workspaceRect);
    }

    suppressBroadcastOnce = true;
    isHydratingRemote = true;
    try {
      windowManager.hydratePersistedState(mergedSnapshot);
    } catch {
      // Ignore malformed remote deltas.
    } finally {
      isHydratingRemote = false;
    }
  }

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

        const delta = createWindowSessionDelta(lastPersistedSnapshot, snapshotToPersist);
        if (!delta) {
          lastPersistedSnapshot = snapshotToPersist;
          continue;
        }

        const nextRevision = Date.now();
        await writeCheckpoint(db, nextRevision, snapshotToPersist);
        lastPersistedSnapshot = snapshotToPersist;
      }
    } catch (error) {
      noteWriteFailure(error);
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
    flushSyncBroadcastNow();
    postPresence('bye');
    void flushPending({ force: true });
  }

  function onVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      void flushPending({ force: true });
      return;
    }

    activeRuntimeSeenAt.set(runtimeId, Date.now());
    postPresence('hello');
    requestPeerState();
    scheduleOrphanReclaim();
    reconcileOwnershipFromPresence();
  }

  function onBeforeUnload() {
    flushSyncBroadcastNow();
    postPresence('bye');
  }

  function onSyncMessage(event) {
    const message = event?.data;
    if (!isRecord(message) || message.protocol !== SESSION_SYNC_PROTOCOL) {
      return;
    }
    if (message.scopeId !== syncScopeId) {
      return;
    }

    const sourceRuntimeId =
      typeof message.runtimeId === 'string' && message.runtimeId.trim() ? message.runtimeId : null;
    if (!sourceRuntimeId || sourceRuntimeId === runtimeId) {
      return;
    }

    touchRuntimePresence(sourceRuntimeId, Number.isFinite(message.sentAt) ? message.sentAt : Date.now());

    if (message.kind === 'state-request') {
      postSnapshot(serializeWindowManagerSnapshot(windowManager.getSnapshot()));
      return;
    }

    if (message.kind === 'delta') {
      applyRemoteDelta(message.delta, sourceRuntimeId);
      return;
    }

    if (message.kind !== 'snapshot') {
      return;
    }

    const incomingSequence = Number(message.sequence);
    if (!Number.isInteger(incomingSequence) || incomingSequence < 1) {
      return;
    }

    const previousSequence = latestRemoteSequence.get(sourceRuntimeId) ?? 0;
    if (incomingSequence <= previousSequence) {
      return;
    }
    latestRemoteSequence.set(sourceRuntimeId, incomingSequence);

    applyRemoteSnapshot(message.snapshot, sourceRuntimeId);
  }

  function onPresenceMessage(event) {
    const message = event?.data;
    if (!isRecord(message) || message.protocol !== PRESENCE_PROTOCOL) {
      return;
    }
    if (message.scopeId !== syncScopeId) {
      return;
    }

    const sourceRuntimeId =
      typeof message.runtimeId === 'string' && message.runtimeId.trim() ? message.runtimeId : null;
    if (!sourceRuntimeId || sourceRuntimeId === runtimeId) {
      return;
    }

    if (message.type === 'bye') {
      if (activeRuntimeSeenAt.delete(sourceRuntimeId)) {
        reclaimOrphanedWindows();
        reconcileOwnershipFromPresence();
      }
      return;
    }

    touchRuntimePresence(sourceRuntimeId, Number.isFinite(message.sentAt) ? message.sentAt : Date.now());

    if (message.type === 'probe') {
      postPresence('heartbeat');
    }
  }

  unsubscribe = windowManager.subscribe((snapshot) => {
    if (isDestroyed) {
      return;
    }

    const normalizedSnapshot = serializeWindowManagerSnapshot(snapshot);
    pendingSnapshot = normalizedSnapshot;
    latestLocalSnapshotForSync = normalizedSnapshot;
    scheduleFlush();

    if (!hasSeenInitialSubscription) {
      hasSeenInitialSubscription = true;
      suppressBroadcastOnce = false;
      lastBroadcastSnapshotForSync = normalizedSnapshot;
      return;
    }

    if (isHydratingRemote || suppressBroadcastOnce) {
      suppressBroadcastOnce = false;
      lastBroadcastSnapshotForSync = normalizedSnapshot;
      return;
    }

    scheduleSyncBroadcast();
  });

  if (hasBroadcastChannel()) {
    try {
      syncChannel = new window.BroadcastChannel(SESSION_SYNC_CHANNEL_NAME);
      syncChannel.addEventListener('message', onSyncMessage);
    } catch {
      syncChannel = null;
    }

    try {
      presenceChannel = new window.BroadcastChannel(PRESENCE_CHANNEL_NAME);
      presenceChannel.addEventListener('message', onPresenceMessage);
    } catch {
      presenceChannel = null;
    }
  }

  if (presenceChannel) {
    postPresence('hello');
    postPresence('probe');
    heartbeatTimerId = window.setInterval(() => {
      if (isDestroyed) {
        return;
      }

      activeRuntimeSeenAt.set(runtimeId, Date.now());
      postPresence('heartbeat');
      pruneStaleRuntimes(Date.now());
    }, presenceHeartbeatMs);

    staleSweepTimerId = window.setInterval(() => {
      if (isDestroyed) {
        return;
      }

      pruneStaleRuntimes(Date.now());
    }, Math.max(500, Math.floor(presenceHeartbeatMs / 2)));
  }

  if (syncChannel && requestPeerStateOnStart) {
    requestPeerState();
  }

  scheduleOrphanReclaim();
  reconcileOwnershipFromPresence();

  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('beforeunload', onBeforeUnload);
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

    if (broadcastTimerId) {
      window.clearTimeout(broadcastTimerId);
      broadcastTimerId = 0;
    }

    if (heartbeatTimerId) {
      window.clearInterval(heartbeatTimerId);
      heartbeatTimerId = 0;
    }

    if (staleSweepTimerId) {
      window.clearInterval(staleSweepTimerId);
      staleSweepTimerId = 0;
    }

    if (ownerReclaimTimerId) {
      window.clearTimeout(ownerReclaimTimerId);
      ownerReclaimTimerId = 0;
    }

    flushSyncBroadcastNow({ allowWhenDestroyed: true });
    postPresence('bye');
    window.removeEventListener('pagehide', onPageHide);
    window.removeEventListener('beforeunload', onBeforeUnload);
    document.removeEventListener('visibilitychange', onVisibilityChange);

    if (typeof unsubscribe === 'function') {
      unsubscribe();
      unsubscribe = null;
    }

    if (!pendingSnapshot) {
      pendingSnapshot = serializeWindowManagerSnapshot(windowManager.getSnapshot());
    }

    await flushPending({ force: true });
    syncChannel?.removeEventListener('message', onSyncMessage);
    presenceChannel?.removeEventListener('message', onPresenceMessage);
    syncChannel?.close();
    presenceChannel?.close();
    db.close();
  }

  return {
    restoredFocusedPath,
    flush: () => flushPending({ force: true }),
    destroy,
    getHealth: () => ({ ...health }),
  };
}
