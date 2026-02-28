<script>
  import { createEventDispatcher } from 'svelte';

  export let windowState;
  export let isFocused = false;
  export let zIndex = 1;

  const dispatch = createEventDispatcher();

  function requestFocus() {
    dispatch('focus', { windowId: windowState.windowId });
  }

  function requestClose(event) {
    event.stopPropagation();
    dispatch('close', { windowId: windowState.windowId });
  }

  function requestMinimize(event) {
    event.stopPropagation();
    dispatch('minimize', { windowId: windowState.windowId });
  }

  function requestMaximize(event) {
    event.stopPropagation();
    dispatch('maximize', { windowId: windowState.windowId });
  }

  function requestSidebarToggle(event) {
    event.stopPropagation();
    dispatch('toggleSidebar', { windowId: windowState.windowId });
  }

  $: bounds = windowState.bounds;
  $: visibility = windowState.isMinimized ? 'hidden' : 'visible';
  $: pointerEvents = windowState.isMinimized ? 'none' : 'auto';
</script>

<section
  class="app-window"
  on:mousedown={requestFocus}
  data-focused={isFocused}
  aria-hidden={windowState.isMinimized}
  style={`z-index:${zIndex};left:${bounds.x}px;top:${bounds.y}px;width:${bounds.width}px;height:${bounds.height}px;visibility:${visibility};pointer-events:${pointerEvents};`}
>
  <header class="window-header">
    <div class="window-header-left">
      {#if windowState.hasSidebar}
        <button type="button" on:click={requestSidebarToggle} aria-label="Toggle app sidebar">Sidebar</button>
      {/if}

      <span>{windowState.title}</span>
      <small>{windowState.path}</small>
    </div>

    <div class="window-header-right">
      <button type="button" on:click={requestMinimize} aria-label="Minimize window">_</button>
      <button type="button" on:click={requestMaximize} aria-label="Maximize window">[]</button>
      <button type="button" on:click={requestClose} aria-label="Close window">X</button>
    </div>
  </header>

  <div class="window-body">
    <slot />
  </div>
</section>

<style>
  .app-window {
    position: absolute;
    border: 1px solid;
    display: flex;
    flex-direction: column;
    background: white;
    min-width: 0;
    min-height: 0;
  }

  .window-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    border-bottom: 1px solid;
    padding: 0.25rem;
  }

  .window-header-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
  }

  .window-header-left small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .window-header-right {
    display: flex;
    gap: 0.25rem;
  }

  .window-body {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
</style>
