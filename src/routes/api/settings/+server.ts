
import type { RequestHandler } from './$types'
import { log } from '$lib/log'
import { KEY_SETTINGS } from '$lib/const'


// Persist settings to cookies

export const POST: RequestHandler = async ({ cookies, request }) => {
  let settings = await request.json()
  log('api/settings', settings)
  cookies.set(KEY_SETTINGS, JSON.stringify(settings), { path: '/' })
  return new Response(JSON.stringify(settings))
}
