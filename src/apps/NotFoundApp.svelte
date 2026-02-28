<script>
  export let path = '';
</script>

<div class="not-found-layout">
  <h3>Not Found</h3>
  <p>No application is registered for this URL:</p>
  <p><code>{path || '(empty path)'}</code></p>

  <p>Try one of these:</p>
  <ul>
    <li><a href="/home">Home</a></li>
    <li><a href="/people">People</a></li>
    <li><a href="/reader">Reader</a></li>
  </ul>
</div>

<style>
  .not-found-layout {
    height: 100%;
    overflow: auto;
    padding: 0.75rem;
  }

  ul {
    margin: 0;
    padding-left: 1rem;
  }
</style>
