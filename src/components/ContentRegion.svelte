<script>
  import { tick } from 'svelte';
  import DefaultContentShell from './content-shells/DefaultContentShell.svelte';
  import HomeLandingShell from './content-shells/HomeLandingShell.svelte';
  import ReaderArticlesShell from './content-shells/ReaderArticlesShell.svelte';

  export let artifact;
  export let cacheLimit = 10;

  const CONTENT_SHELL_REGISTRY = {
    default: DefaultContentShell,
    'home-landing': HomeLandingShell,
    'reader-articles': ReaderArticlesShell,
  };

  function trimCache(entries, limit, scrollByKey) {
    if (entries.length <= limit) {
      return entries;
    }

    const trimmed = entries.slice(entries.length - limit);
    const activeKeys = new Set(trimmed.map((entry) => entry.key));

    for (const key of Object.keys(scrollByKey)) {
      if (!activeKeys.has(key)) {
        delete scrollByKey[key];
      }
    }

    return trimmed;
  }

  let cachedArtifacts = [];
  let activeKey = '';
  let scrollByKey = {};
  $: normalizedCacheLimit = Number.isFinite(cacheLimit) ? Math.max(1, Math.floor(cacheLimit)) : 10;

  $: if (artifact?.key) {
    const existingIndex = cachedArtifacts.findIndex((entry) => entry.key === artifact.key);

    if (existingIndex >= 0) {
      cachedArtifacts = cachedArtifacts.map((entry, index) => (index === existingIndex ? artifact : entry));
    } else {
      cachedArtifacts = [...cachedArtifacts, artifact];
      cachedArtifacts = trimCache(cachedArtifacts, normalizedCacheLimit, scrollByKey);
    }

    activeKey = artifact.key;
  }

  $: if (cachedArtifacts.length > normalizedCacheLimit) {
    cachedArtifacts = trimCache(cachedArtifacts, normalizedCacheLimit, scrollByKey);
  }

  function captureScroll(key, node) {
    scrollByKey = {
      ...scrollByKey,
      [key]: {
        top: node.scrollTop,
        left: node.scrollLeft,
      },
    };
  }

  async function restoreScroll(key, node) {
    await tick();

    const savedPosition = scrollByKey[key];
    if (!savedPosition) {
      return;
    }

    node.scrollTop = savedPosition.top ?? 0;
    node.scrollLeft = savedPosition.left ?? 0;
  }

  function paneLifecycle(node, params) {
    let key = params.key;

    const onScroll = () => {
      captureScroll(key, node);
    };

    node.addEventListener('scroll', onScroll, { passive: true });

    if (params.isActive) {
      restoreScroll(key, node);
    }

    return {
      update(nextParams) {
        key = nextParams.key;

        if (nextParams.isActive) {
          restoreScroll(key, node);
        }
      },
      destroy() {
        node.removeEventListener('scroll', onScroll);
      },
    };
  }

  function resolveContentShell(shellName) {
    if (typeof shellName !== 'string') {
      return CONTENT_SHELL_REGISTRY.default;
    }

    const normalized = shellName.trim().toLowerCase();
    return CONTENT_SHELL_REGISTRY[normalized] ?? CONTENT_SHELL_REGISTRY.default;
  }
</script>

<section class="content-region" data-content-key={artifact?.key}>
  {#each cachedArtifacts as cachedArtifact (cachedArtifact.key)}
    <section
      class="content-pane"
      data-active={cachedArtifact.key === activeKey}
      aria-hidden={cachedArtifact.key !== activeKey}
      use:paneLifecycle={{
        key: cachedArtifact.key,
        isActive: cachedArtifact.key === activeKey,
      }}
    >
      <svelte:component this={resolveContentShell(cachedArtifact?.shell)} artifact={cachedArtifact} />
    </section>
  {/each}
</section>

<style>
  .content-region {
    position: relative;
    height: 100%;
    min-height: 0;
    background: var(--su-app-content-bg, var(--su-surface, #fffdf9));
  }

  .content-pane {
    position: absolute;
    inset: 0;
    overflow: auto;
    padding: 0.86rem 0.98rem 1rem;
    opacity: 0;
    z-index: 0;
    pointer-events: none;
    background: var(--su-app-content-bg, var(--su-surface, #fffdf9));
  }

  .content-pane[data-active='true'] {
    opacity: 1;
    z-index: 1;
    pointer-events: auto;
  }

</style>
