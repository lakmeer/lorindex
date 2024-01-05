<script lang="ts">
  export let limit:number
  export let threshold:number
</script>


<div class="absolute top-0 right-0 space-y-4 p-4 text-center">
  <div class="grid">
    <label for="limit" class="text-sm text-gray-500">Result Limit</label>
    <input id="limit"  type="range" min="1" max="50" step="1" bind:value={limit} />
  </div>

  <div class="grid">
    <label for="threshold" class="text-sm text-gray-500">Similarity Threshold</label>
    <input id="threshold"  type="range" min="0" max="1" step="0.01" bind:value={threshold} />
  </div>
</div>
