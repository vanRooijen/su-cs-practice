import { get, writable } from 'svelte/store';
import { APP_DEFINITIONS, DEFAULT_APP_ID } from '../navigation/siteManifest.js';

const MIN_WINDOW_WIDTH = 420;
const MIN_WINDOW_HEIGHT = 280;
const MAX_WINDOW_HISTORY_ENTRIES = 10;

function cloneBounds(bounds) {
  return {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  };
}

function makeDefaultWorkspaceRect() {
  if (typeof window === 'undefined') {
    return { width: 1200, height: 720 };
  }

  return {
    width: Math.max(window.innerWidth - 260, 600),
    height: Math.max(window.innerHeight - 90, 400),
  };
}

function createInitialState() {
  return {
    windows: {},
    windowOrder: [],
    focusedWindowId: null,
    nextWindowId: 1,
    workspaceRect: makeDefaultWorkspaceRect(),
    lastRoute: null,
  };
}

function cloneState(state) {
  return {
    windows: { ...state.windows },
    windowOrder: [...state.windowOrder],
    focusedWindowId: state.focusedWindowId,
    nextWindowId: state.nextWindowId,
    workspaceRect: { ...state.workspaceRect },
    lastRoute: state.lastRoute ? { ...state.lastRoute } : null,
  };
}

function withUpdatedWindow(state, windowId, nextWindowState) {
  return {
    ...state,
    windows: {
      ...state.windows,
      [windowId]: nextWindowState,
    },
  };
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(value, maximum));
}

function clampBoundsToWorkspace(workspaceRect, bounds) {
  const minWidth = Math.min(MIN_WINDOW_WIDTH, workspaceRect.width);
  const minHeight = Math.min(MIN_WINDOW_HEIGHT, workspaceRect.height);
  const width = clamp(Math.round(bounds.width), minWidth, workspaceRect.width);
  const height = clamp(Math.round(bounds.height), minHeight, workspaceRect.height);

  const maxX = Math.max(0, workspaceRect.width - width);
  const maxY = Math.max(0, workspaceRect.height - height);

  return {
    x: clamp(Math.round(bounds.x), 0, maxX),
    y: clamp(Math.round(bounds.y), 0, maxY),
    width,
    height,
  };
}

function normalizeTitleSegment(segment = '') {
  const cleaned = segment
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) {
    return '';
  }

  return cleaned
    .split(' ')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
}

function toLastSegmentLabel(path = '/') {
  const pathSegments = path
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .filter(Boolean);

  if (pathSegments.length === 0) {
    return 'Home';
  }

  if (pathSegments.length === 1) {
    return normalizeTitleSegment(pathSegments[0]);
  }

  return normalizeTitleSegment(pathSegments.at(-1));
}

function makeCenteredBounds(workspaceRect, seed, preferredSize = null) {
  const preferredWidth =
    Number.isFinite(preferredSize?.width) && preferredSize.width > 0
      ? Math.round(preferredSize.width)
      : Math.floor(workspaceRect.width * 0.72);
  const preferredHeight =
    Number.isFinite(preferredSize?.height) && preferredSize.height > 0
      ? Math.round(preferredSize.height)
      : Math.floor(workspaceRect.height * 0.72);
  const width = clamp(preferredWidth, MIN_WINDOW_WIDTH, workspaceRect.width);
  const height = clamp(preferredHeight, MIN_WINDOW_HEIGHT, workspaceRect.height);

  const offsetStep = ((seed - 1) % 7) * 24;
  const baseX = Math.floor((workspaceRect.width - width) / 2);
  const baseY = Math.floor((workspaceRect.height - height) / 2);

  const maxX = Math.max(workspaceRect.width - width, 0);
  const maxY = Math.max(workspaceRect.height - height, 0);

  return {
    x: clamp(baseX + offsetStep, 0, maxX),
    y: clamp(baseY + offsetStep, 0, maxY),
    width,
    height,
  };
}

function clampPositionToWorkspace(workspaceRect, bounds, x, y) {
  const maxX = Math.max(0, workspaceRect.width - bounds.width);
  const maxY = Math.max(0, workspaceRect.height - bounds.height);

  return {
    x: clamp(Math.round(x), 0, maxX),
    y: clamp(Math.round(y), 0, maxY),
  };
}

