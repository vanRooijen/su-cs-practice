import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/svelte';
import AppWindow from '../../src/components/AppWindow.svelte';

function makeWindowState(overrides = {}) {
  return {
    windowId: 1,
    appId: 'reader',
    title: 'Reader',
    path: '/reader/overview',
    subroute: 'overview',
    routeKey: 'reader::/reader/overview',
    routeLabel: 'Overview',
    hasSidebar: true,
    showWindowHistoryNavigation: true,
    isSidebarCollapsed: false,
    isMinimized: false,
    isMaximized: false,
    bounds: {
      x: 20,
      y: 20,
      width: 600,
      height: 420,
    },
    history: {
      entries: [
        {
          path: '/reader/overview',
          subroute: 'overview',
          routeKey: 'reader::/reader/overview',
        },
      ],
      index: 0,
    },
    ...overrides,
  };
}

function makeProps(windowStateOverrides = {}) {
  return {
    windowState: makeWindowState(windowStateOverrides),
    isFocused: true,
    zIndex: 1,
    workspaceRect: {
      width: 1200,
      height: 800,
    },
  };
}

describe('AppWindow component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders window controls and current path metadata', () => {
    const { getByRole, getByText } = render(AppWindow, { props: makeProps() });

    expect(getByRole('button', { name: 'Minimize window' })).toBeTruthy();
    expect(getByRole('button', { name: 'Maximize window' })).toBeTruthy();
    expect(getByRole('button', { name: 'Close window' })).toBeTruthy();
    expect(getByText('/reader/overview')).toBeTruthy();
  });

  it('toggles history button enabled states at history boundaries', async () => {
    const historyEntries = [
      {
        path: '/reader/overview',
        subroute: 'overview',
        routeKey: 'reader::/reader/overview',
      },
      {
        path: '/reader/help',
        subroute: 'help',
        routeKey: 'reader::/reader/help',
      },
    ];

    const { getByRole, rerender } = render(AppWindow, {
      props: makeProps({
        history: {
          entries: historyEntries,
          index: 0,
        },
      }),
    });

    const backButton = getByRole('button', { name: 'Back in app' });
    const forwardButton = getByRole('button', { name: 'Forward in app' });
    expect(backButton.hasAttribute('disabled')).toBe(true);
    expect(forwardButton.hasAttribute('disabled')).toBe(false);

    await rerender(
      makeProps({
        history: {
          entries: historyEntries,
          index: 1,
        },
      }),
    );

    expect(backButton.hasAttribute('disabled')).toBe(false);
    expect(forwardButton.hasAttribute('disabled')).toBe(true);
  });

  it('forces maximized layout when mobile compositor mode is enabled', () => {
    const { container, getByRole } = render(AppWindow, {
      props: {
        ...makeProps(),
        forceMaximized: true,
      },
    });

    const windowNode = container.querySelector('.app-window');
    expect(windowNode?.getAttribute('data-maximized')).toBe('true');
    expect(getByRole('button', { name: 'Maximize window' }).hasAttribute('disabled')).toBe(true);
    expect(container.querySelector('.resize-handle')).toBe(null);
  });

  it('double-clicking the header emits a maximize toggle request', async () => {
    const onMaximize = vi.fn();
    const { getByRole } = render(AppWindow, {
      props: makeProps(),
      events: {
        maximize: onMaximize,
      },
    });

    await fireEvent.dblClick(getByRole('group', { name: 'Window header' }));

    expect(onMaximize).toHaveBeenCalledTimes(1);
    expect(onMaximize.mock.calls[0][0]?.detail?.windowId).toBe(1);
  });

  it('right-clicking the header emits minimize and suppresses default context menu', () => {
    const onMinimize = vi.fn();
    const { getByRole } = render(AppWindow, {
      props: makeProps(),
      events: {
        minimize: onMinimize,
      },
    });

    const header = getByRole('group', { name: 'Window header' });
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      button: 2,
    });

    const dispatchResult = header.dispatchEvent(event);

    expect(dispatchResult).toBe(false);
    expect(event.defaultPrevented).toBe(true);
    expect(onMinimize).toHaveBeenCalledTimes(1);
    expect(onMinimize.mock.calls[0][0]?.detail?.windowId).toBe(1);
  });
});
