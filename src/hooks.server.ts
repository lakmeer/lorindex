
import db from '$lib/server/db'

import { DEFAULT_LIMIT, DEFAULT_THRESHOLD, KEY_SETTINGS } from '$lib/const'

import { unslugify } from '$lib/utils'
import { info } from '$lib/log'

const defaultSettings:Settings = {
  limit:     DEFAULT_LIMIT,
  threshold: DEFAULT_THRESHOLD
}


/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  if (!event.cookies.get(KEY_SETTINGS)) {
    info('hooks', 'No settings found, persisting defaults')
    event.cookies.set(KEY_SETTINGS, JSON.stringify(defaultSettings), { path: '/' })
  }

  event.locals.db       = db
  event.locals.topic    = unslugify(event.params.topic ?? '')
  event.locals.settings = JSON.parse(event.cookies.get(KEY_SETTINGS)) as Settings

  return resolve(event)
}
