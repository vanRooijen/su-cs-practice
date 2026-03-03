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

  function toSlot(value) {
    return typeof value === 'string' && value.trim() ? value.trim().toLowerCase() : 'main';
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

  function articleCardImage(article) {
    return fromMeta(article, 'card_image', 'cardImage');
  }

  $: sections = normalizeSections(artifact);
  $: introSections = sections.filter((section) => toSlot(section?.slot) === 'intro');
  $: bodySections = sections.filter((section) => {
    const slot = toSlot(section?.slot);
    return slot === 'main' || slot === 'body';
  });
  $: fullSections = sections.filter((section) => {
    const slot = toSlot(section?.slot);
    return slot !== 'intro' && slot !== 'main' && slot !== 'body';
  });
  $: featuredArticles = listReaderArticles().slice(0, 8);
</script>

<article class="home-shell">
  <section class="hero">
    <p class="hero-eyebrow">Stellenbosch University</p>
    <h2>Computer Science Department</h2>
    <p class="hero-summary">
      Official landing workspace for people, programmes, research, and department updates.
    </p>

    {#if introSections.length > 0}
      <div class="intro-sections">
        {#each introSections as section (section.key)}
          <article class="content-document">{@html section.html}</article>
        {/each}
      </div>
    {/if}

    <div class="hero-links">
      <a href="/programs/prospective-undergraduate">Prospective Students</a>
      <a href="/research">Research and Labs</a>
      <a href="/about/department">About the Department</a>
      <a href="/people/staff">Staff and Contact</a>
    </div>
  </section>

  <section class="news">
    <header class="news-header">
      <h3>Latest News and Articles</h3>
      <a href="/reader/overview">View All Articles</a>
    </header>

    <ul class="news-grid">
      {#each featuredArticles as article (article.key)}
        {@const path = `/reader/${article.subroute}`}
        {@const badge = articleCardBadge(article)}
        {@const variant = articleCardVariant(article)}
        {@const image = articleCardImage(article)}
        <li class="news-card" data-variant={variant}>
          <article>
            {#if image}
              <img src={image} alt={articleCardTitle(article)} loading="lazy" />
            {/if}
            {#if badge}
              <p class="news-badge">{badge}</p>
            {/if}
            <h4>{articleCardTitle(article)}</h4>
            <p>{articleCardExcerpt(article)}</p>
            <a href={path}>Open Article</a>
          </article>
        </li>
      {/each}
    </ul>
  </section>

  {#if bodySections.length > 0}
    <section class="body-sections">
      {#each bodySections as section (section.key)}
        <article class="content-document">{@html section.html}</article>
      {/each}
    </section>
  {/if}

  {#if fullSections.length > 0}
    <section class="full-sections">
      {#each fullSections as section (section.key)}
        <article class="content-document">{@html section.html}</article>
      {/each}
    </section>
  {/if}
</article>

<style>
  .home-shell {
    width: 100%;
    max-width: var(--su-content-max-width, 72rem);
    margin: 0 auto;
    display: grid;
    gap: 0.9rem;
  }

  .hero {
    display: grid;
    gap: 0.4rem;
    padding: 0.42rem 0.1rem 0.12rem;
  }

  .hero-eyebrow {
    margin: 0;
    font-size: 0.76rem;
    line-height: 1.2;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--su-muted, #686d71) 94%, black 6%);
  }

  .hero h2 {
    margin: 0;
    font-size: 1.56rem;
    line-height: 1.12;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 86%, black 14%);
  }

  .hero-summary {
    margin: 0;
    font-size: 0.94rem;
    line-height: 1.4;
    color: color-mix(in srgb, var(--su-ink, #2c2a29) 90%, white 10%);
    max-width: 76ch;
  }

  .intro-sections {
    display: grid;
    gap: 0.48rem;
    margin-top: 0.08rem;
  }

  .hero-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.36rem;
    margin-top: 0.06rem;
  }

  .hero-links a {
    text-decoration: none;
    color: var(--su-maroon, #61223b);
    background: rgba(255, 255, 255, 0.74);
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.11);
    border-radius: 0.4rem;
    padding: 0.34rem 0.5rem;
    font-size: 0.82rem;
    line-height: 1.2;
    transition: background-color 120ms ease, color 120ms ease, box-shadow 120ms ease;
  }

  .hero-links a:hover {
    background: rgba(202, 162, 88, 0.2);
    box-shadow: inset 0 0 0 1px rgba(97, 34, 59, 0.24);
  }

  .news {
    padding: 0.2rem 0.1rem 0.1rem;
  }

  .news-header {
    margin: 0 0 0.46rem;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.46rem;
    flex-wrap: wrap;
  }

  .news-header h3 {
    margin: 0;
    font-size: 1.04rem;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 84%, black 16%);
  }

  .news-header a {
    font-size: 0.82rem;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 90%, black 10%);
    text-underline-offset: 2px;
  }

  .news-grid {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 0.46rem;
  }

  .news-card {
    margin: 0;
  }

  .news-card article {
    height: 100%;
    border-radius: 0.42rem;
    padding: 0.5rem 0.56rem;
    background: rgba(255, 255, 255, 0.82);
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.1);
    display: grid;
    gap: 0.26rem;
    align-content: start;
  }

  .news-card img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border-radius: 0.34rem;
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.08);
  }

  .news-card[data-variant='feature'] article {
    background: color-mix(in srgb, rgba(202, 162, 88, 0.18) 76%, white 24%);
    box-shadow: inset 0 0 0 1px rgba(97, 34, 59, 0.16);
  }

  .news-badge {
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

  .news-card h4 {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.22;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 84%, black 16%);
  }

  .news-card p {
    margin: 0;
    font-size: 0.82rem;
    line-height: 1.36;
    color: color-mix(in srgb, var(--su-muted, #686d71) 94%, black 6%);
  }

  .news-card a {
    width: fit-content;
    font-size: 0.82rem;
    text-underline-offset: 2px;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 90%, black 10%);
  }

  .body-sections,
  .full-sections {
    display: grid;
    gap: 0.62rem;
    padding: 0.16rem 0.1rem 0;
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
