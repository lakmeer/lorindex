<script lang="ts">
  import { postJson } from '$lib/utils'
  import { createEventDispatcher } from 'svelte'

  export let time:     Item['time']
  export let type:     Item['type']
  export let hash:     Item['hash']
  export let desc:     Item['desc']
  export let distance: Item['distance']

  export let status : Status = 'done'

  const dispatch = createEventDispatcher()

  async function deleteItem () {
    if (status === 'pending') return

    status = 'pending'

    const result = await postJson('/api/delete', { hash })

    if (result.error) {
      status = 'done'
    } else {
      dispatch('deleted')
    }
  }

  async function newDescription () {
    if (status === 'pending') return

    status = 'pending'

    const newDesc = prompt('New Description', desc)

    if (!newDesc) return

    const result = await postJson('/api/describe', { hash, desc: newDesc })

    if (result.error) {
      status = 'done'
    } else {
      desc = newDesc
      status = 'done'
    }
  }


</script>


<div class="relative w-full min-h-[8rem]">
  <div class="
    absolute right-full top-0 z-10
    w-aside h-full p-4 space-y-2
    mr-8 xl:mr-16 text-right
    bg-slate-300 border-r border-slate-500">

    <div class="flex justify-end items-center">
      <code class="text-xs bg-slate-200 text-slate-500 px-2 py-1 rounded">{hash}</code>

      <span class="w-4 h-4 ml-2 rounded-full transition-colors"
        class:bg-slate-500={status === 'nothing'}
        class:bg-red-500={status === 'modified'}
        class:bg-yellow-500={status === 'pending'}
        class:bg-emerald-500={status === 'done'}>
      </span>
    </div>

    <div class="text-sm my-3"> <strong>{desc}</strong> </div>

    {#if time}
      <div class="text-xs"> <strong>Updated At:</strong> {time} </div>
      <div class="text-xs"> <strong>Distance:</strong> {distance.toFixed(3)} </div>
    {/if}

    <div class="flex items-center text-sm space-x-2 font-bold">
      <button type="button" class="border border-green-500 px-2 py-1 flex items-center space-x-2"
        on:click={newDescription}>
        <span class="text-xs font-bold"> Describe </span>
        <span>  </span>
      </button>

      <button type="button" class="border border-red-500 px-2 py-1 flex items-center space-x-2"
        on:click={deleteItem}>
        <span class="text-xs font-bold"> Delete  </span>
        <span> ❌ </span>
      </button>
    </div>
  </div>

  <slot />
</div>

