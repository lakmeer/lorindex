
type St = Writable<Status>

import { get } from 'svelte/store'
import { sleep, getJson, postJson } from '$lib/utils'
import { log, ok, warn, error, info } from '$lib/log.client'

import app from '$stores/app'


//
// Api Helpers
//

export async function index (status:St) {
  const $app = get(app)
  log('api/index')
  status.set('pending')
  const index = await getJson('/api/index/')
  status.set('done')
  ok('api/index', index)
  return index
}

export async function getItemsForTopic (status:St, topic:string) {
  const $app = get(app)
  log('api/topics', topic, $app.settings.limit, $app.settings.threshold)
  status.set('pending')
  const items  = await getJson('/api/topic/', { topic, limit: $app.settings.limit, threshold: $app.settings.threshold })
  status.set('done')
  ok('api/topic')
  return items
}

