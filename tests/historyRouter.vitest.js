import { get } from 'svelte/store';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

async function loadRouterModule() {
  vi.resetModules();
  return import('../src/lib/navigation/historyRouter.js');
}

describe('historyRouter integration behavior', () => {
  let stopRouter = null;

  beforeEach(() => {
    window.history.replaceState(null, '', '/');
    document.body.innerHTML = '';
  });

  afterEach(() => {
    if (stopRouter) {
      stopRouter();
      stopRouter = null;
    }
  });

  it('initializes root requests to /home', async () => {
    const router = await loadRouterModule();
    stopRouter = router.initHistoryRouter();

    expect(window.location.pathname).toBe('/home');
    expect(get(router.route).path).toBe('/home');
  });

  it('canonicalizes path during navigateTo and updates route store', async () => {
    const router = await loadRouterModule();
    stopRouter = router.initHistoryRouter();

    router.navigateTo('/people/staff/');

    expect(window.location.pathname).toBe('/people/staff');
    expect(get(router.route).path).toBe('/people/staff');
  });

  it('openInNewWindow force-emits route updates on unchanged paths', async () => {
    const router = await loadRouterModule();
    stopRouter = router.initHistoryRouter();

    router.openInNewWindow('/home');
    const first = get(router.route);

    router.openInNewWindow('/home');
    const second = get(router.route);

    expect(first.path).toBe('/home');
    expect(first.openMode).toBe('new-window');
    expect(second.path).toBe('/home');
    expect(second.openMode).toBe('new-window');
    expect(second.navigationId).toBeGreaterThan(first.navigationId);
  });

  it('redirects invalid content routes to error pages and logs metadata', async () => {
    const router = await loadRouterModule();
    stopRouter = router.initHistoryRouter();

    router.navigateTo('/reader/articles/not-a-real-entry');

    expect(window.location.pathname).toBe('/error/path-not-found');
    expect(get(router.route).path).toBe('/error/path-not-found');

    const latestError = get(router.navigationError);
    expect(latestError.code).toBe('path-not-found');
    expect(latestError.requestedPath).toBe('/reader/articles/not-a-real-entry');

    const historyEntries = get(router.navigationErrorHistory);
    expect(historyEntries.length).toBe(1);

    router.clearNavigationErrorHistory();
    expect(get(router.navigationError)).toBe(null);
    expect(get(router.navigationErrorHistory)).toEqual([]);
  });

  it('intercepts same-origin anchor clicks and supports open-in-new-window links', async () => {
    const router = await loadRouterModule();
    stopRouter = router.initHistoryRouter();

    const peopleLink = document.createElement('a');
    peopleLink.href = '/people/students';
    peopleLink.textContent = 'Students';
    document.body.appendChild(peopleLink);
    peopleLink.click();

    expect(window.location.pathname).toBe('/people/students');
    expect(get(router.route).openMode).toBe('match');

    const readerLink = document.createElement('a');
    readerLink.href = '/reader/help';
    readerLink.textContent = 'Help';
    readerLink.dataset.openInNewWindow = 'true';
    document.body.appendChild(readerLink);
    readerLink.click();

    expect(window.location.pathname).toBe('/reader/help');
    expect(get(router.route).openMode).toBe('new-window');
  });

  it('updates route state on popstate events', async () => {
    const router = await loadRouterModule();
    stopRouter = router.initHistoryRouter();

    window.history.pushState({}, '', '/people/staff');
    window.dispatchEvent(new PopStateEvent('popstate'));

    expect(get(router.route).path).toBe('/people/staff');
  });
});
