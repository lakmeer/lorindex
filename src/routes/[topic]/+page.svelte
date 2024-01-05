<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { info } from '$lib/log.client'
  import { getJson } from '$lib/utils'

  import Topic    from '$comp/Topic.svelte';
  import TextItem from '$comp/TextItem.svelte';
  import NewTextItem from '$comp/NewTextItem.svelte';


  export let data


  // Topic changes

  let topic:string = data.topic
  let items: Item[] = []

  async function getItems (newTopic:string) {
    topic = newTopic
    info('topic/getItems', topic)
    items = await getJson('/api/topic/', { topic })
  }

  onMount(() => {
    getItems(topic)
  })
</script>


<main class="px-8 py-16 text-lg max-w-prose mx-auto">
  <Topic class="mb-10" topic={topic} on:change={({ detail }) => getItems(detail) } />

  <div class="space-y-6">
    {#each items as item, ix}
      {#key item.id}
        <div in:fly={{ y: 20, duration: 200, delay: ix * 100 }}>
          <TextItem id={item.id} hash={item.hash} desc={item.desc} content={item.content} />
        </div>
      {/key}
    {/each}
  </div>

  <NewTextItem on:submit={({ detail }) => items.push(detail)} />
</main>
