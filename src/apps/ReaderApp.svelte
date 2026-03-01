<script>
  import ContentRegion from '../components/ContentRegion.svelte';
  import { APP_NAV_LINKS } from '../lib/navigation/siteManifest.js';
  import { listReaderArticles, resolveContent } from '../lib/content/resolveContent.js';

  export let subroute = '';
  export let sidebarCollapsed = false;
  export let windowId = null;

  const articleEntries = listReaderArticles();

  $: normalizedSubroute = subroute.replace(/^\/+|\/+$/g, '');
  $: activePath = normalizedSubroute ? `/reader/${normalizedSubroute}` : '/reader';
  $: content = resolveContent('reader', normalizedSubroute);
  $: contentCacheScope = `reader:${windowId ?? 'default'}`;
</script>

<div class="app-layout" data-sidebar-collapsed={sidebarCollapsed}>
  {#if !sidebarCollapsed}
    <aside>
      <h3>Reader</h3>
      <nav aria-label="Reader sections">
        {#each APP_NAV_LINKS.reader as section}
          <a href={section.href} aria-current={activePath === section.href ? 'page' : undefined}>
            {section.label}
          </a>
        {/each}
      </nav>

      <h4>Entries</h4>
      <ul>
        {#each articleEntries as article (article.key)}
          {@const path = `/reader/${article.subroute}`}
          <li>
            <a href={path} aria-current={activePath === path ? 'page' : undefined}>{article.title}</a>
            <a href={path} data-open-in-new-window="true">Open in new window</a>
          </li>
        {/each}
      </ul>
    </aside>
  {/if}

  <div class="content-slot">
    <ContentRegion artifact={content} cacheScope={contentCacheScope} />
  </div>
</div>

<style>
  .app-layout {
    height: 100%;
    display: grid;
    grid-template-columns: auto 1fr;
    min-height: 0;
  }

  .app-layout[data-sidebar-collapsed='true'] {
    grid-template-columns: 1fr;
  }

  aside {
    border-right: 1px solid;
    padding: 0.5rem;
    min-width: 210px;
    overflow: auto;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  ul {
    margin: 0;
    padding-left: 1rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  li a {
    margin-right: 0.5rem;
  }

  .content-slot {
    min-height: 0;
  }

  @media (max-width: 860px) {
    .app-layout {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
    }

    aside {
      border-right: none;
      border-bottom: 1px solid;
      min-width: 0;
    }
  }
</style>
