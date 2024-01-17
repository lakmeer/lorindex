<script lang="ts">
  import { slugify } from '$lib/utils'

  export let data;

  let topics = data.topics
</script>


<div class="mb-10 transition-opacity">
  <h1 class="flex text-3xl flex-1">
    Table of Contents
  </h1>
</div>

<div class="space-y-6 mb-6 text-base">
  <ul>
    {#each topics as topic}
      <li class="grid gap-3" style:grid-template-columns="1fr 60px 1fr">
        <a href={slugify(topic)} class="text-blue-500 hover:text-blue-700">{ topic }</a>
      </li>
    {/each}
  </ul>
</div>

