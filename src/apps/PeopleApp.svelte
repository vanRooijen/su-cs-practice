<script>
  import ContentRegion from '../components/ContentRegion.svelte';
  import { resolveContent } from '../lib/content/resolveContent.js';

  export let subroute = '';
  export let sidebarCollapsed = false;

  const sections = [
    { label: 'Overview', href: '/people' },
    { label: 'Staff', href: '/people/staff' },
    { label: 'Students', href: '/people/students' },
    { label: 'Alumni', href: '/people/alumni' },
  ];

  $: normalizedSubroute = subroute.replace(/^\/+|\/+$/g, '');
  $: activePath = normalizedSubroute ? `/people/${normalizedSubroute}` : '/people';
  $: content = resolveContent('people', normalizedSubroute);
</script>

<div class="app-layout">
  {#if !sidebarCollapsed}
    <aside>
      <h3>People Sections</h3>
      <nav aria-label="People sections">
        {#each sections as section}
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
  }

  aside {
    border-right: 1px solid;
    padding: 0.5rem;
    min-width: 170px;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
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
    }
  }
</style>