function computeResizedBounds(workspaceRect, startBounds, edge, deltaX, deltaY) {
  const minWidth = Math.min(MIN_WINDOW_WIDTH, workspaceRect.width);
  const minHeight = Math.min(MIN_WINDOW_HEIGHT, workspaceRect.height);

  let left = startBounds.x;
  let top = startBounds.y;
  let right = startBounds.x + startBounds.width;
  let bottom = startBounds.y + startBounds.height;

  if (edge.includes('e')) {
    right += deltaX;
  }

  if (edge.includes('w')) {
    left += deltaX;
  }

  if (edge.includes('s')) {
    bottom += deltaY;
  }

  if (edge.includes('n')) {
    top += deltaY;
  }

  if (edge.includes('w')) {
    left = Math.min(left, right - minWidth);
  }

  if (edge.includes('e')) {
    right = Math.max(right, left + minWidth);
  }

  if (edge.includes('n')) {
    top = Math.min(top, bottom - minHeight);
  }

  if (edge.includes('s')) {
    bottom = Math.max(bottom, top + minHeight);
  }

  left = clamp(left, 0, workspaceRect.width);
  right = clamp(right, 0, workspaceRect.width);
  top = clamp(top, 0, workspaceRect.height);
  bottom = clamp(bottom, 0, workspaceRect.height);

  if (right - left < minWidth) {
    if (edge.includes('w')) {
      left = right - minWidth;
    } else {
      right = left + minWidth;
    }
  }

  if (bottom - top < minHeight) {
    if (edge.includes('n')) {
      top = bottom - minHeight;
    } else {
      bottom = top + minHeight;
    }
  }

  left = clamp(left, 0, workspaceRect.width - minWidth);
  right = clamp(right, minWidth, workspaceRect.width);
  top = clamp(top, 0, workspaceRect.height - minHeight);
  bottom = clamp(bottom, minHeight, workspaceRect.height);

  return {
    x: Math.round(left),
    y: Math.round(top),
    width: Math.round(right - left),
    height: Math.round(bottom - top),
  };
}

function createHistoryEntry(route) {
  return {
    path: route.path,
    subroute: route.subroute,
    routeKey: route.routeKey,
  };
}

function createWindowHistory(route) {
  return {
    entries: [createHistoryEntry(route)],
    index: 0,
  };
}

function pushWindowHistory(history, route) {
  const currentEntry = history.entries[history.index];
  if (currentEntry?.path === route.path) {
    return history;
  }

  const backEntry = history.entries[history.index - 1];
  if (backEntry?.path === route.path) {
    return {
      ...history,
      index: history.index - 1,
    };
  }

  const forwardEntry = history.entries[history.index + 1];
  if (forwardEntry?.path === route.path) {
    return {
      ...history,
      index: history.index + 1,
    };
  }

  const nextEntries = [...history.entries.slice(0, history.index + 1), createHistoryEntry(route)];

  const overflowCount = Math.max(0, nextEntries.length - MAX_WINDOW_HISTORY_ENTRIES);
  const trimmedEntries = overflowCount > 0 ? nextEntries.slice(overflowCount) : nextEntries;

  return {
    entries: trimmedEntries,
    index: trimmedEntries.length - 1,
  };
}

function canStepWindowHistory(windowState, direction) {
  const delta = direction === 'back' ? -1 : 1;
  const nextIndex = windowState.history.index + delta;
  return nextIndex >= 0 && nextIndex < windowState.history.entries.length;
}

function moveToFront(state, windowId) {
  state.windowOrder = [...state.windowOrder.filter((id) => id !== windowId), windowId];
}

function focusWindow(state, windowId, options = {}) {
  const { restoreMinimized = true } = options;
  const target = state.windows[windowId];

  if (!target) {
    return;
  }

  state.windows[windowId] = {
    ...target,
    isMinimized: restoreMinimized ? false : target.isMinimized,
    lastFocusedAt: Date.now(),
  };

  moveToFront(state, windowId);
  state.focusedWindowId = windowId;
}

function listWindowsForApp(state, appId) {
  return state.windowOrder.filter((id) => state.windows[id]?.appId === appId);
}

function hasSameRouteIdentity(windowState, route) {
  return (
    windowState?.path === route.path &&
    windowState?.subroute === route.subroute &&
    windowState?.routeKey === route.routeKey
  );
}

function hasSameLastRouteIdentity(lastRoute, route) {
  return (
    lastRoute?.appId === route.appId &&
    lastRoute?.path === route.path &&
    lastRoute?.subroute === route.subroute &&
    lastRoute?.routeKey === route.routeKey
  );
}

function resolveExactRouteWindowId(state, appWindowIds, route) {
  if (!appWindowIds.length) {
    return null;
  }

  const prioritizedWindowIds = [];
  if (state.focusedWindowId && appWindowIds.includes(state.focusedWindowId)) {
    prioritizedWindowIds.push(state.focusedWindowId);
  }

  for (let index = appWindowIds.length - 1; index >= 0; index -= 1) {
    const windowId = appWindowIds[index];
    if (!prioritizedWindowIds.includes(windowId)) {
      prioritizedWindowIds.push(windowId);
    }
  }

  for (const windowId of prioritizedWindowIds) {
    const win = state.windows[windowId];
    if (win?.routeKey === route.routeKey) {
      return windowId;
    }
  }

  for (const windowId of prioritizedWindowIds) {
    const win = state.windows[windowId];
    if (win?.path === route.path) {
      return windowId;
    }
  }

  return null;
}

function resolveNavigationWindowForApp(state, route) {
  const appConfig = APP_DEFINITIONS[route.appId];
  const appWindowIds = listWindowsForApp(state, route.appId);

  if (!appWindowIds.length) {
    return null;
  }

  const exactRouteWindowId = resolveExactRouteWindowId(state, appWindowIds, route);
  if (exactRouteWindowId) {
    return exactRouteWindowId;
  }

  if (typeof appConfig?.resolveNavigationWindowId === 'function') {
    const selected = appConfig.resolveNavigationWindowId({
      appId: route.appId,
      appWindowIds,
      focusedWindowId: state.focusedWindowId,
      windowOrder: state.windowOrder,
      windows: state.windows,
      route,
    });

    if (selected && state.windows[selected]?.appId === route.appId) {
      return selected;
    }
  }

  return appWindowIds.at(-1) ?? null;
}

