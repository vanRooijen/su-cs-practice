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

      try {
        await clearWindowSessionPersistence();
      } catch {
        // Ignore delete errors and continue close-all flow.
      }

      windowManager.closeAllWindows();
      navigateToDesktop({ replace: true, forceEmit: true });

      await startWindowSessionPersistence();
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
      stopRouter();
    };
  });
</script>

<WindowManager onCloseAll={closeAllApplications} />
