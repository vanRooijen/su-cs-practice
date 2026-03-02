<script>
  import { onMount, tick } from 'svelte';
  import { APP_REGISTRY } from '../lib/window/appRegistry.js';
  import { DESKTOP_SHORTCUTS, TOPBAR_LINKS } from '../lib/navigation/siteManifest.js';
  import { navigateTo, navigateToDesktop, openInNewWindow, route } from '../lib/navigation/historyRouter.js';
  import { windowManager } from '../lib/window/windowManagerStore.js';
  import AppWindow from './AppWindow.svelte';

  export let onCloseOwned = null;
  export let onCloseAllInstances = null;
  export let onCloseOtherInstances = null;

  const runtimeId = windowManager.getRuntimeId?.() ?? null;

  let workspaceElement;
  let contextMenuElement;
  let contextMenu = {
    open: false,
    x: 0,
    y: 0,
    linkPath: null,
  };

  $: sidebarWindowIds = Object.values($windowManager.windows)
    .sort((left, right) => {
      const leftCreatedAt = Number.isFinite(left?.createdAt) ? left.createdAt : 0;
      const rightCreatedAt = Number.isFinite(right?.createdAt) ? right.createdAt : 0;

      if (leftCreatedAt !== rightCreatedAt) {
        return leftCreatedAt - rightCreatedAt;
      }

      return left.windowId - right.windowId;
    })
    .map((windowState) => windowState.windowId);

  $: renderedWindowIds = $windowManager.windowOrder.filter((windowId) => {
    const win = $windowManager.windows[windowId];
    return Boolean(win);
  });

  function isWindowStolen(win) {
    return Boolean(win && !win.isMinimized && win.ownerRuntimeId && win.ownerRuntimeId !== runtimeId);
  }

  function openPath(path) {
    navigateTo(path, { forceEmit: true });
  }

  function openPathInNewWindow(path) {
    openInNewWindow(path);
  }

  function closeContextMenu() {
    if (!contextMenu.open) {
      return;
    }

    contextMenu = {
      ...contextMenu,
      open: false,
    };
  }

  function getInternalPathFromTarget(target) {
    if (!(target instanceof Element)) {
      return null;
    }

    const pathSource = target.closest('[data-context-path]');
    if (pathSource?.dataset.contextPath) {
      return pathSource.dataset.contextPath;
    }

    const anchor = target.closest('a[href]');
    if (!anchor) {
      return null;
    }

    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) {
      return null;
    }

    return url.pathname;
  }

  function clampContextMenuPosition() {
    if (!contextMenu.open || !contextMenuElement) {
      return;
    }

    const menuRect = contextMenuElement.getBoundingClientRect();
    const margin = 4;

    let x = contextMenu.x;
    let y = contextMenu.y;

    if (x + menuRect.width > window.innerWidth - margin) {
      x = Math.max(margin, window.innerWidth - menuRect.width - margin);
    }

    if (y + menuRect.height > window.innerHeight - margin) {
      y = Math.max(margin, window.innerHeight - menuRect.height - margin);
    }

    if (x === contextMenu.x && y === contextMenu.y) {
      return;
    }

    contextMenu = {
      ...contextMenu,
      x,
      y,
    };
  }

  async function openContextMenu(event) {
    event.preventDefault();

    contextMenu = {
      open: true,
      x: event.clientX,
      y: event.clientY,
      linkPath: getInternalPathFromTarget(event.target),
    };

    await tick();
    clampContextMenuPosition();
  }

  function onGlobalClick(event) {
    if (!contextMenu.open) {
      return;
    }

    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('.site-context-menu')) {
      return;
    }

    closeContextMenu();
  }

  function onGlobalKeydown(event) {
    if (event.key === 'Escape' && contextMenu.open) {
      closeContextMenu();
      return;
    }
  }

  function onGlobalResize() {
    clampContextMenuPosition();
  }

  function openHelpPage() {
    openPath('/reader/help');
    closeContextMenu();
  }

  function handleCloseOwned() {
    if (typeof onCloseOwned !== 'function') {
      return;
    }

    onCloseOwned();
  }

  function handleCloseAllInstances() {
    if (typeof onCloseAllInstances !== 'function') {
      return;
    }

    onCloseAllInstances();
  }

  function handleCloseOtherInstances() {
    if (typeof onCloseOtherInstances !== 'function') {
      return;
    }

    onCloseOtherInstances();
  }

  function openContextLink() {
    if (!contextMenu.linkPath) {
      return;
    }

    openPath(contextMenu.linkPath);
    closeContextMenu();
  }

  function openContextLinkInNewWindow() {
    if (!contextMenu.linkPath) {
      return;
    }

    openPathInNewWindow(contextMenu.linkPath);
    closeContextMenu();
  }

  function shouldFallbackToDesktop(snapshot) {
    if (!snapshot || snapshot.windowOrder.length === 0) {
      return true;
    }

    let hasVisibleWindow = false;
    let hasUserMinimizedWindow = false;

    for (const windowId of snapshot.windowOrder) {
      const win = snapshot.windows[windowId];
      if (!win) {
        continue;
      }

      if (!win.isMinimized) {
        hasVisibleWindow = true;
        break;
      }

      if (win.isMinimized && win.minimizeReason === 'user') {
        hasUserMinimizedWindow = true;
      }
    }

    if (hasVisibleWindow) {
      return false;
    }

    return !hasUserMinimizedWindow;
  }

  function syncUrlToFocusedWindowOrDesktop(options = {}) {
    const snapshot = windowManager.getSnapshot();
    const allowDesktopFallback =
      typeof options.allowDesktopFallback === 'boolean'
        ? options.allowDesktopFallback
        : shouldFallbackToDesktop(snapshot);
    const focusedWindowId = snapshot.focusedWindowId;

    if (!focusedWindowId) {
      if (!allowDesktopFallback) {
        return;
      }

      if ($route.path !== '/') {
        navigateToDesktop({ replace: true });
      }
      return;
    }

    const targetPath = snapshot.windows[focusedWindowId]?.path;
    if (targetPath && targetPath !== $route.path) {
      navigateTo(targetPath, { replace: true });
    }
  }

  function focusWindowAndSyncUrl(windowId) {
    windowManager.focusExistingWindow(windowId);
    syncUrlToFocusedWindowOrDesktop();
  }

  function activateSidebarEntry(windowId) {
    const snapshot = windowManager.getSnapshot();
    const target = snapshot.windows[windowId];

    if (!target) {
      return;
    }

    const isFocusedVisibleWindow = snapshot.focusedWindowId === windowId && !target.isMinimized;
    windowManager.activateWindowFromSidebar(windowId);

    // Pure compositor minimize: minimizing never mutates URL/history.
    if (isFocusedVisibleWindow) {
      return;
    }

    syncUrlToFocusedWindowOrDesktop();
  }

  function handleMinimize(windowId) {
    windowManager.toggleMinimize(windowId);
  }

  function handleMaximize(windowId) {
    windowManager.toggleMaximize(windowId);
  }

  function handleToggleSidebar(windowId) {
    windowManager.toggleSidebar(windowId);
  }

  function handleMove(windowId, x, y) {
    windowManager.moveWindow(windowId, { x, y });
  }

  function handleResize(windowId, edge, deltaX, deltaY, startBounds) {
    windowManager.resizeWindow(windowId, {
      edge,
      deltaX,
      deltaY,
      startBounds,
    });
  }

  function handleWindowHistoryBack(windowId) {
    const targetPath = windowManager.stepWindowHistory(windowId, 'back');

    if (targetPath && targetPath !== $route.path) {
      navigateTo(targetPath, { replace: true, forceEmit: true });
    }
  }

  function handleWindowHistoryForward(windowId) {
    const targetPath = windowManager.stepWindowHistory(windowId, 'forward');

    if (targetPath && targetPath !== $route.path) {
      navigateTo(targetPath, { replace: true, forceEmit: true });
    }
  }

  function handleClose(windowId) {
    const suggestedPath = windowManager.closeWindow(windowId, $route.path);

    if (suggestedPath === '/' && $route.path !== '/') {
      navigateToDesktop({ replace: true });
      return;
    }

    if (suggestedPath && suggestedPath !== $route.path) {
      navigateTo(suggestedPath, { replace: true });
    }
  }

  onMount(() => {
    if (!workspaceElement) {
      return () => {};
    }

    const applyRect = (rect) => {
      windowManager.setWorkspaceRect({
        width: rect.width,
        height: rect.height,
      });
    };

    const initialRect = workspaceElement.getBoundingClientRect();
    applyRect(initialRect);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        applyRect(entry.contentRect);
      }
    });

    observer.observe(workspaceElement);

    const initialSnapshot = windowManager.getSnapshot();
    const initialFocusedWindowId = initialSnapshot.focusedWindowId;
    const initialFocusedPath = initialFocusedWindowId ? initialSnapshot.windows[initialFocusedWindowId]?.path ?? '' : '';
    let previousFocusKey = `${initialFocusedWindowId ?? 'none'}::${initialFocusedPath}`;
    let hasSeenFocusedWindow = Boolean(initialFocusedWindowId && initialFocusedPath);
    const stopWindowSubscription = windowManager.subscribe((snapshot) => {
      const focusedWindowId = snapshot.focusedWindowId;
      const focusedPath = focusedWindowId ? snapshot.windows[focusedWindowId]?.path ?? '' : '';
      const focusKey = `${focusedWindowId ?? 'none'}::${focusedPath}`;

      if (focusKey === previousFocusKey) {
        return;
      }

      previousFocusKey = focusKey;
      if (focusedWindowId && focusedPath) {
        hasSeenFocusedWindow = true;
      }

      syncUrlToFocusedWindowOrDesktop({
        allowDesktopFallback: hasSeenFocusedWindow && shouldFallbackToDesktop(snapshot),
      });
    });

    return () => {
      observer.disconnect();
      stopWindowSubscription();
    };
  });
