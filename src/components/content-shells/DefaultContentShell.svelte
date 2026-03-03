<script>
  export let artifact;

  function normalizeSections(contentArtifact) {
    if (Array.isArray(contentArtifact?.sections) && contentArtifact.sections.length > 0) {
      return contentArtifact.sections;
    }

    if (typeof contentArtifact?.html === 'string' && contentArtifact.html.trim()) {
      return [
        {
          key: 'main',
          slot: 'main',
          html: contentArtifact.html,
        },
      ];
    }

    return [];
  }

  $: sections = normalizeSections(artifact);
</script>

<article class="default-shell">
  <header class="default-header">
    <h3>{artifact?.title ?? 'Untitled'}</h3>
    {#if artifact?.excerpt}
      <p>{artifact.excerpt}</p>
    {/if}
  </header>

  {#if sections.length === 0}
    <div class="default-section" data-slot="main">
      <article class="content-document">
        <p>No content was provided for this view.</p>
      </article>
    </div>
  {:else}
    {#each sections as section (section.key)}
      <div class="default-section" data-slot={section.slot}>
        <article class="content-document">{@html section.html}</article>
      </div>
    {/each}
  {/if}
</article>

<style>
  .default-shell {
    width: 100%;
    max-width: var(--su-content-max-width, 72rem);
    margin: 0 auto;
  }

  .default-header {
    margin: 0 0 0.72rem;
  }

  .default-header h3 {
    margin: 0 0 0.26rem;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 86%, black 14%);
    font-size: 1.02rem;
    line-height: 1.2;
  }

  .default-header p {
    margin: 0;
    color: color-mix(in srgb, var(--su-muted, #686d71) 90%, black 10%);
    font-size: 0.88rem;
  }

  .default-section + .default-section {
    margin-top: 0.68rem;
  }

  .content-document {
    color: color-mix(in srgb, var(--su-ink, #2c2a29) 92%, black 8%);
    line-height: 1.58;
    font-size: 0.93rem;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .content-document :global(h1),
  .content-document :global(h2),
  .content-document :global(h3),
  .content-document :global(h4) {
    color: color-mix(in srgb, var(--su-maroon, #61223b) 82%, black 18%);
    line-height: 1.24;
  }

  .content-document :global(table) {
    display: block;
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border-collapse: collapse;
    margin: 0.54rem 0 0.8rem;
  }

  .content-document :global(th),
  .content-document :global(td) {
    padding: 0.42rem 0.46rem;
    border-bottom: 1px solid rgba(44, 42, 41, 0.12);
    text-align: left;
    vertical-align: top;
    overflow-wrap: anywhere;
  }

  .content-document :global(th) {
    background: color-mix(in srgb, var(--su-surface-subtle, #f8f4ed) 78%, white 22%);
  }

  .content-document :global(a) {
    color: color-mix(in srgb, var(--su-maroon, #61223b) 88%, black 12%);
    text-underline-offset: 2px;
  }
</style>
