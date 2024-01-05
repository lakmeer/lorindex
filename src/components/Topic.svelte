<script lang="ts">

  import { createEventDispatcher } from 'svelte';
  import { debounce } from '$lib/utils'

  const dispatch = createEventDispatcher();

  export let topic:string

  let internal:string = topic

  function setTopic () {
    topic = internal
    dispatch('change', topic);
  }

  function updateUrl (_:KeyboardEvent) {
    history.replaceState(null, '', '/' + encodeURIComponent(internal))
  }
</script>


<div class="flex {$$restProps.class}">
  <input class="text-3xl flex-1"
    name="topic"
    type="text"
    bind:value={internal}
    on:blur={setTopic}
    on:keyup={updateUrl}
    on:keyup={debounce(500, setTopic)}
  />
</div>
