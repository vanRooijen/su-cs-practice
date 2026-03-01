<script>
  export let artifact;
  export let cacheLimit = 10;

  let cachedArtifacts = [];
  let activeKey = '';

  $: if (artifact?.key) {
    activeKey = artifact.key;
    const existingIndex = cachedArtifacts.findIndex((entry) => entry.key === artifact.key);

    if (existingIndex >= 0) {
      cachedArtifacts = cachedArtifacts.map((entry, index) => (index === existingIndex ? artifact : entry));
    } else {
      const nextCache = [...cachedArtifacts, artifact];
      cachedArtifacts =
        nextCache.length > cacheLimit ? nextCache.slice(nextCache.length - cacheLimit) : nextCache;
    }
  }
</script>

<section class="content-region" data-content-key={artifact?.key}>
  {#each cachedArtifacts as cachedArtifact (cachedArtifact.key)}
    <section
      class="content-pane"
      data-active={cachedArtifact.key === activeKey}
      aria-hidden={cachedArtifact.key !== activeKey}
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
    padding: 0.5rem;
    opacity: 0;
    z-index: 0;
    pointer-events: none;
  }

  .content-pane[data-active='true'] {
    opacity: 1;
    z-index: 1;
    pointer-events: auto;
  }
</style>
