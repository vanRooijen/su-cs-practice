<script>
  export let onCloseOwned = null;
  export let onCloseAllInstances = null;
  export let onCloseOtherInstances = null;
</script>

<button type="button" on:click={() => onCloseOwned?.()}>Close My Windows</button>
<button type="button" on:click={() => onCloseAllInstances?.()}>Close All Instances</button>
<button type="button" on:click={() => onCloseOtherInstances?.()}>Close Other Instances</button>
