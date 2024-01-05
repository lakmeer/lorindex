
import db from '$lib/server/db'


// OpenAI embeddings

import OpenAI from 'openai'
import { OPENAI_API_KEY } from '$env/static/private'

console.log(OPENAI_API_KEY)


//const openai = new OpenAI(OPENAI_API_KEY)




/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const response = await resolve(event)
  return response
}
