<script>
  import { listReaderArticles } from '../../lib/content/resolveContent.js';

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

  function fromMeta(article, ...keys) {
    for (const key of keys) {
      if (typeof article?.meta?.[key] === 'string' && article.meta[key].trim()) {
        return article.meta[key].trim();
      }
    }
    return '';
  }

  function articleCardTitle(article) {
    return fromMeta(article, 'card_title', 'cardTitle') || article.title;
  }

  function articleCardExcerpt(article) {
    return fromMeta(article, 'card_excerpt', 'cardExcerpt') || article.excerpt || 'Department update and announcement.';
  }

  function articleCardBadge(article) {
    return fromMeta(article, 'card_badge', 'cardBadge');
  }

  function articleCardVariant(article) {
    return fromMeta(article, 'card_variant', 'cardVariant') || 'standard';
  }

  $: sections = normalizeSections(artifact);
  $: articleEntries = listReaderArticles();
</script>

<article class="reader-articles-shell">
  <header class="shell-header">
    <h2>{artifact?.title ?? 'Articles'}</h2>
    {#if artifact?.excerpt}
      <p>{artifact.excerpt}</p>
    {/if}
  </header>

  {#if sections.length > 0}
    <section class="shell-content">
      {#each sections as section (section.key)}
        <article class="content-document">{@html section.html}</article>
      {/each}
    </section>
  {/if}

  <section class="article-list">
    <ul class="article-grid">
      {#each articleEntries as article (article.key)}
        {@const path = `/reader/${article.subroute}`}
        {@const badge = articleCardBadge(article)}
        {@const variant = articleCardVariant(article)}
        <li class="article-card" data-variant={variant}>
          <article>
            {#if badge}
              <p class="article-badge">{badge}</p>
            {/if}
            <h3>{articleCardTitle(article)}</h3>
            <p>{articleCardExcerpt(article)}</p>
            <a href={path}>Open Article</a>
          </article>
        </li>
      {/each}
    </ul>
  </section>
</article>

<style>
  .reader-articles-shell {
    width: 100%;
    max-width: var(--su-content-max-width, 72rem);
    margin: 0 auto;
    display: grid;
    gap: 0.72rem;
  }

  .shell-header {
    display: grid;
    gap: 0.28rem;
  }

  .shell-header h2 {
    margin: 0;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 86%, black 14%);
    font-size: 1.22rem;
    line-height: 1.16;
  }

  .shell-header p {
    margin: 0;
    font-size: 0.88rem;
    color: color-mix(in srgb, var(--su-muted, #686d71) 90%, black 10%);
  }

  .shell-content {
    display: grid;
    gap: 0.54rem;
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

  .article-grid {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(232px, 1fr));
    gap: 0.5rem;
  }

  .article-card {
    margin: 0;
  }

  .article-card article {
    height: 100%;
    border-radius: 0.42rem;
    padding: 0.56rem 0.62rem;
    background: rgba(255, 255, 255, 0.84);
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.1);
    display: grid;
    gap: 0.28rem;
    align-content: start;
  }

  .article-card[data-variant='feature'] article {
    background: color-mix(in srgb, rgba(202, 162, 88, 0.18) 76%, white 24%);
    box-shadow: inset 0 0 0 1px rgba(97, 34, 59, 0.16);
  }

  .article-badge {
    margin: 0;
    width: fit-content;
    font-size: 0.7rem;
    line-height: 1.15;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 86%, black 14%);
    background: rgba(202, 162, 88, 0.22);
    border-radius: 999px;
    padding: 0.16rem 0.34rem;
  }

  .article-card h3 {
    margin: 0;
    font-size: 0.94rem;
    line-height: 1.24;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 84%, black 16%);
  }

  .article-card p {
    margin: 0;
    font-size: 0.83rem;
    line-height: 1.36;
    color: color-mix(in srgb, var(--su-muted, #686d71) 94%, black 6%);
  }

  .article-card a {
    width: fit-content;
    font-size: 0.82rem;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 90%, black 10%);
    text-underline-offset: 2px;
  }
</style>
