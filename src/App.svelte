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

  const WINDOW_CONTROL_CHANNEL_NAME = 'su-cs-window-control';
  const WINDOW_CONTROL_PROTOCOL = 'su-cs-window-control-v1';
  const WINDOW_CONTROL_TYPE_CLOSE_ALL = 'close-all-instances';
  const WINDOW_CONTROL_TYPE_CLOSE_OWNED = 'close-owned-windows';
  const GLOBAL_CLOSE_BROADCAST_GRACE_MS = 140;

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
    void closeOwnedApplications({
      initiatedByRemote: false,
      clearPersistence: false,
      broadcastType: null,
    });
  }

  function requestGlobalCloseAllApplications() {
    void closeOwnedApplications({
      initiatedByRemote: false,
      clearPersistence: true,
      broadcastType: WINDOW_CONTROL_TYPE_CLOSE_ALL,
      restartPersistenceCycle: true,
    });
  }

  function requestCloseOtherInstances() {
    const didBroadcast = broadcastWindowControl(WINDOW_CONTROL_TYPE_CLOSE_OWNED);
    if (!didBroadcast) {
      showCloseAllNotice('Could not reach other tabs in this browser.');
    }
  }

  async function closeOwnedApplications(options = {}) {
    const initiatedByRemote = options.initiatedByRemote === true;
    const clearPersistence = options.clearPersistence === true;
    const broadcastType = typeof options.broadcastType === 'string' ? options.broadcastType : null;
    const restartPersistenceCycle = options.restartPersistenceCycle === true;

    if (isClosingAll) {
      return;
    }

    isClosingAll = true;

    try {
      if (!initiatedByRemote && broadcastType) {
        const didBroadcast = broadcastWindowControl(broadcastType);
        if (!didBroadcast) {
          showCloseAllNotice('Could not reach other tabs in this browser.');
        }
        await wait(GLOBAL_CLOSE_BROADCAST_GRACE_MS);
      }

      if (!clearPersistence && !restartPersistenceCycle) {
        windowManager.closeAllWindows();
        navigateToDesktop({ replace: true, forceEmit: true });
        return;
      }

      try {
        await persistenceController?.destroy?.();
      } catch {
        // Ignore close errors and continue close-all flow.
      }

      persistenceController = null;
      let shouldRestoreOnStart = false;

      if (clearPersistence && !initiatedByRemote) {
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

        shouldRestoreOnStart = clearResult?.ok === true;
      }

      windowManager.closeAllWindows();
      navigateToDesktop({ replace: true, forceEmit: true });

      await startWindowSessionPersistence({ restoreOnStart: shouldRestoreOnStart });
    } finally {
      isClosingAll = false;
    }
  }

  onMount(() => {
    initialEntryPathname = window.location.pathname;
    const stopRouter = initHistoryRouter();
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

      const restartPersistenceForMessage = message.type === WINDOW_CONTROL_TYPE_CLOSE_ALL;
      void closeOwnedApplications({
        initiatedByRemote: true,
        clearPersistence: false,
        broadcastType: null,
        restartPersistenceCycle: restartPersistenceForMessage,
      });
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
