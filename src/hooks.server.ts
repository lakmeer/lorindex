
import db, { allItems, newTextItem } from '$lib/server/db'


/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {

  event.locals = {
    db: db
  }

  const response = await resolve(event)
  return response
}
