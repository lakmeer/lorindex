
import type { RequestHandler } from './$types'

import { info, ok } from '$lib/log'
import { updateTextItem, autotag } from '$lib/server/db/items'


//
// Reprocess a text item
//

export const POST: RequestHandler = async ({ request }) => {

  let data = await request.json()

  info('api/reprocess', `Reprocessing item ${data.id}`)

  let tags = await autotag(data.id, data.content)

  ok('api/reprocess', `${tags.length} new tags generated`)

  return new Response(JSON.stringify(tags), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}


