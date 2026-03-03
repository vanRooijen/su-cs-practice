<script>
  import ContentRegion from '../components/ContentRegion.svelte';
  import { APP_NAV_LINKS } from '../lib/navigation/siteManifest.js';
  import { listReaderArticles, resolveContent } from '../lib/content/resolveContent.js';

  export let subroute = '';
  export let sidebarCollapsed = false;

  const articleEntries = listReaderArticles();
  const ARTICLE_TITLE_MAX_LENGTH = 40;

  function truncateLabel(value = '', maxLength = ARTICLE_TITLE_MAX_LENGTH) {
    const text = String(value).trim();
    if (text.length <= maxLength) {
      return text;
    }

    return `${text.slice(0, Math.max(1, maxLength - 1)).trimEnd()}…`;
  }

  $: normalizedSubroute = subroute.replace(/^\/+|\/+$/g, '');
  $: activePath = normalizedSubroute ? `/reader/${normalizedSubroute}` : '/reader';
  $: content = resolveContent('reader', normalizedSubroute);
</script>

<div class="app-layout" data-sidebar-collapsed={sidebarCollapsed}>
  {#if !sidebarCollapsed}
    <aside class="app-sidebar">
      <nav aria-label="Reader sections">
        {#each APP_NAV_LINKS.reader as section}
          <a href={section.href} aria-current={activePath === section.href ? 'page' : undefined}>
            {section.label}
          </a>
        {/each}
      </nav>

      <ul class="tab-list">
        {#each articleEntries as article (article.key)}
          {@const path = `/reader/${article.subroute}`}
          {@const shortTitle = truncateLabel(article.title)}
          <li>
            <a
              class="tab-link"
              href={path}
              aria-current={activePath === path ? 'page' : undefined}
              title={article.title}
            >
              {shortTitle}
            </a>
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
    position: relative;
    height: 100%;
    display: grid;
    grid-template-columns: auto 1fr;
    min-height: 0;
    min-width: 0;
    overflow: hidden;
    background: var(--su-app-content-bg, var(--su-surface, #fffdf9));
  }

  .app-layout[data-sidebar-collapsed='true'] {
    grid-template-columns: 1fr;
  }

  .app-sidebar {
    border-right: 1px solid var(--su-app-chrome-line, rgba(44, 42, 41, 0.08));
    padding: 0.62rem 0.58rem;
    min-width: 210px;
    overflow: auto;
    background: var(--su-app-sidebar-bg, color-mix(in srgb, var(--su-surface-subtle, #f8f4ed) 82%, white 18%));
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 0.24rem;
    margin-bottom: 0.52rem;
  }

  nav a,
  .tab-link {
    display: block;
    color: color-mix(in srgb, var(--su-ink, #2c2a29) 86%, white 14%);
    text-decoration: none;
    padding: 0.34rem 0.4rem;
    line-height: 1.26;
    border-radius: 0.4rem;
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.1);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: background-color 120ms ease, color 120ms ease, box-shadow 120ms ease;
  }

  nav a:hover,
  .tab-link:hover {
    background: rgba(202, 162, 88, 0.16);
    color: var(--su-maroon, #61223b);
    box-shadow: inset 0 0 0 1px rgba(97, 34, 59, 0.22);
  }

  nav a[aria-current='page'],
  .tab-link[aria-current='page'] {
    background: rgba(202, 162, 88, 0.22);
    color: var(--su-maroon, #61223b);
    font-weight: 600;
  }

  .tab-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.24rem;
    border-top: 1px solid var(--su-app-chrome-line, rgba(44, 42, 41, 0.08));
    padding-top: 0.52rem;
  }

  .tab-list li {
    margin: 0;
  }

  .content-slot {
    min-height: 0;
    min-width: 0;
    background: var(--su-app-content-bg, var(--su-surface, #fffdf9));
  }

  @media (max-width: 860px) {
    .app-layout {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
    }

    .app-sidebar {
      position: absolute;
      inset: 0;
      z-index: 3;
      border-right: none;
      border-bottom: none;
      min-width: 0;
      box-shadow: 0 10px 24px rgba(44, 42, 41, 0.14);
    }
  }
</style>
