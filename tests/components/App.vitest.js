import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/svelte';

const mocks = vi.hoisted(() => {
  const routeValue = {
    path: '/home',
    appId: 'home',
    subroute: '',
    routeKey: 'home::/home',
    openMode: 'match',
  };
  const routeSubscribers = new Set();

  return {
    routeValue,
    routeSubscribers,
    windowManager: {
      getRuntimeId: vi.fn(() => 'runtime-local'),
      applyRoute: vi.fn(),
      closeOwnedWindows: vi.fn(),
      closeWindowsOwnedByOthers: vi.fn(),
      closeAllWindowsGlobal: vi.fn(),
      subscribe: vi.fn(() => () => {}),
      getSnapshot: vi.fn(() => ({ windowOrder: [], windows: {}, focusedWindowId: null, workspaceRect: { width: 1200, height: 720 } })),
      hydratePersistedState: vi.fn(() => null),
    },
    createWindowSessionPersistence: vi.fn(async () => ({
      restoredFocusedPath: null,
      flush: async () => {},
      destroy: async () => {},
    })),
    clearWindowSessionPersistence: vi.fn(async () => ({ ok: true })),
    resolveRestoredFocusedPath: vi.fn(() => null),
    initHistoryRouter: vi.fn(() => () => {}),
    navigateTo: vi.fn(),
    navigateToDesktop: vi.fn(),
  };
});

vi.mock('../../src/components/WindowManager.svelte', async () => {
  const module = await import('./WindowManagerStub.svelte');
  return {
    default: module.default,
  };
});

vi.mock('../../src/lib/window/windowManagerStore.js', () => ({
  windowManager: mocks.windowManager,
}));

vi.mock('../../src/lib/window/windowSessionPersistence.js', () => ({
  createWindowSessionPersistence: mocks.createWindowSessionPersistence,
  clearWindowSessionPersistence: mocks.clearWindowSessionPersistence,
}));

vi.mock('../../src/lib/window/restorePolicy.js', () => ({
  resolveRestoredFocusedPath: mocks.resolveRestoredFocusedPath,
}));

vi.mock('../../src/lib/navigation/historyRouter.js', () => ({
  initHistoryRouter: mocks.initHistoryRouter,
  navigateTo: mocks.navigateTo,
  navigateToDesktop: mocks.navigateToDesktop,
  route: {
    subscribe: (subscriber) => {
      mocks.routeSubscribers.add(subscriber);
      subscriber(mocks.routeValue);
      return () => {
        mocks.routeSubscribers.delete(subscriber);
      };
    },
  },
}));

class MockBroadcastChannel {
  static channelsByName = new Map();
  static failPost = false;

  constructor(name) {
    this.name = name;
    this.closed = false;
    this.listeners = new Set();

    const peers = MockBroadcastChannel.channelsByName.get(name) ?? new Set();
    peers.add(this);
    MockBroadcastChannel.channelsByName.set(name, peers);
  }

  addEventListener(type, listener) {
    if (type === 'message' && typeof listener === 'function') {
      this.listeners.add(listener);
    }
  }

  removeEventListener(type, listener) {
    if (type === 'message') {
      this.listeners.delete(listener);
    }
  }

  postMessage(data) {
    if (MockBroadcastChannel.failPost) {
      throw new Error('post failed');
    }

    const peers = MockBroadcastChannel.channelsByName.get(this.name) ?? new Set();
    for (const peer of peers) {
      if (peer === this || peer.closed) {
        continue;
      }

      for (const listener of peer.listeners) {
        listener({ data });
      }
    }
  }

  close() {
    if (this.closed) {
      return;
    }

    this.closed = true;
    const peers = MockBroadcastChannel.channelsByName.get(this.name);
    if (!peers) {
      return;
    }

    peers.delete(this);
    if (peers.size === 0) {
      MockBroadcastChannel.channelsByName.delete(this.name);
    }
  }

  static reset() {
    for (const peers of MockBroadcastChannel.channelsByName.values()) {
      for (const peer of peers) {
        peer.close();
      }
    }
    MockBroadcastChannel.channelsByName.clear();
    MockBroadcastChannel.failPost = false;
  }
}

let AppComponent = null;

async function renderApp() {
  if (!AppComponent) {
    const module = await import('../../src/App.svelte');
    AppComponent = module.default;
  }

  return render(AppComponent);
}

describe('App control-channel flows', () => {
  beforeAll(async () => {
    if (!AppComponent) {
      const module = await import('../../src/App.svelte');
      AppComponent = module.default;
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.routeSubscribers.clear();
    MockBroadcastChannel.reset();
    vi.stubGlobal('BroadcastChannel', MockBroadcastChannel);
    window.history.replaceState(null, '', '/home');
  });

  afterEach(() => {
    cleanup();
    MockBroadcastChannel.reset();
    vi.unstubAllGlobals();
  });

  it('does not mutate local other-owned state when close-other broadcast fails', async () => {
    MockBroadcastChannel.failPost = true;
    const view = await renderApp();
    await waitFor(() => expect(mocks.createWindowSessionPersistence).toHaveBeenCalledTimes(1));

    await fireEvent.click(view.getByRole('button', { name: 'Close Other Instances' }));

    expect(mocks.windowManager.closeWindowsOwnedByOthers).not.toHaveBeenCalled();
    expect(view.getByText('Could not reach other tabs in this browser.')).toBeTruthy();
  });

  it('reacts to remote close-owned by closing local owned windows and syncing URL', async () => {
    await renderApp();
    await waitFor(() => expect(mocks.createWindowSessionPersistence).toHaveBeenCalledTimes(1));

    const peer = new BroadcastChannel('su-cs-window-control');
    peer.postMessage({
      protocol: 'su-cs-window-control-v1',
      type: 'close-owned-windows',
      sourceRuntimeId: 'runtime-remote',
      sentAt: Date.now(),
    });

    await waitFor(() => expect(mocks.windowManager.closeOwnedWindows).toHaveBeenCalledTimes(1));
    expect(mocks.windowManager.closeAllWindowsGlobal).not.toHaveBeenCalled();
    expect(mocks.navigateToDesktop).toHaveBeenCalledWith({ replace: true, forceEmit: true });
    peer.close();
  });

  it('reacts to remote close-all by running global close flow without clearing DB locally', async () => {
    await renderApp();
    await waitFor(() => expect(mocks.createWindowSessionPersistence).toHaveBeenCalledTimes(1));

    const peer = new BroadcastChannel('su-cs-window-control');
    peer.postMessage({
      protocol: 'su-cs-window-control-v1',
      type: 'close-all-instances',
      sourceRuntimeId: 'runtime-remote',
      sentAt: Date.now(),
    });

    await waitFor(() => expect(mocks.windowManager.closeAllWindowsGlobal).toHaveBeenCalledTimes(1));
    expect(mocks.clearWindowSessionPersistence).not.toHaveBeenCalled();
    await waitFor(() => expect(mocks.createWindowSessionPersistence).toHaveBeenCalledTimes(2));
    const secondCallOptions = mocks.createWindowSessionPersistence.mock.calls[1][1];
    expect(secondCallOptions).toEqual(expect.objectContaining({ restoreOnStart: false, requestPeerStateOnStart: false }));
    peer.close();
  });
});
