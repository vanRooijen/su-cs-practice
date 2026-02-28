<script>
  export let artifact;
</script>

<section class="content-region" data-content-key={artifact?.key}>
  <header>
    <h3>{artifact?.title}</h3>
    {#if artifact?.excerpt}
      <p>{artifact.excerpt}</p>
    {/if}
  </header>

  <article class="content-document">{@html artifact?.html}</article>
</section>

<style>
  .content-region {
    height: 100%;
    overflow: auto;
    padding: 0.5rem;
  }
</style>
