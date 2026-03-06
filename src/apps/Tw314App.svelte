<script>
  import ContentRegion from '../components/ContentRegion.svelte';
  import { resolveContent } from '../lib/content/resolveContent.js';
  import { TW314_DEFAULT_SLUG, TW314_TOC, toTw314Href } from '../lib/tw314/pages.js';

  export let subroute = '';
  export let sidebarCollapsed = false;

  function trimSlashes(value = '') {
    return value.replace(/^\/+|\/+$/g, '');
  }

  $: normalizedSubroute = trimSlashes(subroute);
  $: activeSlug = normalizedSubroute || TW314_DEFAULT_SLUG;
  $: activePath = toTw314Href(activeSlug);
  $: content = resolveContent('tw314', normalizedSubroute);

  function isChapterActive(chapter) {
    if (!chapter) {
      return false;
    }

    if (chapter.slug === activeSlug) {
      return true;
    }

    return Array.isArray(chapter.sections) && chapter.sections.some((section) => section.slug === activeSlug);
  }

  function isPartActive(part) {
    if (!part) {
      return false;
    }

    if (part.slug === activeSlug) {
      return true;
    }

    return Array.isArray(part.chapters) && part.chapters.some((chapter) => isChapterActive(chapter));
  }

  function hasSections(chapter) {
    return Array.isArray(chapter?.sections) && chapter.sections.length > 0;
  }
</script>

<div class="app-layout" data-sidebar-collapsed={sidebarCollapsed}>
  {#if !sidebarCollapsed}
    <aside class="app-sidebar">
      <nav aria-label="TW314 sections">
        {#if TW314_TOC.preface?.length}
          <section class="toc-block">
            {#each TW314_TOC.preface as chapter (chapter.slug)}
              <div class="toc-chapter" data-active={isChapterActive(chapter)}>
                <a class="toc-link toc-link-chapter" href={toTw314Href(chapter.slug)} aria-current={activePath === toTw314Href(chapter.slug) ? 'page' : undefined} title={chapter.title}>
                  {#if chapter.codenumber}
                    <span class="toc-code">{chapter.codenumber}</span>
                  {/if}
                  <span class="toc-title">{chapter.title}</span>
                </a>
                {#if hasSections(chapter)}
                  <div class="toc-sections">
                    {#each chapter.sections as section (section.slug)}
                      <a class="toc-link toc-link-section" href={toTw314Href(section.slug)} aria-current={activePath === toTw314Href(section.slug) ? 'page' : undefined} title={section.title}>
                        <span class="toc-title">{section.title}</span>
                      </a>
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
          </section>
        {/if}

        {#if TW314_TOC.parts?.length}
          {#each TW314_TOC.parts as part (part.slug)}
            <section class="toc-block toc-part" data-active={isPartActive(part)}>
              <a class="toc-link toc-link-part" href={toTw314Href(part.slug)} aria-current={activePath === toTw314Href(part.slug) ? 'page' : undefined} title={part.title}>
                {#if part.codenumber}
                  <span class="toc-code">{part.codenumber}</span>
                {/if}
                <span class="toc-title">{part.title}</span>
              </a>

              <div class="toc-chapters">
                {#each part.chapters as chapter (chapter.slug)}
                  <div class="toc-chapter" data-active={isChapterActive(chapter)}>
                    <a class="toc-link toc-link-chapter" href={toTw314Href(chapter.slug)} aria-current={activePath === toTw314Href(chapter.slug) ? 'page' : undefined} title={chapter.title}>
                      {#if chapter.codenumber}
                        <span class="toc-code">{chapter.codenumber}</span>
                      {/if}
                      <span class="toc-title">{chapter.title}</span>
                    </a>

                    {#if hasSections(chapter)}
                      <div class="toc-sections">
                        {#each chapter.sections as section (section.slug)}
                          <a class="toc-link toc-link-section" href={toTw314Href(section.slug)} aria-current={activePath === toTw314Href(section.slug) ? 'page' : undefined} title={section.title}>
                            <span class="toc-title">{section.title}</span>
                          </a>
                        {/each}
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>
            </section>
          {/each}
        {/if}
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
    min-width: 260px;
    background: var(--su-app-sidebar-bg, color-mix(in srgb, var(--su-surface-subtle, #f8f4ed) 82%, white 18%));
    overflow: auto;
  }

  nav {
    display: grid;
    gap: 0.36rem;
  }

  .toc-block {
    display: grid;
    gap: 0.26rem;
  }

  .toc-part {
    margin-top: 0.22rem;
    padding-top: 0.16rem;
    border-top: 1px solid rgba(44, 42, 41, 0.08);
  }

  .toc-chapters {
    display: grid;
    gap: 0.24rem;
  }

  .toc-chapter {
    display: grid;
    gap: 0.2rem;
  }

  .toc-link {
    display: flex;
    align-items: baseline;
    gap: 0.3rem;
    color: color-mix(in srgb, var(--su-ink, #2c2a29) 86%, white 14%);
    text-decoration: none;
    padding: 0.34rem 0.4rem;
    border-radius: 0.4rem;
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.1);
    transition: background-color 120ms ease, color 120ms ease, box-shadow 120ms ease;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .toc-link:hover {
    background: rgba(202, 162, 88, 0.16);
    color: var(--su-maroon, #61223b);
    box-shadow: inset 0 0 0 1px rgba(97, 34, 59, 0.22);
  }

  .toc-link[aria-current='page'] {
    background: rgba(202, 162, 88, 0.22);
    color: var(--su-maroon, #61223b);
    font-weight: 600;
  }

  .toc-link-part {
    font-weight: 650;
  }

  .toc-link-chapter {
    font-size: 0.92rem;
  }

  .toc-sections {
    display: grid;
    gap: 0.18rem;
    padding-left: 0.7rem;
  }

  .toc-link-section {
    font-size: 0.82rem;
    border-radius: 0.34rem;
    color: color-mix(in srgb, var(--su-muted, #686d71) 86%, black 14%);
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.07);
  }

  .toc-code {
    color: color-mix(in srgb, var(--su-muted, #686d71) 80%, black 20%);
    font-size: 0.8em;
    flex: 0 0 auto;
  }

  .toc-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
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
