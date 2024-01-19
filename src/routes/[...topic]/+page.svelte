<script lang="ts">

  import app from '$stores/app'

  import TitleInput from '$comp/TitleInput.svelte'
  import TopicPane from '$panes/Topic.svelte'
  import IndexPane from '$panes/Index.svelte'


  //🔴 Unify url scheme
  //
  // - /                   Topic index
  // - /<topic>            Show topic results
  // - /#tags              Any items with matching tags
  // - /<topic>#tags       Filter topic items by tags
  // - /<topic>!type       Filter topic items by type
  // - /?question          Results of an assistant question
  // - /<topic>?question   Topic items, plus results of question           




</script>


<div class="mb-10 transition-opacity">
  <TitleInput topic={$app.topic || 'Table of Contents'} />
</div>

<div class="space-y-6 mb-6">
  {#if $app.topic}
    <TopicPane topic={$app.topic} />
  {:else}
    <IndexPane />
  {/if}
</div>

