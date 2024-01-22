<script lang="ts">
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'
  import { fly } from 'svelte/transition'

  import * as API from '$lib/api'
  import app from '$stores/app'

  import TextItem from '$comp/TextItem.svelte'
  import ImageItem from '$comp/ImageItem.svelte'

  let items = []
  let status = writable<Status>('none')

  onMount(() => {
    return app.subscribe(async ({ topic }) =>
      items = await API.getItemsForTopic(status, topic))
  })
</script>


<div class="space-y-6 mb-6">
  {#each items as item, ix}
    {#key item.hash}
      <div in:fly={{ y: 20, duration: 200, delay: ix * 100 }}>
        {#if item.type === 'text'}
          <TextItem {...item} />
        {:else if item.type === 'image'}
          <ImageItem {...item} />
        {/if}
      </div>
    {/key}
  {/each}
</div>
