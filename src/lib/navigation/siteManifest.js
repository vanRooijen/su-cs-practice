import { hasContent } from '../content/resolveContent.js';

export const DEFAULT_APP_ID = 'home';
export const ERROR_APP_ID = 'error';

function validateContentBackedSubroute({ appId, subroute }) {
  return hasContent(appId, subroute);
}

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
    validateSubroute: validateContentBackedSubroute,
    resolveNavigationWindowId: reuseFocusedOrTopMostWindow,
  },
  people: {
    id: 'people',
    title: 'People',
    defaultSubroute: '',
    hasSidebar: true,
    enableWindowHistoryNavigation: true,
    validateSubroute: validateContentBackedSubroute,
    resolveNavigationWindowId: reuseFocusedOrTopMostWindow,
  },
  programs: {
    id: 'programs',
    title: 'Programs',
    defaultSubroute: '',
    hasSidebar: true,
    enableWindowHistoryNavigation: true,
    validateSubroute: validateContentBackedSubroute,
    resolveNavigationWindowId: reuseFocusedOrTopMostWindow,
  },
  research: {
    id: 'research',
    title: 'Research',
    defaultSubroute: '',
    hasSidebar: true,
    enableWindowHistoryNavigation: true,
    validateSubroute: validateContentBackedSubroute,
    resolveNavigationWindowId: reuseFocusedOrTopMostWindow,
  },
  about: {
    id: 'about',
    title: 'About',
    defaultSubroute: '',
    hasSidebar: true,
    enableWindowHistoryNavigation: true,
    validateSubroute: validateContentBackedSubroute,
    resolveNavigationWindowId: reuseFocusedOrTopMostWindow,
  },
  reader: {
    id: 'reader',
    title: 'Reader',
    defaultSubroute: 'overview',
    hasSidebar: true,
    enableWindowHistoryNavigation: true,
    validateSubroute: validateContentBackedSubroute,
    resolveNavigationWindowId: reuseFocusedOrTopMostWindow,
  },
  [ERROR_APP_ID]: {
    id: ERROR_APP_ID,
    title: 'Error Message',
    defaultSubroute: 'path-not-found',
    hasSidebar: false,
    enableWindowHistoryNavigation: false,
    validateSubroute: validateContentBackedSubroute,
    resolveNavigationWindowId: reuseFocusedOrTopMostWindow,
    initialBounds: {
      width: 560,
      height: 360,
    },
  },
};

export const TOPBAR_LINKS = [
  { label: 'home', path: '/home' },
  { label: 'people', path: '/people' },
  { label: 'articles', path: '/reader/overview' },
  { label: 'programs', path: '/programs' },
  { label: 'research', path: '/research' },
  { label: 'about', path: '/about' },
];

export const DESKTOP_SHORTCUTS = [
  { label: 'Home', path: '/home' },
  { label: 'Programs', path: '/programs' },
  { label: 'Research', path: '/research' },
  { label: 'About', path: '/about' },
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
    { label: 'Overview', href: '/reader/overview' },
  ],
  programs: [
    { label: 'Overview', href: '/programs' },
    { label: 'Programme Guide', href: '/programs/guide' },
    { label: 'UG Modules', href: '/programs/undergraduate-modules' },
    { label: 'PG Modules', href: '/programs/postgraduate-modules' },
    { label: 'Prospective UG', href: '/programs/prospective-undergraduate' },
    { label: 'Prospective PG', href: '/programs/prospective-postgraduate' },
    { label: 'Honours', href: '/programs/honours' },
    { label: 'Masters', href: '/programs/masters' },
    { label: 'PhD', href: '/programs/phd' },
  ],
  research: [
    { label: 'Overview', href: '/research' },
    { label: 'Automata', href: '/research/automata-grammars' },
    { label: 'Software Engineering', href: '/research/software-engineering-verification' },
    { label: 'Machine Learning', href: '/research/machine-learning-ai' },
    { label: 'Broadband Networks', href: '/research/broadband-networks' },
  ],
  about: [
    { label: 'Overview', href: '/about' },
    { label: 'Department', href: '/about/department' },
    { label: 'Contact', href: '/about/contact' },
    { label: 'Visit Campus', href: '/about/visit' },
  ],
};
