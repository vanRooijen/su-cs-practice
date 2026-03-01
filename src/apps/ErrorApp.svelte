<script>
  import ContentRegion from '../components/ContentRegion.svelte';
  import { resolveContent } from '../lib/content/resolveContent.js';
  import {
    clearNavigationErrorHistory,
    navigationError,
    navigationErrorHistory,
  } from '../lib/navigation/historyRouter.js';

  export let subroute = '';
  export let windowId = null;

  $: normalizedSubroute = subroute.replace(/^\/+|\/+$/g, '');
  $: content = resolveContent('error', normalizedSubroute);
  $: errorHistoryEntries = [...$navigationErrorHistory].reverse();
  $: contentCacheScope = `error:${windowId ?? 'default'}`;
</script>

<div class="error-layout">
  <section class="error-context">
    {#if $navigationError}
      <p><strong>Latest:</strong> {$navigationError.message}</p>
      <p><strong>Requested path:</strong> <code>{$navigationError.requestedPath}</code></p>
      <p><strong>Time:</strong> {$navigationError.occurredAt}</p>
    {:else}
      <p>No recent navigation error.</p>
    {/if}
  </section>

  <section class="error-history" aria-label="Error history">
    <div class="error-history-header">
      <h4>Error Log ({$navigationErrorHistory.length})</h4>
      <button type="button" disabled={$navigationErrorHistory.length === 0} on:click={clearNavigationErrorHistory}>
        Clear Log
      </button>
    </div>

    {#if errorHistoryEntries.length === 0}
      <p>No errors captured in this session.</p>
    {:else}
      <ul>
        {#each errorHistoryEntries as entry (entry.id)}
          <li>
            <p>
              <strong>{entry.code}</strong> at <code>{entry.occurredAt}</code>
            </p>
            <p>{entry.message}</p>
          </li>
        {/each}
      </ul>
    {/if}
  </section>

  <div class="content-slot">
    <ContentRegion artifact={content} cacheLimit={5} cacheScope={contentCacheScope} />
  </div>
</div>

<style>
  .error-layout {
    height: 100%;
    display: grid;
    grid-template-rows: auto auto 1fr;
    min-height: 0;
  }

  .error-context {
    border-bottom: 1px solid;
    padding: 0.5rem;
  }

  .error-context p {
    margin: 0 0 0.3rem;
  }

  .error-context p:last-child {
    margin-bottom: 0;
  }

  .error-history {
    border-bottom: 1px solid;
    padding: 0.5rem;
    max-height: 180px;
    overflow: auto;
  }

  .error-history-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.4rem;
  }

  .error-history-header h4 {
    margin: 0;
  }

  .error-history p {
    margin: 0 0 0.3rem;
  }

  .error-history ul {
    margin: 0;
    padding-left: 1rem;
  }

  .error-history li {
    margin: 0 0 0.45rem;
  }

  .error-history li p {
    margin: 0 0 0.2rem;
  }

  .error-history li p:last-child {
    margin-bottom: 0;
  }

  .content-slot {
    min-height: 0;
  }
</style>
