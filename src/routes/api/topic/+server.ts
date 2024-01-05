
import type { RequestHandler } from './$types'

import { allItems, topicItems } from '$lib/server/db'
import { unslugify }            from '$lib/utils'
import { log }                  from '$lib/log'


// Get top k items relating to a topic

export const GET: RequestHandler = async ({ url }) => {

  const params = Object.fromEntries(url.searchParams)

  const topic     = unslugify(params.topic      ?? "")
  const limit     = parseInt(params.limit       ?? '5')
  const threshold = parseFloat(params.threshold ?? '0.5')

  log('api/topic', `${topic || '[NO TOPIC]'} (limit ${limit}, thresh ${threshold})`)

  let items = (topic === '') ? allItems(limit) : await topicItems(topic, limit, threshold)

  return new Response(JSON.stringify(items))
}



