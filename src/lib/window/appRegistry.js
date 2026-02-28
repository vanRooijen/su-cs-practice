import HomeApp from '../../apps/HomeApp.svelte';
import PeopleApp from '../../apps/PeopleApp.svelte';
import ReaderApp from '../../apps/ReaderApp.svelte';

export const DEFAULT_APP_ID = 'home';

export const APP_REGISTRY = {
  home: {
    id: 'home',
    title: 'Home',
    component: HomeApp,
    defaultSubroute: '',
    hasSidebar: false,
  },
  people: {
    id: 'people',
    title: 'People',
    component: PeopleApp,
    defaultSubroute: '',
    hasSidebar: true,
  },
  reader: {
    id: 'reader',
    title: 'Reader',
    component: ReaderApp,
    defaultSubroute: 'articles',
    hasSidebar: true,
  },
};

export const APP_LIST = Object.values(APP_REGISTRY);
