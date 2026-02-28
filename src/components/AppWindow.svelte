<script>
  import { createEventDispatcher, onDestroy } from 'svelte';

  export let windowState;
  export let isFocused = false;
  export let zIndex = 1;

  const dispatch = createEventDispatcher();
  let windowElement;
  let interactionState = null;
  let interactionSourceElement = null;
  let hasWindowInteractionListeners = false;
  let interactionFrameRequestId = 0;
  let latestPointerPosition = null;

  function addWindowInteractionListeners() {
    if (hasWindowInteractionListeners) {
      return;
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', finishDrag);
    hasWindowInteractionListeners = true;
  }

  function removeWindowInteractionListeners() {
    if (!hasWindowInteractionListeners) {
      return;
    }

    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', finishDrag);
    window.removeEventListener('pointercancel', finishDrag);
    hasWindowInteractionListeners = false;
  }

  function capturePointer(sourceElement, pointerId) {
    if (!(sourceElement instanceof Element)) {
      return false;
    }

    try {
      sourceElement.setPointerCapture(pointerId);
      return true;
    } catch {
      // Ignore: capture can fail if the pointer is no longer active.
      return false;
    }
  }

  function emitInteractionAt(clientX, clientY) {
    if (!interactionState) {
      return;
    }

    const deltaX = clientX - interactionState.startPointerX;
    const deltaY = clientY - interactionState.startPointerY;

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

  function flushInteractionFrame() {
    interactionFrameRequestId = 0;

    if (!interactionState || !latestPointerPosition) {
      return;
    }

    emitInteractionAt(latestPointerPosition.x, latestPointerPosition.y);
  }

  function requestInteractionFrame() {
    if (interactionFrameRequestId !== 0) {
      return;
    }

    interactionFrameRequestId = window.requestAnimationFrame(flushInteractionFrame);
  }

  function cancelInteractionFrame() {
    if (interactionFrameRequestId !== 0) {
      window.cancelAnimationFrame(interactionFrameRequestId);
      interactionFrameRequestId = 0;
    }

    latestPointerPosition = null;
  }

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

  function requestHistoryBack(event) {
    event.stopPropagation();
    dispatch('historyBack', { windowId: windowState.windowId });
  }

  function requestHistoryForward(event) {
    event.stopPropagation();
    dispatch('historyForward', { windowId: windowState.windowId });
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
    interactionSourceElement = event.currentTarget instanceof Element ? event.currentTarget : windowElement;

    capturePointer(interactionSourceElement, event.pointerId);
    addWindowInteractionListeners();
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
    interactionSourceElement = event.currentTarget instanceof Element ? event.currentTarget : windowElement;

    capturePointer(interactionSourceElement, event.pointerId);
    addWindowInteractionListeners();
    event.preventDefault();
  }

  function handlePointerMove(event) {
    if (!interactionState || event.pointerId !== interactionState.pointerId) {
      return;
    }

    latestPointerPosition = {
      x: event.clientX,
      y: event.clientY,
    };
    requestInteractionFrame();
  }

  function finishDrag(event) {
    if (!interactionState) {
      return;
    }

    if (typeof event.pointerId === 'number' && event.pointerId !== interactionState.pointerId) {
      return;
    }

    if (typeof event.clientX === 'number' && typeof event.clientY === 'number') {
      emitInteractionAt(event.clientX, event.clientY);
    }

    const pointerId = interactionState.pointerId;
    const sourceElement = interactionSourceElement;
    interactionState = null;
    interactionSourceElement = null;
    cancelInteractionFrame();
    removeWindowInteractionListeners();

    if (sourceElement?.hasPointerCapture(pointerId)) {
      sourceElement.releasePointerCapture(pointerId);
    }
  }

  onDestroy(() => {
    interactionState = null;
    interactionSourceElement = null;
    cancelInteractionFrame();
    removeWindowInteractionListeners();
  });

  $: bounds = windowState.bounds;
  $: visibility = windowState.isMinimized ? 'hidden' : 'visible';
  $: pointerEvents = windowState.isMinimized ? 'none' : 'auto';
  $: historyIndex = windowState.history?.index ?? 0;
  $: historyLength = windowState.history?.entries?.length ?? 0;
  $: canGoBack = historyIndex > 0;
  $: canGoForward = historyIndex < historyLength - 1;
</script>

<section
  class="app-window"
  bind:this={windowElement}
  on:click={requestFocus}
  data-focused={isFocused}
  aria-hidden={windowState.isMinimized}
  style={`z-index:${zIndex};left:${bounds.x}px;top:${bounds.y}px;width:${bounds.width}px;height:${bounds.height}px;visibility:${visibility};pointer-events:${pointerEvents};`}
>
  <header class="window-header" role="group" aria-label="Window header" on:pointerdown={startDrag}>
    <div class="window-header-left">
      {#if windowState.showWindowHistoryNavigation}
        <button type="button" disabled={!canGoBack} on:click={requestHistoryBack} aria-label="Back in app">
          &lt;
        </button>
        <button
          type="button"
          disabled={!canGoForward}
          on:click={requestHistoryForward}
          aria-label="Forward in app"
        >
          &gt;
        </button>
      {/if}

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
