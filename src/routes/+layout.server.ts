
export async function load ({ locals }) {
  return {
    topic: locals.topic,
    settings: locals.settings
  }
}
