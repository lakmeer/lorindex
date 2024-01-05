<script lang="ts">

  let content = '';
  let status:Status = 'done';

</script>


<div class="relative mt-6">
  <button class="absolute right-full top-0 w-4 h-4 mr-2 !mt-1 rounded-full transition-colors"
    class:bg-gray-500={content === ''}
    class:bg-red-500={status === 'modified'}
    class:bg-yellow-500={status === 'pending'}
    class:bg-emerald-500={status === 'done'}
    on:click>
  </button>

  <div
    class="block w-full min-h-[3rem]"
    contenteditable
    bind:textContent={content}>
  </div>
</div>

