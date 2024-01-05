<script lang="ts">

  import { postJson } from '$lib/utils'
  import { error } from '$lib/log.client'

  export let id:      Item['id']
  export let hash:    Item['hash']
  export let desc:    Item['desc']
  export let content: Item['content']

  let status : Status = 'done'

  async function submit () {
    if (status !== 'modified') return console.warn("Not modified")

    status = 'pending'

    const result = await postJson('/api/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, hash, desc, content })
    })

    if (result.error) {
      error('TextItem/submit', result.message)
      status = 'modified'
    } else {
      status = 'done'
    }
	}
</script>


<div class="relative space-y-2 w-full">
  <button class="absolute right-full top-0 w-4 h-4 mr-2 !mt-1 rounded-full transition-colors"
    class:bg-red-500={status === 'modified'}
    class:bg-yellow-500={status === 'pending'}
    class:bg-emerald-500={status === 'done'}
    on:click={submit}>
  </button>

  <div class="block w-full whitespace-normal"
    on:input={() => status = 'modified'}
    on:blur={submit}
    contenteditable
    disabled={status !== 'pending'}
    bind:textContent={content}>
  </div>
</div>
