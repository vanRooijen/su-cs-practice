<script>
  import ContentRegion from '../components/ContentRegion.svelte';
  import { resolveContent } from '../lib/content/resolveContent.js';

  export let subroute = '';

  $: content = resolveContent('home', subroute);
</script>

<div class="app-layout">
  <div class="content-slot">
    <ContentRegion artifact={content} />
  </div>
</div>

<style>
  .app-layout {
    height: 100%;
    display: grid;
    grid-template-rows: 1fr;
    min-height: 0;
    background: var(--su-app-content-bg, var(--su-surface, #fffdf9));
  }

  .content-slot {
    min-height: 0;
    background: var(--su-app-content-bg, var(--su-surface, #fffdf9));
  }
</style>
