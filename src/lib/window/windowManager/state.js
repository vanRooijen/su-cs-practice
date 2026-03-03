import { clampBoundsToWorkspace, cloneBounds, makeCenteredBounds, makeDefaultWorkspaceRect } from './geometry.js';
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
  const { restoreMinimized = true, ownerRuntimeId = null } = options;
  const target = state.windows[windowId];

  if (!target) {
    return;
  }

  const shouldSetOwner = typeof ownerRuntimeId === 'string' && ownerRuntimeId;
  const ownerChanged = shouldSetOwner && target.ownerRuntimeId !== ownerRuntimeId;

  let bounds = target.bounds;
  let restoreBounds = target.restoreBounds;

  if (ownerChanged) {
    const clampedRestoreBounds = clampBoundsToWorkspace(state.workspaceRect, target.restoreBounds ?? target.bounds);
    restoreBounds = cloneBounds(clampedRestoreBounds);

    bounds = target.isMaximized
      ? {
          x: 0,
          y: 0,
          width: state.workspaceRect.width,
          height: state.workspaceRect.height,
        }
      : cloneBounds(clampBoundsToWorkspace(state.workspaceRect, target.bounds));
  }

  state.windows[windowId] = {
    ...target,
    ownerRuntimeId: shouldSetOwner ? ownerRuntimeId : target.ownerRuntimeId ?? null,
    isMinimized: restoreMinimized ? false : target.isMinimized,
    bounds,
    restoreBounds,
    lastFocusedAt: Date.now(),
  };

  moveToFront(state, windowId);
  state.focusedWindowId = windowId;
}

export function highestVisibleWindowId(state, ownerRuntimeId = null) {
  for (let index = state.windowOrder.length - 1; index >= 0; index -= 1) {
    const id = state.windowOrder[index];
    const windowState = state.windows[id];

    if (!windowState || windowState.isMinimized) {
      continue;
    }

    if (typeof ownerRuntimeId === 'string' && ownerRuntimeId && windowState.ownerRuntimeId !== ownerRuntimeId) {
      continue;
    }

    return id;
  }

  return null;
}

export function createWindowFromRoute(state, route, appDefinitions, options = {}) {
  const appConfig = appDefinitions[route.appId];
  const windowId = state.nextWindowId;
  const ownerRuntimeId = typeof options.ownerRuntimeId === 'string' ? options.ownerRuntimeId : null;
  const initialSidebarCollapsed =
    typeof options.initialSidebarCollapsed === 'boolean' ? options.initialSidebarCollapsed : false;

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
    isSidebarCollapsed: Boolean(appConfig?.hasSidebar) ? initialSidebarCollapsed : false,
    isMinimized: false,
    ownerRuntimeId,
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
