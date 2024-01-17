
import MD5 from 'crypto-js/md5'

import { embed, summary } from '$lib/openai'
import { log, info, warn, ok, error } from '$lib/log'


// Check for missing embeddings and fill them in

export async function refill (db:Db) {
  const items = db.prepare(`
    select * from items where rowid not in (select rowid from vss_items)`)
    .all()

  if (items.length === 0) return log(`db/refill`, '✔')

  warn('db/refill', `${items.length} items are missing embeddings`)

  for (const item of items) {
    const embedding = await embed(db, item.desc + ' ' + item.content)
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
    const desc = await summary(db, item.content)

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
    select type,hash,content,data from items`)
    .all()

  for (const item of items) {
    let newHash:string

    switch (item.type) {
      case 'text':  newHash = MD5(item.content).toString(); break;
      case 'image': newHash = MD5(item.data).toString(); break;
      default: error('db/rehash', `unknown item type '${item.type}'`); continue;
    }
   
    if (item.hash === newHash) continue

    info('db/rehash', `#${item.hash} -> #${newHash}`)

    db.prepare(`
      update items set hash = ? where hash = ?`)
      .run(newHash, item.hash)
  }

  ok('db/rehash', 'done')
}


// Reset: Empty a whole table and reset the autoincrement counter

export function resetTable (db:Db, table:string) {
  warn('db/reset', `clearing table '${table}'`)
  db.prepare(`delete from ${table}`).run()
  db.prepare(`delete from sqlite_sequence where name = ?`).run(table)
  ok('db/reset', 'done')
}

