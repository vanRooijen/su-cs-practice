<script>
  import { onMount, tick } from 'svelte';
  import { TW314_KATEX_MACROS } from '../../lib/tw314/katex-macros.js';

  export let artifact;

  let shellElement;
  let hasMounted = false;
  let renderMathInElement = null;
  let isRenderingMath = false;

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

  function toSlotName(value) {
    const slot = String(value ?? '').trim().toLowerCase();
    if (!slot || slot === 'end') {
      return 'main';
    }

    return /^[a-z0-9][a-z0-9-]*$/i.test(slot) ? slot : 'main';
  }

  function calloutTypeFromSlot(slotName) {
    if (slotName === 'callout') {
      return 'note';
    }

    if (slotName.startsWith('callout-') && slotName.length > 'callout-'.length) {
      return slotName.slice('callout-'.length);
    }

    return '';
  }

  async function ensureMathRenderer() {
    if (renderMathInElement) {
      return renderMathInElement;
    }

    const module = await import('katex/contrib/auto-render/auto-render.js');
    renderMathInElement = module.default;
    return renderMathInElement;
  }

  async function renderVisibleMath() {
    if (!hasMounted || isRenderingMath) {
      return;
    }

    isRenderingMath = true;

    try {
      await tick();
      if (!shellElement) {
        return;
      }

      const renderer = await ensureMathRenderer();
      const pendingNodes = shellElement.querySelectorAll('[data-tw314-math-state=\"pending\"]');

      for (const node of pendingNodes) {
        renderer(node, {
          throwOnError: false,
          strict: 'ignore',
          macros: TW314_KATEX_MACROS,
          delimiters: [
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\begin{equation*}', right: '\\end{equation*}', display: true },
            { left: '\\begin{equation}', right: '\\end{equation}', display: true },
            { left: '\\begin{align*}', right: '\\end{align*}', display: true },
            { left: '\\begin{align}', right: '\\end{align}', display: true },
          ],
          ignoredClasses: ['katex'],
        });

        node.setAttribute('data-tw314-math-state', 'rendered');
      }
    } finally {
      isRenderingMath = false;
    }
  }

  onMount(() => {
    hasMounted = true;
    void renderVisibleMath();
  });

  $: sections = normalizeSections(artifact);
  $: if (hasMounted && artifact?.key) {
    void renderVisibleMath();
  }
</script>

