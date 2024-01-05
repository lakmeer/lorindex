<script lang="ts">
  import '../app.css'

  export let data;
</script>


<main class="p-8">
  <form class="flex mb-8" action="?/topic" method="POST">
    <input class="text-3xl flex-1" name="topic" type="text" value={data.topic} />
    <button class="bg-emerald-400 py-2 px-4 rounded" type="submit">Go</button>
  </form>

  <div class="space-y-6">
    {#each data.items as item}
      <form class="space-y-2 w-full" action="?/update" method="POST">
        <input type="hidden" name="id"   value={item.id} />
        <input type="hidden" name="hash" value={item.hash} />
        <div class="flex space-x-2">
          <button class="bg-emerald-400 py-2 px-4 rounded" type="submit">&check;</button>
          <input class="block w-full text-lg font-bold" type="text" name="desc" value={item.desc} />
        </div>
        <textarea class="block w-full whitespace-normal" rows="10" name="content">{item.content}</textarea>
      </form>
    {/each}
  </div>

  <form class="mt-16 border space-y-4 p-4" action="?/create" method="POST">
    <input class="block w-full border" type="text" name="desc" id="desc" placeholder="Description" />
    <textarea class="block w-full border" name="content" id="content" placeholder="Content"></textarea>
    <button class="col-span-2 bg-emerald-400 py-2 px-8 rounded" type="submit">Submit</button>
  </form>
</main>
