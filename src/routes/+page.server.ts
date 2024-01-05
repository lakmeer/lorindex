
import { allItems } from '$lib/server/db'


export async function load ({ locals }) {
  return {
    items: allItems()
  }
}
