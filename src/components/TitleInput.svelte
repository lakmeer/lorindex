<script lang="ts">
  import { debounce, slugify } from '$lib/utils'
  import { info, warn, ok } from '$lib/log.client'

  export let topic:string

  $: internal = topic

  function setTopic () {
    if (history.state?.topic === internal) return warn('Topic/setTopic', 'no change')
    topic = internal
    history.pushState({ topic }, '', '/' + slugify(topic))
    info('Topic/setTopic', topic, history.state)
  }
</script>


<svelte:head>
  <title>{ internal || 'Table of Contents'} ~ Lorindex</title>
</svelte:head>

<h1 class="flex {$$restProps.class}">
  <input class="text-3xl flex-1"
    name="topic"
    type="text"
    bind:value={internal}
    on:blur={setTopic}
    placeholder="Type anything"
    on:keyup={debounce(800, setTopic)}
  />
</h1>
