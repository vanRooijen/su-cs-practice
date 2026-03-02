<script>
  import { onMount } from 'svelte';
  import WindowManager from './components/WindowManager.svelte';
  import { initHistoryRouter, navigateTo, navigateToDesktop, route } from './lib/navigation/historyRouter.js';
  import { windowManager } from './lib/window/windowManagerStore.js';
  import { createWindowSessionPersistence, markWindowSessionCleared } from './lib/window/windowSessionPersistence.js';
  import { resolveRestoredFocusedPath } from './lib/window/restorePolicy.js';

  const WINDOW_CONTROL_CHANNEL_NAME = 'su-cs-window-control';
  const WINDOW_CONTROL_PROTOCOL = 'su-cs-window-control-v1';
  const WINDOW_CONTROL_TYPE_CLOSE_ALL = 'close-all-instances';
  const WINDOW_CONTROL_TYPE_CLOSE_OWNED = 'close-owned-windows';
  const GLOBAL_CLOSE_BROADCAST_GRACE_MS = 140;
  const HOME_AUTO_OPEN_COOLDOWN_MS = 24 * 60 * 60 * 1000;
  const HOME_AUTO_OPEN_LAST_AT_KEY = 'su-cs-home-auto-open-last-at';

  let stopRouteSubscription = () => {};
  let persistenceController = null;
  let isDisposed = false;
  let isClosingAll = false;
  let initialEntryPathname = '/';
  let closeAllNotice = '';
  let closeAllNoticeTimerId = 0;
  let windowControlChannel = null;
  const runtimeId = windowManager.getRuntimeId?.() ?? null;

  function hasBroadcastChannel() {
    return typeof window !== 'undefined' && typeof window.BroadcastChannel === 'function';
  }

  function wait(delayMs) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, delayMs);
    });
  }

  function readHomeAutoOpenLastAt() {
    try {
      const value = Number(window.localStorage.getItem(HOME_AUTO_OPEN_LAST_AT_KEY) ?? '');
      return Number.isFinite(value) && value > 0 ? value : 0;
    } catch {
      return 0;
    }
  }

  function writeHomeAutoOpenLastAt(timestampMs = Date.now()) {
    const safeTimestampMs = Number.isFinite(timestampMs) && timestampMs > 0 ? Math.floor(timestampMs) : Date.now();

    try {
      window.localStorage.setItem(HOME_AUTO_OPEN_LAST_AT_KEY, String(safeTimestampMs));
    } catch {
      // Ignore localStorage failures and continue without cooldown persistence.
    }
  }

  function shouldAutoOpenHome() {
    if (window.location.pathname !== '/') {
      return false;
    }

    const snapshot = windowManager.getSnapshot();
    if ((snapshot?.windowOrder?.length ?? 0) > 0) {
      return false;
    }

    const lastOpenedAt = readHomeAutoOpenLastAt();
    if (!lastOpenedAt) {
      return true;
    }

    return Date.now() - lastOpenedAt >= HOME_AUTO_OPEN_COOLDOWN_MS;
  }

  function maybeAutoOpenHome() {
    if (!shouldAutoOpenHome()) {
      return;
    }

    writeHomeAutoOpenLastAt();
    navigateTo('/home', {
      replace: true,
      forceEmit: true,
    });
  }

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

  async function startWindowSessionPersistence() {
    try {
      persistenceController = await createWindowSessionPersistence(windowManager);
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

    await persistenceController?.waitForStartupOwnership?.();
  }

  function broadcastWindowControl(type) {
    if (!windowControlChannel) {
      return false;
    }

    try {
      windowControlChannel.postMessage({
        protocol: WINDOW_CONTROL_PROTOCOL,
        type,
        sourceRuntimeId: runtimeId,
        sentAt: Date.now(),
      });
      return true;
    } catch {
      // Ignore cross-tab control broadcast failures.
      return false;
    }
  }

  function requestCloseOwnedApplications() {
    if (isClosingAll) {
      return;
    }

    windowManager.closeOwnedWindows();
    navigateToDesktop({ replace: true, forceEmit: true });
  }

  function requestGlobalCloseAllApplications() {
    void closeAllInstances({
      initiatedByRemote: false,
    });
  }

  function requestCloseOtherInstances() {
    if (isClosingAll) {
      return;
    }

    const didBroadcast = broadcastWindowControl(WINDOW_CONTROL_TYPE_CLOSE_OWNED);
    if (!didBroadcast) {
      showCloseAllNotice('Could not reach other tabs in this browser.');
      return;
    }

    windowManager.closeWindowsOwnedByOthers();
  }

  async function closeAllInstances(options = {}) {
    const initiatedByRemote = options.initiatedByRemote === true;

    if (isClosingAll) {
      return;
    }

    isClosingAll = true;

    try {
      if (!initiatedByRemote) {
        const didBroadcast = broadcastWindowControl(WINDOW_CONTROL_TYPE_CLOSE_ALL);
        if (!didBroadcast) {
          showCloseAllNotice('Could not reach other tabs in this browser.');
        }
        await wait(GLOBAL_CLOSE_BROADCAST_GRACE_MS);
      }

      if (!initiatedByRemote) {
        markWindowSessionCleared();
      }
      windowManager.closeAllWindowsGlobal();
      navigateToDesktop({ replace: true, forceEmit: true });

      const writeFailuresBefore = persistenceController?.getHealth?.().writeFailures ?? 0;
      await persistenceController?.flush?.();
      const writeFailuresAfter = persistenceController?.getHealth?.().writeFailures ?? writeFailuresBefore;
      if (writeFailuresAfter > writeFailuresBefore) {
        showCloseAllNotice('Close-all completed, but persistence write failed. Refresh may not reflect the latest state.');
      }
    } finally {
      isClosingAll = false;
    }
  }

  onMount(() => {
    initialEntryPathname = window.location.pathname;
    const stopRouter = initHistoryRouter({
      openDefaultHomeOnRoot: false,
    });
    isDisposed = false;
    const onWindowControlMessage = (event) => {
      const message = event?.data;
      if (!message || typeof message !== 'object') {
        return;
      }

      if (message.protocol !== WINDOW_CONTROL_PROTOCOL) {
        return;
      }

      const sourceRuntimeId =
        typeof message.sourceRuntimeId === 'string' && message.sourceRuntimeId.trim() ? message.sourceRuntimeId : null;
      if (sourceRuntimeId && runtimeId && sourceRuntimeId === runtimeId) {
        return;
      }

      if (
        message.type !== WINDOW_CONTROL_TYPE_CLOSE_ALL &&
        message.type !== WINDOW_CONTROL_TYPE_CLOSE_OWNED
      ) {
        return;
      }

      if (message.type === WINDOW_CONTROL_TYPE_CLOSE_ALL) {
        void closeAllInstances({
          initiatedByRemote: true,
        });
        return;
      }

      if (isClosingAll) {
        return;
      }

      windowManager.closeOwnedWindows();
      navigateToDesktop({ replace: true, forceEmit: true });
    };

    if (hasBroadcastChannel()) {
      try {
        windowControlChannel = new window.BroadcastChannel(WINDOW_CONTROL_CHANNEL_NAME);
        windowControlChannel.addEventListener('message', onWindowControlMessage);
      } catch {
        windowControlChannel = null;
      }
    }

    const setup = async () => {
      await startWindowSessionPersistence();
      if (isDisposed) {
        return;
      }

      stopRouteSubscription = route.subscribe((currentRoute) => {
        windowManager.applyRoute(currentRoute);
      });

      maybeAutoOpenHome();
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
      windowControlChannel?.removeEventListener('message', onWindowControlMessage);
      windowControlChannel?.close();
      windowControlChannel = null;
      stopRouter();
    };
  });
</script>

<WindowManager
  onCloseOwned={requestCloseOwnedApplications}
  onCloseAllInstances={requestGlobalCloseAllApplications}
  onCloseOtherInstances={requestCloseOtherInstances}
/>
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
