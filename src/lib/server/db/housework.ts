
import type { Database } from 'better-sqlite3'
type Db = typeof Database

import { embed, summary } from '$lib/openai'
import { log } from '$lib/log'


// Check for missing embeddings and fill them in

export async function refill (db:Db) {
  const items = db.prepare(`
    select * from items where rowid not in (select rowid from vss_items)`)
    .all()

  if (items.length === 0) return log(`db/refill`, '✔')

  warn('db/refill', `${items.length} items are missing embeddings`)

  for (const item of items) {
    const embedding = await embed(item.desc + ' ' + item.content)
    db.prepare(`
      insert into vss_items (rowid, embedding) values (?, ?)`)
      .run(item.id, JSON.stringify(embedding))
  }

  ok('db/refill', 'done')
}


// Check for orphaned embeddings

export async function clean (db:Db) {
  const orphanIds = db.prepare(`
    select rowid from vss_items where rowid not in (select id from items)`)
    .pluck()
    .all()

  if (orphanIds.length === 0) return log(`db/clean`, '✔')

  warn('db/clean', `${orphanIds.length} orphaned embeddings`)

  for (const id of orphanIds) {
    db.prepare(`
      delete from vss_items where rowid = ?`)
      .run(id)
  }

  ok('db/clean', 'done')
}


// Check for missing description and fill them in

export async function describe (db:Db) {
  const items = db.prepare(`
    select * from items where desc is null`)
    .all()

  if (items.length === 0) return log('db/describe', '✔')

  warn('db/describe', `${items.length} items are missing descriptions`)

  for (const item of items) {
    log('db/describe', 'resummarizing', item)
    console.log(summarize)
    const desc = await summarize(item.content)

    db.prepare(`
      update items set desc = ? where id = ?`)
      .run(desc, item.id)
  }

  ok('db/describe', 'done')
}


// Recompute content hashes

export function rehash (db:Db) {
  info('db/rehash', 'recomputing md5 hashes')

  const items = db.prepare(`
    select hash, content from items`)
    .all()

  for (const item of items) {
    const newHash = MD5(item.content).toString()
    if (item.hash === newHash) continue
    info('db/rehash', `#${item.hash} -> #${newHash}`)
    db.prepare(`
      update items set hash = ? where hash = ?`)
      .run(newHash, item.hash)
  }

  ok('db/rehash', 'done')
}

