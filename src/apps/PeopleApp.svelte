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

<div class="app-layout people-layout" data-sidebar-collapsed={sidebarCollapsed}>
  {#if !sidebarCollapsed}
    <aside class="app-sidebar">
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
    min-width: 170px;
    overflow: auto;
    background: var(--su-app-sidebar-bg, color-mix(in srgb, var(--su-surface-subtle, #f8f4ed) 82%, white 18%));
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 0.24rem;
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
    min-width: 0;
    background: var(--su-app-content-bg, var(--su-surface, #fffdf9));
  }

  .people-layout :global(.default-shell) {
    width: 100%;
    max-width: min(100%, 92rem);
  }

  .people-layout :global(.content-document h2) {
    margin: 0 0 0.92rem;
    font-size: 1.38rem;
    letter-spacing: 0.01em;
  }

  .people-layout :global(.content-document h3) {
    margin: 1.24rem 0 0.76rem;
    font-size: 1.06rem;
  }

  .people-layout :global(.content-document ul) {
    margin: 0.42rem 0 1rem;
    padding-left: 1.2rem;
  }

  .people-layout :global(.content-document li) {
    margin: 0.24rem 0;
  }

  .people-layout :global(.content-document table) {
    display: table;
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 0.66rem;
    margin: 0.56rem 0 1.2rem;
  }

  .people-layout :global(.content-document thead th) {
    border-bottom: none;
    background: transparent;
    padding: 0.18rem 0.66rem 0.4rem;
    color: color-mix(in srgb, var(--su-ink, #2c2a29) 72%, white 28%);
    font-size: 0.75rem;
    letter-spacing: 0.055em;
    text-transform: uppercase;
  }

  .people-layout :global(.content-document tbody tr) {
    background: color-mix(in srgb, var(--su-surface, #fffdf9) 90%, var(--su-surface-subtle, #f8f4ed) 10%);
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.08);
  }

  .people-layout :global(.content-document tbody td) {
    border-bottom: none;
    padding: 0.82rem 0.74rem;
    vertical-align: top;
    line-height: 1.45;
  }

  .people-layout :global(.content-document tbody td:first-child) {
    width: 8rem;
    min-width: 8rem;
  }

  .people-layout :global(.content-document tbody td:first-child img) {
    display: block;
    width: clamp(72px, 6.4vw, 98px);
    height: clamp(72px, 6.4vw, 98px);
    max-width: none;
    object-fit: cover;
    border-radius: 0.62rem;
    border: 1px solid rgba(44, 42, 41, 0.12);
    box-shadow: 0 3px 12px rgba(44, 42, 41, 0.11);
    background: color-mix(in srgb, var(--su-surface-subtle, #f8f4ed) 70%, white 30%);
  }

  .people-layout :global(.content-document tbody td:nth-child(2)) {
    min-width: 11.5rem;
    font-weight: 600;
  }

  .people-layout :global(.content-document tbody td > :first-child) {
    margin-top: 0;
  }

  .people-layout :global(.content-document tbody td > :last-child) {
    margin-bottom: 0;
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

    .people-layout :global(.content-document table) {
      display: block;
      width: 100%;
      overflow-x: auto;
      border-spacing: 0;
    }

    .people-layout :global(.content-document thead th),
    .people-layout :global(.content-document tbody td) {
      white-space: normal;
      min-width: 9.5rem;
    }

    .people-layout :global(.content-document tbody tr) {
      box-shadow: none;
      background: transparent;
    }

    .people-layout :global(.content-document tbody td) {
      border-bottom: 1px solid rgba(44, 42, 41, 0.12);
      padding: 0.6rem 0.54rem;
    }

    .people-layout :global(.content-document tbody td:first-child) {
      width: 5.2rem;
      min-width: 5.2rem;
    }

    .people-layout :global(.content-document tbody td:first-child img) {
      width: 64px;
      height: 64px;
    }
  }
</style>
