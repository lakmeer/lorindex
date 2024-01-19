<script lang="ts">
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'
  import { slugify } from '$lib/utils'

  import * as API from '$lib/api'

  let index = []
  let status = writable<Status>('none')

  onMount(async () => {
    index = await API.index(status)
  })
</script>


<div class="space-y-6 mb-6 text-base">
  <ul>
    {#each index as topic}
      <li class="grid gap-3" style:grid-template-columns="1fr 60px 1fr">
        <a href={slugify(topic)} class="text-blue-500 hover:text-blue-700">{ topic }</a>
      </li>
    {/each}
  </ul>
</div>
