<script lang="ts">
  import { page } from '$app/stores'
  import { unslugify } from '$lib/utils'

  import app from '$stores/app'

  import TitleInput from '$comp/TitleInput.svelte'
  import TopicPane from '$panes/Topic.svelte'
  import IndexPane from '$panes/Index.svelte'

  page.subscribe(page => {
    $app.topic = unslugify(page.params.topic)
  })
</script>


<div class="mb-10 transition-opacity">
  <TitleInput bind:topic={$app.topic} />
</div>

<div class="space-y-6 mb-6">
  {#if $app.topic}
    <TopicPane />
  {:else}
    <IndexPane />
  {/if}
</div>
