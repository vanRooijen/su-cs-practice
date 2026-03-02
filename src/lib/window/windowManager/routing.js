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

function listWindowsForAppOwnedByRuntime(state, appWindowIds, ownerRuntimeId) {
  if (typeof ownerRuntimeId !== 'string' || !ownerRuntimeId.trim()) {
    return appWindowIds;
  }

  return appWindowIds.filter((windowId) => state.windows[windowId]?.ownerRuntimeId === ownerRuntimeId);
}

function listUnownedMinimizedWindowsForApp(state, appWindowIds) {
  return appWindowIds.filter((windowId) => {
    const windowState = state.windows[windowId];
    return Boolean(windowState && windowState.ownerRuntimeId === null && windowState.isMinimized);
  });
}

function prioritizeWindowIds(state, appWindowIds) {
  if (!appWindowIds.length) {
    return [];
  }

  const prioritizedWindowIds = [];
  const seenWindowIds = new Set();

  if (state.focusedWindowId && appWindowIds.includes(state.focusedWindowId)) {
    prioritizedWindowIds.push(state.focusedWindowId);
    seenWindowIds.add(state.focusedWindowId);
  }

  for (let index = appWindowIds.length - 1; index >= 0; index -= 1) {
    const windowId = appWindowIds[index];
    if (seenWindowIds.has(windowId)) {
      continue;
    }

    prioritizedWindowIds.push(windowId);
    seenWindowIds.add(windowId);
  }

  return prioritizedWindowIds;
}

function resolveExactRouteWindowId(state, appWindowIds, route) {
  if (!appWindowIds.length) {
    return null;
  }

  const prioritizedWindowIds = prioritizeWindowIds(state, appWindowIds);

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

function normalizeComparableSubroute(value = '') {
  return value
    .toLowerCase()
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .filter(Boolean)
    .join('/');
}

function resolveSubstringRouteWindowId(state, appWindowIds, route) {
  if (!appWindowIds.length) {
    return null;
  }

  const targetSubroute = normalizeComparableSubroute(route.subroute);
  if (!targetSubroute) {
    return null;
  }

  const prioritizedWindowIds = prioritizeWindowIds(state, appWindowIds);
  let bestWindowId = null;
  let bestScore = 0;

  for (const windowId of prioritizedWindowIds) {
    const windowSubroute = normalizeComparableSubroute(state.windows[windowId]?.subroute);
    if (!windowSubroute) {
      continue;
    }

    const sharesSubstring =
      targetSubroute.includes(windowSubroute) || windowSubroute.includes(targetSubroute);

    if (!sharesSubstring) {
      continue;
    }

    const score = Math.min(targetSubroute.length, windowSubroute.length);
    if (score > bestScore) {
      bestScore = score;
      bestWindowId = windowId;
    }
  }

  return bestWindowId;
}

export function resolveNavigationWindowForApp(state, route, appDefinitions, options = {}) {
  const ownerRuntimeId =
    typeof options.ownerRuntimeId === 'string' && options.ownerRuntimeId.trim() ? options.ownerRuntimeId : null;
  const includeVoidWindows = options.includeVoidWindows === true;
  const appConfig = appDefinitions[route.appId];
  const appWindowIds = listWindowsForApp(state, route.appId);

  if (!appWindowIds.length) {
    return null;
  }

  const ownerScopedWindowIds = listWindowsForAppOwnedByRuntime(state, appWindowIds, ownerRuntimeId);
  const exactRouteWindowId = resolveExactRouteWindowId(state, ownerScopedWindowIds, route);
  if (exactRouteWindowId) {
    return exactRouteWindowId;
  }

  const voidWindowIds = includeVoidWindows ? listUnownedMinimizedWindowsForApp(state, appWindowIds) : [];
  const exactVoidRouteWindowId = resolveExactRouteWindowId(state, voidWindowIds, route);
  if (exactVoidRouteWindowId) {
    return exactVoidRouteWindowId;
  }

  const substringVoidRouteWindowId = resolveSubstringRouteWindowId(state, voidWindowIds, route);
  if (substringVoidRouteWindowId) {
    return substringVoidRouteWindowId;
  }

  const localWindowIds = appWindowIds.filter((windowId) => {
    const win = state.windows[windowId];
    if (!win) {
      return false;
    }

    if (ownerRuntimeId && win.ownerRuntimeId === ownerRuntimeId) {
      return true;
    }

    return includeVoidWindows && win.ownerRuntimeId === null && win.isMinimized;
  });

  if (localWindowIds.length && typeof appConfig?.resolveNavigationWindowId === 'function') {
    const selected = appConfig.resolveNavigationWindowId({
      appId: route.appId,
      appWindowIds: localWindowIds,
      focusedWindowId: state.focusedWindowId,
      windowOrder: state.windowOrder,
      windows: state.windows,
      route,
    });

    if (selected && localWindowIds.includes(selected) && state.windows[selected]?.appId === route.appId) {
      return selected;
    }
  }

  if (localWindowIds.length) {
    return localWindowIds.at(-1) ?? null;
  }
  return null;
}
