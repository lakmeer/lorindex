<script lang="ts">
  import Button      from '$comp/Button.svelte'

  import { fade }    from 'svelte/transition'
  import { postJson, isError } from '$lib/utils'
  import { error, ok, log }    from '$lib/log.client'

  export let itemId:  Item['id']
  export let tags:    Item['tags'] = []
  export let status : Status = 'done'

  async function autotag () {
    log('TextItem/autotag', "Autotagging", itemId)

    const oldTags = tags
    status = 'pending'
    tags = []

    const result = await postJson<string[]>('/api/autotag', { id: itemId })

    if (isError(result)) {
      error('TextItem/autotag', result.message)
      status = 'modified'
      tags = oldTags
    } else {
      tags = result.data
      ok('TextItem/autotag', ...result.data)
      status = 'done'
    }
  }
</script>


<div class="flex flex-wrap flex-row-reverse gap-1 items-center min-h-[1.2rem]">
  <Button size="xs" style={status} on:click={autotag}> + </Button>

  {#each tags as tag, ix}
    <a class="text-2xs nowrap bg-slate-200 px-1 py-[0.2rem] rounded hover:bg-white transition-colors"
      transition:fade|global={{ duration: 150, delay: ix * 25 }}
      href="/tag/{tag}">
      {tag} 
    </a>
    {:else}
    {#if status !== 'pending'}
      <span class="text-2xs nowrap bg-slate-200 px-1 py-[0.2rem] rounded">
        No tags
      </span>
    {/if}
  {/each}
</div>
