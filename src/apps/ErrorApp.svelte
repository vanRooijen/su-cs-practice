<script>
  import ContentRegion from '../components/ContentRegion.svelte';
  import { resolveContent } from '../lib/content/resolveContent.js';
  import {
    clearNavigationErrorHistory,
    navigationError,
    navigationErrorHistory,
  } from '../lib/navigation/historyRouter.js';

  export let subroute = '';

  $: normalizedSubroute = subroute.replace(/^\/+|\/+$/g, '');
  $: content = resolveContent('error', normalizedSubroute);
  $: errorHistoryEntries = [...$navigationErrorHistory].reverse();
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
    <ContentRegion artifact={content} cacheLimit={5} />
  </div>
</div>

<style>
  .error-layout {
    height: 100%;
    display: grid;
    grid-template-rows: auto auto 1fr;
    min-height: 0;
    background: var(--su-surface, #fffdf9);
  }

  .error-context {
    border-bottom: 1px solid rgba(44, 42, 41, 0.08);
    padding: 0.66rem 0.72rem;
    background: color-mix(in srgb, var(--su-surface-subtle, #f8f4ed) 82%, white 18%);
  }

  .error-context p {
    margin: 0 0 0.3rem;
  }

  .error-context p:last-child {
    margin-bottom: 0;
  }

  .error-history {
    border-bottom: 1px solid rgba(44, 42, 41, 0.08);
    padding: 0.66rem 0.72rem;
    max-height: 180px;
    overflow: auto;
    background: color-mix(in srgb, var(--su-surface-subtle, #f8f4ed) 70%, white 30%);
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
    color: color-mix(in srgb, var(--su-maroon, #61223b) 84%, black 16%);
  }

  .error-history-header button {
    border: none;
    border-radius: 0.38rem;
    padding: 0.3rem 0.44rem;
    background: rgba(255, 255, 255, 0.85);
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.11);
    color: var(--su-ink, #2c2a29);
  }

  .error-history-header button:not(:disabled):hover {
    color: var(--su-maroon, #61223b);
    box-shadow: inset 0 0 0 1px rgba(97, 34, 59, 0.24);
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
