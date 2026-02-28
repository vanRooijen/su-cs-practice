import { get, writable } from 'svelte/store';
import { APP_REGISTRY, DEFAULT_APP_ID } from './appRegistry.js';

const MIN_WINDOW_WIDTH = 420;
const MIN_WINDOW_HEIGHT = 280;

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

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(value, maximum));
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

function makeCenteredBounds(workspaceRect, seed) {
  const width = clamp(Math.floor(workspaceRect.width * 0.72), MIN_WINDOW_WIDTH, workspaceRect.width);
  const height = clamp(Math.floor(workspaceRect.height * 0.72), MIN_WINDOW_HEIGHT, workspaceRect.height);

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

function topWindowMatchingRoute(state, routeKey) {
  for (let index = state.windowOrder.length - 1; index >= 0; index -= 1) {
    const id = state.windowOrder[index];
    const win = state.windows[id];

    if (win?.routeKey === routeKey) {
      return id;
    }
  }

  return null;
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
  const appConfig = APP_REGISTRY[route.appId];
  const windowId = state.nextWindowId;

  state.nextWindowId += 1;

  const bounds = makeCenteredBounds(state.workspaceRect, windowId);

  state.windows[windowId] = {
    windowId,
    appId: route.appId,
    title: appConfig?.title ?? route.appId,
    path: route.path,
    subroute: route.subroute,
    routeKey: route.routeKey,
    routeLabel: toLastSegmentLabel(route.path),
    hasSidebar: Boolean(appConfig?.hasSidebar),
    isSidebarCollapsed: false,
    isMinimized: false,
    isMaximized: false,
    bounds,
    restoreBounds: cloneBounds(bounds),
    createdAt: Date.now(),
    lastFocusedAt: Date.now(),
  };

  state.windowOrder.push(windowId);

  return windowId;
}

function createWindowManagerStore() {
  const store = writable(createInitialState());

  function applyRoute(route) {
    store.update((state) => {
      const next = cloneState(state);
      next.lastRoute = {
        appId: route.appId,
        path: route.path,
        subroute: route.subroute,
        routeKey: route.routeKey,
      };

      const shouldForceDuplicate = route.openMode === 'new-window';
      let targetWindowId = shouldForceDuplicate ? null : topWindowMatchingRoute(next, route.routeKey);

      if (!targetWindowId) {
        targetWindowId = createWindowFromRoute(next, route);
      } else {
        const target = next.windows[targetWindowId];
        next.windows[targetWindowId] = {
          ...target,
          path: route.path,
          subroute: route.subroute,
          routeKey: route.routeKey,
          routeLabel: toLastSegmentLabel(route.path),
        };
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
          next.windows[windowId] = {
            ...win,
            bounds: {
              x: 0,
              y: 0,
              width: normalizedWidth,
              height: normalizedHeight,
            },
          };
          continue;
        }

        const width = clamp(win.bounds.width, MIN_WINDOW_WIDTH, normalizedWidth);
        const height = clamp(win.bounds.height, MIN_WINDOW_HEIGHT, normalizedHeight);

        const maxX = Math.max(0, normalizedWidth - width);
        const maxY = Math.max(0, normalizedHeight - height);

        next.windows[windowId] = {
          ...win,
          bounds: {
            x: clamp(win.bounds.x, 0, maxX),
            y: clamp(win.bounds.y, 0, maxY),
            width,
            height,
          },
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
        next.windows[windowId] = {
          ...current,
          isMaximized: false,
          bounds: cloneBounds(restored),
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

      const next = cloneState(state);
      next.windows[windowId] = {
        ...target,
        bounds: {
          ...target.bounds,
          x: nextPosition.x,
          y: nextPosition.y,
        },
      };

      return next;
    });
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
          suggestedPath = `/${DEFAULT_APP_ID}`;
        }
      }

      return next;
    });

    return suggestedPath;
  }

  function getDefaultPathForApp(appId) {
    const app = APP_REGISTRY[appId] ?? APP_REGISTRY[DEFAULT_APP_ID];
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
    closeWindow,
    getDefaultPathForApp,
    getSnapshot,
  };
}

export const windowManager = createWindowManagerStore();
