
//
// Items Model
//

import MD5 from 'crypto-js/md5'

import * as OpenAi from '$lib/openai'
import { timer, nQueries, quotes, formatRow } from '$lib/utils'
import { warn, ok, info, log, error, debug } from '$lib/log'

import { DEFAULT_LIMIT, DEFAULT_THRESHOLD } from '$lib/const'

import db from '$db/instance'
import { resetTable } from '$db/housework'


//
// Read
//

// Get single item by id

export function getItemById (id:number):Item {
  const item = db.prepare(`
    select items.*, group_concat(tags.tag) as tags from items
    left join item_tags on items.id = item_tags.item_id
    left join tags on item_tags.tag_id = tags.id
    where items.id = ?
    group by items.id;`)
    .get(id) as QueryResult

  return xformItemRowToItem(item)
}


// Get single item by hash

export function getItemByHash (hash:MD5Hash):Item {
  const item = db.prepare(`
    select items.*, group_concat(tags.tag) as tags from items
    left join item_tags on items.id = item_tags.item_id
    left join tags on item_tags.tag_id = tags.id
    where items.hash = ?
    group by items.id;`)
    .get(hash) as QueryResult
  return xformItemRowToItem(item)
}


// Get items without topic correlation

export function allItems (limit:number = DEFAULT_LIMIT):Item[] {
  return db.prepare(`
    select * from items left join (
      select item_tags.item_id, group_concat(tags.tag) as tags
      from item_tags
      join tags on item_tags.tag_id = tags.id
      group by item_tags.item_id
    ) as tags_agg on items.id = tags_agg.item_id
    limit ?`)
    .all(limit)
    .map(xformItemRowToItem)
}


// Get items with correlated topic

export async function getItemsByTopic (topic:string, k = DEFAULT_LIMIT, threshold = DEFAULT_THRESHOLD):Promise<Item[]> {
  info('db/topic', `query ${topic}, (limit ${k}, thresh ${threshold})`)

  const query = await OpenAi.embed(db, topic)

  const items = db.prepare(`
    select items.*, hits.distance, hits.rowid as rowid, tags_agg.tags
    from items
    left join (
      select item_tags.item_id, group_concat(tags.tag) as tags
      from item_tags
      join tags on item_tags.tag_id = tags.id
      group by item_tags.item_id
    ) as tags_agg on items.id = tags_agg.item_id
    join (
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
  const desc      = await OpenAi.summary(db, content)
  const embedding = await OpenAi.embed(db, desc + ' ' + content)

  const { lastInsertRowid } = db.prepare(`
    insert into items (type, hash, desc, content) values (?, ?, ?, ?)`)
    .run('text', hash, desc, content)

  const rowId = lastInsertRowid as number

  db.prepare(`
    insert into vss_items (rowid, embedding) values (?, ?)`)
    .run(rowId, JSON.stringify(embedding))

  addTags(rowId, tags)

  const item = getItemById(rowId)

  ok('db/create-text', `created #${item.id}:${item.hash}`)

  return item
}


// Update an existing item

export async function updateTextItem (id:number, data:Partial<Item>):Promise<Item> {
  info('db/update-text: updating item', id)

  const hash = MD5(data.content).toString()
  const desc = await OpenAi.summary(db, data.content)
  const embedding = await OpenAi.embed(db, desc + ' ' + data.content)

  db.prepare(`
    update items set
      hash = ?,
      desc = ?,
      content = ?
    where id = ?`)
    .run(hash, desc, data.content, id)

  db.prepare(`
    delete from vss_items where rowid = ?;`)
    .run(id)

  db.prepare(`
    insert into vss_items (rowid, embedding) values (?, ?)`)
    .run(id, JSON.stringify(embedding))

  if (data.tags) addTags(id, data.tags)

  return getItemById(id)
}


// New Image Item

export async function createImageItem (data:Base64, desc:string, tags:string[] = []) {
  const hash      = MD5(data).toString()
  // 🔴 TODO: Auto-discover description via image model
  const embedding = await OpenAi.embed(db, desc)

  info('db/create-image', 'creating image item', hash, data.length)

  const { lastInsertRowid } = db.prepare(`
    insert into items (type, hash, desc, data) values (?, ?, ?, ?)`)
    .run('image', hash, desc, data)

  const rowId = lastInsertRowid as number

  db.prepare(`
    insert into vss_items (rowid, embedding) values (?, ?)`)
    .run(rowId, JSON.stringify(embedding))

  addTags(rowId, tags)

  return getItemById(rowId)
}



//
// Tagging
//

// Add new tags

export function addTags (id:number, tags:string[]) {

  if (tags.length === 0) return

  db.prepare(`
    insert or ignore into tags (tag)
    values ${ tags.map(formatRow).join(',')}`)
    .run()

  const newTags = db.prepare(`
    select * from tags
    where tag in ${nQueries(tags.length)};`)
    .all(tags) as { id:number, tag:string }[]

  db.prepare(`
    insert or ignore into item_tags (item_id, tag_id)
    values ${ newTags.map(x => [ id, x.id ]).map(formatRow) }`)
    .run()

  ok('db/add-tags', `added ${tags.length} tags to #${id}`)
}


// Auto-generate tags

export async function autotag (id:number, content:string):Promise<string[]> {
  log('item/autotag', `Generating new tags for ${id}`)
  const tags = await OpenAi.autotag(db, content)
  addTags(id, tags)
  return tags
}


//
// Misc Utils
//

// Get a single distance for a given item and topic

export async function distance (item:Item, topic:string):Promise<number> {
  const query = await OpenAi.embed(db, topic)

  const target = db.prepare(`
    select embedding from vss_items where rowid = ?`)
    .pluck()
    .get(item.id)

  const result = db.prepare(`
    select vss_distance_l2(?, ?)`)
    .pluck()
    .get(JSON.stringify(query), target) as number

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
    distance: row.distance || 1,
    data:     row.data,
    tags:     row.tags?.split(',') || [],
  }
}
