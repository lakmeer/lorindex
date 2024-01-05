
import Database from 'better-sqlite3'
import * as VSS from 'sqlite-vss'
import MD5 from 'crypto-js/md5'

import { migrate }            from '$lib/server/db/migrations'
import { embed }              from '$lib/openai'
import { warn, ok, info, log, error }from '$lib/log'
import { xformItemRowToItem } from '$lib/server/db/xform'

import { DEFAULT_LIMIT, DEFAULT_THRESHOLD } from '$lib/const'

const DB_PATH = ':memory:' // './src/lib/server/db/main.db'


//
// Read
//

// Get items without topic correlation

export function allItems (limit:number = DEFAULT_LIMIT):Item[] {
  return db.prepare(`
    select * from items limit ?`)
    .all(limit)
    .map(xformItemRowToItem)
}


// Get items with correlated topic

export async function topicItems (topic:string, k = DEFAULT_LIMIT, threshold = DEFAULT_THRESHOLD):Promise<Item[]> {
  info('db/topic', `query ${topic}, (limit ${k}, thresh ${threshold})`)

  const query = await embed(topic)

  const items = db.prepare(`
    select items.*, hits.distance, hits.rowid as rowid from items join (
      select rowid, distance
      from vss_items
      where vss_search(embedding, ?)
      limit ?
    ) as hits on items.rowid = hits.rowid and hits.distance <= ?;`)
    .all(JSON.stringify(query), k, threshold)

  ok('db/topic', topic, '-', items.length, 'items')

  return items.map(xformItemRowToItem)
}


//
// Write
//

// New Text Item

export async function createTextItem (content:string, tags:string[] = []) {
  const hash      = MD5(content).toString()
  const desc      = 'TODO: Auto-description'
  const embedding = await embed(desc + ' ' + content)

  // 🔴 Tags

  const { lastInsertRowid } = db.prepare(`
    insert into items (type, hash, desc, content) values (?, ?, ?, ?)`)
    .run('text', hash, desc, content)

  db.prepare(`
    insert into vss_items (rowid, embedding) values (?, ?)`)
    .run(lastInsertRowid, JSON.stringify(embedding))

  const item = db.prepare(`
    select * from items where id = ?`)
    .get(lastInsertRowid)

  ok('db/create', `created #${item.id}:${item.hash}`)

  return xformItemRowToItem(item)
}


// Update an existing item

export async function updateTextItem (id:number, data:Partial<Item>):Promise<Item> {
  info('db/update: updating item', id)

  const hash = MD5(data.content).toString()
  const embedding = await embed(data.desc + ' ' + data.content)

  db.prepare(`
    update items set
      hash = ?,
      desc = ?,
      content = ?
    where id = ?`)
    .run(hash, data.desc, data.content, id)

  db.prepare(`
    delete from vss_items where rowid = ?;`)
    .run(id)

  db.prepare(`
    insert into vss_items (rowid, embedding) values (?, ?)`)
    .run(id, JSON.stringify(embedding))

  const item = db.prepare(`
    select * from items where id = ?`)
    .get(id)

  return xformItemRowToItem(item)
}


//
// Utils
//

// Check for missing embeddings and fill them in

export async function refill () {
  const items = db.prepare(`
    select * from items where rowid not in (select rowid from vss_items)`)
    .all()

  if (items.length === 0) return ok(`db/refill: all ok`)

  warn('db/refill', `${items.length} items are missing embeddings`)

  for (const item of items) {
    const embedding = await embed(item.desc + ' ' + item.content)
    db.prepare(`
      insert into vss_items (rowid, embedding) values (?, ?)`)
      .run(item.id, JSON.stringify(embedding))
  }

  ok('db/refill', 'done')
}


// Recompute content hashes

export function rehash () {
  info('db/rehash', 'recomputing md5 hashes')

  const items = db.prepare(`
    select hash, content from items`)
    .all()

  for (const item of items) {
    const newHash = MD5(item.content).toString()
    if (item.hash === newHash) continue
    info('db/rehash', `${item.hash} -> ${newHash}`)
    db.prepare(`
      update items set hash = ? where hash = ?`)
      .run(newHash, item.hash)
  }

  ok('db/rehash', 'done')
}

// Get a single distance for a given item and topic

export async function distance (item:Item, topic:string):Promise<number> {
  const query = await embed(topic)

  const result = db.prepare(`
    select rowid, distance from vss_items
    where vss_search(embedding, ?) and rowid = ?
    limit 1`)
    .get(JSON.stringify(query), item.id)

  if (!result) error('db/distance', `no result for #${item.id}:${item.hash} from '${topic}'`)

  return result?.distance ?? 1
}


// Export instance

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
VSS.load(db)
migrate(db)
refill()

export default db

