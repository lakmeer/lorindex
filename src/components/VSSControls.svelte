<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { postJson } from '$lib/utils'

  export let limit:number
  export let threshold:number

  const dispatch = createEventDispatcher()

  function changed () {
    dispatch('change', { limit, threshold })
    postJson('/api/settings', { limit, threshold })
  }
</script>


<div class="
  items-center
  text-right text-slate-700 text-sm
  grid grid-cols-3 gap-4
  [grid-template-columns:auto_2rem_1fr]">

  <div class="grid col-span-3 grid-cols-subgrid">
    <label for="limit">Limit</label>
    <strong class="text-center">{ limit }</strong>

    <input 
      class="accent-emerald-500 w-full"
      id="limit"
      type="range"
      min="1" max="50" step="1"
      on:change={changed}
      bind:value={limit} />
  </div>

  <div class="grid col-span-3 grid-cols-subgrid">
    <label for="threshold"> Threshold </label>
    <strong class="text-center">{ threshold }</strong>

    <input
      class="accent-emerald-500 w-full"
      id="threshold"
      type="range" 
      min="0" max="1" step="0.01" 
      on:change={changed}
      bind:value={threshold} />
  </div>
</div>
