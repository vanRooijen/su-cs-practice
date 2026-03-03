<script>
  import ContentRegion from '../components/ContentRegion.svelte';
  import { APP_NAV_LINKS } from '../lib/navigation/siteManifest.js';
  import { listReaderArticles, resolveContent } from '../lib/content/resolveContent.js';

  export let subroute = '';
  export let sidebarCollapsed = false;

  const articleEntries = listReaderArticles();

  $: normalizedSubroute = subroute.replace(/^\/+|\/+$/g, '');
  $: activePath = normalizedSubroute ? `/reader/${normalizedSubroute}` : '/reader';
  $: content = resolveContent('reader', normalizedSubroute);
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
    <ContentRegion artifact={content} />
  </div>
</div>

<style>
  .app-layout {
    height: 100%;
    display: grid;
    grid-template-columns: auto 1fr;
    min-height: 0;
    background: var(--su-surface, #fffdf9);
  }

  .app-layout[data-sidebar-collapsed='true'] {
    grid-template-columns: 1fr;
  }

  aside {
    border-right: 1px solid rgba(44, 42, 41, 0.08);
    padding: 0.72rem 0.68rem;
    min-width: 210px;
    overflow: auto;
    background: color-mix(in srgb, var(--su-surface-subtle, #f8f4ed) 82%, white 18%);
  }

  aside h3,
  aside h4 {
    margin: 0 0 0.48rem;
    font-size: 0.92rem;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 84%, black 16%);
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 0.28rem;
    margin-bottom: 0.65rem;
  }

  nav a {
    color: color-mix(in srgb, var(--su-ink, #2c2a29) 86%, white 14%);
    text-decoration: none;
    padding: 0.34rem 0.4rem;
    border-radius: 0.4rem;
    transition: background-color 120ms ease, color 120ms ease;
  }

  nav a:hover {
    background: rgba(202, 162, 88, 0.16);
    color: var(--su-maroon, #61223b);
  }

  nav a[aria-current='page'] {
    background: rgba(202, 162, 88, 0.22);
    color: var(--su-maroon, #61223b);
    font-weight: 600;
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
    color: color-mix(in srgb, var(--su-maroon, #61223b) 90%, black 10%);
    text-underline-offset: 2px;
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
      border-bottom: 1px solid rgba(44, 42, 41, 0.08);
      min-width: 0;
    }
  }
</style>
