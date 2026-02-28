import HomeApp from '../../apps/HomeApp.svelte';
import PeopleApp from '../../apps/PeopleApp.svelte';
import ReaderApp from '../../apps/ReaderApp.svelte';
import NotFoundApp from '../../apps/NotFoundApp.svelte';
import { APP_DEFINITIONS, NOT_FOUND_APP_ID } from '../navigation/siteManifest.js';

const APP_COMPONENTS = {
  home: HomeApp,
  people: PeopleApp,
  reader: ReaderApp,
  [NOT_FOUND_APP_ID]: NotFoundApp,
};

export const APP_REGISTRY = Object.fromEntries(
  Object.values(APP_DEFINITIONS).map((appDefinition) => [
    appDefinition.id,
    {
      ...appDefinition,
      component: APP_COMPONENTS[appDefinition.id],
    },
  ]),
);

export const APP_LIST = Object.values(APP_REGISTRY);
export { DEFAULT_APP_ID } from '../navigation/siteManifest.js';
