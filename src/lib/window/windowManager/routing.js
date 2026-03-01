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

export function toLastSegmentLabel(path = '/') {
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

export function hasSameRouteIdentity(windowState, route) {
  return (
    windowState?.path === route.path &&
    windowState?.subroute === route.subroute &&
    windowState?.routeKey === route.routeKey
  );
}

export function hasSameLastRouteIdentity(lastRoute, route) {
  return (
    lastRoute?.appId === route.appId &&
    lastRoute?.path === route.path &&
    lastRoute?.subroute === route.subroute &&
    lastRoute?.routeKey === route.routeKey
  );
}

function listWindowsForApp(state, appId) {
  return state.windowOrder.filter((id) => state.windows[id]?.appId === appId);
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

export function resolveNavigationWindowForApp(state, route, appDefinitions) {
  const appConfig = appDefinitions[route.appId];
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
