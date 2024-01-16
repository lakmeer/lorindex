
import db from '$db/instance'

console.log("Root", db)

import { allItems } from '$db/items'







export async function load (context) {

  return { 
    items: await allItems()
  }
}
