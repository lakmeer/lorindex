
import type { RequestHandler } from './$types'

import { discoverTopics } from '$db/items'


// Generate topic index

export const GET: RequestHandler = async ({ url }) => {
  const topics = await discoverTopics()
  return new Response(JSON.stringify(topics))
}
