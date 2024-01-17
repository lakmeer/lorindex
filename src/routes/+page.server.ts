
import db from '$db/instance'
import { allItems, discoverTopics } from '$db/items'


export async function load (context) {
  return { 
    topics: await discoverTopics()
  }
}