<article class="tw314-shell" bind:this={shellElement}>
  {#if sections.length === 0}
    <div class="tw314-section" data-slot="main">
      <article class="tw314-document">
        <p>No TW314 content is available for this route.</p>
      </article>
    </div>
  {:else}
    {#each sections as section (section.key)}
      {@const slotName = toSlotName(section.slot)}
      {@const calloutType = calloutTypeFromSlot(slotName)}
      <div class={`tw314-section tw314-slot-${slotName}`} data-slot={slotName}>
        <article
          class="tw314-document"
          class:is-callout={Boolean(calloutType)}
          data-callout-type={calloutType || undefined}
          data-tw314-math-state="pending"
        >
          {@html section.html}
        </article>
      </div>
    {/each}
  {/if}
</article>

<style>
  .tw314-shell {
    width: 100%;
    max-width: var(--su-content-max-width, 78rem);
    margin: 0 auto;
  }

  .tw314-section + .tw314-section {
    margin-top: 0.58rem;
  }

  .tw314-document {
    color: color-mix(in srgb, var(--su-ink, #2c2a29) 92%, black 8%);
    line-height: 1.62;
    font-size: 0.95rem;
    overflow-wrap: anywhere;
    word-break: break-word;
    max-width: min(100%, 70ch);
    margin: 0 auto;
  }

  .tw314-section[data-slot='wide'] .tw314-document {
    max-width: 100%;
  }

  .tw314-section[data-slot='narrow'] .tw314-document {
    max-width: min(100%, 62ch);
  }

  .tw314-document.is-callout {
    max-width: min(100%, 66ch);
    padding: 0.66rem 0.78rem;
    border-radius: 0.45rem;
    border-left: 3px solid rgba(97, 34, 59, 0.42);
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.1);
    background: color-mix(in srgb, var(--su-surface-subtle, #f8f4ed) 76%, white 24%);
  }

  .tw314-document[data-callout-type='tip'] {
    border-left-color: rgba(130, 204, 174, 0.75);
  }

  .tw314-document[data-callout-type='warn'],
  .tw314-document[data-callout-type='warning'] {
    border-left-color: rgba(220, 68, 5, 0.75);
  }

  .tw314-document[data-callout-type='theorem'] {
    border-left-color: rgba(97, 34, 59, 0.75);
  }

  .tw314-document :global(h1),
  .tw314-document :global(h2),
  .tw314-document :global(h3),
  .tw314-document :global(h4),
  .tw314-document :global(h5),
  .tw314-document :global(h6) {
    margin: 0.6rem 0 0.42rem;
    line-height: 1.24;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 84%, black 16%);
  }

  .tw314-document :global(h2 .codenumber),
  .tw314-document :global(h3 .codenumber),
  .tw314-document :global(h4 .codenumber),
  .tw314-document :global(h5 .codenumber),
  .tw314-document :global(h6 .codenumber) {
    color: color-mix(in srgb, var(--su-muted, #686d71) 84%, black 16%);
    margin-right: 0.26rem;
    font-weight: 500;
  }

  .tw314-document :global(p) {
    margin: 0.46rem 0;
  }

  .tw314-document :global(ul),
  .tw314-document :global(ol) {
    margin: 0.36rem 0 0.5rem;
    padding-left: 1.25rem;
  }

  .tw314-document :global(li + li) {
    margin-top: 0.18rem;
  }

  .tw314-document :global(a) {
    color: color-mix(in srgb, var(--su-maroon, #61223b) 88%, black 12%);
    text-underline-offset: 2px;
  }

  .tw314-document :global(img) {
    display: block;
    width: auto;
    max-width: min(100%, 42rem);
    height: auto;
    margin: 0.62rem auto;
    border-radius: 0.32rem;
    box-shadow:
      inset 0 0 0 1px rgba(44, 42, 41, 0.12),
      0 4px 12px rgba(44, 42, 41, 0.08);
    background: rgba(255, 255, 255, 0.9);
  }

  .tw314-document :global(.displaymath) {
    margin: 0.86rem 0;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0.08rem 0 0.16rem;
  }

  .tw314-document :global(.katex-display) {
    margin: 0;
    padding: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .tw314-document :global(.katex) {
    font-size: 1.02em;
  }

  .tw314-document :global(.content-block) {
    margin: 0.86rem 0;
    padding: 0.62rem 0.74rem 0.68rem;
    border-radius: 0.44rem;
    border-left: 4px solid rgba(44, 42, 41, 0.28);
    background: color-mix(in srgb, var(--su-surface-subtle, #f8f4ed) 74%, white 26%);
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.1);
  }

  .tw314-document :global(.content-block > .content-block__header) {
    margin: 0 0 0.34rem;
  }

  .tw314-document :global(.content-block .content-block__title) {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.25;
    letter-spacing: 0.01em;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 86%, black 14%);
  }

  .tw314-document :global(.content-block .content-block__body > :first-child) {
    margin-top: 0;
  }

  .tw314-document :global(.content-block .content-block__body > :last-child) {
    margin-bottom: 0;
  }

  .tw314-document :global(details.content-block > summary.content-block__summary) {
    cursor: pointer;
    list-style: none;
    margin: -0.1rem 0 0;
    padding: 0.08rem 0 0.2rem;
  }

  .tw314-document :global(details.content-block > summary.content-block__summary::-webkit-details-marker) {
    display: none;
  }

  .tw314-document :global(details.content-block > summary.content-block__summary::before) {
    content: '▸';
    display: inline-block;
    margin-right: 0.34rem;
    color: color-mix(in srgb, var(--su-muted, #686d71) 78%, black 22%);
    transition: transform 120ms ease;
  }

  .tw314-document :global(details.content-block[open] > summary.content-block__summary::before) {
    transform: rotate(90deg);
  }

  .tw314-document :global(.content-block--definition) {
    border-left-color: rgba(97, 34, 59, 0.65);
  }

  .tw314-document :global(.content-block--theorem) {
    border-left-color: rgba(166, 10, 61, 0.76);
  }

  .tw314-document :global(.content-block--proof) {
    border-left-color: rgba(100, 51, 53, 0.74);
    background: color-mix(in srgb, var(--su-surface-subtle, #f8f4ed) 68%, white 32%);
  }

  .tw314-document :global(.content-block--example) {
    border-left-color: rgba(202, 162, 88, 0.9);
  }

  .tw314-document :global(.content-block--exercise) {
    border-left-color: rgba(220, 68, 5, 0.76);
  }

  .tw314-document :global(.content-block--intuition) {
    border-left-color: rgba(130, 204, 174, 0.88);
  }

  .tw314-document :global(.content-block--warning) {
    border-left-color: rgba(220, 68, 5, 0.88);
    background: color-mix(in srgb, #fff7ef 82%, white 18%);
  }

  .tw314-document :global(.content-block--summary) {
    border-left-color: rgba(77, 83, 86, 0.72);
    background: color-mix(in srgb, #f5f6f7 82%, white 18%);
  }

  .tw314-document :global(.example),
  .tw314-document :global(.theorem),
  .tw314-document :global(.proposition),
  .tw314-document :global(.lemma) {
    margin: 0.56rem 0;
    padding: 0.44rem 0.5rem;
    border-radius: 0.34rem;
    background: color-mix(in srgb, var(--su-surface-subtle, #f8f4ed) 76%, white 24%);
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.1);
  }

  .tw314-document :global(.theorem > .heading),
  .tw314-document :global(.proposition > .heading),
  .tw314-document :global(.lemma > .heading),
  .tw314-document :global(.example > .heading),
  .tw314-document :global(.corollary > .heading),
  .tw314-document :global(.proof > .heading),
  .tw314-document :global(.hiddenproof > .heading),
  .tw314-document :global(.solution > .heading) {
    margin: 0 0 0.34rem;
    font-size: 1.01rem;
    line-height: 1.32;
    font-weight: 650;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 86%, black 14%);
  }

  .tw314-document :global(.theorem > .heading .codenumber),
  .tw314-document :global(.proposition > .heading .codenumber),
  .tw314-document :global(.lemma > .heading .codenumber),
  .tw314-document :global(.example > .heading .codenumber),
  .tw314-document :global(.corollary > .heading .codenumber) {
    color: color-mix(in srgb, var(--su-muted, #686d71) 84%, black 16%);
    font-weight: 600;
  }

  .tw314-document :global(.solution .type),
  .tw314-document :global(.proof .type),
  .tw314-document :global(.hiddenproof .type) {
    color: var(--su-maroon, #61223b);
    font-weight: 600;
  }
</style>
