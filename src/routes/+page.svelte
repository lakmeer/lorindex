<script lang="ts">
  export let data;

  let items = data.items
</script>


<div class="mb-10 transition-opacity">
  <h1 class="flex text-3xl flex-1">
    Table of Contents
  </h1>
</div>

<div class="space-y-6 mb-6 text-sm">
  <ul>
    {#each items as item}
      <li class="grid gap-3" style:grid-template-columns="1fr 60px 1fr">
        <span class="font-bold">{ item.desc } </span>
        <span class="bg-green-300 py-1 px-2 text-center">{ item.type } </span>
        <span class="flex flex-wrap">
          {#each item.tags as tag}
            <span class="bg-gray-200 py-1 px-2">{ tag }</span>
          {/each}
        </span>
      </li>
    {/each}
  </ul>
</div>

