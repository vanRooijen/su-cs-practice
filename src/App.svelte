<script>
  import { onMount } from 'svelte';
  import WindowManager from './components/WindowManager.svelte';
  import { initHistoryRouter, navigateTo, route } from './lib/navigation/historyRouter.js';
  import { windowManager } from './lib/window/windowManagerStore.js';
  import { createWindowSessionPersistence } from './lib/window/windowSessionPersistence.js';

  onMount(() => {
    const stopRouter = initHistoryRouter();
    let stopRouteSubscription = () => {};
    let persistenceController = null;
    let isDisposed = false;

    const setup = async () => {
      try {
        persistenceController = await createWindowSessionPersistence(windowManager);
      } catch {
        persistenceController = null;
      }

      if (isDisposed) {
        persistenceController?.destroy();
        return;
      }

      const restoredFocusedPath = persistenceController?.restoredFocusedPath;
      if (
        typeof restoredFocusedPath === 'string' &&
        restoredFocusedPath &&
        restoredFocusedPath !== window.location.pathname
      ) {
        navigateTo(restoredFocusedPath, {
          replace: true,
          forceEmit: true,
        });
      }

      stopRouteSubscription = route.subscribe((currentRoute) => {
        windowManager.applyRoute(currentRoute);
      });
    };

    void setup();

    return () => {
      isDisposed = true;
      stopRouteSubscription();
      persistenceController?.destroy();
      stopRouter();
    };
  });
</script>

<WindowManager />
