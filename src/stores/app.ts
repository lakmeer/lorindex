
import { persisted } from '$lib/persisted'
import { type Writable } from 'svelte/store'

import { slugify, unslugify } from '$lib/utils'

import { DEFAULT_LIMIT, DEFAULT_THRESHOLD, KEY_APP_STATE } from '$lib/const'

const STATE_REVISION = 1


//
// App State
//

export default persisted(KEY_APP_STATE, STATE_REVISION, {
  state: {
    topic: '',
    query: '',
    index: [],
    tags:  [],
    items: [],
  },
  settings: {
    limit: DEFAULT_LIMIT,
    threshold: DEFAULT_THRESHOLD,
  }
})
