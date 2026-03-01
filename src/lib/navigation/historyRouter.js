import { get, writable } from 'svelte/store';
import { APP_DEFINITIONS, DEFAULT_APP_ID } from './siteManifest.js';

let navigationSequence = 0;
let navigationErrorSequence = 0;
let hasInitialized = false;

function trimSlashes(value = '') {
  return value.replace(/^\/+|\/+$/g, '');
}

function ensureLeadingSlash(value = '') {
  return value.startsWith('/') ? value : `/${value}`;
}

function toSegments(pathname = '/') {
  const pathOnly = pathname.split('?')[0].split('#')[0];
  return trimSlashes(pathOnly)
    .split('/')
    .filter(Boolean);
}

function normalizePathname(pathname = '/') {
  const segments = toSegments(pathname);
  return segments.length ? `/${segments.join('/')}` : '/';
}

function normalizeSubroute(subroute = '') {
  return trimSlashes(subroute)
    .split('/')
    .filter(Boolean)
    .join('/');
}

function toRouteKey(appId, fullPath) {
  return `${appId ?? 'desktop'}::${fullPath}`;
}

function createHistoryState(pathname) {
  return {
    desktopRoot: normalizePathname(pathname) === '/',
  };
}

function hasDesktopRootState(state) {
  return Boolean(state && typeof state === 'object' && state.desktopRoot === true);
}

function reportNavigationError(errorCode, requestedPath) {
  const readableCode = errorCode === 'app-not-found' ? 'App not found' : 'Path not found';

  navigationErrorStore.set({
    id: ++navigationErrorSequence,
    code: errorCode,
    requestedPath,
    message: `${readableCode}: ${requestedPath}`,
  });
}

export function clearNavigationError() {
  navigationErrorStore.set(null);
}

export function buildAppPath(appId, subroute = '') {
  const cleanedSubroute = normalizeSubroute(subroute);
  return cleanedSubroute ? `/${appId}/${cleanedSubroute}` : `/${appId}`;
}

export function parsePath(pathname = '/') {
  const segments = toSegments(pathname);
  const candidateAppId = (segments[0] ?? '').toLowerCase();

  if (!candidateAppId) {
    return {
      isValid: true,
      appId: null,
      subroute: '',
      canonicalPath: '/',
      routeKey: toRouteKey(null, '/'),
      shouldCanonicalize: ensureLeadingSlash(pathname) !== '/',
    };
  }

  if (!APP_DEFINITIONS[candidateAppId]) {
    return {
      isValid: false,
      errorCode: 'app-not-found',
      canonicalPath: normalizePathname(pathname),
    };
  }

  const appDefinition = APP_DEFINITIONS[candidateAppId];
  const subroute = normalizeSubroute(segments.slice(1).join('/'));
  const canonicalPath = buildAppPath(candidateAppId, subroute);
  const validation = appDefinition.validateSubroute?.({
    appId: candidateAppId,
    subroute,
    path: canonicalPath,
  });

  if (validation === false || validation?.isValid === false) {
    return {
      isValid: false,
      errorCode: 'path-not-found',
      canonicalPath,
    };
  }

  return {
    isValid: true,
    appId: candidateAppId,
    subroute,
    canonicalPath,
    routeKey: toRouteKey(candidateAppId, canonicalPath),
    shouldCanonicalize: ensureLeadingSlash(pathname) !== canonicalPath,
  };
}

const routeStore = writable({
  path: `/${DEFAULT_APP_ID}`,
  appId: DEFAULT_APP_ID,
  subroute: '',
  routeKey: toRouteKey(DEFAULT_APP_ID, `/${DEFAULT_APP_ID}`),
  openMode: 'match',
  navigationId: ++navigationSequence,
});

const navigationErrorStore = writable(null);

