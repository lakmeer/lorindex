<script lang="ts">
  import '../app.css'

  import VSSControls from '$comp/VSSControls.svelte'

  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'

  const settings = writable<Settings>({
    limit: 20,
    threshold: 0.5,
  })

  setContext('settings', settings)

  export let data

</script>


<main class="mx-auto flex min-h-screen">
  <aside class="px-8 bg-slate-200 border-r border-slate-500 min-w-aside min-h-full">
    <div class="h-32 grid items-center mt-1">
      <VSSControls title={data.db} bind:limit={$settings.limit} bind:threshold={$settings.threshold} on:change />
    </div>
  </aside>

  <article class="max-w-prose w-full px-8 xl:px-16 py-16 xl:text-lg">
    <slot />
  </article>
</main>
