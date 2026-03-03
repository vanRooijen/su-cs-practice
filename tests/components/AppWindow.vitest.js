import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/svelte';
import AppWindow from '../../src/components/AppWindow.svelte';

function makeWindowState(overrides = {}) {
  return {
    windowId: 1,
    appId: 'reader',
    title: 'Reader',
    path: '/reader/articles',
    subroute: 'articles',
    routeKey: 'reader::/reader/articles',
    routeLabel: 'Articles',
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
          path: '/reader/articles',
          subroute: 'articles',
          routeKey: 'reader::/reader/articles',
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
    expect(getByText('/reader/articles')).toBeTruthy();
  });

  it('toggles history button enabled states at history boundaries', async () => {
    const historyEntries = [
      {
        path: '/reader/articles',
        subroute: 'articles',
        routeKey: 'reader::/reader/articles',
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
});
