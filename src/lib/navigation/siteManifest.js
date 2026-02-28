export const DEFAULT_APP_ID = 'home';
export const NOT_FOUND_APP_ID = 'not-found';

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

export const APP_DEFINITIONS = {
  [DEFAULT_APP_ID]: {
    id: DEFAULT_APP_ID,
    title: 'Home',
    defaultSubroute: '',
    hasSidebar: false,
    enableWindowHistoryNavigation: false,
    resolveNavigationWindowId: reuseFocusedOrTopMostWindow,
  },
  people: {
    id: 'people',
    title: 'People',
    defaultSubroute: '',
    hasSidebar: true,
    enableWindowHistoryNavigation: true,
    resolveNavigationWindowId: reuseFocusedOrTopMostWindow,
  },
  reader: {
    id: 'reader',
    title: 'Reader',
    defaultSubroute: 'articles',
    hasSidebar: true,
    enableWindowHistoryNavigation: true,
    resolveNavigationWindowId: reuseFocusedOrTopMostWindow,
  },
  [NOT_FOUND_APP_ID]: {
    id: NOT_FOUND_APP_ID,
    title: 'Not Found',
    defaultSubroute: '',
    hasSidebar: false,
    enableWindowHistoryNavigation: false,
  },
};

export const TOPBAR_LINKS = [
  { label: 'home', path: '/home' },
  { label: 'people', path: '/people' },
  { label: 'article', path: '/reader/articles' },
];

export const DESKTOP_SHORTCUTS = [
  { label: 'Home', path: '/home' },
  { label: 'People Staff', path: '/people/staff' },
  { label: 'People Students', path: '/people/students' },
  { label: 'Reader Hackathon', path: '/reader/articles/hackathon-2026' },
];

export const APP_NAV_LINKS = {
  people: [
    { label: 'Overview', href: '/people' },
    { label: 'Staff', href: '/people/staff' },
    { label: 'Students', href: '/people/students' },
    { label: 'Alumni', href: '/people/alumni' },
  ],
  reader: [
    { label: 'Overview', href: '/reader' },
    { label: 'Articles', href: '/reader/articles' },
    { label: 'Help', href: '/reader/help' },
  ],
};
