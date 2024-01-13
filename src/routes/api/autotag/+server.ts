
import type { RequestHandler } from './$types'

import { info, ok } from '$lib/log'
import { getItemById, autotag } from '$db/items'


//
// Automatically generate tags for an item
//

export const POST: RequestHandler = async ({ request }) => {

  let data = await request.json()

  info('api/autotag', `Autotagging item ${data.id}`)

  let content = data.content ?? await getItemById(data.id).content
  let tags = await autotag(data.id, content)

  ok('api/autotag', `${tags.length} new tags generated`)

  return new Response(JSON.stringify(tags), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}


