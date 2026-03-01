import { get, writable } from 'svelte/store';
import { APP_DEFINITIONS, DEFAULT_APP_ID } from '../navigation/siteManifest.js';
import {
  MIN_WINDOW_HEIGHT,
  MIN_WINDOW_WIDTH,
  clampBoundsToWorkspace,
  clampPositionToWorkspace,
  cloneBounds,
  computeResizedBounds,
  makeCenteredBounds,
} from './windowManager/geometry.js';
import { canStepWindowHistory, pushWindowHistory } from './windowManager/history.js';
import {
  hasSameLastRouteIdentity,
  hasSameRouteIdentity,
  resolveNavigationWindowForApp,
  toLastSegmentLabel,
} from './windowManager/routing.js';
import {
  cloneState,
  createInitialState,
  createWindowFromRoute,
  focusWindow,
  highestVisibleWindowId,
  withUpdatedWindow,
} from './windowManager/state.js';

export function createWindowManagerStore() {
  const store = writable(createInitialState());
  const runtimeId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `runtime-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

  function toPositiveWindowId(value) {
    const numeric = Number(value);
    return Number.isInteger(numeric) && numeric > 0 ? numeric : null;
  }

  function isOwnedByRuntime(windowState) {
    return windowState?.ownerRuntimeId === runtimeId;
  }

  function sanitizeWorkspaceRect(candidateRect, fallbackRect) {
    const fallbackWidth = Math.max(Math.floor(fallbackRect?.width ?? 0), MIN_WINDOW_WIDTH);
    const fallbackHeight = Math.max(Math.floor(fallbackRect?.height ?? 0), MIN_WINDOW_HEIGHT);

    const width = Math.max(Math.floor(candidateRect?.width ?? fallbackWidth), MIN_WINDOW_WIDTH);
    const height = Math.max(Math.floor(candidateRect?.height ?? fallbackHeight), MIN_WINDOW_HEIGHT);

    return { width, height };
  }

  function sanitizeLooseBounds(candidateBounds, fallbackBounds = null) {
    const fallback = fallbackBounds ?? { x: 0, y: 0, width: 640, height: 420 };

    return {
      x: Number.isFinite(candidateBounds?.x) ? Math.round(candidateBounds.x) : fallback.x,
      y: Number.isFinite(candidateBounds?.y) ? Math.round(candidateBounds.y) : fallback.y,
      width: Number.isFinite(candidateBounds?.width) ? Math.max(1, Math.round(candidateBounds.width)) : fallback.width,
      height: Number.isFinite(candidateBounds?.height)
        ? Math.max(1, Math.round(candidateBounds.height))
        : fallback.height,
    };
  }

  function toRoutePath(routeLike, appId, defaultSubroute = '') {
    const normalizedSubroute =
      typeof defaultSubroute === 'string'
        ? defaultSubroute
            .replace(/^\/+|\/+$/g, '')
            .split('/')
            .filter(Boolean)
            .join('/')
        : '';
    const defaultPath = normalizedSubroute ? `/${appId}/${normalizedSubroute}` : `/${appId}`;
    const candidatePath = typeof routeLike?.path === 'string' ? routeLike.path.trim() : '';

    if (!candidatePath) {
      return defaultPath;
    }

    return candidatePath.startsWith('/') ? candidatePath : `/${candidatePath}`;
  }

  function sanitizeHistory(historyLike, fallbackPath, fallbackSubroute, fallbackRouteKey) {
    const entryCandidates = Array.isArray(historyLike?.entries) ? historyLike.entries : [];
    const entries = [];

    for (const entry of entryCandidates) {
      const path = typeof entry?.path === 'string' && entry.path.trim() ? entry.path : null;
      if (!path) {
        continue;
      }

      const subroute = typeof entry?.subroute === 'string' ? entry.subroute : '';
      const routeKey = typeof entry?.routeKey === 'string' && entry.routeKey.trim() ? entry.routeKey : null;

      entries.push({
        path,
        subroute,
        routeKey: routeKey ?? `${path}::${subroute}`,
      });
    }

    if (!entries.length) {
      entries.push({
        path: fallbackPath,
        subroute: fallbackSubroute,
        routeKey: fallbackRouteKey,
      });
    }

    const indexCandidate = Number(historyLike?.index);
    const index = Number.isInteger(indexCandidate)
      ? Math.max(0, Math.min(indexCandidate, entries.length - 1))
      : entries.length - 1;

    return {
      entries,
      index,
    };
  }

  function sanitizePersistedWindow(windowLike, windowId, workspaceRect) {
    const appId = typeof windowLike?.appId === 'string' ? windowLike.appId : null;
    const appDefinition = appId ? APP_DEFINITIONS[appId] : null;
    if (!appDefinition) {
      return null;
    }

    const path = toRoutePath(windowLike, appId, appDefinition.defaultSubroute ?? '');
    const subroute = typeof windowLike?.subroute === 'string' ? windowLike.subroute : '';
    const routeKey =
      typeof windowLike?.routeKey === 'string' && windowLike.routeKey.trim()
        ? windowLike.routeKey
        : `${appId}::${path}`;
    const ownerRuntimeId =
      typeof windowLike?.ownerRuntimeId === 'string' && windowLike.ownerRuntimeId.trim()
        ? windowLike.ownerRuntimeId
        : runtimeId;
    const isOwnedLocally = ownerRuntimeId === runtimeId;

    const nextBoundsCandidate =
      windowLike?.bounds && typeof windowLike.bounds === 'object'
        ? windowLike.bounds
        : makeCenteredBounds(workspaceRect, windowId, appDefinition?.initialBounds ?? null);
    const nextBounds = isOwnedLocally
      ? clampBoundsToWorkspace(workspaceRect, nextBoundsCandidate)
      : sanitizeLooseBounds(nextBoundsCandidate);

    const restoreBoundsCandidate =
      windowLike?.restoreBounds && typeof windowLike.restoreBounds === 'object'
        ? windowLike.restoreBounds
        : nextBounds;
    const restoreBounds = isOwnedLocally
      ? clampBoundsToWorkspace(workspaceRect, restoreBoundsCandidate)
      : sanitizeLooseBounds(restoreBoundsCandidate, nextBounds);

    const isMaximized = Boolean(windowLike?.isMaximized);
    const history = sanitizeHistory(windowLike?.history, path, subroute, routeKey);
    const minimizeReason =
      windowLike?.minimizeReason === 'user' || windowLike?.minimizeReason === 'offline' ? windowLike.minimizeReason : null;

    return {
      windowId,
      appId,
      title: appDefinition.title,
      path,
      subroute,
      routeKey,
      routeLabel: toLastSegmentLabel(path),
      hasSidebar: Boolean(appDefinition.hasSidebar),
      showWindowHistoryNavigation: Boolean(appDefinition.enableWindowHistoryNavigation),
      isSidebarCollapsed: Boolean(windowLike?.isSidebarCollapsed) && Boolean(appDefinition.hasSidebar),
      isMinimized: Boolean(windowLike?.isMinimized),
      minimizeReason,
      ownerRuntimeId,
      isMaximized,
      bounds: isMaximized && isOwnedLocally
        ? {
            x: 0,
            y: 0,
            width: workspaceRect.width,
            height: workspaceRect.height,
          }
        : cloneBounds(nextBounds),
      restoreBounds: cloneBounds(restoreBounds),
      history,
      createdAt: Number.isFinite(windowLike?.createdAt) ? windowLike.createdAt : Date.now(),
      lastFocusedAt: Number.isFinite(windowLike?.lastFocusedAt) ? windowLike.lastFocusedAt : Date.now(),
    };
  }

  function sanitizePersistedState(state, persistedState) {
    const next = createInitialState();
    next.workspaceRect = sanitizeWorkspaceRect(persistedState?.workspaceRect, state.workspaceRect);

    const rawWindows =
      persistedState?.windows && typeof persistedState.windows === 'object' ? persistedState.windows : {};
    const rawOrder = Array.isArray(persistedState?.windowOrder) ? persistedState.windowOrder : [];
    const seenWindowIds = new Set();

    for (const rawWindowId of rawOrder) {
      const windowId = toPositiveWindowId(rawWindowId);
      if (!windowId || seenWindowIds.has(windowId)) {
        continue;
      }

      const candidate = rawWindows[windowId] ?? rawWindows[String(windowId)];
      const sanitizedWindow = sanitizePersistedWindow(candidate, windowId, next.workspaceRect);
      if (!sanitizedWindow) {
        continue;
      }

      next.windows[windowId] = sanitizedWindow;
      next.windowOrder.push(windowId);
      seenWindowIds.add(windowId);
    }

    for (const [rawWindowId, candidate] of Object.entries(rawWindows)) {
      const windowId = toPositiveWindowId(rawWindowId);
      if (!windowId || seenWindowIds.has(windowId)) {
        continue;
      }

      const sanitizedWindow = sanitizePersistedWindow(candidate, windowId, next.workspaceRect);
      if (!sanitizedWindow) {
        continue;
      }

      next.windows[windowId] = sanitizedWindow;
      next.windowOrder.push(windowId);
      seenWindowIds.add(windowId);
    }

    const maxWindowId = next.windowOrder.reduce((highest, id) => Math.max(highest, id), 0);
    const persistedNextWindowId = toPositiveWindowId(persistedState?.nextWindowId);
    next.nextWindowId = persistedNextWindowId ? Math.max(persistedNextWindowId, maxWindowId + 1) : maxWindowId + 1;

    const focusedWindowId = toPositiveWindowId(persistedState?.focusedWindowId);
    const focusedWindow = focusedWindowId ? next.windows[focusedWindowId] : null;
    if (focusedWindow && !focusedWindow.isMinimized && isOwnedByRuntime(focusedWindow)) {
      next.focusedWindowId = focusedWindowId;
    } else {
      next.focusedWindowId = highestVisibleWindowId(next, runtimeId);
    }

    if (next.focusedWindowId && next.windows[next.focusedWindowId]) {
      const focused = next.windows[next.focusedWindowId];
      next.windows[next.focusedWindowId] = {
        ...focused,
        lastFocusedAt: Number.isFinite(focused.lastFocusedAt) ? focused.lastFocusedAt : Date.now(),
      };
    }

    const lastRoute = persistedState?.lastRoute;
    const lastRouteAppId = typeof lastRoute?.appId === 'string' ? lastRoute.appId : null;
    if (lastRouteAppId && APP_DEFINITIONS[lastRouteAppId] && typeof lastRoute?.path === 'string') {
      next.lastRoute = {
        appId: lastRouteAppId,
        path: lastRoute.path,
        subroute: typeof lastRoute?.subroute === 'string' ? lastRoute.subroute : '',
        routeKey:
          typeof lastRoute?.routeKey === 'string' && lastRoute.routeKey.trim()
            ? lastRoute.routeKey
            : `${lastRouteAppId}::${lastRoute.path}`,
      };
    } else {
      next.lastRoute = null;
    }

    return next;
  }

  function ensureOwnedFocus(next) {
    const focusedWindow = next.focusedWindowId ? next.windows[next.focusedWindowId] : null;
    const focusedVisibleOwned = Boolean(focusedWindow && !focusedWindow.isMinimized && isOwnedByRuntime(focusedWindow));

    if (focusedVisibleOwned) {
      return;
    }

    next.focusedWindowId = highestVisibleWindowId(next, runtimeId);
    if (!next.focusedWindowId) {
      return;
    }

    const target = next.windows[next.focusedWindowId];
    if (!target) {
      next.focusedWindowId = null;
      return;
    }

    next.windows[next.focusedWindowId] = {
      ...target,
      lastFocusedAt: Date.now(),
    };
  }

  function applyRoute(route) {
    store.update((state) => {
      const shouldForceDuplicate = route.openMode === 'new-window';
      const preselectedWindowId = shouldForceDuplicate
        ? null
        : resolveNavigationWindowForApp(state, route, APP_DEFINITIONS);
      const preselectedWindow = preselectedWindowId ? state.windows[preselectedWindowId] : null;
      const isStrictNoOp =
        Boolean(preselectedWindow) &&
        hasSameRouteIdentity(preselectedWindow, route) &&
        state.focusedWindowId === preselectedWindowId &&
        isOwnedByRuntime(preselectedWindow) &&
        !preselectedWindow.isMinimized &&
        hasSameLastRouteIdentity(state.lastRoute, route);

      if (isStrictNoOp) {
        return state;
      }

      const next = cloneState(state);
      next.lastRoute = {
        appId: route.appId,
        path: route.path,
        subroute: route.subroute,
        routeKey: route.routeKey,
      };

      if (!route.appId) {
        next.focusedWindowId = null;

        for (const windowId of next.windowOrder) {
          const win = next.windows[windowId];

          if (!win || win.isMinimized) {
            continue;
          }

          next.windows[windowId] = {
            ...win,
            isMinimized: true,
            minimizeReason: 'user',
          };
        }

        return next;
      }

      if (!APP_DEFINITIONS[route.appId]) {
        return next;
      }

      let targetWindowId = shouldForceDuplicate ? null : resolveNavigationWindowForApp(next, route, APP_DEFINITIONS);

      if (!targetWindowId) {
        targetWindowId = createWindowFromRoute(next, route, APP_DEFINITIONS, { ownerRuntimeId: runtimeId });
      } else {
        const target = next.windows[targetWindowId];
        if (!hasSameRouteIdentity(target, route)) {
          const nextHistory = pushWindowHistory(target.history, route);
          next.windows[targetWindowId] = {
            ...target,
            path: route.path,
            subroute: route.subroute,
            routeKey: route.routeKey,
            routeLabel: toLastSegmentLabel(route.path),
            history: nextHistory,
          };
        }
      }

      focusWindow(next, targetWindowId, { restoreMinimized: true, ownerRuntimeId: runtimeId });
      return next;
    });
  }

  function setWorkspaceRect(rect) {
    store.update((state) => {
      const normalizedWidth = Math.max(Math.floor(rect?.width ?? 0), MIN_WINDOW_WIDTH);
      const normalizedHeight = Math.max(Math.floor(rect?.height ?? 0), MIN_WINDOW_HEIGHT);

      if (state.workspaceRect.width === normalizedWidth && state.workspaceRect.height === normalizedHeight) {
        return state;
      }

      const next = cloneState(state);
      next.workspaceRect = {
        width: normalizedWidth,
        height: normalizedHeight,
      };

      for (const windowId of next.windowOrder) {
        const win = next.windows[windowId];

        if (!win || !isOwnedByRuntime(win)) {
          continue;
        }

        if (win.isMaximized) {
          const nextRestoreBounds = win.restoreBounds
            ? clampBoundsToWorkspace(next.workspaceRect, win.restoreBounds)
            : makeCenteredBounds(next.workspaceRect, windowId);

          next.windows[windowId] = {
            ...win,
            restoreBounds: cloneBounds(nextRestoreBounds),
            bounds: {
              x: 0,
              y: 0,
              width: normalizedWidth,
              height: normalizedHeight,
            },
          };
          continue;
        }

        const nextBounds = clampBoundsToWorkspace(next.workspaceRect, win.bounds);

        next.windows[windowId] = {
          ...win,
          bounds: nextBounds,
        };
      }

      return next;
    });
  }

  function focusExistingWindow(windowId) {
    store.update((state) => {
      const target = state.windows[windowId];

      if (!target) {
        return state;
      }

      if (state.focusedWindowId === windowId && !target.isMinimized && isOwnedByRuntime(target)) {
        return state;
      }

      const next = cloneState(state);
      focusWindow(next, windowId, { restoreMinimized: true, ownerRuntimeId: runtimeId });
      return next;
    });
  }

  function activateWindowFromSidebar(windowId) {
    store.update((state) => {
      const target = state.windows[windowId];

      if (!target) {
        return state;
      }

      const isFocused = state.focusedWindowId === windowId && !target.isMinimized && isOwnedByRuntime(target);
      const next = cloneState(state);

      if (isFocused) {
        next.windows[windowId] = {
          ...target,
          isMinimized: true,
          minimizeReason: 'user',
        };

        const nextVisibleWindowId = highestVisibleWindowId(next, runtimeId);
        next.focusedWindowId = nextVisibleWindowId;

        if (nextVisibleWindowId) {
          next.windows[nextVisibleWindowId] = {
            ...next.windows[nextVisibleWindowId],
            lastFocusedAt: Date.now(),
          };
        }

        return next;
      }

      focusWindow(next, windowId, { restoreMinimized: true, ownerRuntimeId: runtimeId });
      return next;
    });
  }

  function toggleMinimize(windowId) {
    store.update((state) => {
      const target = state.windows[windowId];

      if (!target) {
        return state;
      }

      const next = cloneState(state);
      const current = next.windows[windowId];

      if (current.isMinimized) {
        focusWindow(next, windowId, { restoreMinimized: true, ownerRuntimeId: runtimeId });
        return next;
      }

      next.windows[windowId] = {
        ...current,
        isMinimized: true,
        minimizeReason: 'user',
      };

      if (next.focusedWindowId === windowId || !next.windows[next.focusedWindowId]) {
        const nextVisibleWindowId = highestVisibleWindowId(next, runtimeId);
        next.focusedWindowId = nextVisibleWindowId;

        if (nextVisibleWindowId) {
          next.windows[nextVisibleWindowId] = {
            ...next.windows[nextVisibleWindowId],
            lastFocusedAt: Date.now(),
          };
        }
      }

      return next;
    });
  }

  function toggleMaximize(windowId) {
    store.update((state) => {
      const target = state.windows[windowId];

      if (!target || !isOwnedByRuntime(target)) {
        return state;
      }

      const next = cloneState(state);
      const current = next.windows[windowId];

      if (current.isMaximized) {
        const restored = current.restoreBounds ?? makeCenteredBounds(next.workspaceRect, windowId);
        const restoredBounds = clampBoundsToWorkspace(next.workspaceRect, restored);

        next.windows[windowId] = {
          ...current,
          isMaximized: false,
          bounds: cloneBounds(restoredBounds),
          restoreBounds: cloneBounds(restoredBounds),
        };
      } else {
        next.windows[windowId] = {
          ...current,
          isMaximized: true,
          restoreBounds: cloneBounds(current.bounds),
          bounds: {
            x: 0,
            y: 0,
            width: next.workspaceRect.width,
            height: next.workspaceRect.height,
          },
        };
      }

      focusWindow(next, windowId, { restoreMinimized: true, ownerRuntimeId: runtimeId });
      return next;
    });
  }

  function toggleSidebar(windowId) {
    store.update((state) => {
      const target = state.windows[windowId];

      if (!target || !target.hasSidebar || !isOwnedByRuntime(target)) {
        return state;
      }

      const next = cloneState(state);
      next.windows[windowId] = {
        ...target,
        isSidebarCollapsed: !target.isSidebarCollapsed,
      };
      return next;
    });
  }

  function moveWindow(windowId, position) {
    store.update((state) => {
      const target = state.windows[windowId];

      if (!target || target.isMaximized || !isOwnedByRuntime(target)) {
        return state;
      }

      const nextPosition = clampPositionToWorkspace(
        state.workspaceRect,
        target.bounds,
        position?.x ?? target.bounds.x,
        position?.y ?? target.bounds.y,
      );

      if (nextPosition.x === target.bounds.x && nextPosition.y === target.bounds.y) {
        return state;
      }

      return withUpdatedWindow(state, windowId, {
        ...target,
        bounds: {
          ...target.bounds,
          x: nextPosition.x,
          y: nextPosition.y,
        },
      });
    });
  }

  function resizeWindow(windowId, payload) {
    store.update((state) => {
      const target = state.windows[windowId];

      if (!target || target.isMaximized || !isOwnedByRuntime(target)) {
        return state;
      }

      const edge = payload?.edge ?? '';
      const startBounds = payload?.startBounds ?? target.bounds;
      const deltaX = payload?.deltaX ?? 0;
      const deltaY = payload?.deltaY ?? 0;

      if (!edge) {
        return state;
      }

      const nextBounds = computeResizedBounds(state.workspaceRect, startBounds, edge, deltaX, deltaY);

      if (
        nextBounds.x === target.bounds.x &&
        nextBounds.y === target.bounds.y &&
        nextBounds.width === target.bounds.width &&
        nextBounds.height === target.bounds.height
      ) {
        return state;
      }

      return withUpdatedWindow(state, windowId, {
        ...target,
        bounds: nextBounds,
      });
    });
  }

  function stepWindowHistory(windowId, direction) {
    let targetPath = null;

    store.update((state) => {
      const target = state.windows[windowId];

      if (!target?.history || !canStepWindowHistory(target, direction) || !isOwnedByRuntime(target)) {
        return state;
      }

      const delta = direction === 'back' ? -1 : 1;
      const nextIndex = target.history.index + delta;
      const historyEntry = target.history.entries[nextIndex];

      if (!historyEntry) {
        return state;
      }

      const next = cloneState(state);
      next.windows[windowId] = {
        ...target,
        path: historyEntry.path,
        subroute: historyEntry.subroute,
        routeKey: historyEntry.routeKey,
        routeLabel: toLastSegmentLabel(historyEntry.path),
        history: {
          ...target.history,
          index: nextIndex,
        },
      };

      focusWindow(next, windowId, { restoreMinimized: true, ownerRuntimeId: runtimeId });
      targetPath = historyEntry.path;

      return next;
    });

    return targetPath;
  }

  function closeWindow(windowId, activePath = null) {
    let suggestedPath = null;

    store.update((state) => {
      const target = state.windows[windowId];

      if (!target) {
        return state;
      }

      const next = cloneState(state);
      const wasFocused = next.focusedWindowId === windowId;
      const wasActiveRoute = activePath ? target.path === activePath : false;

      delete next.windows[windowId];
      next.windowOrder = next.windowOrder.filter((id) => id !== windowId);

      if (wasFocused || next.focusedWindowId && !next.windows[next.focusedWindowId]) {
        next.focusedWindowId = highestVisibleWindowId(next, runtimeId);
      }
      ensureOwnedFocus(next);

      if (next.focusedWindowId) {
        const focused = next.windows[next.focusedWindowId];
        next.windows[next.focusedWindowId] = {
          ...focused,
          lastFocusedAt: Date.now(),
        };
      }

      if (wasFocused || wasActiveRoute) {
        if (next.focusedWindowId) {
          suggestedPath = next.windows[next.focusedWindowId].path;
        } else {
          suggestedPath = '/';
        }
      }

      return next;
    });

    return suggestedPath;
  }

  function closeAllWindows() {
    store.update((state) => {
      if (state.windowOrder.length === 0 && !state.focusedWindowId) {
        return state;
      }

      return {
        windows: {},
        windowOrder: [],
        focusedWindowId: null,
        nextWindowId: 1,
        workspaceRect: { ...state.workspaceRect },
        lastRoute: null,
      };
    });
  }

  function getDefaultPathForApp(appId) {
    const app = APP_DEFINITIONS[appId] ?? APP_DEFINITIONS[DEFAULT_APP_ID];
    const subroute = app.defaultSubroute ?? '';

    return subroute ? `/${app.id}/${subroute}` : `/${app.id}`;
  }

  function getSnapshot() {
    return get(store);
  }

  function hydratePersistedState(persistedState) {
    let focusedPath = null;

    store.update((state) => {
      const next = sanitizePersistedState(state, persistedState);
      ensureOwnedFocus(next);

      if (next.focusedWindowId && next.windows[next.focusedWindowId]) {
        focusedPath = next.windows[next.focusedWindowId].path;
      }

      return next;
    });

    return focusedPath;
  }

  function reconcileOwnership(activeRuntimeIdsLike) {
    const activeRuntimeIds = new Set(
      activeRuntimeIdsLike instanceof Set
        ? [...activeRuntimeIdsLike]
        : Array.isArray(activeRuntimeIdsLike)
          ? activeRuntimeIdsLike
          : [],
    );
    activeRuntimeIds.add(runtimeId);

    store.update((state) => {
      const next = cloneState(state);
      let hasChanges = false;

      for (const windowId of next.windowOrder) {
        const win = next.windows[windowId];
        if (!win) {
          continue;
        }

        const ownerRuntimeId =
          typeof win.ownerRuntimeId === 'string' && win.ownerRuntimeId.trim() ? win.ownerRuntimeId : null;
        if (!ownerRuntimeId) {
          continue;
        }

        const ownerIsActive = activeRuntimeIds.has(ownerRuntimeId);
        if (!ownerIsActive) {
          if (!win.isMinimized || win.minimizeReason !== 'offline') {
            next.windows[windowId] = {
              ...win,
              isMinimized: true,
              minimizeReason: 'offline',
            };
            hasChanges = true;
          }
          continue;
        }

        if (win.isMinimized && win.minimizeReason === 'offline') {
          next.windows[windowId] = {
            ...win,
            isMinimized: false,
            minimizeReason: null,
          };
          hasChanges = true;
        }
      }

      const focusedBefore = next.focusedWindowId;
      ensureOwnedFocus(next);
      if (next.focusedWindowId !== focusedBefore) {
        hasChanges = true;
      }

      return hasChanges ? next : state;
    });
  }

  function getRuntimeId() {
    return runtimeId;
  }

  return {
    subscribe: store.subscribe,
    applyRoute,
    setWorkspaceRect,
    focusExistingWindow,
    activateWindowFromSidebar,
    toggleMinimize,
    toggleMaximize,
    toggleSidebar,
    moveWindow,
    resizeWindow,
    stepWindowHistory,
    closeWindow,
    closeAllWindows,
    getDefaultPathForApp,
    getSnapshot,
    hydratePersistedState,
    reconcileOwnership,
    getRuntimeId,
  };
}

export const windowManager = createWindowManagerStore();
