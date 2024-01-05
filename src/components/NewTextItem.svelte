<script lang="ts">

  import { createEventDispatcher } from 'svelte';
  import { postJson } from '$lib/utils'
  import { error, ok } from '$lib/log.client'

  import Item from '$comp/Item.svelte'

  const dispatch = createEventDispatcher()

  export let topic:string

  let content = ''
  let status:Status = 'nothing'

  async function submit () {
    if (status !== 'modified') return console.warn("Not modified")

    status = 'pending'

    const result = await postJson('/api/create', { topic, content })

    if (result.error) {
      error('NewTextItem/submit', result.message)
      status = 'modified'
      return
    }

    //@ts-ignore stupid
    const item = result.data
    ok('NewTextItem/submit', 'saved', item)
    dispatch('created', item)
    content = ''
    status = 'nothing'
	}
</script>


<Item
  type='text'
  hash="00000000000000000000000000000000"
  desc="New Item"
  time={0}
  distance={1} {status}>

  <div
    class="border border-slate-400 block w-full min-h-[3rem]"
    on:input={() => status = 'modified'}
    on:blur={submit}
    contenteditable
    bind:textContent={content}>
  </div>
</Item>

