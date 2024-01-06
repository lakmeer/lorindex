
import type { RequestHandler } from './$types'

import { log, ok } from '$lib/log'
import { createTextItem, distance } from '$lib/server/db/items'


//
// Create a new text item
//

export const POST: RequestHandler = async ({ request }) => {

  let data = await request.json()

  let item = await createTextItem(data.content)

  if (data.topic) {
    item.distance = await distance(item, data.topic)
  }

  ok('api/create', `#${item.id}:${item.hash}`)

  return new Response(JSON.stringify(item), {
    headers: {
      'Content-Type': 'application/json'
    }
  })

}



