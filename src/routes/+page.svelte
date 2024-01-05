<script lang="ts">
  import '../app.css'

  export let data;
</script>


<main class="p-8">
  <h1 class="text-3xl mb-8">Items</h1>

  <div class="space-y-6">
    {#each data.items as item}
    <div class="space-y-2">
      <code class="bg-slate-200">{item.hash}</code>
      <p class="text-lg font-bold">{item.desc}</p>
      <p>{item.content}</p>
    </div>
    {/each}
  </div>

  <form class="mt-16 border space-y-4 p-4" action="/items" method="POST">
    <input class="block w-full border" type="text" name="desc" id="desc" placeholder="Description" />
    <textarea class="block w-full border" name="content" id="content" placeholder="Content"></textarea>
    <button class="col-span-2 bg-emerald-400 py-2 px-8 rounded" type="submit">Submit</button>
  </form>
</main>
