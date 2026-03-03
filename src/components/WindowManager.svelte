<script>
  import { onMount, tick } from 'svelte';
  import { APP_REGISTRY } from '../lib/window/appRegistry.js';
  import { DESKTOP_SHORTCUTS, TOPBAR_LINKS } from '../lib/navigation/siteManifest.js';
  import { navigateTo, navigateToDesktop, openInNewWindow, route } from '../lib/navigation/historyRouter.js';
  import { windowManager } from '../lib/window/windowManagerStore.js';
  import suLogoMark from '../assets/branding/su-corporate-horizontal-no-slogan.svg';
  import iconMail from '../assets/icons/lucide/mail.svg?raw';
  import iconHome from '../assets/icons/lucide/house.svg?raw';
  import iconNewspaper from '../assets/icons/lucide/newspaper.svg?raw';
  import iconHelp from '../assets/icons/lucide/circle-question-mark.svg?raw';
  import iconTrash from '../assets/icons/lucide/trash-2.svg?raw';
  import iconClose from '../assets/icons/lucide/x.svg?raw';
  import AppWindow from './AppWindow.svelte';

  export let onCloseOwned = null;
  export let onCloseAllInstances = null;
  export let onCloseOtherInstances = null;

  const runtimeId = windowManager.getRuntimeId?.() ?? null;
  const MOBILE_VIEWPORT_MEDIA_QUERY = '(max-width: 860px)';
  let localKeepAliveMinimizedWindowIds = new Set();

  let workspaceElement;
  let isMobileViewport = false;
  let mobileDrawer = null;
  let contextMenuElement;
  let sidebarActionsOpen = false;
  let sidebarActionsTriggerElement;
  let sidebarActionsMenuElement;
  let sidebarActionsMenuPosition = {
    x: 0,
    y: 0,
  };
  let contextMenu = {
    open: false,
    x: 0,
    y: 0,
    linkPath: null,
  };

  function setsEqual(left, right) {
    if (left.size !== right.size) {
      return false;
    }

    for (const value of left) {
      if (!right.has(value)) {
        return false;
      }
    }

    return true;
  }

  function trackLocalMinimizedWindow(windowId) {
    if (!Number.isInteger(windowId) || windowId <= 0 || localKeepAliveMinimizedWindowIds.has(windowId)) {
      return;
    }

    const next = new Set(localKeepAliveMinimizedWindowIds);
    next.add(windowId);
    localKeepAliveMinimizedWindowIds = next;
  }

  function untrackLocalMinimizedWindow(windowId) {
    if (!localKeepAliveMinimizedWindowIds.has(windowId)) {
      return;
    }

    const next = new Set(localKeepAliveMinimizedWindowIds);
    next.delete(windowId);
    localKeepAliveMinimizedWindowIds = next;
  }

  $: {
    if (localKeepAliveMinimizedWindowIds.size === 0) {
      // No local minimized windows are currently being preserved.
    } else {
      const next = new Set();
      for (const windowId of localKeepAliveMinimizedWindowIds) {
        const win = $windowManager.windows[windowId];
        if (win && win.ownerRuntimeId === null && win.isMinimized) {
          next.add(windowId);
        }
      }

      if (!setsEqual(next, localKeepAliveMinimizedWindowIds)) {
        localKeepAliveMinimizedWindowIds = next;
      }
    }
  }

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
    if (!win) {
      return false;
    }

    if (win.ownerRuntimeId === runtimeId) {
      return true;
    }

    return Boolean(
      win.ownerRuntimeId === null && win.isMinimized && localKeepAliveMinimizedWindowIds.has(windowId),
    );
  });

  function isWindowStolen(win) {
    return Boolean(win && !win.isMinimized && win.ownerRuntimeId && win.ownerRuntimeId !== runtimeId);
  }

  function openPath(path) {
    closeSidebarActionsMenu();
    closeMobileDrawer();
    navigateTo(path, { forceEmit: true });
  }

  function openContact() {
    openPath('/about/contact');
  }

  function openPathInNewWindow(path) {
    closeSidebarActionsMenu();
    closeMobileDrawer();
    openInNewWindow(path);
  }

  function openPathInNewTab(path) {
    closeSidebarActionsMenu();
    closeMobileDrawer();

    if (typeof window === 'undefined') {
      return;
    }

    window.open(path, '_blank', 'noopener,noreferrer');
  }

  function setMobileViewport(nextIsMobile) {
    const normalized = Boolean(nextIsMobile);
    if (normalized === isMobileViewport) {
      return;
    }

    isMobileViewport = normalized;
    if (!normalized) {
      closeMobileDrawer();
    }
  }

  function closeMobileDrawer() {
    if (mobileDrawer === null) {
      return;
    }

    mobileDrawer = null;
  }

  function closeSidebarActionsMenu() {
    if (!sidebarActionsOpen) {
      return;
    }

    sidebarActionsOpen = false;
  }

  async function updateSidebarActionsMenuPosition() {
    if (!sidebarActionsOpen || !sidebarActionsTriggerElement) {
      return;
    }

    await tick();

    if (!sidebarActionsOpen || !sidebarActionsTriggerElement || !sidebarActionsMenuElement) {
      return;
    }

    const triggerRect = sidebarActionsTriggerElement.getBoundingClientRect();
    const menuRect = sidebarActionsMenuElement.getBoundingClientRect();
    const margin = 8;
    const offset = 6;

    let x = triggerRect.right - menuRect.width;
    let y = triggerRect.bottom + offset;

    if (x < margin) {
      x = margin;
    } else if (x + menuRect.width > window.innerWidth - margin) {
      x = window.innerWidth - menuRect.width - margin;
    }

    if (y + menuRect.height > window.innerHeight - margin) {
      const aboveY = triggerRect.top - menuRect.height - offset;
      y = aboveY >= margin ? aboveY : window.innerHeight - menuRect.height - margin;
    }

    if (y < margin) {
      y = margin;
    }

    sidebarActionsMenuPosition = {
      x: Math.round(x),
      y: Math.round(y),
    };
  }

  async function toggleSidebarActionsMenu(event) {
    event?.stopPropagation();
    sidebarActionsOpen = !sidebarActionsOpen;
    if (sidebarActionsOpen) {
      await updateSidebarActionsMenuPosition();
    }
  }

  function toggleMobileDrawer(drawer) {
    if (!isMobileViewport) {
      return;
    }

    mobileDrawer = mobileDrawer === drawer ? null : drawer;
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
    const target = event.target instanceof Element ? event.target : null;
    if (contextMenu.open) {
      if (!target?.closest('.site-context-menu')) {
        closeContextMenu();
      }
    }

    if (mobileDrawer && !target?.closest('.mobile-dock') && !target?.closest('.mobile-drawer')) {
      closeMobileDrawer();
    }

    if (sidebarActionsOpen && !target?.closest('.toolbar-actions')) {
      closeSidebarActionsMenu();
    }
  }

  function onGlobalClickCapture(event) {
    if (!isMobileViewport) {
      return;
    }

    if (event.defaultPrevented || event.button !== 0) {
      return;
    }

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const target = event.target instanceof Element ? event.target : null;
    const sidebarLink = target?.closest('.app-sidebar a[href]');
    if (!sidebarLink) {
      return;
    }

    const windowHost = sidebarLink.closest('.app-window');
    if (!windowHost) {
      return;
    }

    const windowId = Number(windowHost.getAttribute('data-window-id'));
    if (!Number.isInteger(windowId) || windowId <= 0) {
      return;
    }

    const win = $windowManager.windows[windowId];
    if (!win || win.ownerRuntimeId !== runtimeId || !win.hasSidebar || win.isSidebarCollapsed) {
      return;
    }

    const href = sidebarLink.getAttribute('href');
    if (typeof href !== 'string' || !href.trim()) {
      return;
    }

    const targetUrl = new URL(href, window.location.href);
    if (targetUrl.origin !== window.location.origin) {
      return;
    }

    event.preventDefault();
    windowManager.setSidebarCollapsed(windowId, true);
    navigateTo(targetUrl.pathname, { forceEmit: true });
  }

  function onGlobalKeydown(event) {
    if (event.key === 'Escape' && contextMenu.open) {
      closeContextMenu();
    }

    if (event.key === 'Escape' && mobileDrawer) {
      closeMobileDrawer();
    }

    if (event.key === 'Escape' && sidebarActionsOpen) {
      closeSidebarActionsMenu();
    }
  }

  function onGlobalResize() {
    clampContextMenuPosition();
    void updateSidebarActionsMenuPosition();
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    setMobileViewport(window.matchMedia(MOBILE_VIEWPORT_MEDIA_QUERY).matches);
  }

  function openHelpPage() {
    openPath('/reader/general/help');
    closeContextMenu();
  }

  function handleCloseOwned() {
    if (typeof onCloseOwned !== 'function') {
      return;
    }

    closeSidebarActionsMenu();
    onCloseOwned();
  }

  function handleCloseAllInstances() {
    if (typeof onCloseAllInstances !== 'function') {
      return;
    }

    closeSidebarActionsMenu();
    onCloseAllInstances();
  }

  function handleCloseOtherInstances() {
    if (typeof onCloseOtherInstances !== 'function') {
      return;
    }

    closeSidebarActionsMenu();
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

  function openContextLinkInNewTab() {
    if (!contextMenu.linkPath) {
      return;
    }

    openPathInNewTab(contextMenu.linkPath);
    closeContextMenu();
  }

  function shouldFallbackToDesktop(snapshot) {
    if (!snapshot || snapshot.windowOrder.length === 0) {
      return true;
    }

    let hasOwnedVisibleWindow = false;
    let hasUserMinimizedWindow = false;

    for (const windowId of snapshot.windowOrder) {
      const win = snapshot.windows[windowId];
      if (!win) {
        continue;
      }

      if (win.ownerRuntimeId === runtimeId && !win.isMinimized) {
        hasOwnedVisibleWindow = true;
        break;
      }

      if (win.ownerRuntimeId === runtimeId && win.isMinimized) {
        hasUserMinimizedWindow = true;
      }
    }

    if (hasOwnedVisibleWindow) {
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

    const isFocusedVisibleWindow =
      snapshot.focusedWindowId === windowId && !target.isMinimized && target.ownerRuntimeId === runtimeId;
    if (isFocusedVisibleWindow) {
      trackLocalMinimizedWindow(windowId);
    } else {
      untrackLocalMinimizedWindow(windowId);
    }
    windowManager.activateWindowFromSidebar(windowId);

    // Pure compositor minimize: minimizing never mutates URL/history.
    if (isFocusedVisibleWindow) {
      return;
    }

    syncUrlToFocusedWindowOrDesktop();
    closeMobileDrawer();
  }

  function handleMinimize(windowId) {
    const snapshot = windowManager.getSnapshot();
    const target = snapshot.windows[windowId];
    if (target) {
      if (target.ownerRuntimeId === runtimeId && !target.isMinimized) {
        trackLocalMinimizedWindow(windowId);
      } else if (target.isMinimized) {
        untrackLocalMinimizedWindow(windowId);
      }
    }

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
    untrackLocalMinimizedWindow(windowId);
    const suggestedPath = windowManager.closeWindow(windowId, $route.path);

    if (suggestedPath === '/' && $route.path !== '/') {
      navigateToDesktop({ replace: true });
      return;
    }

    if (suggestedPath && suggestedPath !== $route.path) {
      navigateTo(suggestedPath, { replace: true });
    }

    closeMobileDrawer();
  }

  onMount(() => {
    if (!workspaceElement) {
      return () => {};
    }

    const applyRect = (rect) => {
      windowManager.setWorkspaceRect({
        width: Math.max(1, rect.width),
        height: Math.max(1, rect.height),
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

    let removeViewportListener = () => {};
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const mediaQueryList = window.matchMedia(MOBILE_VIEWPORT_MEDIA_QUERY);
      const onViewportChange = (event) => {
        setMobileViewport(event.matches);
      };

      setMobileViewport(mediaQueryList.matches);
      if (typeof mediaQueryList.addEventListener === 'function') {
        mediaQueryList.addEventListener('change', onViewportChange);
        removeViewportListener = () => mediaQueryList.removeEventListener('change', onViewportChange);
      } else if (typeof mediaQueryList.addListener === 'function') {
        mediaQueryList.addListener(onViewportChange);
        removeViewportListener = () => mediaQueryList.removeListener(onViewportChange);
      }
    }

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
      removeViewportListener();
      stopWindowSubscription();
    };
  });
</script>

<div class="os-layout" role="application" aria-label="Desktop workspace" on:contextmenu={openContextMenu}>
  <header class="topbar">
    <div class="topbar-brand">
      <img class="site-logo" src={suLogoMark} alt="Stellenbosch University" />
      <div class="brand-copy">
        <strong>Computer Science Department</strong>
      </div>
    </div>

    {#if !isMobileViewport}
      <nav class="topbar-cluster" aria-label="Topbar app links">
        {#each TOPBAR_LINKS as link}
          <button
            type="button"
            class="topbar-link"
            data-context-path={link.path}
            title={link.path}
            on:click={() => openPath(link.path)}
          >
            {link.label}
          </button>
        {/each}
      </nav>

      <div class="topbar-utilities">
        <div class="topbar-cluster topbar-cluster-single">
          <button type="button" class="topbar-link topbar-contact" on:click={openContact}>
            <span class="inline-icon" aria-hidden="true">{@html iconMail}</span>
            <span>Contact</span>
          </button>
        </div>
      </div>
    {/if}
  </header>

  <div class="main-row">
    {#if !isMobileViewport}
      <aside class="sidebar">
        <div class="sidebar-toolbar" aria-label="Sidebar shortcuts">
          <div class="toolbar-shortcuts">
            <button
              type="button"
              class="sidebar-tool"
              aria-label="Open Home"
              on:click={() => openPath('/home')}
            >
              <span class="inline-icon" aria-hidden="true">{@html iconHome}</span>
            </button>
            <button
              type="button"
              class="sidebar-tool"
              aria-label="Open Articles"
              on:click={() => openPath('/reader/overview')}
            >
              <span class="inline-icon" aria-hidden="true">{@html iconNewspaper}</span>
            </button>
            <button
              type="button"
              class="sidebar-tool"
              aria-label="Open Help"
              on:click={() => openPath('/reader/general/help')}
            >
              <span class="inline-icon" aria-hidden="true">{@html iconHelp}</span>
            </button>
          </div>

          <div class="toolbar-actions">
            <button
              type="button"
              class="sidebar-tool sidebar-tool-actions"
              aria-label="Clear windows"
              aria-haspopup="menu"
              aria-expanded={sidebarActionsOpen}
              bind:this={sidebarActionsTriggerElement}
              on:click={toggleSidebarActionsMenu}
            >
              <span class="inline-icon" aria-hidden="true">{@html iconTrash}</span>
            </button>

            {#if sidebarActionsOpen}
              <div
                class="toolbar-actions-menu"
                role="menu"
                aria-label="Clear windows menu"
                bind:this={sidebarActionsMenuElement}
                style={`left:${sidebarActionsMenuPosition.x}px;top:${sidebarActionsMenuPosition.y}px;`}
              >
                <button type="button" role="menuitem" on:click={handleCloseOwned}>Close My Windows</button>
                <button type="button" role="menuitem" on:click={handleCloseOtherInstances}>
                  Close Other Instances
                </button>
                <button type="button" role="menuitem" on:click={handleCloseAllInstances}>Close All Instances</button>
              </div>
            {/if}
          </div>
        </div>

        {#if sidebarWindowIds.length === 0}
          <p class="sidebar-empty">No windows open.</p>
        {/if}

        {#each sidebarWindowIds as windowId (windowId)}
          {@const win = $windowManager.windows[windowId]}
          {@const appName = APP_REGISTRY[win.appId]?.title ?? win.appId}

          <div
            class="sidebar-entry"
            data-focused={$windowManager.focusedWindowId === windowId && !win.isMinimized && win.ownerRuntimeId === runtimeId}
            data-minimized={win.isMinimized}
            data-stolen={isWindowStolen(win)}
            data-owned-local={win.ownerRuntimeId === runtimeId}
            data-owned-foreign={Boolean(win.ownerRuntimeId && win.ownerRuntimeId !== runtimeId)}
          >
            <button
              type="button"
              class="entry-main"
              data-context-path={win.path}
              on:click={() => activateSidebarEntry(windowId)}
            >
              <strong>{appName}</strong>
              <small>{win.routeLabel}</small>
            </button>

            <button
              type="button"
              class="entry-close"
              aria-label={`Close ${appName}`}
              on:click|stopPropagation={() => handleClose(windowId)}
            >
              <span class="inline-icon" aria-hidden="true">{@html iconClose}</span>
            </button>
          </div>
        {/each}

      </aside>
    {/if}

    <section class="workspace" bind:this={workspaceElement}>
      <div class="desktop-layer">
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
            forceMaximized={isMobileViewport}
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
              path={windowState.path}
              subroute={windowState.subroute}
              sidebarCollapsed={windowState.isSidebarCollapsed}
            />
          </AppWindow>
        {/each}
      </div>
    </section>
  </div>

  {#if isMobileViewport}
    <nav class="mobile-dock" aria-label="Mobile controls">
      <button type="button" on:click={() => toggleMobileDrawer('apps')}>
        <span class="inline-icon" aria-hidden="true">{@html iconHome}</span>
        <span>Apps</span>
      </button>
      <button type="button" on:click={() => toggleMobileDrawer('tabs')}>
        <span class="inline-icon" aria-hidden="true">{@html iconNewspaper}</span>
        <span>Tabs</span>
      </button>
      <button type="button" on:click={openHelpPage}>
        <span class="inline-icon" aria-hidden="true">{@html iconHelp}</span>
        <span>Help</span>
      </button>
    </nav>
  {/if}

  {#if isMobileViewport && mobileDrawer}
    <div class="mobile-drawer-backdrop">
      <div class="mobile-drawer" role="dialog" aria-label="Mobile panel">
        {#if mobileDrawer === 'apps'}
          <header>
            <h2>Apps</h2>
          </header>
          <div class="mobile-drawer-list">
            {#each TOPBAR_LINKS as link}
              <button type="button" data-context-path={link.path} on:click={() => openPath(link.path)}>
                {link.label}
              </button>
            {/each}
            <button type="button" on:click={openContact}>Contact</button>
          </div>
        {:else if mobileDrawer === 'tabs'}
          <header>
            <h2>Tabs</h2>
          </header>
          <div class="mobile-drawer-list">
            {#if sidebarWindowIds.length === 0}
              <p class="mobile-drawer-empty">No windows open.</p>
            {:else}
              {#each sidebarWindowIds as windowId (windowId)}
                {@const win = $windowManager.windows[windowId]}
                {@const appName = APP_REGISTRY[win.appId]?.title ?? win.appId}
                <div
                  class="mobile-tab-row"
                  data-focused={$windowManager.focusedWindowId === windowId && !win.isMinimized}
                  data-minimized={win.isMinimized}
                >
                  <button type="button" data-context-path={win.path} on:click={() => activateSidebarEntry(windowId)}>
                    <strong>{appName}</strong>
                    <small>{win.routeLabel}</small>
                  </button>
                  <button
                    type="button"
                    class="mobile-tab-close"
                    aria-label={`Close ${appName}`}
                    on:click={() => handleClose(windowId)}
                  >
                    <span class="inline-icon" aria-hidden="true">{@html iconClose}</span>
                  </button>
                </div>
              {/each}
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/if}

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
        <button type="button" role="menuitem" on:click={openContextLinkInNewTab}>Open Link in New Tab</button>
        <button type="button" role="menuitem" on:click={openContextLinkInNewWindow}>
          Open Link in New Window
        </button>
        <hr />
      {/if}

      <button type="button" role="menuitem" on:click={openHelpPage}>Help</button>
    </div>
  {/if}

</div>

<svelte:window
  on:click|capture={onGlobalClickCapture}
  on:click={onGlobalClick}
  on:keydown={onGlobalKeydown}
  on:resize={onGlobalResize}
/>

<style>
  .os-layout {
    --su-maroon: #61223b;
    --su-gold: #caa258;
    --su-ink: #2c2a29;
    --su-muted: #686d71;
    --su-paper: #f7f4ee;
    --su-topbar: #f1ede5;
    --su-sidebar: #f4f0e8;
    --su-surface: #fffdf9;
    --su-surface-subtle: #f8f4ed;
    --su-workspace: #fcfcfb;
    --su-line: #ddd6cb;
    --su-line-strong: #cec6b9;
    --su-app-content-bg: #ffffff;
    --su-app-sidebar-bg: color-mix(in srgb, var(--su-surface-subtle) 82%, white 18%);
    --su-app-chrome-line: rgba(44, 42, 41, 0.08);
    --su-content-max-width: 72rem;
    --su-local-accent: #61223b;
    --su-foreign-accent: #4d5356;
    --su-focus-soft: rgba(97, 34, 59, 0.12);
    --su-tab-highlight: rgba(202, 162, 88, 0.14);
    --su-panel-radius: 0.42rem;

    height: 100vh;
    box-sizing: border-box;
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 0;
    padding: 0;
    min-height: 0;
    background-color: var(--su-paper);
    color: var(--su-ink);
    font-family: var(--su-font-ui, 'SU Raleway Local', 'SU Raleway', 'Raleway', 'Trebuchet MS', sans-serif);
  }

  .topbar {
    position: relative;
    z-index: 3;
    border-bottom: 1px solid var(--su-line);
    background: var(--su-topbar);
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    column-gap: 0.86rem;
    min-height: 4.2rem;
    padding: 0 0.56rem;
    box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.75);
  }

  .topbar-brand {
    display: inline-flex;
    align-items: center;
    gap: 0;
    min-width: 0;
    justify-self: start;
  }

  .site-logo {
    height: 4.5rem;
    max-width: clamp(20.8rem, 39vw, 26.8rem);
    width: auto;
    display: block;
    margin-inline: 0 0.5rem;
    margin-block: 0;
    flex: 0 0 auto;
  }

  .brand-copy {
    display: grid;
    min-width: 0;
  }

  .brand-copy strong {
    font-size: 1.03rem;
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: 0.004em;
    color: color-mix(in srgb, var(--su-maroon) 84%, black 16%);
    white-space: nowrap;
    padding-top: 0.03rem;
    text-rendering: geometricPrecision;
    -webkit-font-smoothing: antialiased;
  }

  .topbar-cluster {
    display: flex;
    align-items: center;
    gap: 0;
    min-width: 0;
    border: 1px solid rgba(44, 42, 41, 0.2);
    border-radius: 0.4rem;
    background: rgba(255, 255, 255, 0.5);
    box-shadow:
      0 1px 2px rgba(44, 42, 41, 0.09),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    overflow: hidden;
  }

  .topbar nav.topbar-cluster {
    justify-content: center;
    justify-self: center;
  }

  .topbar-link {
    appearance: none;
    border: none;
    border-radius: 0;
    background: transparent;
    color: var(--su-ink);
    padding: 0.45rem 0.68rem;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.004em;
    text-transform: capitalize;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.36rem;
    cursor: pointer;
    position: relative;
    box-shadow: none;
    transition: color 140ms ease, background-color 140ms ease, box-shadow 140ms ease;
  }

  .topbar-link:first-child {
    border-top-left-radius: 0.32rem;
    border-bottom-left-radius: 0.32rem;
  }

  .topbar-link:last-child {
    border-top-right-radius: 0.32rem;
    border-bottom-right-radius: 0.32rem;
  }

  .topbar-cluster-single .topbar-link {
    border-radius: 0.32rem;
  }

  .topbar-link + .topbar-link::before {
    content: '';
    position: absolute;
    left: 0;
    top: 24%;
    bottom: 24%;
    width: 1px;
    background: rgba(44, 42, 41, 0.14);
  }

  .topbar-link::after {
    content: '';
    position: absolute;
    left: 0.62rem;
    right: 0.62rem;
    bottom: 0.22rem;
    height: 2px;
    border-radius: 999px;
    background: var(--su-gold);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 140ms ease;
  }

  .topbar-link:hover {
    background: var(--su-tab-highlight);
    color: var(--su-maroon);
  }

  .topbar-link:hover::after,
  .topbar-link:focus-visible::after {
    transform: scaleX(1);
  }

  .topbar-link:focus-visible {
    outline: none;
    background: var(--su-tab-highlight);
    box-shadow: inset 0 0 0 1px rgba(97, 34, 59, 0.32);
    z-index: 1;
  }

  .topbar-utilities {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    justify-self: end;
  }

  .topbar-contact {
    text-transform: none;
  }

  .inline-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 0.95rem;
    height: 0.95rem;
  }

  .inline-icon :global(svg) {
    width: 0.95rem;
    height: 0.95rem;
    display: block;
  }

  .main-row {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 0;
    min-height: 0;
  }

  .sidebar {
    border-right: 1px solid var(--su-line);
    background: var(--su-app-sidebar-bg, var(--su-sidebar));
    overflow: auto;
    padding: 0.62rem 0.6rem 0.65rem;
    box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.6);
  }

  .sidebar-toolbar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin: 0.08rem 0 0.62rem;
    padding: 0 0.02rem 0.52rem;
    border-bottom: 1px solid var(--su-line);
  }

  .toolbar-shortcuts {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .sidebar-tool {
    appearance: none;
    width: 1.82rem;
    height: 1.82rem;
    border: none;
    border-radius: 0.34rem;
    background: color-mix(in srgb, var(--su-surface-subtle) 86%, white 14%);
    color: color-mix(in srgb, var(--su-maroon) 70%, black 30%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    cursor: pointer;
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.14);
    transition: background-color 140ms ease, color 140ms ease, box-shadow 140ms ease;
  }

  .sidebar-tool .inline-icon,
  .sidebar-tool .inline-icon :global(svg) {
    width: 0.94rem;
    height: 0.94rem;
  }

  .sidebar-tool:hover {
    background: var(--su-tab-highlight);
    color: var(--su-maroon);
    box-shadow: inset 0 0 0 1px rgba(97, 34, 59, 0.28);
  }

  .sidebar-tool:focus-visible {
    outline: 2px solid rgba(202, 162, 88, 0.65);
    outline-offset: 2px;
  }

  .toolbar-actions {
    position: relative;
    padding-left: 0.5rem;
    margin-left: auto;
    border-left: 1px solid rgba(44, 42, 41, 0.16);
    z-index: 4;
  }

  .sidebar-tool-actions[aria-expanded='true'] {
    background: var(--su-tab-highlight);
    color: var(--su-maroon);
    box-shadow: inset 0 0 0 1px rgba(97, 34, 59, 0.3);
  }

  .toolbar-actions-menu {
    position: fixed;
    min-width: 13rem;
    padding: 0.28rem;
    border-radius: 0.44rem;
    background: color-mix(in srgb, var(--su-surface) 92%, white 8%);
    box-shadow:
      0 8px 22px rgba(44, 42, 41, 0.18),
      inset 0 0 0 1px rgba(44, 42, 41, 0.11);
    display: grid;
    gap: 0.2rem;
    z-index: 100;
  }

  .toolbar-actions-menu button {
    appearance: none;
    width: 100%;
    text-align: left;
    border: none;
    border-radius: 0.34rem;
    background: color-mix(in srgb, var(--su-surface-subtle) 84%, white 16%);
    color: var(--su-ink);
    padding: 0.36rem 0.44rem;
    font-family: inherit;
    font-size: 0.82rem;
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.08);
  }

  .toolbar-actions-menu button:hover {
    background: var(--su-tab-highlight);
    color: var(--su-maroon);
    box-shadow: inset 0 0 0 1px rgba(97, 34, 59, 0.24);
  }

  .sidebar-empty {
    margin: 0.1rem 0 0.55rem;
    color: var(--su-muted);
    font-size: 0.84rem;
  }

  .sidebar-entry {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 1.58rem;
    gap: 0.24rem;
    align-items: stretch;
    height: 2.42rem;
    margin-bottom: 0.28rem;
    border: none;
    border-radius: var(--su-panel-radius);
    padding: 0.09rem;
    background: color-mix(in srgb, var(--su-surface) 86%, white 14%);
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.08);
    transition: background-color 140ms ease, box-shadow 140ms ease;
  }

  .sidebar-entry:hover {
    background: var(--su-surface-subtle);
  }

  .sidebar-entry:focus-within {
    box-shadow:
      inset 2px 0 0 color-mix(in srgb, var(--su-local-accent) 62%, white 38%),
      inset 0 0 0 1px rgba(97, 34, 59, 0.26),
      0 0 0 2px var(--su-focus-soft);
  }

  .sidebar-entry[data-owned-local='true'] {
    box-shadow:
      inset 2px 0 0 color-mix(in srgb, var(--su-local-accent) 60%, white 40%),
      inset 0 0 0 1px rgba(44, 42, 41, 0.08);
  }

  .sidebar-entry[data-owned-foreign='true'] {
    background: #f4f7f8;
    box-shadow:
      inset 2px 0 0 color-mix(in srgb, var(--su-foreign-accent) 56%, white 44%),
      inset 0 0 0 1px rgba(44, 42, 41, 0.08);
  }

  .sidebar-entry[data-focused='true'][data-owned-local='true'] {
    background: #fff9fb;
    box-shadow:
      inset 2px 0 0 var(--su-local-accent),
      inset 0 0 0 1px rgba(97, 34, 59, 0.26),
      0 0 0 2px var(--su-focus-soft);
  }

  .sidebar-entry[data-focused='true'][data-owned-foreign='true'] {
    background: #eef3f5;
    box-shadow:
      inset 2px 0 0 color-mix(in srgb, var(--su-foreign-accent) 86%, white 14%),
      inset 0 0 0 1px rgba(77, 83, 86, 0.24),
      0 0 0 2px rgba(77, 83, 86, 0.1);
  }

  .sidebar-entry[data-minimized='true'] {
    background: #ece9e3;
    box-shadow: inset 0 0 0 1px rgba(77, 83, 86, 0.2);
    opacity: 0.84;
  }

  .sidebar-entry[data-stolen='true'] {
    box-shadow:
      inset 2px 0 0 color-mix(in srgb, var(--su-foreign-accent) 72%, white 28%),
      inset 0 0 0 1px rgba(77, 83, 86, 0.17);
  }

  .entry-main {
    width: 100%;
    text-align: left;
    min-width: 0;
    height: 100%;
    padding: 0.2rem 0.34rem;
    display: flex;
    align-items: center;
    gap: 0.34rem;
  }

  .entry-main strong,
  .entry-main small {
    display: inline-block;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .entry-main strong {
    flex-shrink: 0;
    color: var(--su-ink);
    font-size: 0.83rem;
    line-height: 1;
    font-weight: 600;
  }

  .entry-main small {
    flex: 1;
    color: var(--su-muted);
    font-size: 0.73rem;
    line-height: 1;
  }

  .entry-main small::before {
    content: '~';
    margin-right: 0.24rem;
    opacity: 0.78;
  }

  .sidebar-entry[data-owned-local='true'] .entry-main strong {
    color: var(--su-maroon);
  }

  .sidebar-entry[data-owned-foreign='true'] .entry-main strong {
    color: var(--su-foreign-accent);
  }

  .sidebar button {
    font-family: inherit;
  }

  .entry-main,
  .entry-close {
    appearance: none;
    border: none;
    border-radius: calc(var(--su-panel-radius) - 0.04rem);
    background: transparent;
    transition: color 140ms ease;
  }

  .entry-main:focus-visible,
  .entry-close:focus-visible {
    outline: none;
  }

  .entry-close {
    width: 1.58rem;
    height: 100%;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    font-weight: 600;
    color: color-mix(in srgb, var(--su-muted) 84%, black 16%);
    background: transparent;
  }

  .sidebar-entry:hover .entry-close,
  .sidebar-entry:focus-within .entry-close {
    color: var(--su-maroon);
  }

  .workspace {
    position: relative;
    min-height: 0;
    overflow: hidden;
    background: var(--su-workspace);
    padding-bottom: 0;
  }

  .desktop-layer,
  .window-canvas {
    position: absolute;
    inset: 0;
  }

  .desktop-layer {
    overflow: auto;
    padding: 0.5rem;
    background-color: #fdfdfd;
    background-image:
      radial-gradient(rgba(44, 42, 41, 0.022) 0.5px, transparent 0.5px),
      radial-gradient(rgba(255, 255, 255, 0.88) 0.6px, transparent 0.6px);
    background-size: 13px 13px, 18px 18px;
    background-position: 0 0, 5px 6px;
  }

  .desktop-icons {
    display: grid;
    grid-template-columns: repeat(auto-fill, 92px);
    grid-auto-rows: 104px;
    gap: 0.72rem;
    margin: 0;
    padding: 0.25rem;
    list-style: none;
    align-content: start;
  }

  .desktop-icons li {
    margin: 0;
    padding: 0;
    width: 92px;
    height: 104px;
  }

  .desktop-icon {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    padding: 0.26rem 0.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 0.28rem;
    cursor: pointer;
    border-radius: 0.36rem;
    box-shadow: inset 0 0 0 1px transparent;
    transition: background-color 140ms ease, box-shadow 140ms ease;
  }

  .desktop-icon:hover {
    background: rgba(255, 255, 255, 0.52);
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.1);
  }

  .desktop-icon-block {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 0.46rem;
    background: color-mix(in srgb, var(--su-surface-subtle) 82%, white 18%);
    box-shadow:
      inset 0 0 0 1px rgba(44, 42, 41, 0.1),
      0 2px 6px rgba(44, 42, 41, 0.08);
    display: block;
  }

  .desktop-icon-label {
    text-align: center;
    font-size: 0.76rem;
    color: color-mix(in srgb, var(--su-ink) 82%, white 18%);
    line-height: 1.2;
  }

  .window-canvas {
    z-index: 1;
    pointer-events: none;
  }

  .mobile-dock {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0;
    background: color-mix(in srgb, var(--su-topbar) 94%, white 6%);
    border-top: 1px solid var(--su-line);
    box-shadow: 0 -8px 20px rgba(44, 42, 41, 0.08);
  }

  .mobile-dock button {
    appearance: none;
    border: none;
    background: transparent;
    color: var(--su-ink);
    font-family: inherit;
    font-size: 0.84rem;
    font-weight: 600;
    line-height: 1.2;
    min-height: 3.05rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.34rem;
    box-shadow: inset -1px 0 0 rgba(44, 42, 41, 0.08);
  }

  .mobile-dock button:last-child {
    box-shadow: none;
  }

  .mobile-dock button:hover {
    background: var(--su-tab-highlight);
    color: var(--su-maroon);
  }

  .mobile-drawer-backdrop {
    position: fixed;
    inset: 0 0 3.05rem 0;
    z-index: 19;
    background: rgba(44, 42, 41, 0.22);
    display: flex;
    align-items: flex-end;
  }

  .mobile-drawer {
    width: 100%;
    max-height: min(74vh, 38rem);
    border-top-left-radius: 0.72rem;
    border-top-right-radius: 0.72rem;
    background: color-mix(in srgb, var(--su-surface) 94%, white 6%);
    box-shadow:
      0 -14px 36px rgba(44, 42, 41, 0.16),
      0 1px 0 rgba(255, 255, 255, 0.8) inset;
    padding: 0.6rem 0.62rem 0.82rem;
    overflow: auto;
  }

  .mobile-drawer header {
    margin-bottom: 0.48rem;
  }

  .mobile-drawer h2 {
    margin: 0;
    font-size: 0.96rem;
    color: var(--su-maroon);
  }

  .mobile-drawer-list {
    display: grid;
    gap: 0.32rem;
  }

  .mobile-drawer-list > button {
    appearance: none;
    border: none;
    border-radius: 0.38rem;
    background: var(--su-surface-subtle);
    color: var(--su-ink);
    text-transform: capitalize;
    text-align: left;
    font-family: inherit;
    font-size: 0.86rem;
    font-weight: 600;
    padding: 0.54rem 0.58rem;
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.1);
  }

  .mobile-drawer-list > button:hover {
    background: var(--su-tab-highlight);
    color: var(--su-maroon);
    box-shadow: inset 0 0 0 1px rgba(97, 34, 59, 0.24);
  }

  .mobile-drawer-empty {
    margin: 0;
    color: var(--su-muted);
    font-size: 0.84rem;
  }

  .mobile-tab-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.22rem;
    border-radius: 0.42rem;
    background: var(--su-surface-subtle);
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.1);
    overflow: hidden;
  }

  .mobile-tab-row[data-focused='true'] {
    box-shadow:
      inset 2px 0 0 var(--su-local-accent),
      inset 0 0 0 1px rgba(97, 34, 59, 0.24);
  }

  .mobile-tab-row[data-minimized='true'] {
    opacity: 0.84;
  }

  .mobile-tab-row > button {
    appearance: none;
    border: none;
    background: transparent;
    color: inherit;
    font-family: inherit;
  }

  .mobile-tab-row > button:first-child {
    min-width: 0;
    text-align: left;
    display: inline-flex;
    align-items: center;
    gap: 0.28rem;
    padding: 0.5rem 0.52rem;
  }

  .mobile-tab-row strong,
  .mobile-tab-row small {
    display: inline-block;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mobile-tab-row strong {
    font-size: 0.84rem;
    color: var(--su-maroon);
  }

  .mobile-tab-row small {
    font-size: 0.75rem;
    color: var(--su-muted);
  }

  .mobile-tab-row small::before {
    content: '~';
    margin-right: 0.22rem;
  }

  .mobile-tab-close {
    width: 2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--su-muted);
  }

  .mobile-tab-close .inline-icon,
  .mobile-tab-close .inline-icon :global(svg) {
    width: 0.9rem;
    height: 0.9rem;
  }

  .site-context-menu {
    position: fixed;
    z-index: 50;
    border: none;
    border-radius: 0.58rem;
    background: color-mix(in srgb, var(--su-surface) 95%, white 5%);
    box-shadow:
      0 10px 24px rgba(44, 42, 41, 0.14),
      inset 0 0 0 1px rgba(44, 42, 41, 0.12);
    padding: 0.25rem;
    min-width: 180px;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .site-context-menu button {
    border: none;
    border-radius: 0.36rem;
    background: transparent;
    text-align: left;
    padding: 0.3rem 0.35rem;
    color: var(--su-ink);
  }

  .site-context-menu button:hover {
    background: var(--su-surface-subtle);
    color: var(--su-maroon);
  }

  .site-context-menu hr {
    width: 100%;
    border: 0;
    border-top: 1px solid rgba(44, 42, 41, 0.14);
    margin: 0.15rem 0;
  }

  @media (max-width: 860px) {
    .topbar {
      grid-template-columns: 1fr;
      gap: 0;
      min-height: 3.7rem;
      padding: 0 0.32rem;
    }

    .topbar-brand,
    .topbar-utilities {
      width: 100%;
    }

    .topbar-utilities {
      justify-content: flex-start;
    }

    .site-logo {
      height: 3.18rem;
      max-width: min(86vw, 22rem);
      margin-inline: 0 0.3rem;
    }

    .brand-copy strong {
      font-size: 0.88rem;
    }

    .main-row {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
    }

    .workspace {
      padding-bottom: 3.05rem;
    }

    .desktop-layer {
      display: none;
    }
  }
</style>
