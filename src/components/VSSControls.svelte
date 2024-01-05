<script lang="ts">
  export let limit:number
  export let threshold:number
</script>


<div class="fixed top-0 right-0 space-y-6 p-4">
  <div class="grid gap-2">
    <label for="limit" class="text-sm text-gray-500">Result Limit: <strong>{ limit }</strong></label>
    <input id="limit"  type="range" min="1" max="50" step="1" bind:value={limit} />
  </div>

  <div class="grid gap-2">
    <label for="threshold" class="text-sm text-gray-500">Similarity Cutoff: <strong>{ threshold }</strong></label>
    <input id="threshold"  type="range" min="0" max="1" step="0.01" bind:value={threshold} />
  </div>
</div>
