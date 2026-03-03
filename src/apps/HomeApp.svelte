<script>
  import ContentRegion from '../components/ContentRegion.svelte';
  import { listReaderArticles, resolveContent } from '../lib/content/resolveContent.js';

  export let subroute = '';

  const featuredArticles = listReaderArticles();

  $: content = resolveContent('home', subroute);
</script>

<div class="app-layout">
  <section class="home-chrome">
    <header class="home-hero">
      <p class="hero-eyebrow">Stellenbosch University</p>
      <h2>Computer Science Department</h2>
      <p>
        Welcome to the department workspace. Open people directories, explore current articles, and move between apps
        without losing your place.
      </p>
      <div class="hero-actions">
        <a href="/people">Open People</a>
        <a href="/reader/articles">Open Articles</a>
        <a href="/reader/help">Open Help</a>
      </div>
    </header>

    <section class="home-featured">
      <div class="featured-heading">
        <h3>Featured Stories</h3>
        <p>Select an entry to open it in Reader.</p>
      </div>

      <ul class="feature-grid">
        {#each featuredArticles as article (article.key)}
          {@const path = `/reader/${article.subroute}`}
          <li class="feature-card">
            <h4>{article.title}</h4>
            <p>{article.excerpt ?? 'Department update and announcement.'}</p>
            <a class="feature-link" href={path}>Read story</a>
          </li>
        {/each}
      </ul>
    </section>
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
    background: var(--su-app-content-bg, var(--su-surface, #fffdf9));
  }

  .home-chrome {
    border-bottom: 1px solid var(--su-app-chrome-line, rgba(44, 42, 41, 0.08));
    padding: 0.72rem 0.86rem 0.74rem;
    background: var(--su-app-sidebar-bg, color-mix(in srgb, var(--su-surface-subtle, #f8f4ed) 82%, white 18%));
    display: grid;
    gap: 0.72rem;
  }

  .home-hero {
    width: 100%;
    max-width: var(--su-content-max-width, 72rem);
    margin: 0 auto;
    display: grid;
    gap: 0.34rem;
  }

  .hero-eyebrow {
    margin: 0;
    font-size: 0.76rem;
    line-height: 1.2;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--su-muted, #686d71) 94%, black 6%);
  }

  .home-hero h2 {
    margin: 0;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 86%, black 14%);
    font-size: 1.28rem;
    line-height: 1.16;
  }

  .home-hero > p {
    margin: 0;
    color: color-mix(in srgb, var(--su-ink, #2c2a29) 90%, white 10%);
    font-size: 0.92rem;
    line-height: 1.38;
    max-width: 76ch;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.34rem;
    margin-top: 0.1rem;
  }

  .hero-actions a {
    text-decoration: none;
    color: var(--su-maroon, #61223b);
    background: rgba(255, 255, 255, 0.72);
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.11);
    border-radius: 0.4rem;
    padding: 0.34rem 0.5rem;
    font-size: 0.82rem;
    line-height: 1.2;
    transition: background-color 120ms ease, color 120ms ease, box-shadow 120ms ease;
  }

  .hero-actions a:hover {
    background: rgba(202, 162, 88, 0.18);
    box-shadow: inset 0 0 0 1px rgba(97, 34, 59, 0.24);
  }

  .home-featured {
    width: 100%;
    max-width: var(--su-content-max-width, 72rem);
    margin: 0 auto;
  }

  .featured-heading {
    margin: 0 0 0.42rem;
    display: grid;
    gap: 0.16rem;
  }

  .featured-heading h3 {
    margin: 0;
    font-size: 0.95rem;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 84%, black 16%);
  }

  .featured-heading p {
    margin: 0;
    color: color-mix(in srgb, var(--su-muted, #686d71) 92%, black 8%);
    font-size: 0.82rem;
  }

  .feature-grid {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 0.44rem;
  }

  .feature-card {
    margin: 0;
    border-radius: 0.42rem;
    padding: 0.44rem 0.5rem;
    background: rgba(255, 255, 255, 0.76);
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.1);
    display: grid;
    gap: 0.2rem;
  }

  .feature-card h4 {
    margin: 0;
    font-size: 0.86rem;
    line-height: 1.24;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 84%, black 16%);
  }

  .feature-card p {
    margin: 0;
    color: color-mix(in srgb, var(--su-muted, #686d71) 94%, black 6%);
    font-size: 0.8rem;
    line-height: 1.34;
  }

  .feature-link {
    text-underline-offset: 2px;
    color: color-mix(in srgb, var(--su-maroon, #61223b) 90%, black 10%);
    font-size: 0.8rem;
    width: fit-content;
  }

  .content-slot {
    min-height: 0;
    background: var(--su-app-content-bg, var(--su-surface, #fffdf9));
  }
</style>
