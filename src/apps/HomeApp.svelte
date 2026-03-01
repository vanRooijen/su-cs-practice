<script>
  import ContentRegion from '../components/ContentRegion.svelte';
  import { listReaderArticles, resolveContent } from '../lib/content/resolveContent.js';

  export let subroute = '';
  export let windowId = null;

  const featuredArticles = listReaderArticles();

  $: content = resolveContent('home', subroute);
  $: contentCacheScope = `home:${windowId ?? 'default'}`;
</script>

<div class="app-layout">
  <section>
    <h3>Home</h3>
    <p>Featured articles delegate into Reader routes.</p>

    <ul>
      {#each featuredArticles as article (article.key)}
        {@const path = `/reader/${article.subroute}`}
        <li>
          <strong>{article.title}</strong>
          <div>
            <a href={path}>Open</a>
            <a href={path} data-open-in-new-window="true">Open in new window</a>
          </div>
        </li>
      {/each}
    </ul>

    <h4>Broken Link Tests</h4>
    <ul>
      <li><a href="/broken-app/demo">Broken app route</a></li>
      <li><a href="/reader/articles/this-does-not-exist">Broken reader path</a></li>
    </ul>
  </section>

  <div class="content-slot">
    <ContentRegion artifact={content} cacheScope={contentCacheScope} />
  </div>
</div>

<style>
  .app-layout {
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
    min-height: 0;
  }

  section {
    border-bottom: 1px solid;
    padding: 0.5rem;
  }

  ul {
    margin: 0;
    padding-left: 1rem;
  }

  li {
    margin-bottom: 0.4rem;
  }

  li div {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .content-slot {
    min-height: 0;
  }
</style>
