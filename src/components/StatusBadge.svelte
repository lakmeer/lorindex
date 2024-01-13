<script lang="ts">
  export let status : Status = 'done'
</script>

<span class="block w-4 h-4 rounded-full transition-colors"
  on:click
  class:bg-slate-500={status === 'nothing'}
  class:bg-red-500={status === 'modified'}
  class:bg-yellow-500={status === 'pending'}
  class:bg-emerald-500={status === 'done'}>
</span>
