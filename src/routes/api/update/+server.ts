
import type { RequestHandler } from './$types'

import { info, ok } from '$lib/log'
import { updateTextItem } from '$lib/server/db/items'


//
// Update a text item
//

export const POST: RequestHandler = async ({ request }) => {

  let data = await request.json()

  info('api/update', data.id, data.hash)

  let item = await updateTextItem(data.id, {
    desc:    data.desc,
    content: data.content
  })

  ok('api/update', `${data.hash} -> ${item.hash}`)

  return new Response(JSON.stringify(item), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}


