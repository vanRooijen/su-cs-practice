<script>
  import { createEventDispatcher, onDestroy } from 'svelte';

  export let windowState;
  export let isFocused = false;
  export let zIndex = 1;
  export let workspaceRect = null;

  const dispatch = createEventDispatcher();
  let windowElement;
  let interactionState = null;
  let interactionSourceElement = null;
  let hasWindowInteractionListeners = false;
  let interactionFrameRequestId = 0;
  let latestPointerPosition = null;
  let dragPreviewOffset = null;

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

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(value, maximum));
  }

  function toDraggedPosition(interaction, clientX, clientY) {
    const rawX = interaction.startWindowX + (clientX - interaction.startPointerX);
    const rawY = interaction.startWindowY + (clientY - interaction.startPointerY);

    if (!workspaceRect) {
      return {
        x: Math.round(rawX),
        y: Math.round(rawY),
      };
    }

    const maxX = Math.max(0, workspaceRect.width - windowState.bounds.width);
    const maxY = Math.max(0, workspaceRect.height - windowState.bounds.height);

    return {
      x: clamp(Math.round(rawX), 0, maxX),
      y: clamp(Math.round(rawY), 0, maxY),
    };
  }

  function emitInteractionAt(clientX, clientY) {
    if (!interactionState) {
      return;
    }

    if (interactionState.kind === 'drag') {
      const nextPosition = toDraggedPosition(interactionState, clientX, clientY);
      dispatch('move', {
        windowId: windowState.windowId,
        x: nextPosition.x,
        y: nextPosition.y,
      });
      return;
    }

    const deltaX = clientX - interactionState.startPointerX;
    const deltaY = clientY - interactionState.startPointerY;
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

    if (interactionState.kind === 'drag') {
      const nextPosition = toDraggedPosition(interactionState, latestPointerPosition.x, latestPointerPosition.y);
      dragPreviewOffset = {
        x: nextPosition.x - interactionState.startWindowX,
        y: nextPosition.y - interactionState.startWindowY,
      };
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
    dragPreviewOffset = { x: 0, y: 0 };
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
    dragPreviewOffset = null;
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

    const finalClientX =
      typeof event.clientX === 'number' ? event.clientX : (latestPointerPosition?.x ?? interactionState.startPointerX);
    const finalClientY =
      typeof event.clientY === 'number' ? event.clientY : (latestPointerPosition?.y ?? interactionState.startPointerY);

    emitInteractionAt(finalClientX, finalClientY);

    const pointerId = interactionState.pointerId;
    const sourceElement = interactionSourceElement;
    interactionState = null;
    interactionSourceElement = null;
    dragPreviewOffset = null;
    cancelInteractionFrame();
    removeWindowInteractionListeners();

    if (sourceElement?.hasPointerCapture(pointerId)) {
      sourceElement.releasePointerCapture(pointerId);
    }
  }

  onDestroy(() => {
    interactionState = null;
    interactionSourceElement = null;
    dragPreviewOffset = null;
    cancelInteractionFrame();
    removeWindowInteractionListeners();
  });

  $: bounds = windowState.bounds;
  $: visibility = windowState.isMinimized ? 'hidden' : 'visible';
  $: pointerEvents = windowState.isMinimized ? 'none' : 'auto';
  $: activeTransform =
    interactionState?.kind === 'drag' && dragPreviewOffset
      ? `translate3d(${dragPreviewOffset.x}px, ${dragPreviewOffset.y}px, 0)`
      : 'none';
  $: windowWillChange = interactionState?.kind === 'drag' ? 'transform' : 'auto';
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
  style={`z-index:${zIndex};left:${bounds.x}px;top:${bounds.y}px;width:${bounds.width}px;height:${bounds.height}px;visibility:${visibility};pointer-events:${pointerEvents};transform:${activeTransform};will-change:${windowWillChange};`}
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
        <button
          type="button"
          class="window-sidebar-toggle"
          on:click={requestSidebarToggle}
          aria-label="Toggle app sidebar"
          title="Toggle app sidebar"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4.5 5.5h15v13h-15z" fill="none" stroke="currentColor" stroke-width="1.7" />
            <path d="M10 5.5v13M13 9h4M13 12h4M13 15h4" fill="none" stroke="currentColor" stroke-width="1.7" />
          </svg>
        </button>
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
    border: none;
    border-radius: var(--su-panel-radius, 0.42rem);
    display: flex;
    flex-direction: column;
    background: var(--su-surface, #fffdf9);
    min-width: 0;
    min-height: 0;
    overflow: clip;
    box-shadow:
      0 10px 26px rgba(44, 42, 41, 0.14),
      0 1px 0 rgba(255, 255, 255, 0.75) inset,
      0 0 0 1px rgba(44, 42, 41, 0.1);
  }

  .app-window[data-focused='true'] {
    box-shadow:
      0 14px 34px rgba(44, 42, 41, 0.18),
      0 0 0 1px rgba(97, 34, 59, 0.26),
      0 0 0 3px rgba(97, 34, 59, 0.08);
  }

  .window-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.42rem;
    border-bottom: 1px solid rgba(44, 42, 41, 0.1);
    padding: 0.28rem 0.36rem;
    min-height: 2.25rem;
    cursor: move;
    user-select: none;
    touch-action: none;
    background: color-mix(in srgb, var(--su-surface-subtle, #f8f4ed) 84%, white 16%);
  }

  .window-header-left {
    display: flex;
    align-items: center;
    gap: 0.34rem;
    min-width: 0;
  }

  .window-header-left span {
    font-size: 0.88rem;
    line-height: 1.1;
    font-weight: 600;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 82%, black 18%);
    white-space: nowrap;
  }

  .window-header-left small {
    font-size: 0.72rem;
    line-height: 1.1;
    color: color-mix(in srgb, var(--su-muted, #686d71) 92%, black 8%);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
    max-width: min(44ch, 36vw);
  }

  .window-header-right {
    display: flex;
    gap: 0.22rem;
    flex-shrink: 0;
  }

  .window-header button {
    appearance: none;
    border: none;
    border-radius: 0.38rem;
    background: color-mix(in srgb, var(--su-surface-subtle, #f8f4ed) 86%, white 14%);
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.11);
    color: var(--su-ink, #2c2a29);
    min-width: 1.62rem;
    height: 1.52rem;
    padding: 0 0.34rem;
    font-size: 0.72rem;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: background-color 140ms ease, color 140ms ease, box-shadow 140ms ease;
  }

  .window-sidebar-toggle {
    min-width: 1.58rem;
    width: 1.58rem;
    padding: 0;
  }

  .window-sidebar-toggle svg {
    width: 0.9rem;
    height: 0.9rem;
    display: block;
    margin: 0 auto;
  }

  .window-header button:hover {
    background: color-mix(in srgb, var(--su-tab-highlight, rgba(202, 162, 88, 0.14)) 60%, white 40%);
    color: var(--su-maroon, #61223b);
    box-shadow: inset 0 0 0 1px rgba(97, 34, 59, 0.24);
  }

  .window-header button:focus-visible {
    outline: none;
    box-shadow:
      inset 0 0 0 1px rgba(97, 34, 59, 0.28),
      0 0 0 2px rgba(97, 34, 59, 0.13);
  }

  .window-header button:disabled {
    opacity: 0.44;
    cursor: not-allowed;
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.08);
  }

  .window-header-right button:last-child:hover {
    background: color-mix(in srgb, var(--su-maroon, #61223b) 14%, white 86%);
    color: var(--su-maroon, #61223b);
    box-shadow: inset 0 0 0 1px rgba(97, 34, 59, 0.32);
  }

  .window-body {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    background: var(--su-surface, #fffdf9);
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
