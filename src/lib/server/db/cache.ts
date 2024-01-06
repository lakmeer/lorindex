
import { warn } from '$lib/log'

import db from '$lib/server/db/instance'


// Cache embedding results

export function getCachedEmbedding (hash:string):Vector|null {
  const embedding = db.prepare(`
    select embedding from embedding_cache where hash = ?`)
    .pluck()
    .get(hash)

  if (embedding) return JSON.parse(embedding) as Vector

  return null
}

export function saveCachedEmbedding (hash:string, embedding:Vector) {
  let result =  db.prepare(`
    insert or ignore into embedding_cache (hash, embedding) values (?, ?)`)
    .run(hash, JSON.stringify(embedding))

  if (result.changes === 0) warn('db/cache/save', 'attempted to cache existing embedding', hash)
}


// Cache summary text


