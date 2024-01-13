<script lang="ts">
  import { postJson, isError } from '$lib/utils'
  import { error, ok, log }    from '$lib/log.client'

  import ItemWrapper from '$comp/Item.svelte'

  export let id:       Item['id']
  export let time:     Item['time']
  export let hash:     Item['hash']
  export let desc:     Item['desc']
  export let distance: Item['distance']
  export let content:  Item['content'] = ""
  export let tags:     Item['tags'] = []

  export const type:   Item['type'] = 'text'

  let status : Status = 'done'

  async function submit () {
    log('TextItem/submit', "Submitting", id)

    if (status !== 'modified') return log('TextItem/submit', "Not modified")
    if (content.trim().length < 1) {
      status = 'done'
      return log('TextItem/submit', "Empty")
    }

    status = 'pending'

    const result = await postJson<Item>('/api/update', { id, hash, desc, content })

    if (isError(result)) {
      error('TextItem/submit', result.message)
      status = 'modified'
    } else {
      //@ts-ignore stupid
      const item = result.data
      hash = item.hash
      desc = item.desc
      time = item.time
      tags = item.tags

      ok('TextItem/submit', result.data)
      status = 'done'
    }
  }
</script>


<ItemWrapper type='text' {id} {hash} {desc} {time} {distance} {status} {tags}>
  <div class="block w-full"
    on:input={() => status = 'modified'}
    on:blur={submit}
    contenteditable
    bind:textContent={content}>
  </div>
</ItemWrapper>
