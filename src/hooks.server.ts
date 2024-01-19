
import db from '$db'

import { unslugify } from '$lib/utils'
import { info } from '$lib/log'
import { redirect } from '@sveltejs/kit'

import { DB_NAME } from '$env/static/private'


/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const query = event.url.searchParams

  event.locals.db       = DB_NAME
  event.locals.topic    = unslugify(event.params.topic ?? '' as string)
  event.locals.query    = query.get('query') || ''
  event.locals.tags     = query.has('tags') ? query.get('tags').split(',') : []
  event.locals.type     = query.get('type') || ''

  return resolve(event)
}
