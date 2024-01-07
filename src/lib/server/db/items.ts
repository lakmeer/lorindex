
//
// Items Model
//

import MD5 from 'crypto-js/md5'

import { embed, summarize }     from '$lib/openai'
import { warn, ok, info, log, error } from '$lib/log'
import db from '$lib/server/db/instance'

import { DEFAULT_LIMIT, DEFAULT_THRESHOLD } from '$lib/const'



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

export async function getItemsByTopic (topic:string, k = DEFAULT_LIMIT, threshold = DEFAULT_THRESHOLD):Promise<Item[]> {
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
  const desc      = await summarize(content)
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

  // 🔴 Work out whether desc needs to be recalculated

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
// Misc Utils
//

// Get a single distance for a given item and topic

export async function distance (item:Item, topic:string):Promise<number> {
  const query = await embed(topic)

  const target = db.prepare(`
    select embedding from vss_items where rowid = ?`)
    .pluck()
    .get(item.id)

  const result = db.prepare(`
    select vss_distance_l2(?, ?)`)
    .pluck()
    .get(JSON.stringify(query), target)

  return result ?? 1
}


//
// Xforms
//

export function xformItemRowToItem (row:QueryResult):Item {
  return {
    id:       row.id,
    time:     row.last_update,
    type:     row.type,
    hash:     row.hash,
    desc:     row.desc,
    content:  row.content,
    distance: row.distance || 1
    //tags: row.tags,
  }
}
