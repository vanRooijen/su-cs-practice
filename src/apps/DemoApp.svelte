<script>
  import ContentRegion from '../components/ContentRegion.svelte';
  import { resolveDemoContent } from '../lib/demo/resolveDemoContent.js';

  export let appId = 'demo';
  export let subroute = '';

  $: content = resolveDemoContent(appId, subroute);
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
    min-width: 0;
    overflow: hidden;
    background: var(--su-app-content-bg, var(--su-surface, #fffdf9));
  }

  .content-slot {
    min-height: 0;
    min-width: 0;
    background: var(--su-app-content-bg, var(--su-surface, #fffdf9));
  }
</style>
