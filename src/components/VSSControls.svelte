<script lang="ts">
  export let title:string
  export let limit:number
  export let threshold:number
</script>


<div class="
  items-center
  text-right text-slate-700 text-sm
  grid grid-cols-3 gap-2
  [grid-template-columns:auto_2rem_1fr]">

  <h2 class="text-center col-span-3 font-bold mb-2 uppercase">{title}</h2>

  <div class="grid col-span-3 grid-cols-subgrid">
    <label for="limit">Limit</label>
    <strong class="text-center">{ limit }</strong>

    <input 
      class="accent-emerald-500 w-full"
      id="limit"
      type="range"
      min="1" max="50" step="1"
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
      bind:value={threshold} />
  </div>
</div>
