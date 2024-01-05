<script lang="ts">
  export let time:     Item['time']
  export let type:     Item['type']
  export let hash:     Item['hash']
  export let desc:     Item['desc']
  export let distance: Item['distance']

  export let status : Status = 'done'
</script>


<div class="relative w-full min-h-[8rem]">
  <div class="
    absolute right-full top-0 z-10
    w-aside h-full p-4 space-y-2
    mr-8 xl:mr-16 text-right
    bg-slate-300 border-r border-slate-500">

    <div class="flex justify-end items-center">
      <code class="text-xs bg-slate-200 text-slate-500 px-2 py-1 rounded">{hash}</code>

      <span class="w-4 h-4 ml-2 rounded-full transition-colors"
        class:bg-slate-500={status === 'nothing'}
        class:bg-red-500={status === 'modified'}
        class:bg-yellow-500={status === 'pending'}
        class:bg-emerald-500={status === 'done'}>
      </span>
    </div>

    <div class="text-sm my-3"> <strong>{desc}</strong> </div>
    <div class="text-xs"> <strong>Updated At:</strong> {time} </div>
    <div class="text-xs"> <strong>Distance:</strong> {distance.toFixed(3)} </div>
  </div>

  <slot />
</div>

