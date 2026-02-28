import { get, writable } from 'svelte/store';
import {
  APP_DEFINITIONS,
  DEFAULT_APP_ID,
  NOT_FOUND_APP_ID,
} from './siteManifest.js';

let navigationSequence = 0;
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

export function buildAppPath(appId, subroute = '') {
  const cleanedSubroute = normalizeSubroute(subroute);
  return cleanedSubroute ? `/${appId}/${cleanedSubroute}` : `/${appId}`;
}

function toRouteKey(appId, fullPath) {
  return `${appId}::${fullPath}`;
}

export function parsePath(pathname = '/') {
  const segments = toSegments(pathname);
  const candidateAppId = (segments[0] ?? '').toLowerCase();

  if (!candidateAppId) {
    const canonicalPath = buildAppPath(DEFAULT_APP_ID);
    return {
      appId: DEFAULT_APP_ID,
      subroute: '',
      canonicalPath,
      routeKey: toRouteKey(DEFAULT_APP_ID, canonicalPath),
      shouldCanonicalize: true,
    };
  }

  if (!APP_DEFINITIONS[candidateAppId]) {
    const canonicalPath = normalizePathname(pathname);
    const subroute = trimSlashes(canonicalPath);

    return {
      appId: NOT_FOUND_APP_ID,
      subroute,
      canonicalPath,
      routeKey: toRouteKey(NOT_FOUND_APP_ID, canonicalPath),
      shouldCanonicalize: ensureLeadingSlash(pathname) !== canonicalPath,
    };
  }

  const subroute = normalizeSubroute(segments.slice(1).join('/'));
  const canonicalPath = buildAppPath(candidateAppId, subroute);

  return {
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

function syncRoute(pathname, options = {}) {
  const { historyMode = 'none', openMode = 'match', forceEmit = false } = options;
  const parsed = parsePath(pathname);
  const current = get(routeStore);

  if (historyMode === 'push' && current.path !== parsed.canonicalPath) {
    window.history.pushState({}, '', parsed.canonicalPath);
  }

  if (historyMode === 'replace' || parsed.shouldCanonicalize) {
    window.history.replaceState({}, '', parsed.canonicalPath);
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

  syncRoute(window.location.pathname, { historyMode: 'replace', openMode: 'match' });

  return () => {
    window.removeEventListener('popstate', onPopState);
    document.removeEventListener('click', onDocumentClick);
    hasInitialized = false;
  };
}

export const route = {
  subscribe: routeStore.subscribe,
};
