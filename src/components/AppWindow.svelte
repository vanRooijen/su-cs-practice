<script>
  import { createEventDispatcher, onDestroy, tick } from 'svelte';
  import iconChevronLeft from '../assets/icons/lucide/chevron-left.svg?raw';
  import iconChevronRight from '../assets/icons/lucide/chevron-right.svg?raw';
  import iconPanelLeft from '../assets/icons/lucide/panel-left.svg?raw';
  import iconMinus from '../assets/icons/lucide/minus.svg?raw';
  import iconSquare from '../assets/icons/lucide/square.svg?raw';
  import iconClose from '../assets/icons/lucide/x.svg?raw';

  export let windowState;
  export let isFocused = false;
  export let zIndex = 1;
  export let workspaceRect = null;
  export let forceMaximized = false;
  export let attentionToken = 0;

  const dispatch = createEventDispatcher();
  let windowElement;
  let interactionState = null;
  let interactionSourceElement = null;
  let hasWindowInteractionListeners = false;
  let interactionFrameRequestId = 0;
  let latestPointerPosition = null;
  let dragPreviewOffset = null;
  let attentionOverlayElement;
  let attentionAnimation = null;
  let lastAttentionToken = 0;

  function setGlobalDragCursor(isActive) {
    if (typeof document === 'undefined' || !document.body) {
      return;
    }

    document.body.classList.toggle('wm-window-dragging', Boolean(isActive));
  }

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

  function playAttentionAnimation() {
    if (!attentionOverlayElement || typeof attentionOverlayElement.animate !== 'function') {
      return;
    }

    attentionAnimation?.cancel();
    attentionAnimation = attentionOverlayElement.animate(
      [
        {
          opacity: 0,
          transform: 'scale(0.985)',
        },
        {
          opacity: 0.6,
          transform: 'scale(1)',
          offset: 0.38,
        },
        {
          opacity: 0,
          transform: 'scale(1.01)',
        },
      ],
      {
        duration: 360,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
    );
  }

  async function playAttentionAnimationSoon(expectedToken) {
    await tick();
    if (attentionToken !== expectedToken || windowState?.isMinimized) {
      return;
    }

    playAttentionAnimation();
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

  function handleHeaderDoubleClick(event) {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('button, a, input, textarea, select')) {
      return;
    }

    if (forceMaximized) {
      return;
    }

    dispatch('maximize', { windowId: windowState.windowId });
  }

  function handleHeaderContextMenu(event) {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('button, a, input, textarea, select')) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    dispatch('minimize', { windowId: windowState.windowId });
  }

  function startDrag(event) {
    if (event.button !== 0 || isEffectivelyMaximized) {
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
    setGlobalDragCursor(true);
    dragPreviewOffset = { x: 0, y: 0 };
    interactionSourceElement = event.currentTarget instanceof Element ? event.currentTarget : windowElement;

    capturePointer(interactionSourceElement, event.pointerId);
    addWindowInteractionListeners();
    event.preventDefault();
  }

  function startResize(event, edge) {
    if (event.button !== 0 || isEffectivelyMaximized) {
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
    setGlobalDragCursor(false);
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
    setGlobalDragCursor(false);
    dragPreviewOffset = null;
    attentionAnimation?.cancel();
    attentionAnimation = null;
    cancelInteractionFrame();
    removeWindowInteractionListeners();
  });

  $: bounds = windowState.bounds;
  $: isEffectivelyMaximized = Boolean(forceMaximized || windowState.isMaximized);
  $: effectiveBounds =
    isEffectivelyMaximized && workspaceRect
      ? {
          x: 0,
          y: 0,
          width: Math.max(1, Math.round(workspaceRect.width)),
          height: Math.max(1, Math.round(workspaceRect.height)),
        }
      : bounds;
  $: visibility = windowState.isMinimized ? 'hidden' : 'visible';
  $: pointerEvents = windowState.isMinimized ? 'none' : 'auto';
  $: activeTransform =
    interactionState?.kind === 'drag' && dragPreviewOffset
      ? `translate3d(${dragPreviewOffset.x}px, ${dragPreviewOffset.y}px, 0)`
      : 'translate3d(0, 0, 0)';
  $: isDragging = interactionState?.kind === 'drag';
  $: windowWillChange = 'transform';
  $: historyIndex = windowState.history?.index ?? 0;
  $: historyLength = windowState.history?.entries?.length ?? 0;
  $: canGoBack = historyIndex > 0;
  $: canGoForward = historyIndex < historyLength - 1;
  $: canonicalPath = typeof windowState?.path === 'string' && windowState.path ? windowState.path : '/';
  $: if (attentionToken > 0 && attentionToken !== lastAttentionToken) {
    lastAttentionToken = attentionToken;
    if (!windowState?.isMinimized) {
      void playAttentionAnimationSoon(attentionToken);
    }
  }
</script>

<section
  class="app-window"
  bind:this={windowElement}
  on:click={requestFocus}
  data-window-id={windowState.windowId}
  data-focused={isFocused}
  data-maximized={isEffectivelyMaximized}
  data-dragging={isDragging}
  aria-hidden={windowState.isMinimized}
  style={`z-index:${zIndex};left:${effectiveBounds.x}px;top:${effectiveBounds.y}px;width:${effectiveBounds.width}px;height:${effectiveBounds.height}px;visibility:${visibility};pointer-events:${pointerEvents};transform:${activeTransform};will-change:${windowWillChange};`}
>
  <header
    class="window-header"
    role="group"
    aria-label="Window header"
    on:pointerdown={startDrag}
    on:dblclick={handleHeaderDoubleClick}
    on:contextmenu={handleHeaderContextMenu}
  >
    <div class="window-header-left">
      {#if windowState.showWindowHistoryNavigation}
        <button type="button" disabled={!canGoBack} on:click={requestHistoryBack} aria-label="Back in app">
          <span class="control-icon" aria-hidden="true">{@html iconChevronLeft}</span>
        </button>
        <button
          type="button"
          disabled={!canGoForward}
          on:click={requestHistoryForward}
          aria-label="Forward in app"
        >
          <span class="control-icon" aria-hidden="true">{@html iconChevronRight}</span>
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
          <span class="control-icon" aria-hidden="true">{@html iconPanelLeft}</span>
        </button>
      {/if}

      <div class="window-header-title" title={canonicalPath}>
        <span class="window-path-label">{canonicalPath}</span>
      </div>
    </div>

    <div class="window-header-right">
      <button type="button" on:click={requestMinimize} aria-label="Minimize window">
        <span class="control-icon" aria-hidden="true">{@html iconMinus}</span>
      </button>
      <button type="button" on:click={requestMaximize} aria-label="Maximize window" disabled={forceMaximized}>
        <span class="control-icon" aria-hidden="true">{@html iconSquare}</span>
      </button>
      <button type="button" on:click={requestClose} aria-label="Close window">
        <span class="control-icon" aria-hidden="true">{@html iconClose}</span>
      </button>
    </div>
  </header>

  <div class="window-body">
    <slot />
  </div>
  <div class="window-attention-overlay" bind:this={attentionOverlayElement} aria-hidden="true"></div>

  {#if !isEffectivelyMaximized}
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
    transform-origin: top left;
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

  .app-window[data-maximized='true'] {
    border-radius: 0;
  }

  .window-header {
    --window-control-size: 2.14rem;

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.62rem;
    border-bottom: 1px solid rgba(44, 42, 41, 0.1);
    padding: 0.3rem 0.56rem;
    cursor: default;
    user-select: none;
    touch-action: none;
    background: color-mix(in srgb, var(--su-surface-subtle, #f8f4ed) 84%, white 16%);
  }

  .app-window[data-dragging='true'] .window-header {
    cursor: move;
  }

  :global(body.wm-window-dragging),
  :global(body.wm-window-dragging *) {
    cursor: move !important;
  }

  .window-header-left {
    display: flex;
    align-items: center;
    gap: 0.42rem;
    flex: 1;
    min-width: 0;
  }

  .window-header-title {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    margin-inline-start: 0.34rem;
  }

  .window-path-label {
    width: 100%;
    max-width: min(58ch, 58vw);
    margin: 0;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 78%, black 22%);
    font-size: 0.96rem;
    font-weight: 600;
    line-height: 1.18;
    letter-spacing: 0.002em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }

  .window-header-right {
    display: flex;
    gap: 0.32rem;
    flex-shrink: 0;
  }

  .window-header-left > button,
  .window-header-right > button {
    appearance: none;
    border: none;
    border-radius: 0.34rem;
    background: color-mix(in srgb, var(--su-surface-subtle, #f8f4ed) 86%, white 14%);
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.16);
    color: var(--su-ink, #2c2a29);
    flex: 0 0 var(--window-control-size);
    width: var(--window-control-size);
    height: var(--window-control-size);
    min-width: var(--window-control-size);
    min-height: var(--window-control-size);
    max-width: var(--window-control-size);
    max-height: var(--window-control-size);
    aspect-ratio: 1 / 1;
    padding: 0;
    font-size: 0.86rem;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0.01em;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color 140ms ease, color 140ms ease, box-shadow 140ms ease;
  }

  .window-sidebar-toggle {
    width: var(--window-control-size);
    height: var(--window-control-size);
  }

  .window-header-left > button .control-icon,
  .window-header-right > button .control-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.02rem;
    height: 1.02rem;
    flex: 0 0 auto;
  }

  .window-header-left > button .control-icon :global(svg),
  .window-header-right > button .control-icon :global(svg) {
    width: 1.02rem;
    height: 1.02rem;
    display: block;
  }

  .window-sidebar-toggle .control-icon,
  .window-sidebar-toggle .control-icon :global(svg) {
    width: 1.08rem;
    height: 1.08rem;
  }

  .window-header-left > button:hover,
  .window-header-right > button:hover {
    background: color-mix(in srgb, var(--su-tab-highlight, rgba(202, 162, 88, 0.14)) 60%, white 40%);
    color: var(--su-maroon, #61223b);
    box-shadow: inset 0 0 0 1px rgba(97, 34, 59, 0.3);
  }

  .window-header-left > button:focus-visible,
  .window-header-right > button:focus-visible {
    outline: none;
    box-shadow:
      inset 0 0 0 1px rgba(97, 34, 59, 0.28),
      0 0 0 2px rgba(97, 34, 59, 0.13);
  }

  .window-header-left > button:disabled,
  .window-header-right > button:disabled {
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
    background: var(--su-app-content-bg, var(--su-surface, #fffdf9));
  }

  .window-attention-overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    border-radius: inherit;
    opacity: 0;
    background:
      radial-gradient(100% 95% at 0% 0%, rgba(202, 162, 88, 0.28), transparent 62%),
      radial-gradient(105% 100% at 100% 100%, rgba(97, 34, 59, 0.2), transparent 64%);
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