</script>

<div class="os-layout" role="application" aria-label="Desktop workspace" on:contextmenu={openContextMenu}>
  <header class="topbar">
    <div class="site-block" aria-hidden="true"></div>

    <nav aria-label="Topbar app links">
      {#each TOPBAR_LINKS as link}
        <button
          type="button"
          data-context-path={link.path}
          on:click={() => openPath(link.path)}
        >
          {link.label}
        </button>
      {/each}
    </nav>
  </header>

  <div class="main-row">
    <aside class="sidebar">
      <h2>Windows</h2>

      {#if sidebarWindowIds.length === 0}
        <p>No running windows.</p>
      {/if}

      {#each sidebarWindowIds as windowId (windowId)}
        {@const win = $windowManager.windows[windowId]}
        {@const appName = APP_REGISTRY[win.appId]?.title ?? win.appId}

        <div
          class="sidebar-entry"
          data-focused={$windowManager.focusedWindowId === windowId && !win.isMinimized}
        >
          <button
            type="button"
            class="entry-main"
            data-context-path={win.path}
            on:click={() => activateSidebarEntry(windowId)}
          >
            <strong>{appName}</strong>
            <small>~ {win.routeLabel}</small>
            {#if win.isMinimized}
              <small>(minimized)</small>
            {:else if isWindowStolen(win)}
              <small>(stolen)</small>
            {/if}
          </button>

          <button
            type="button"
            class="entry-close"
            aria-label={`Close ${appName}`}
            on:click|stopPropagation={() => handleClose(windowId)}
          >
            x
          </button>
        </div>
      {/each}

      <div class="sidebar-actions">
        <button type="button" on:click={handleCloseOwned}>Close My Windows</button>
        <button type="button" on:click={handleCloseAllInstances}>Close All Instances</button>
        <button type="button" on:click={handleCloseOtherInstances}>Close Other Instances</button>
      </div>
    </aside>

    <section class="workspace" bind:this={workspaceElement}>
      <div class="desktop-layer">
        <h2>Desktop</h2>

        <ul class="desktop-icons">
          {#each DESKTOP_SHORTCUTS as shortcut}
            <li>
              <button
                type="button"
                class="desktop-icon"
                data-context-path={shortcut.path}
                on:click={() => openPath(shortcut.path)}
                title={shortcut.path}
              >
                <span class="desktop-icon-block" aria-hidden="true"></span>
                <span class="desktop-icon-label">{shortcut.label}</span>
              </button>
            </li>
          {/each}
        </ul>
      </div>

      <div class="window-canvas" aria-live="polite">
        {#each renderedWindowIds as windowId, index (windowId)}
          {@const windowState = $windowManager.windows[windowId]}
          {@const appConfig = APP_REGISTRY[windowState.appId]}

          <AppWindow
            windowState={windowState}
            workspaceRect={$windowManager.workspaceRect}
            zIndex={index + 1}
            isFocused={$windowManager.focusedWindowId === windowId && !windowState.isMinimized}
            on:focus={(event) => focusWindowAndSyncUrl(event.detail.windowId)}
            on:minimize={(event) => handleMinimize(event.detail.windowId)}
            on:maximize={(event) => handleMaximize(event.detail.windowId)}
            on:toggleSidebar={(event) => handleToggleSidebar(event.detail.windowId)}
            on:historyBack={(event) => handleWindowHistoryBack(event.detail.windowId)}
            on:historyForward={(event) => handleWindowHistoryForward(event.detail.windowId)}
            on:move={(event) => handleMove(event.detail.windowId, event.detail.x, event.detail.y)}
            on:resize={(event) =>
              handleResize(
                event.detail.windowId,
                event.detail.edge,
                event.detail.deltaX,
                event.detail.deltaY,
                event.detail.startBounds,
              )}
            on:close={(event) => handleClose(event.detail.windowId)}
          >
            <svelte:component
              this={appConfig.component}
              appId={windowState.appId}
              windowId={windowId}
              path={windowState.path}
              subroute={windowState.subroute}
              sidebarCollapsed={windowState.isSidebarCollapsed}
            />
          </AppWindow>
        {/each}
      </div>
    </section>
  </div>

  {#if contextMenu.open}
    <div
      class="site-context-menu"
      role="menu"
      aria-label="Site context menu"
      bind:this={contextMenuElement}
      style={`left:${contextMenu.x}px;top:${contextMenu.y}px;`}
    >
      {#if contextMenu.linkPath}
        <button type="button" role="menuitem" on:click={openContextLink}>Open Link</button>
        <button type="button" role="menuitem" on:click={openContextLinkInNewWindow}>
          Open Link in New Window
        </button>
        <hr />
      {/if}

      <button type="button" role="menuitem" on:click={openHelpPage}>Help</button>
    </div>
  {/if}

</div>

<svelte:window on:click={onGlobalClick} on:keydown={onGlobalKeydown} on:resize={onGlobalResize} />

<style>
  .os-layout {
    height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr;
    min-height: 0;
  }

  .topbar {
    border-bottom: 1px solid;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem;
  }

  .site-block {
    width: 1.5rem;
    height: 1.5rem;
    border: 1px solid;
  }

  .topbar nav {
    display: flex;
    gap: 0.4rem;
  }

  .main-row {
    display: grid;
    grid-template-columns: 260px 1fr;
    min-height: 0;
  }

  .sidebar {
    border-right: 1px solid;
    overflow: auto;
    padding: 0.35rem;
  }

  .sidebar-entry {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 1.7rem;
    gap: 0.3rem;
    align-items: stretch;
    margin-bottom: 0.3rem;
    border: 1px solid transparent;
    padding: 0.1rem;
  }

  .sidebar-entry[data-focused='true'] {
    border-color: #2b62cf;
    background: rgba(43, 98, 207, 0.08);
  }

  .sidebar-actions {
    margin-top: 0.6rem;
    padding-top: 0.4rem;
    border-top: 1px solid;
    display: grid;
    gap: 0.35rem;
  }

  .entry-main {
    width: 100%;
    text-align: left;
    min-width: 0;
  }

  .entry-main strong,
  .entry-main small {
    display: block;
  }

  .entry-close {
    width: 1.7rem;
    height: 1.7rem;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    font-weight: 600;
  }

  .workspace {
    position: relative;
    min-height: 0;
    overflow: hidden;
    background: #d7e7ff;
  }

  .desktop-layer,
  .window-canvas {
    position: absolute;
    inset: 0;
  }

  .desktop-layer {
    overflow: auto;
    padding: 0.5rem;
    background-image:
      linear-gradient(to right, rgba(32, 72, 140, 0.08) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(32, 72, 140, 0.08) 1px, transparent 1px);
    background-size: 24px 24px;
  }

  .desktop-icons {
    display: grid;
    grid-template-columns: repeat(auto-fill, 88px);
    grid-auto-rows: min-content;
    gap: 0.75rem;
    margin: 0;
    padding: 0.25rem;
    list-style: none;
  }

  .desktop-icons li {
    margin: 0;
    padding: 0;
  }

  .desktop-icon {
    width: 88px;
    border: 1px solid transparent;
    background: transparent;
    padding: 0.3rem 0.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    cursor: pointer;
  }

  .desktop-icon-block {
    width: 40px;
    height: 40px;
    border: 1px solid;
    display: block;
  }

  .desktop-icon-label {
    text-align: center;
    font-size: 0.8rem;
    line-height: 1.2;
  }

  .window-canvas {
    z-index: 1;
    pointer-events: none;
  }

  .site-context-menu {
    position: fixed;
    z-index: 50;
    border: 1px solid;
    background: white;
    padding: 0.2rem;
    min-width: 180px;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .site-context-menu button {
    border: 1px solid transparent;
    background: white;
    text-align: left;
    padding: 0.3rem 0.35rem;
  }

  .site-context-menu hr {
    width: 100%;
    border: 0;
    border-top: 1px solid;
    margin: 0.15rem 0;
  }

  @media (max-width: 860px) {
    .main-row {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
    }

    .sidebar {
      border-right: none;
      border-bottom: 1px solid;
      max-height: 180px;
    }
  }
</style>
