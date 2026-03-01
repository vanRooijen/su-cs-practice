function trimSlashes(value = '') {
  return value.replace(/^\/+|\/+$/g, '');
}

function normalizePathname(pathname = '/') {
  const safePathname = typeof pathname === 'string' ? pathname : '/';
  const pathOnly = safePathname.split('?')[0].split('#')[0];
  const segments = trimSlashes(pathOnly)
    .split('/')
    .filter(Boolean);

  return segments.length ? `/${segments.join('/')}` : '/';
}

function isErrorRoute(pathname = '/') {
  return pathname === '/error' || pathname.startsWith('/error/');
}

export function resolveRestoredFocusedPath({
  initialEntryPathname = '/',
  currentPathname = '/',
  restoredFocusedPath = '',
} = {}) {
  if (typeof restoredFocusedPath !== 'string' || !restoredFocusedPath.trim()) {
    return null;
  }

  const initialPath = normalizePathname(initialEntryPathname);
  if (initialPath !== '/') {
    return null;
  }

  const normalizedCurrentPath = normalizePathname(currentPathname);
  if (isErrorRoute(normalizedCurrentPath)) {
    return null;
  }

  const normalizedRestoredPath = normalizePathname(restoredFocusedPath);
  if (normalizedRestoredPath === '/' || normalizedRestoredPath === normalizedCurrentPath) {
    return null;
  }

  return normalizedRestoredPath;
}

