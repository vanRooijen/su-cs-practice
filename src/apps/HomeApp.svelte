<script>
  import ContentRegion from '../components/ContentRegion.svelte';
  import { listReaderArticles, resolveContent } from '../lib/content/resolveContent.js';

  export let subroute = '';

  const featuredArticles = listReaderArticles();

  $: content = resolveContent('home', subroute);
</script>

<div class="app-layout">
  <section class="home-overview">
    <h3>Home</h3>
    <p>Featured articles delegate into Reader routes.</p>

    <ul class="featured-list">
      {#each featuredArticles as article (article.key)}
        {@const path = `/reader/${article.subroute}`}
        <li>
          <strong>{article.title}</strong>
          <div class="featured-actions">
            <a href={path}>Open</a>
            <a href={path} data-open-in-new-window="true">Open in new window</a>
          </div>
        </li>
      {/each}
    </ul>

    <h4>Broken Link Tests</h4>
    <ul class="broken-links">
      <li><a href="/broken-app/demo">Broken app route</a></li>
      <li><a href="/reader/articles/this-does-not-exist">Broken reader path</a></li>
    </ul>
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

  .home-overview h3,
  .home-overview h4 {
    margin: 0 0 0.36rem;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 84%, black 16%);
  }

  .home-overview p {
    margin: 0 0 0.5rem;
    color: color-mix(in srgb, var(--su-muted, #686d71) 90%, black 10%);
    font-size: 0.88rem;
  }

  .featured-list,
  .broken-links {
    margin: 0;
    padding-left: 1rem;
  }

  .featured-list li,
  .broken-links li {
    margin-bottom: 0.42rem;
  }

  .featured-list li strong {
    display: block;
    font-size: 0.88rem;
    margin-bottom: 0.12rem;
  }

  .featured-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .home-overview a {
    color: color-mix(in srgb, var(--su-maroon, #61223b) 90%, black 10%);
    text-underline-offset: 2px;
  }

  .content-slot {
    min-height: 0;
  }
</style>
