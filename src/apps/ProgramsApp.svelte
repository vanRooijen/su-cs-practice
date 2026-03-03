<script>
  import ContentRegion from '../components/ContentRegion.svelte';
  import { resolveContent } from '../lib/content/resolveContent.js';

  export let subroute = '';
  export let sidebarCollapsed = false;

  const coreLinks = [
    { label: 'Overview', href: '/programs' },
    { label: 'Programme Guide', href: '/programs/guide' },
  ];

  const undergraduateLinks = [
    { label: 'Prospective Undergraduate', href: '/programs/prospective-undergraduate' },
    { label: 'Undergraduate Modules', href: '/programs/undergraduate-modules' },
  ];

  const postgraduateLinks = [
    { label: 'Prospective Postgraduate', href: '/programs/prospective-postgraduate' },
    { label: 'Postgraduate Modules', href: '/programs/postgraduate-modules' },
    { label: 'Honours', href: '/programs/honours' },
    { label: 'Masters', href: '/programs/masters' },
    { label: 'PhD', href: '/programs/phd' },
  ];

  $: normalizedSubroute = subroute.replace(/^\/+|\/+$/g, '');
  $: activePath = normalizedSubroute ? `/programs/${normalizedSubroute}` : '/programs';
  $: content = resolveContent('programs', normalizedSubroute);
</script>

<div class="app-layout" data-sidebar-collapsed={sidebarCollapsed}>
  {#if !sidebarCollapsed}
    <aside class="app-sidebar">
      <nav aria-label="Programmes sections">
        {#each coreLinks as section (section.href)}
          <a href={section.href} aria-current={activePath === section.href ? 'page' : undefined}>
            {section.label}
          </a>
        {/each}

        <details class="nav-group" open>
          <summary>Undergraduate</summary>
          <ul>
            {#each undergraduateLinks as section (section.href)}
              <li>
                <a href={section.href} aria-current={activePath === section.href ? 'page' : undefined}>
                  {section.label}
                </a>
              </li>
            {/each}
          </ul>
        </details>

        <details class="nav-group" open>
          <summary>Postgraduate</summary>
          <ul>
            {#each postgraduateLinks as section (section.href)}
              <li>
                <a href={section.href} aria-current={activePath === section.href ? 'page' : undefined}>
                  {section.label}
                </a>
              </li>
            {/each}
          </ul>
        </details>
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
    min-width: 220px;
    background: var(--su-app-sidebar-bg, color-mix(in srgb, var(--su-surface-subtle, #f8f4ed) 82%, white 18%));
    overflow: auto;
  }

  nav {
    display: grid;
    gap: 0.34rem;
  }

  nav a {
    display: block;
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

  .nav-group {
    border: 1px solid rgba(44, 42, 41, 0.1);
    border-radius: 0.44rem;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.42);
  }

  .nav-group > summary {
    list-style: none;
    cursor: pointer;
    user-select: none;
    padding: 0.34rem 0.42rem;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 82%, black 18%);
    font-size: 0.84rem;
    font-weight: 600;
    line-height: 1.25;
    border-bottom: 1px solid rgba(44, 42, 41, 0.08);
    background: rgba(255, 255, 255, 0.56);
  }

  .nav-group > summary::-webkit-details-marker {
    display: none;
  }

  .nav-group > ul {
    margin: 0;
    padding: 0.34rem;
    list-style: none;
    display: grid;
    gap: 0.24rem;
  }

  .nav-group > ul > li {
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
