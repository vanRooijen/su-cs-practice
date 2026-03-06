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
  $: firstSectionHtml = sections[0]?.html ?? '';
  $: hasEmbeddedHeading = /<h[1-6]\b/i.test(firstSectionHtml);
  $: showShellTitle = Boolean(artifact?.title) && !hasEmbeddedHeading;
</script>

<article class="default-shell">
  {#if showShellTitle}
    <header class="default-header">
      <h3>{artifact?.title ?? 'Untitled'}</h3>
    </header>
  {/if}

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

  .default-section + .default-section {
    margin-top: 0.68rem;
  }

  .default-section[data-slot='narrow'] .content-document {
    max-width: min(100%, 62ch);
    margin: 0 auto;
  }

  .default-section[data-slot='wide'] .content-document {
    max-width: 100%;
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

  .content-document :global(.katex-display) {
    margin: 0.8rem 0;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0.1rem 0.08rem 0.24rem;
  }

  .content-document :global(.katex) {
    font-size: 1.02em;
  }

  .content-document :global(.content-block) {
    margin: 0.84rem 0;
    padding: 0.58rem 0.7rem 0.64rem;
    border-radius: 0.4rem;
    border-left: 4px solid rgba(44, 42, 41, 0.28);
    background: color-mix(in srgb, var(--su-surface-subtle, #f8f4ed) 74%, white 26%);
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.1);
  }

  .content-document :global(.content-block > .content-block__header) {
    margin: 0 0 0.32rem;
  }

  .content-document :global(.content-block .content-block__title) {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.25;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 86%, black 14%);
  }

  .content-document :global(.content-block .content-block__body > :first-child) {
    margin-top: 0;
  }

  .content-document :global(.content-block .content-block__body > :last-child) {
    margin-bottom: 0;
  }

  .content-document :global(details.content-block > summary.content-block__summary) {
    cursor: pointer;
    list-style: none;
    margin: -0.1rem 0 0;
    padding: 0.08rem 0 0.2rem;
  }

  .content-document :global(details.content-block > summary.content-block__summary::-webkit-details-marker) {
    display: none;
  }

  .content-document :global(details.content-block > summary.content-block__summary::before) {
    content: '▸';
    display: inline-block;
    margin-right: 0.34rem;
    color: color-mix(in srgb, var(--su-muted, #686d71) 78%, black 22%);
    transition: transform 120ms ease;
  }

  .content-document :global(details.content-block[open] > summary.content-block__summary::before) {
    transform: rotate(90deg);
  }

  .content-document :global(.content-block--definition) {
    border-left-color: rgba(97, 34, 59, 0.65);
  }

  .content-document :global(.content-block--theorem) {
    border-left-color: rgba(166, 10, 61, 0.76);
  }

  .content-document :global(.content-block--proof) {
    border-left-color: rgba(100, 51, 53, 0.74);
  }

  .content-document :global(.content-block--example) {
    border-left-color: rgba(202, 162, 88, 0.9);
  }

  .content-document :global(.content-block--exercise) {
    border-left-color: rgba(220, 68, 5, 0.76);
  }

  .content-document :global(.content-block--intuition) {
    border-left-color: rgba(130, 204, 174, 0.88);
  }

  .content-document :global(.content-block--warning) {
    border-left-color: rgba(220, 68, 5, 0.88);
  }

  .content-document :global(.content-block--summary) {
    border-left-color: rgba(77, 83, 86, 0.72);
  }
</style>
