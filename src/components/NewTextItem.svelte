<script lang="ts">
  import Item from '$comp/Item.svelte'

  let content = ''
  let status:Status = 'nothing'
</script>


<Item type='text' hash="00000000000000000000000000000000"
  desc="New Item"
  time={0}
  distance={1} {status}>

  <div
    class="border border-slate-400 block w-full min-h-[3rem]"
    contenteditable
    bind:textContent={content}>
  </div>
</Item>

