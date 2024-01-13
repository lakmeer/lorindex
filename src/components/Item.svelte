<script lang="ts">
  import StatusBadge from '$comp/StatusBadge.svelte'

  export let time:     Item['time']
  export let type:     Item['type']
  export let hash:     Item['hash']
  export let desc:     Item['desc']
  export let distance: Item['distance']
  export let tags:     Item['tags'] = []

  export let status : Status = 'done'

  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

</script>


<div class="relative flex 
  w-[calc(100%+20rem+2rem)]
  xl:w-[calc(100%+20rem+4rem)]
  ml-[calc(-20rem-2rem)]
  xl:ml-[calc(-20rem-4rem)]">

  <div class="w-aside space-y-2 text-right bg-slate-300
    border-r border-slate-500 p-4 mr-8 xl:mr-16">

    <div class="text-sm"> <strong>{desc}</strong> </div>

    {#if tags.length}
      <div class="flex flex-wrap gap-1 justify-end items-center">
        {#each tags as tag}
          <a href="/tag/{tag}" class="text-2xs nowrap bg-slate-200 px-1 py-[0.2rem] rounded hover:bg-white transition-colors"> {tag} </a>
        {/each}
      </div>
    {/if}

    {#if time}
      <div class="text-xs"> <strong>Updated At:</strong> {time} </div>
      <div class="text-xs"> <strong>Distance:</strong> {distance.toFixed(3)} </div>
    {/if}

    <div class="w-4 ml-auto">
      <StatusBadge status={status} on:click={() => dispatch('reprocess')} />
    </div>
  </div>

  <div class="flex-1">
    <slot />
  </div>
</div>
