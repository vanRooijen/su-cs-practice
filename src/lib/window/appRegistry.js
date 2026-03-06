import AboutApp from '../../apps/AboutApp.svelte';
import DemoApp from '../../apps/DemoApp.svelte';
import DocsApp from '../../apps/DocsApp.svelte';
import ErrorApp from '../../apps/ErrorApp.svelte';
import HomeApp from '../../apps/HomeApp.svelte';
import MathApp from '../../apps/MathApp.svelte';
import PeopleApp from '../../apps/PeopleApp.svelte';
import ProgramsApp from '../../apps/ProgramsApp.svelte';
import ResearchApp from '../../apps/ResearchApp.svelte';
import ReaderApp from '../../apps/ReaderApp.svelte';
import Tw314App from '../../apps/Tw314App.svelte';
import { APP_DEFINITIONS } from '../navigation/siteManifest.js';

const APP_COMPONENTS = {
  about: AboutApp,
  demo: DemoApp,
  docs: DocsApp,
  error: ErrorApp,
  home: HomeApp,
  math: MathApp,
  people: PeopleApp,
  programs: ProgramsApp,
  relay: DemoApp,
  research: ResearchApp,
  reader: ReaderApp,
  tw314: Tw314App,
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
