<script lang="ts">
  import { postJson } from '$lib/utils'
  import { error, ok } from '$lib/log.client'

  import Item from '$comp/Item.svelte'

  export let id:       Item['id']
  export let time:     Item['time']
  export let type:     Item['type']
  export let hash:     Item['hash']
  export let desc:     Item['desc']
  export let distance: Item['distance']
  export let content:  Item['content'] = ""


  let status : Status = 'done'

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


<Item type='text' {hash} {desc} {time} {distance} {status}>
  <div class="block w-full"
    on:input={() => status = 'modified'}
    on:blur={submit}
    contenteditable
    bind:textContent={content}>
  </div>
</Item>
