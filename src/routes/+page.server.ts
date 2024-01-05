import { redirect } from '@sveltejs/kit'


// Redirect to topic page (for now)

export async function load () {
  throw redirect(302, '/everything')
}
  
