<script>
  import ContentRegion from '../components/ContentRegion.svelte';
  import { APP_NAV_LINKS } from '../lib/navigation/siteManifest.js';
  import { resolveContent } from '../lib/content/resolveContent.js';

  export let subroute = '';
  export let sidebarCollapsed = false;

  $: normalizedSubroute = subroute.replace(/^\/+|\/+$/g, '');
  $: activePath = normalizedSubroute ? `/people/${normalizedSubroute}` : '/people';
  $: content = resolveContent('people', normalizedSubroute);
</script>

<div class="app-layout" data-sidebar-collapsed={sidebarCollapsed}>
  {#if !sidebarCollapsed}
    <aside class="app-sidebar">
      <h3>People Sections</h3>
      <p class="app-intro">Browse academic staff, students, and alumni directories.</p>
      <nav aria-label="People sections">
        {#each APP_NAV_LINKS.people as section}
          <a href={section.href} aria-current={activePath === section.href ? 'page' : undefined}>
            {section.label}
          </a>
        {/each}
      </nav>
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

  .app-sidebar {
    border-right: 1px solid rgba(44, 42, 41, 0.08);
    padding: 0.72rem 0.68rem;
    min-width: 170px;
    background: color-mix(in srgb, var(--su-surface-subtle, #f8f4ed) 82%, white 18%);
  }

  .app-sidebar h3 {
    margin: 0 0 0.48rem;
    font-size: 0.92rem;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 84%, black 16%);
  }

  .app-intro {
    margin: 0 0 0.56rem;
    font-size: 0.82rem;
    line-height: 1.35;
    color: color-mix(in srgb, var(--su-muted, #686d71) 92%, black 8%);
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 0.28rem;
    margin-bottom: 0;
  }

  nav a {
    color: color-mix(in srgb, var(--su-ink, #2c2a29) 86%, white 14%);
    text-decoration: none;
    padding: 0.34rem 0.4rem;
    border-radius: 0.4rem;
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.1);
    transition: background-color 120ms ease, color 120ms ease, box-shadow 120ms ease;
  }

  nav a:hover {
    background: rgba(202, 162, 88, 0.16);
    color: var(--su-maroon, #61223b);
    box-shadow: inset 0 0 0 1px rgba(97, 34, 59, 0.22);
  }

  nav a[aria-current='page'] {
    background: rgba(202, 162, 88, 0.22);
    color: var(--su-maroon, #61223b);
    font-weight: 600;
  }

  .content-slot {
    min-height: 0;
  }

  @media (max-width: 860px) {
    .app-layout {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
    }

    .app-sidebar {
      border-right: none;
      border-bottom: 1px solid rgba(44, 42, 41, 0.08);
    }
  }
</style>
