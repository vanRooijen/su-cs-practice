<script>
  import { onMount } from 'svelte';
  import WindowManager from './components/WindowManager.svelte';
  import { initHistoryRouter, navigateTo, navigateToDesktop, route } from './lib/navigation/historyRouter.js';
  import { windowManager } from './lib/window/windowManagerStore.js';
  import {
    clearWindowSessionPersistence,
    createWindowSessionPersistence,
  } from './lib/window/windowSessionPersistence.js';
  import { resolveRestoredFocusedPath } from './lib/window/restorePolicy.js';

  let stopRouteSubscription = () => {};
  let persistenceController = null;
  let isDisposed = false;
  let isClosingAll = false;
  let initialEntryPathname = '/';
  let closeAllNotice = '';
  let closeAllNoticeTimerId = 0;

  function showCloseAllNotice(message) {
    closeAllNotice = message;

    if (closeAllNoticeTimerId) {
      window.clearTimeout(closeAllNoticeTimerId);
      closeAllNoticeTimerId = 0;
    }

    closeAllNoticeTimerId = window.setTimeout(() => {
      closeAllNotice = '';
      closeAllNoticeTimerId = 0;
    }, 5000);
  }

  async function startWindowSessionPersistence(options = {}) {
    const shouldRestoreOnStart = options.restoreOnStart !== false;

    try {
      persistenceController = await createWindowSessionPersistence(windowManager, {
        restoreOnStart: shouldRestoreOnStart,
      });
    } catch {
      persistenceController = null;
    }

    if (isDisposed) {
      await persistenceController?.destroy?.();
      persistenceController = null;
      return;
    }

    const restorePath = resolveRestoredFocusedPath({
      initialEntryPathname,
      currentPathname: window.location.pathname,
      restoredFocusedPath: persistenceController?.restoredFocusedPath,
    });

    if (restorePath) {
      navigateTo(restorePath, {
        replace: true,
        forceEmit: true,
      });
    }
  }

  async function closeAllApplications() {
    if (isClosingAll) {
      return;
    }

    isClosingAll = true;

    try {
      try {
        await persistenceController?.destroy?.();
      } catch {
        // Ignore close errors and continue close-all flow.
      }

      persistenceController = null;
      let clearResult = { ok: false, reason: 'delete-error' };

      try {
        clearResult = await clearWindowSessionPersistence();
      } catch {
        clearResult = { ok: false, reason: 'delete-error' };
      }

      if (!clearResult?.ok) {
        showCloseAllNotice(
          clearResult?.reason === 'blocked'
            ? 'Could not clear session storage. Close other tabs and try again.'
            : 'Could not fully clear session storage. Try again.',
        );
      }

      windowManager.closeAllWindows();
      navigateToDesktop({ replace: true, forceEmit: true });

      await startWindowSessionPersistence({ restoreOnStart: clearResult?.ok === true });
    } finally {
      isClosingAll = false;
    }
  }

  onMount(() => {
    initialEntryPathname = window.location.pathname;
    const stopRouter = initHistoryRouter();
    isDisposed = false;

    const setup = async () => {
      await startWindowSessionPersistence();
      if (isDisposed) {
        return;
      }

      stopRouteSubscription = route.subscribe((currentRoute) => {
        windowManager.applyRoute(currentRoute);
      });
    };

    void setup();

    return () => {
      isDisposed = true;
      stopRouteSubscription();
      void persistenceController?.destroy?.();
      if (closeAllNoticeTimerId) {
        window.clearTimeout(closeAllNoticeTimerId);
        closeAllNoticeTimerId = 0;
      }
      stopRouter();
    };
  });
</script>

<WindowManager onCloseAll={closeAllApplications} />
{#if closeAllNotice}
  <p class="session-warning" role="status" aria-live="polite">{closeAllNotice}</p>
{/if}

<style>
  .session-warning {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 9999;
    margin: 0;
    padding: 0.55rem 0.7rem;
    border: 1px solid #c78f00;
    background: #fff7d6;
    color: #5c4200;
    max-width: min(90vw, 460px);
    font-size: 0.9rem;
  }
</style>
