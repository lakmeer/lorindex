
import { allItems, topicItems, updateTextItem } from '$lib/server/db'

import { info, log, ok } from '$lib/log'


export async function load ({ locals, request }) {

  let items:Item[] = []

  if (!locals.topic) locals.topic = 'Everything'

  if (locals.topic === 'Everything') {
    items = await allItems()
  } else {
    items = await topicItems(locals.topic, 4)
  }

  return {
    topic: locals.topic,
    items
  }
}


export const actions = {

	topic: async ({ locals, request }) => {
		const data = await request.formData();

    info('req/topic:', data.get('topic'))

    locals.topic = data.get('topic')
	},

  update: async ({ locals, request }) => {
    const data = await request.formData();

    const id      = parseInt(data.get('id'))
    const hash    = data.get('hash')
    const desc    = data.get('desc')
    const content = data.get('content')

    info('req/update:', hash)

    updateTextItem(id, { desc, content })
  },

	create: async ({ locals, request }) => {
		const data = await request.formData();
    info('req/create:', data)
	}

};

