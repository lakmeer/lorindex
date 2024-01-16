export const prerender = false

export async function load ({ locals }) {
  return {
    db:       locals.db,
    topic:    locals.topic,
    settings: locals.settings
  }
}