function highestVisibleWindowId(state) {
  for (let index = state.windowOrder.length - 1; index >= 0; index -= 1) {
    const id = state.windowOrder[index];

    if (!state.windows[id]?.isMinimized) {
      return id;
    }
  }

  return null;
}

function createWindowFromRoute(state, route) {
  const appConfig = APP_DEFINITIONS[route.appId];
  const windowId = state.nextWindowId;

  state.nextWindowId += 1;

  const bounds = makeCenteredBounds(state.workspaceRect, windowId, appConfig?.initialBounds ?? null);

  state.windows[windowId] = {
    windowId,
    appId: route.appId,
    title: appConfig?.title ?? route.appId,
    path: route.path,
    subroute: route.subroute,
    routeKey: route.routeKey,
    routeLabel: toLastSegmentLabel(route.path),
    hasSidebar: Boolean(appConfig?.hasSidebar),
    showWindowHistoryNavigation: Boolean(appConfig?.enableWindowHistoryNavigation),
    isSidebarCollapsed: false,
    isMinimized: false,
    isMaximized: false,
    bounds,
    restoreBounds: cloneBounds(bounds),
    history: createWindowHistory(route),
    createdAt: Date.now(),
    lastFocusedAt: Date.now(),
  };

  state.windowOrder.push(windowId);

  return windowId;
}

export function createWindowManagerStore() {
  const store = writable(createInitialState());

  function applyRoute(route) {
    store.update((state) => {
      const shouldForceDuplicate = route.openMode === 'new-window';
      const preselectedWindowId = shouldForceDuplicate ? null : resolveNavigationWindowForApp(state, route);
      const preselectedWindow = preselectedWindowId ? state.windows[preselectedWindowId] : null;
      const isStrictNoOp =
        Boolean(preselectedWindow) &&
        hasSameRouteIdentity(preselectedWindow, route) &&
        state.focusedWindowId === preselectedWindowId &&
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
          };
        }

        return next;
      }

      if (!APP_DEFINITIONS[route.appId]) {
        return next;
      }

      let targetWindowId = shouldForceDuplicate ? null : resolveNavigationWindowForApp(next, route);

      if (!targetWindowId) {
        targetWindowId = createWindowFromRoute(next, route);
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

      focusWindow(next, targetWindowId, { restoreMinimized: true });
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

        if (!win) {
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

      if (state.focusedWindowId === windowId && !target.isMinimized) {
        return state;
      }

      const next = cloneState(state);
      focusWindow(next, windowId, { restoreMinimized: true });
      return next;
    });
  }

  function activateWindowFromSidebar(windowId) {
    store.update((state) => {
      const target = state.windows[windowId];

      if (!target) {
        return state;
      }

      const isFocused = state.focusedWindowId === windowId && !target.isMinimized;
      const next = cloneState(state);

      if (isFocused) {
        next.windows[windowId] = {
          ...target,
          isMinimized: true,
        };

        const nextVisibleWindowId = highestVisibleWindowId(next);
        next.focusedWindowId = nextVisibleWindowId;

        if (nextVisibleWindowId) {
          next.windows[nextVisibleWindowId] = {
            ...next.windows[nextVisibleWindowId],
            lastFocusedAt: Date.now(),
          };
        }

        return next;
      }

      focusWindow(next, windowId, { restoreMinimized: true });
      return next;
    });
  }

  function toggleMinimize(windowId) {
    activateWindowFromSidebar(windowId);
  }

  function toggleMaximize(windowId) {
    store.update((state) => {
      const target = state.windows[windowId];

      if (!target) {
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

      focusWindow(next, windowId, { restoreMinimized: true });
      return next;
    });
  }

  function toggleSidebar(windowId) {
    store.update((state) => {
      const target = state.windows[windowId];

      if (!target || !target.hasSidebar) {
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

      if (!target || target.isMaximized) {
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

      if (!target || target.isMaximized) {
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

      if (!target?.history || !canStepWindowHistory(target, direction)) {
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

      focusWindow(next, windowId, { restoreMinimized: true });
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

      if (wasFocused) {
        next.focusedWindowId = highestVisibleWindowId(next);
      } else if (next.focusedWindowId && !next.windows[next.focusedWindowId]) {
        next.focusedWindowId = highestVisibleWindowId(next);
      }

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

  function getDefaultPathForApp(appId) {
    const app = APP_DEFINITIONS[appId] ?? APP_DEFINITIONS[DEFAULT_APP_ID];
    const subroute = app.defaultSubroute ?? '';

    return subroute ? `/${app.id}/${subroute}` : `/${app.id}`;
  }

  function getSnapshot() {
    return get(store);
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
    getDefaultPathForApp,
    getSnapshot,
  };
}

export const windowManager = createWindowManagerStore();
