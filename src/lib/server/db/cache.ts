
import { warn } from '$lib/log'



// Cache embedding results

export function getCachedEmbedding (db:Db, hash:MD5Hash):Vector|null {
  const embedding = db.prepare(`
    select embedding from embedding_cache where hash = ?`)
    .pluck()
    .get(hash)

  if (embedding) return JSON.parse(embedding) as Vector

  return null
}

export function saveCachedEmbedding (db:Db, hash:MD5Hash, embedding:Vector) {
  let result =  db.prepare(`
    insert or ignore into embedding_cache (hash, embedding) values (?, ?)`)
    .run(hash, JSON.stringify(embedding))

  if (result.changes === 0) warn('db/cache/save', 'attempted to cache existing embedding', hash)
}


// Cache summary text

export function getCachedSummary (db:Db, hash:MD5Hash):string|null {
  const summary = db.prepare(`
    select summary from summary_cache where hash = ?`)
    .pluck()
    .get(hash)

  if (summary) return summary

  return null
}

export function saveCachedSummary (db:Db, hash:MD5Hash, summary:string) {
  let result = db.prepare(`
    insert or ignore into summary_cache (hash, summary) values (?, ?)`)
    .run(hash, summary)

  if (result.changes === 0) warn('db/cache/save', 'attempted to cache existing summary', hash)
}
