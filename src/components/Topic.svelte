<script lang="ts">

  import { createEventDispatcher } from 'svelte'
  import { debounce } from '$lib/utils'
  import { info, warn, ok } from '$lib/log.client'

  const dispatch = createEventDispatcher()

  export let topic:string

  let internal:string = topic

  function setTopic () {
    if (internal === '') return warn('Topic/setTopic', 'is empty')
    if (history.state?.topic == topic) return warn('Topic/setTopic', 'no change')

    topic = internal

    info('Topic/setTopic', topic)

    dispatch('change', topic)

    history.pushState({ topic }, '', '/' + encodeURIComponent(topic))

    ok('Topic/setTopic', topic, history.state)

  }
</script>


<h1 class="flex {$$restProps.class}">
  <input class="text-3xl flex-1"
    name="topic"
    type="text"
    bind:value={internal}
    on:blur={setTopic}
    on:keyup={debounce(800, setTopic)}
  />
</h1>
