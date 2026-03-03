import AboutApp from '../../apps/AboutApp.svelte';
import ErrorApp from '../../apps/ErrorApp.svelte';
import GuideApp from '../../apps/GuideApp.svelte';
import HomeApp from '../../apps/HomeApp.svelte';
import PeopleApp from '../../apps/PeopleApp.svelte';
import ProgramsApp from '../../apps/ProgramsApp.svelte';
import ResearchApp from '../../apps/ResearchApp.svelte';
import ReaderApp from '../../apps/ReaderApp.svelte';
import { APP_DEFINITIONS } from '../navigation/siteManifest.js';

const APP_COMPONENTS = {
  about: AboutApp,
  demo: GuideApp,
  error: ErrorApp,
  home: HomeApp,
  people: PeopleApp,
  programs: ProgramsApp,
  relay: GuideApp,
  research: ResearchApp,
  reader: ReaderApp,
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

export { DEFAULT_APP_ID } from '../navigation/siteManifest.js';
