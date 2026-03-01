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

      let targetWindowId = shouldForceDuplicate ? null : resolveNavigationWindowForApp(next, route, APP_DEFINITIONS);

      if (!targetWindowId) {
        targetWindowId = createWindowFromRoute(next, route, APP_DEFINITIONS);
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
