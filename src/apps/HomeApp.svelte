<script>
  import ContentRegion from '../components/ContentRegion.svelte';
  import { listReaderArticles, resolveContent } from '../lib/content/resolveContent.js';

  export let subroute = '';

  const featuredArticles = listReaderArticles();

  $: content = resolveContent('home', subroute);
</script>

<div class="app-layout">
  <section class="home-overview">
    <div class="overview-header">
      <h3>Home</h3>
      <p>Featured articles delegate into Reader routes.</p>
    </div>

    <ul class="entry-cards">
      {#each featuredArticles as article (article.key)}
        {@const path = `/reader/${article.subroute}`}
        <li class="entry-card">
          <h4>{article.title}</h4>
          <p>{article.excerpt ?? 'Department updates and announcements.'}</p>
          <a class="entry-link" href={path}>Read in Reader</a>
        </li>
      {/each}
    </ul>

    <details class="dev-links">
      <summary>Developer Test Links</summary>
      <ul class="broken-links">
        <li><a href="/broken-app/demo">Broken app route</a></li>
        <li><a href="/reader/articles/this-does-not-exist">Broken reader path</a></li>
      </ul>
    </details>
  </section>

  <div class="content-slot">
    <ContentRegion artifact={content} />
  </div>
</div>

<style>
  .app-layout {
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
    min-height: 0;
    background: var(--su-surface, #fffdf9);
  }

  .home-overview {
    border-bottom: 1px solid rgba(44, 42, 41, 0.08);
    padding: 0.72rem 0.78rem 0.68rem;
    background: color-mix(in srgb, var(--su-surface-subtle, #f8f4ed) 80%, white 20%);
  }

  .overview-header {
    margin-bottom: 0.52rem;
  }

  .home-overview h3 {
    margin: 0 0 0.24rem;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 84%, black 16%);
  }

  .home-overview p {
    margin: 0;
    color: color-mix(in srgb, var(--su-muted, #686d71) 90%, black 10%);
    font-size: 0.88rem;
  }

  .entry-cards,
  .broken-links {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .entry-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 0.42rem;
    margin-bottom: 0.5rem;
  }

  .entry-card,
  .broken-links li {
    margin: 0;
  }

  .entry-card {
    border-radius: 0.42rem;
    padding: 0.44rem 0.5rem;
    background: rgba(255, 255, 255, 0.72);
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.09);
    display: grid;
    gap: 0.2rem;
  }

  .entry-card h4 {
    margin: 0;
    font-size: 0.88rem;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 84%, black 16%);
  }

  .entry-card p {
    margin: 0;
    font-size: 0.82rem;
    line-height: 1.35;
    color: color-mix(in srgb, var(--su-muted, #686d71) 94%, black 6%);
  }

  .entry-link,
  .home-overview a {
    color: color-mix(in srgb, var(--su-maroon, #61223b) 90%, black 10%);
    text-underline-offset: 2px;
    font-size: 0.82rem;
  }

  .dev-links {
    border: none;
    border-radius: 0.42rem;
    background: rgba(255, 255, 255, 0.62);
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.08);
    overflow: hidden;
  }

  .dev-links summary {
    list-style: none;
    cursor: pointer;
    user-select: none;
    padding: 0.34rem 0.46rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: color-mix(in srgb, var(--su-ink, #2c2a29) 86%, white 14%);
  }

  .dev-links summary::-webkit-details-marker {
    display: none;
  }

  .dev-links ul {
    padding: 0 0.46rem 0.4rem;
  }

  .broken-links li + li {
    margin-top: 0.22rem;
  }

  .content-slot {
    min-height: 0;
  }
</style>
