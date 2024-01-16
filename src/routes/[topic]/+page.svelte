<script lang="ts">
  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'
  import { ok, warn, log } from '$lib/log.client'
  import { getJson, slugify } from '$lib/utils'
  import { getContext } from 'svelte'
  import type { Writable } from 'svelte/store';

  import Topic       from '$comp/Topic.svelte'
  import TextItem    from '$comp/TextItem.svelte'
  import ImageItem   from '$comp/ImageItem.svelte'
  import NewTextItem from '$comp/NewTextItem.svelte'


  export let data

  const settings = getContext('settings') as Writable<Settings>

  // Topic changes

  let topic:string = data.topic
  let items: Item[] = []
  let status:Status = 'done'

  async function getItems (newTopic:string) {
    log('Main/getItems', newTopic, $settings.limit, $settings.threshold)
    status = 'pending'
    topic  = newTopic
    items  = await getJson('/api/topic/', { topic, limit: $settings.limit, threshold: $settings.threshold })
    status = 'done'
    ok('Main/getItems', `${items.length} results for '${topic}'`)
  }

  onMount(() => {
    getItems(topic)
    history.replaceState({ topic }, '', '/' + slugify(topic))

    return settings.subscribe(() => getItems(topic))
  })


  // History management

  function pop (event:PopStateEvent) {
    log('Main/pop', event.state.topic)

    if (event.state.topic) {
      getItems(event.state.topic)
    } else {
      warn('Main/pop', 'no topic in state')
    }
  }


  // New Items

  function pushNewItem (item:Item) {
    log('pushNewItem', item)
    items = items.concat(item)
  }
</script>


<svelte:window on:popstate={pop} />

<div class="mb-10 transition-opacity" class:opacity-50={status==='pending'}>
  <Topic topic={topic} on:change={({ detail }) => getItems(detail) } />
</div>

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

<NewTextItem topic={topic} on:created={({ detail }) => pushNewItem(detail)} />
