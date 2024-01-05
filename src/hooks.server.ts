
import db from '$lib/server/db'

import { DEFAULT_LIMIT, DEFAULT_THRESHOLD, KEY_SETTINGS } from '$lib/const'

import { info } from '$lib/log'

const defaultSettings:Settings = {
  limit:     DEFAULT_LIMIT,
  threshold: DEFAULT_THRESHOLD
}


/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  if (!event.cookies.get(KEY_SETTINGS)) {
    info('hooks', 'No settings found, setting defaults')
    event.cookies.set(KEY_SETTINGS, JSON.stringify(defaultSettings), { path: '/' })
  } else {
    info('hooks', 'Settings found:', event.cookies.get(KEY_SETTINGS))
  }

  event.locals.db       = db
  event.locals.topic    = event.params.topic ?? ''
  event.locals.settings = JSON.parse(event.cookies.get(KEY_SETTINGS)) as Settings

  const response = await resolve(event)
  return response
}
