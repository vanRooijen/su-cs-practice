const EMPTY_DEMO_CONTENT = {
  key: 'demo.missing',
  appId: 'demo',
  subroute: '',
  title: 'Demo Not Found',
  excerpt: '',
  shell: 'demo-step',
  meta: {
    validation_position: 'hidden',
  },
  sections: [
    {
      key: '000-main',
      slot: 'main',
      html: '<h2>Demo Not Found</h2><p>The requested demo route is not available.</p>',
    },
  ],
  html: '<h2>Demo Not Found</h2><p>The requested demo route is not available.</p>',
};

function normalizeSubroute(subroute = '') {
  if (typeof subroute !== 'string') {
    return '';
  }

  return subroute
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .filter(Boolean)
    .join('/');
}

function makeArtifact({
  key,
  appId,
  subroute,
  title,
  excerpt = '',
  demoStep = '',
  validationPosition = 'before',
  sections = [],
}) {
  const normalizedSections = sections.map((section, index) => ({
    key: `${String(index + 1).padStart(3, '0')}-${section.slot ?? 'main'}-${index + 1}`,
    slot: section.slot ?? 'main',
    html: section.html ?? '',
  }));

  return {
    key,
    appId,
    subroute,
    title,
    excerpt,
    shell: 'demo-step',
    meta: {
      demo_step: demoStep,
      validation_position: validationPosition,
    },
    sections: normalizedSections,
    html: normalizedSections.map((section) => section.html).join('\n'),
  };
}

const DEMO_ARTIFACTS = {
  'demo.index': makeArtifact({
    key: 'demo.index',
    appId: 'demo',
    subroute: '',
    title: 'Demo Step 1',
    demoStep: 'step-2-pull-over',
    validationPosition: 'after',
    sections: [
      {
        slot: 'title',
        html: '<h2>Step 1</h2>',
      },
      {
        slot: 'command',
        html:
          '<details><summary><strong>Command</strong></summary><p class="demo-command-desktop">Right-click this link and choose Open in New Browser Tab: <a href="/relay/pull-over">Right-click me</a>.</p><p class="demo-command-mobile">Tap and hold this link, then choose Open in New Tab: <a href="/relay/pull-over">Tap and hold me</a>.</p></details>',
      },
    ],
  }),
  'demo.history-a': makeArtifact({
    key: 'demo.history-a',
    appId: 'demo',
    subroute: 'history-a',
    title: 'Demo Step 3',
    demoStep: 'step-3-history-back',
    validationPosition: 'after',
    sections: [
      {
        slot: 'title',
        html: '<h2>Step 3</h2>',
      },
      {
        slot: 'command',
        html:
          '<details open><summary><strong>Command</strong></summary><p class="demo-command-desktop">Click this link to open Checkpoint in this window, then press browser Back once: <a href="/demo/checkpoint">Click me</a>.</p><p class="demo-command-mobile">Tap this link to open Checkpoint in this window, then use browser Back once: <a href="/demo/checkpoint">Tap me</a>.</p></details>',
      },
    ],
  }),
  'demo.checkpoint': makeArtifact({
    key: 'demo.checkpoint',
    appId: 'demo',
    subroute: 'checkpoint',
    title: 'Demo Checkpoint',
    validationPosition: 'hidden',
    sections: [
      {
        slot: 'title',
        html: '<h2>Checkpoint</h2>',
      },
      {
        slot: 'command',
        html:
          '<details open><summary><strong>Command</strong></summary><p>Press browser Back once to return to Step 3.</p></details>',
      },
    ],
  }),
  'demo.history-b': makeArtifact({
    key: 'demo.history-b',
    appId: 'demo',
    subroute: 'history-b',
    title: 'Demo Step 4',
    validationPosition: 'hidden',
    sections: [
      {
        slot: 'title',
        html: '<h2>Step 4</h2>',
      },
      {
        slot: 'command',
        html:
          '<details><summary><strong>Command</strong></summary><p class="demo-command-desktop">Right-click this link and choose Open in New App Window: <a href="/demo/final">Right-click me</a>.</p><p class="demo-command-mobile">Tap and hold this link, then choose Open in New App Window: <a href="/demo/final">Tap and hold me</a>.</p></details>',
      },
    ],
  }),
  'demo.final': makeArtifact({
    key: 'demo.final',
    appId: 'demo',
    subroute: 'final',
    title: 'Demo Step 4 Destination',
    demoStep: 'step-4-new-window',
    validationPosition: 'middle',
    sections: [
      {
        slot: 'title',
        html: '<h2>Step 4 Destination</h2>',
      },
      {
        slot: 'command',
        html:
          '<details><summary><strong>Command</strong></summary><p>You&apos;re all done!</p></details>',
      },
    ],
  }),
  'relay.index': makeArtifact({
    key: 'relay.index',
    appId: 'relay',
    subroute: '',
    title: 'Demo Step 2',
    demoStep: 'step-1-new-tab',
    validationPosition: 'middle',
    sections: [
      {
        slot: 'title',
        html: '<h2>Step 2</h2>',
      },
      {
        slot: 'command',
        html:
          '<details><summary><strong>Command</strong></summary><p class="demo-command-desktop">Click the Demo sidebar entry once.</p><p class="demo-command-mobile">Tap Tabs in the bottom bar, then tap the Demo entry once.</p></details>',
      },
    ],
  }),
  'relay.pull-over': makeArtifact({
    key: 'relay.pull-over',
    appId: 'relay',
    subroute: 'pull-over',
    title: 'Demo Step 2',
    demoStep: 'step-1-new-tab',
    validationPosition: 'middle',
    sections: [
      {
        slot: 'title',
        html: '<h2>Step 2</h2>',
      },
      {
        slot: 'command',
        html:
          '<details><summary><strong>Command</strong></summary><p class="demo-command-desktop">Click the Demo sidebar entry once.</p><p class="demo-command-mobile">Tap Tabs in the bottom bar, then tap the Demo entry once.</p></details>',
      },
    ],
  }),
};

function toArtifactKey(appId, subroute = '') {
  const normalizedSubroute = normalizeSubroute(subroute);
  if (!normalizedSubroute) {
    return `${appId}.index`;
  }

  return `${appId}.${normalizedSubroute.replace(/\//g, '.')}`;
}

export function hasDemoContent(appId, subroute = '') {
  const key = toArtifactKey(appId, subroute);
  return Boolean(DEMO_ARTIFACTS[key]);
}

export function resolveDemoContent(appId, subroute = '') {
  const key = toArtifactKey(appId, subroute);
  const artifact = DEMO_ARTIFACTS[key];
  if (artifact) {
    return artifact;
  }

  return {
    ...EMPTY_DEMO_CONTENT,
    key,
    appId,
    subroute: normalizeSubroute(subroute),
  };
}
