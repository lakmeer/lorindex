
import db from '$lib/server/db'


/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {

  event.locals.db = db
  event.locals.topic = event.params.topic ?? ''

  const response = await resolve(event)
  return response
}
