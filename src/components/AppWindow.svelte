<script>
  import { createEventDispatcher } from 'svelte';

  export let windowState;
  export let isFocused = false;
  export let zIndex = 1;

  const dispatch = createEventDispatcher();
  let interactionState = null;

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

  function startDrag(event) {
    if (event.button !== 0 || windowState.isMaximized) {
      return;
    }

    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('button, a, input, textarea, select')) {
      return;
    }

    requestFocus();
    interactionState = {
      kind: 'drag',
      pointerId: event.pointerId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startWindowX: windowState.bounds.x,
      startWindowY: windowState.bounds.y,
    };

    event.preventDefault();
  }

  function startResize(event, edge) {
    if (event.button !== 0 || windowState.isMaximized) {
      return;
    }

    event.stopPropagation();
    requestFocus();

    interactionState = {
      kind: 'resize',
      edge,
      pointerId: event.pointerId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startBounds: { ...windowState.bounds },
    };

    event.preventDefault();
  }

  function handlePointerMove(event) {
    if (!interactionState || event.pointerId !== interactionState.pointerId) {
      return;
    }

    const deltaX = event.clientX - interactionState.startPointerX;
    const deltaY = event.clientY - interactionState.startPointerY;

    if (interactionState.kind === 'drag') {
      dispatch('move', {
        windowId: windowState.windowId,
        x: interactionState.startWindowX + deltaX,
        y: interactionState.startWindowY + deltaY,
      });
      return;
    }

    dispatch('resize', {
      windowId: windowState.windowId,
      edge: interactionState.edge,
      deltaX,
      deltaY,
      startBounds: interactionState.startBounds,
    });
  }

  function finishDrag(event) {
    if (!interactionState) {
      return;
    }

    if (typeof event.pointerId === 'number' && event.pointerId !== interactionState.pointerId) {
      return;
    }

    interactionState = null;
  }

  $: bounds = windowState.bounds;
  $: visibility = windowState.isMinimized ? 'hidden' : 'visible';
  $: pointerEvents = windowState.isMinimized ? 'none' : 'auto';
</script>

<section
  class="app-window"
  on:click={requestFocus}
  data-focused={isFocused}
  aria-hidden={windowState.isMinimized}
  style={`z-index:${zIndex};left:${bounds.x}px;top:${bounds.y}px;width:${bounds.width}px;height:${bounds.height}px;visibility:${visibility};pointer-events:${pointerEvents};`}
>
  <header class="window-header" role="group" aria-label="Window header" on:pointerdown={startDrag}>
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

  {#if !windowState.isMaximized}
    <button
      type="button"
      class="resize-handle resize-handle-n"
      aria-label="Resize north"
      tabindex="-1"
      on:pointerdown={(event) => startResize(event, 'n')}
    ></button>
    <button
      type="button"
      class="resize-handle resize-handle-s"
      aria-label="Resize south"
      tabindex="-1"
      on:pointerdown={(event) => startResize(event, 's')}
    ></button>
    <button
      type="button"
      class="resize-handle resize-handle-e"
      aria-label="Resize east"
      tabindex="-1"
      on:pointerdown={(event) => startResize(event, 'e')}
    ></button>
    <button
      type="button"
      class="resize-handle resize-handle-w"
      aria-label="Resize west"
      tabindex="-1"
      on:pointerdown={(event) => startResize(event, 'w')}
    ></button>
    <button
      type="button"
      class="resize-handle resize-handle-ne"
      aria-label="Resize northeast"
      tabindex="-1"
      on:pointerdown={(event) => startResize(event, 'ne')}
    ></button>
    <button
      type="button"
      class="resize-handle resize-handle-nw"
      aria-label="Resize northwest"
      tabindex="-1"
      on:pointerdown={(event) => startResize(event, 'nw')}
    ></button>
    <button
      type="button"
      class="resize-handle resize-handle-se"
      aria-label="Resize southeast"
      tabindex="-1"
      on:pointerdown={(event) => startResize(event, 'se')}
    ></button>
    <button
      type="button"
      class="resize-handle resize-handle-sw"
      aria-label="Resize southwest"
      tabindex="-1"
      on:pointerdown={(event) => startResize(event, 'sw')}
    ></button>
  {/if}
</section>

<svelte:window on:pointermove={handlePointerMove} on:pointerup={finishDrag} on:pointercancel={finishDrag} />

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
    cursor: move;
    user-select: none;
    touch-action: none;
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

  .resize-handle {
    position: absolute;
    border: none;
    background: transparent;
    margin: 0;
    padding: 0;
    z-index: 2;
    touch-action: none;
  }

  .resize-handle-n {
    top: -4px;
    left: 8px;
    right: 8px;
    height: 8px;
    cursor: ns-resize;
  }

  .resize-handle-s {
    bottom: -4px;
    left: 8px;
    right: 8px;
    height: 8px;
    cursor: ns-resize;
  }

  .resize-handle-e {
    right: -4px;
    top: 8px;
    bottom: 8px;
    width: 8px;
    cursor: ew-resize;
  }

  .resize-handle-w {
    left: -4px;
    top: 8px;
    bottom: 8px;
    width: 8px;
    cursor: ew-resize;
  }

  .resize-handle-ne {
    top: -5px;
    right: -5px;
    width: 12px;
    height: 12px;
    cursor: nesw-resize;
  }

  .resize-handle-nw {
    top: -5px;
    left: -5px;
    width: 12px;
    height: 12px;
    cursor: nwse-resize;
  }

  .resize-handle-se {
    bottom: -5px;
    right: -5px;
    width: 12px;
    height: 12px;
    cursor: nwse-resize;
  }

  .resize-handle-sw {
    bottom: -5px;
    left: -5px;
    width: 12px;
    height: 12px;
    cursor: nesw-resize;
  }
</style>
