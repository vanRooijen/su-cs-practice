<script>
  import { onMount, tick } from 'svelte';
  import { APP_REGISTRY } from '../lib/window/appRegistry.js';
  import { navigateTo, openInNewWindow, route } from '../lib/navigation/historyRouter.js';
  import { windowManager } from '../lib/window/windowManagerStore.js';
  import AppWindow from './AppWindow.svelte';

  const topbarLinks = [
    { label: 'home', path: '/home' },
    { label: 'people', path: '/people' },
    { label: 'article', path: '/reader/articles' },
  ];

  const desktopShortcuts = [
    { label: 'Home', path: '/home' },
    { label: 'People Staff', path: '/people/staff' },
    { label: 'People Students', path: '/people/students' },
    { label: 'Reader Hackathon', path: '/reader/articles/hackathon-2026' },
  ];

  let workspaceElement;
  let contextMenuElement;
  let contextMenu = {
    open: false,
    x: 0,
    y: 0,
    linkPath: null,
  };

  $: sidebarWindowIds = [...$windowManager.windowOrder].reverse();

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
    if (event.key === 'Escape') {
      closeContextMenu();
    }
  }

  function onGlobalResize() {
    clampContextMenuPosition();
  }

  function openHelpPage() {
    openPath('/reader/help');
    closeContextMenu();
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

  function focusWindowAndSyncUrl(windowId) {
    windowManager.focusExistingWindow(windowId);

    const snapshot = windowManager.getSnapshot();
    const targetPath = snapshot.windows[windowId]?.path;

    if (targetPath && targetPath !== $route.path) {
      navigateTo(targetPath, { replace: true });
    }
  }

  function activateSidebarEntry(windowId) {
    const snapshot = windowManager.getSnapshot();
    const target = snapshot.windows[windowId];

    if (!target) {
      return;
    }

    const wasFocused = snapshot.focusedWindowId === windowId && !target.isMinimized;
    windowManager.activateWindowFromSidebar(windowId);

    if (!wasFocused) {
      const nextSnapshot = windowManager.getSnapshot();
      const targetPath = nextSnapshot.windows[windowId]?.path;

      if (targetPath && targetPath !== $route.path) {
        navigateTo(targetPath, { replace: true });
      }
    }
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

  function handleClose(windowId) {
    const suggestedPath = windowManager.closeWindow(windowId, $route.path);

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

    return () => {
      observer.disconnect();
    };
  });
</script>

<div class="os-layout" role="application" aria-label="Desktop workspace" on:contextmenu={openContextMenu}>
  <header class="topbar">
    <div class="site-block" aria-hidden="true"></div>

    <nav aria-label="Topbar app links">
      {#each topbarLinks as link}
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

        <div class="sidebar-entry">
          <button
            type="button"
            class="entry-main"
            data-context-path={win.path}
            data-focused={$windowManager.focusedWindowId === windowId && !win.isMinimized}
            on:click={() => activateSidebarEntry(windowId)}
          >
            <strong>{appName}</strong>
            <small>~ {win.routeLabel}</small>
            {#if win.isMinimized}
              <small>(minimized)</small>
            {/if}
          </button>
        </div>
      {/each}
    </aside>

    <section class="workspace" bind:this={workspaceElement}>
      <div class="desktop-layer">
        <h2>Desktop</h2>

        <ul class="desktop-icons">
          {#each desktopShortcuts as shortcut}
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
        {#each $windowManager.windowOrder as windowId, index (windowId)}
          {@const windowState = $windowManager.windows[windowId]}
          {@const appConfig = APP_REGISTRY[windowState.appId]}

          <AppWindow
            windowState={windowState}
            zIndex={index + 1}
            isFocused={$windowManager.focusedWindowId === windowId && !windowState.isMinimized}
            on:focus={(event) => focusWindowAndSyncUrl(event.detail.windowId)}
            on:minimize={(event) => handleMinimize(event.detail.windowId)}
            on:maximize={(event) => handleMaximize(event.detail.windowId)}
            on:toggleSidebar={(event) => handleToggleSidebar(event.detail.windowId)}
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
              isFocused={$windowManager.focusedWindowId === windowId && !windowState.isMinimized}
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
    display: block;
    margin-bottom: 0.3rem;
  }

  .entry-main {
    width: 100%;
    text-align: left;
  }

  .entry-main strong,
  .entry-main small {
    display: block;
  }

  .workspace {
    position: relative;
    min-height: 0;
    overflow: hidden;
  }

  .desktop-layer,
  .window-canvas {
    position: absolute;
    inset: 0;
  }

  .desktop-layer {
    overflow: auto;
    padding: 0.5rem;
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
