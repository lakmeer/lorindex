export const prerender = false


export async function load ({ locals }) {
  return {
    db:       locals.db,
    settings: locals.settings,
    state: {
      topic: locals.topic,
      query: locals.query,
      tags:  locals.tags,
      type:  locals.type,
      items: []
    }
  }
}
