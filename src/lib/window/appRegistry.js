import HomeApp from '../../apps/HomeApp.svelte';
import PeopleApp from '../../apps/PeopleApp.svelte';
import ReaderApp from '../../apps/ReaderApp.svelte';

export const DEFAULT_APP_ID = 'home';

function reuseFocusedOrTopMostWindow(context) {
  const { appWindowIds, focusedWindowId } = context;

  if (!appWindowIds.length) {
    return null;
  }

  if (focusedWindowId && appWindowIds.includes(focusedWindowId)) {
    return focusedWindowId;
  }

  return appWindowIds.at(-1);
}

export const APP_REGISTRY = {
  home: {
    id: 'home',
    title: 'Home',
    component: HomeApp,
    defaultSubroute: '',
    hasSidebar: false,
    resolveNavigationWindowId: reuseFocusedOrTopMostWindow,
    enableWindowHistoryNavigation: false,
  },
  people: {
    id: 'people',
    title: 'People',
    component: PeopleApp,
    defaultSubroute: '',
    hasSidebar: true,
    resolveNavigationWindowId: reuseFocusedOrTopMostWindow,
    enableWindowHistoryNavigation: true,
  },
  reader: {
    id: 'reader',
    title: 'Reader',
    component: ReaderApp,
    defaultSubroute: 'articles',
    hasSidebar: true,
    resolveNavigationWindowId: reuseFocusedOrTopMostWindow,
    enableWindowHistoryNavigation: true,
  },
};

export const APP_LIST = Object.values(APP_REGISTRY);
