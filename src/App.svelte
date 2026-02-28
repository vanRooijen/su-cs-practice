<script>
  import { onMount } from 'svelte';
  import WindowManager from './components/WindowManager.svelte';
  import { initHistoryRouter, route } from './lib/navigation/historyRouter.js';
  import { windowManager } from './lib/window/windowManagerStore.js';

  onMount(() => {
    const stopRouter = initHistoryRouter();
    const stopRouteSubscription = route.subscribe((currentRoute) => {
      windowManager.applyRoute(currentRoute);
    });

    return () => {
      stopRouteSubscription();
      stopRouter();
    };
  });
</script>

<WindowManager />
