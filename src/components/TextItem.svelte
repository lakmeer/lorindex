<script lang="ts">
  import { fly } from 'svelte/transition'
  import { postJson } from '$lib/utils'
  import { error, ok } from '$lib/log.client'

  export let id:       Item['id']
  export let time:     Item['time']
  export let type:     Item['type']
  export let hash:     Item['hash']
  export let desc:     Item['desc']
  export let content:  Item['content']
  export let distance: Item['distance']


  let status : Status = 'done'

  let panelOpen = false

  async function submit () {
    if (status !== 'modified') return console.warn("Not modified")

    status = 'pending'

    const result = await postJson<Item>('/api/update', { id, hash, desc, content })

    if (result.error) {
      error('TextItem/submit', result.message)
      status = 'modified'
    } else {
      ok('TextItem/submit', 'saved')
      //@ts-ignore stupid
      const item = result.data
      hash = item.hash
      desc = item.desc
      time = item.time

      ok('TextItem/submit', result)
      status = 'done'
    }
	}
</script>


<div class="relative w-full"
  on:mouseover={() => panelOpen = true}
  on:mouseout={() => panelOpen = false}>

  <div class="absolute h-full bg-slate-300 p-4 text-right w-aside mr-8 xl:mr-16 border-r border-slate-500 right-full top-0 z-10">
    <div class="space-y-2" transition:fly={{ x: 20, duration: 200 }}>
      <div class="flex justify-end items-center">
        <code class="text-xs bg-slate-200 text-slate-500 px-2 py-1 rounded">{hash}</code>

        <span class="w-4 h-4 ml-2 rounded-full transition-colors"
          class:bg-red-500={status === 'modified'}
          class:bg-yellow-500={status === 'pending'}
          class:bg-emerald-500={status === 'done'}>
        </span>
      </div>

      <div class="text-sm my-3"> <strong>{desc}</strong> </div>
      <div class="text-xs"> <strong>Updated At:</strong> {time} </div>
      <div class="text-xs"> <strong>Similarity:</strong> {(1 - distance).toFixed(3)} </div>
    </div>
  </div>

  <div class="block w-full whitespace-normal"
    on:input={() => status = 'modified'}
    on:blur={submit}
    contenteditable
    bind:textContent={content}>
  </div>
</div>