function syncRoute(pathname, options = {}) {
  const { historyMode = 'none', openMode = 'match', forceEmit = false } = options;
  const parsed = parsePath(pathname);
  const current = get(routeStore);

  if (!parsed.isValid) {
    const fallbackPath = current?.path ?? buildAppPath(DEFAULT_APP_ID);

    if (window.location.pathname !== fallbackPath) {
      window.history.replaceState(createHistoryState(fallbackPath), '', fallbackPath);
    }

    reportNavigationError(parsed.errorCode, parsed.canonicalPath);
    return current;
  }

  if (historyMode === 'push' && current.path !== parsed.canonicalPath) {
    window.history.pushState(createHistoryState(parsed.canonicalPath), '', parsed.canonicalPath);
  }

  if (historyMode === 'replace' || parsed.shouldCanonicalize) {
    window.history.replaceState(createHistoryState(parsed.canonicalPath), '', parsed.canonicalPath);
  }

  const unchangedRoute =
    current.path === parsed.canonicalPath &&
    current.appId === parsed.appId &&
    current.subroute === parsed.subroute &&
    current.routeKey === parsed.routeKey;

  if (unchangedRoute && !forceEmit && openMode === 'match') {
    return current;
  }

  const nextRoute = {
    path: parsed.canonicalPath,
    appId: parsed.appId,
    subroute: parsed.subroute,
    routeKey: parsed.routeKey,
    openMode,
    navigationId: ++navigationSequence,
  };

  routeStore.set(nextRoute);
  return nextRoute;
}

function isModifiedClick(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function shouldInterceptAnchor(event, anchor) {
  if (!anchor || event.defaultPrevented || event.button !== 0 || isModifiedClick(event)) {
    return false;
  }

  if (anchor.target && anchor.target.toLowerCase() !== '_self') {
    return false;
  }

  if (anchor.hasAttribute('download') || anchor.getAttribute('rel') === 'external') {
    return false;
  }

  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#')) {
    return false;
  }

  const url = new URL(anchor.href, window.location.href);
  return url.origin === window.location.origin;
}

export function navigateTo(pathname, options = {}) {
  const { replace = false, openMode = 'match', forceEmit = false } = options;

  syncRoute(ensureLeadingSlash(pathname), {
    historyMode: replace ? 'replace' : 'push',
    openMode,
    forceEmit,
  });
}

export function navigateToDesktop(options = {}) {
  const { replace = false, forceEmit = false } = options;

  syncRoute('/', {
    historyMode: replace ? 'replace' : 'push',
    openMode: 'match',
    forceEmit,
  });
}

export function openInNewWindow(pathname, options = {}) {
  const { replace = false } = options;

  navigateTo(pathname, {
    replace,
    openMode: 'new-window',
    forceEmit: true,
  });
}

export function initHistoryRouter() {
  if (hasInitialized) {
    return () => {};
  }

  hasInitialized = true;

  const onPopState = () => {
    syncRoute(window.location.pathname, { historyMode: 'none', openMode: 'match' });
  };

  const onDocumentClick = (event) => {
    const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;

    if (!shouldInterceptAnchor(event, anchor)) {
      return;
    }

    event.preventDefault();
    const url = new URL(anchor.href, window.location.href);

    if (anchor.dataset.openInNewWindow === 'true') {
      openInNewWindow(url.pathname);
      return;
    }

    navigateTo(url.pathname);
  };

  window.addEventListener('popstate', onPopState);
  document.addEventListener('click', onDocumentClick);

  const initialPath = window.location.pathname;
  const shouldOpenDefaultHome =
    normalizePathname(initialPath) === '/' && !hasDesktopRootState(window.history.state);

  syncRoute(shouldOpenDefaultHome ? buildAppPath(DEFAULT_APP_ID) : initialPath, {
    historyMode: 'replace',
    openMode: 'match',
  });

  return () => {
    window.removeEventListener('popstate', onPopState);
    document.removeEventListener('click', onDocumentClick);
    hasInitialized = false;
  };
}

export const route = {
  subscribe: routeStore.subscribe,
};

export const navigationError = {
  subscribe: navigationErrorStore.subscribe,
};
