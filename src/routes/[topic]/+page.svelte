<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { ok, info } from '$lib/log.client'
  import { getJson } from '$lib/utils'

  import Topic       from '$comp/Topic.svelte';
  import TextItem    from '$comp/TextItem.svelte';
  import NewTextItem from '$comp/NewTextItem.svelte';
  import VSSControls from '$comp/VSSControls.svelte';


  export let data


  // Topic changes

  let topic:string = data.topic
  let items: Item[] = []

  let status:Status = 'done'

  async function getItems (newTopic:string) {
    topic = newTopic
    status = 'pending'
    info('topic/getItems', topic, limit, threshold)
    items = await getJson('/api/topic/', { topic, limit, threshold })
    status = 'done'
    ok('topic/getItems', topic, items.length)
  }

  onMount(() => {
    getItems(topic)
  })


  // Search paramters

  let limit     = data.settings.limit
  let threshold = data.settings.threshold

</script>


<main class="mx-auto flex min-h-screen">
  <aside class="px-8 bg-slate-200 border-r border-slate-500 min-w-aside min-h-full">
    <div class="h-32 grid items-center mt-1">
      <VSSControls bind:limit bind:threshold on:change={() => getItems(topic)} />
    </div>
  </aside>

  <article class="max-w-prose px-8 xl:px-16 py-16 xl:text-lg">
    <div class="mb-10" class:opacity-50={status==='pending'}>
      <Topic topic={topic} on:change={({ detail }) => getItems(detail) } />
    </div>

    <div class="space-y-6">
      {#each items as item, ix}
        {#key item.id}
          <div in:fly={{ y: 20, duration: 200, delay: ix * 100 }}>
            <TextItem {...item} />
          </div>
        {/key}
      {:else}
        <div in:fly={{ y: 20, duration: 200, delay: ix * 100 }}>
          <h3 class="text-center text-xl"> No Results </h3>
        </div>
      {/each}
    </div>

    <NewTextItem on:submit={({ detail }) => items.push(detail)} />
  </article>
</main>
