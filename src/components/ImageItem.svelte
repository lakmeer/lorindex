<script lang="ts">
  import ItemWrapper from '$comp/Item.svelte'

  export let id:       Item['id']
  export let time:     Item['time']
  export let hash:     Item['hash']
  export let desc:     Item['desc']
  export let distance: Item['distance']
  export let content:  Item['content'] = ""
  export let tags:     Item['tags'] = []
  export let data:     Item['data']

  export const type:   Item['type'] = 'image'

  let status : Status = 'done'
</script>


<ItemWrapper type='text' {id} {hash} {desc} {time} {distance} {status} {tags}>
  <div class="block w-full">
    <img src="data:;base64,{data}" alt={desc} class="w-full" />
  </div>
</ItemWrapper>
