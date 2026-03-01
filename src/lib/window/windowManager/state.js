import { cloneBounds, makeCenteredBounds, makeDefaultWorkspaceRect } from './geometry.js';
import { createWindowHistory } from './history.js';
import { toLastSegmentLabel } from './routing.js';

export function createInitialState() {
  return {
    windows: {},
    windowOrder: [],
    focusedWindowId: null,
    nextWindowId: 1,
    workspaceRect: makeDefaultWorkspaceRect(),
    lastRoute: null,
  };
}

export function cloneState(state) {
  return {
    windows: { ...state.windows },
    windowOrder: [...state.windowOrder],
    focusedWindowId: state.focusedWindowId,
    nextWindowId: state.nextWindowId,
    workspaceRect: { ...state.workspaceRect },
    lastRoute: state.lastRoute ? { ...state.lastRoute } : null,
  };
}

export function withUpdatedWindow(state, windowId, nextWindowState) {
  return {
    ...state,
    windows: {
      ...state.windows,
      [windowId]: nextWindowState,
    },
  };
}

function moveToFront(state, windowId) {
  state.windowOrder = [...state.windowOrder.filter((id) => id !== windowId), windowId];
}

export function focusWindow(state, windowId, options = {}) {
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

export function highestVisibleWindowId(state) {
  for (let index = state.windowOrder.length - 1; index >= 0; index -= 1) {
    const id = state.windowOrder[index];

    if (!state.windows[id]?.isMinimized) {
      return id;
    }
  }

  return null;
}

export function createWindowFromRoute(state, route, appDefinitions) {
  const appConfig = appDefinitions[route.appId];
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
