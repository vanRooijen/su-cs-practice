<script>
  import { tick } from 'svelte';

  export let artifact;
  export let cacheLimit = 10;

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
      <header>
        <h3>{cachedArtifact?.title}</h3>
        {#if cachedArtifact?.excerpt}
          <p>{cachedArtifact.excerpt}</p>
        {/if}
      </header>

      <article class="content-document">{@html cachedArtifact?.html}</article>
    </section>
  {/each}
</section>

<style>
  .content-region {
    position: relative;
    height: 100%;
    min-height: 0;
  }

  .content-pane {
    position: absolute;
    inset: 0;
    overflow: auto;
    padding: 0.82rem 0.92rem 0.95rem;
    opacity: 0;
    z-index: 0;
    pointer-events: none;
    background: var(--su-surface, #fffdf9);
  }

  .content-pane[data-active='true'] {
    opacity: 1;
    z-index: 1;
    pointer-events: auto;
  }

  .content-pane > header {
    margin: 0 0 0.72rem;
  }

  .content-pane > header h3 {
    margin: 0 0 0.26rem;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 86%, black 14%);
    font-size: 1.02rem;
    line-height: 1.2;
  }

  .content-pane > header p {
    margin: 0;
    color: color-mix(in srgb, var(--su-muted, #686d71) 90%, black 10%);
    font-size: 0.88rem;
  }

  .content-document {
    color: color-mix(in srgb, var(--su-ink, #2c2a29) 92%, black 8%);
    line-height: 1.58;
    font-size: 0.93rem;
  }

  .content-document :global(h1),
  .content-document :global(h2),
  .content-document :global(h3),
  .content-document :global(h4) {
    color: color-mix(in srgb, var(--su-maroon, #61223b) 82%, black 18%);
    line-height: 1.24;
  }

  .content-document :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 0.54rem 0 0.8rem;
  }

  .content-document :global(th),
  .content-document :global(td) {
    padding: 0.42rem 0.46rem;
    border-bottom: 1px solid rgba(44, 42, 41, 0.12);
    text-align: left;
    vertical-align: top;
  }

  .content-document :global(th) {
    background: color-mix(in srgb, var(--su-surface-subtle, #f8f4ed) 78%, white 22%);
  }

  .content-document :global(a) {
    color: color-mix(in srgb, var(--su-maroon, #61223b) 88%, black 12%);
    text-underline-offset: 2px;
  }
</style>
