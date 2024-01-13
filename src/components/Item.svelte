<script lang="ts">
  import StatusBadge from '$comp/StatusBadge.svelte'
  import TagList     from '$comp/TagList.svelte'

  import { unixRelative }  from '$lib/utils'

  export let id:       Item['id'] = -1 // New item has no id
  export let time:     Item['time']
  export let type:     Item['type']
  export let hash:     Item['hash']
  export let desc:     Item['desc']
  export let distance: Item['distance']
  export let tags:     Item['tags'] = []

  export let status : Status = 'done'
</script>


<div class="relative flex 
  w-[calc(100%+20rem+2rem)]
  xl:w-[calc(100%+20rem+4rem)]
  ml-[calc(-20rem-2rem)]
  xl:ml-[calc(-20rem-4rem)]"
  data-type={type}>

  <div class="w-aside space-y-2 text-right bg-slate-300
    border-r border-slate-500 p-4 mr-8 xl:mr-16">

    <div class="text-sm"> <strong>{desc}</strong> </div>

    {#if id !== -1}
      <TagList itemId={id} tags={tags} status={status} />

      {#if time}
        <div class="text-xs"> <strong>Last Update:</strong> {unixRelative(time)} </div>
      {/if}

      <div class="text-xs"> <strong>Distance:</strong> {distance.toFixed(3)} </div>
    {/if}

    <div class="w-4 ml-auto">
      <StatusBadge status={status} />
    </div>
  </div>

  <div class="flex-1">
    <slot />
  </div>
</div>
