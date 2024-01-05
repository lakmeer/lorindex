import { redirect } from '@sveltejs/kit'


// Redirect to topic page (for now)
//
// 🔴 Create index generator

export async function load () {
  throw redirect(302, '/Everything')
}
  
