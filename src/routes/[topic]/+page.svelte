<script lang="ts">
  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'
  import { ok, warn, log } from '$lib/log.client'
  import { getJson, slugify } from '$lib/utils'

  import Topic       from '$comp/Topic.svelte'
  import TextItem    from '$comp/TextItem.svelte'
  import NewTextItem from '$comp/NewTextItem.svelte'
  import VSSControls from '$comp/VSSControls.svelte'


  export let data

  let limit     = data.settings.limit
  let threshold = data.settings.threshold


  // Topic changes

  let topic:string = data.topic
  let items: Item[] = []
  let status:Status = 'done'

  async function getItems (newTopic:string) {
    log('Main/getItems', newTopic, limit, threshold)
    status = 'pending'
    topic  = newTopic
    items  = await getJson('/api/topic/', { topic, limit, threshold })
    status = 'done'
    ok('Main/getItems', `${items.length} results for '${topic}'`)
  }

  onMount(() => {
    getItems(topic)
    history.replaceState({ topic }, '', '/' + slugify(topic))
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


<main class="mx-auto flex min-h-screen">
  <aside class="px-8 bg-slate-200 border-r border-slate-500 min-w-aside min-h-full">
    <div class="h-32 grid items-center mt-1">
      <VSSControls bind:limit bind:threshold on:change={() => getItems(topic)} />
    </div>
  </aside>

  <article class="max-w-prose w-full px-8 xl:px-16 py-16 xl:text-lg">
    <div class="mb-10 transition-opacity" class:opacity-50={status==='pending'}>
      <Topic topic={topic} on:change={({ detail }) => getItems(detail) } />
    </div>

    <div class="space-y-6 mb-6">
      {#each items as item, ix}
        {#key item.hash}
          <div in:fly={{ y: 20, duration: 200, delay: ix * 100 }}>
            <TextItem {...item} />
          </div>
        {/key}
      {/each}
    </div>

    <NewTextItem topic={topic} on:created={({ detail }) => pushNewItem(detail)} />
  </article>
</main>

<svelte:window on:popstate={pop} />
