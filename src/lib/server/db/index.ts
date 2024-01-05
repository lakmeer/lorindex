
import Database from 'better-sqlite3';
import * as VSS from 'sqlite-vss'
import MD5 from 'crypto-js/md5'
import { migrate } from '$lib/server/db/migrations'
import { embed } from '$lib/openai'
import { warn, ok, info } from '$lib/log'

const DB_PATH = ':memory:' // './src/lib/server/db/main.db'


// Functions

export function allItems ():Item[] {
  return db.prepare('select * from items').all()
}

export async function newTextItem (desc:string, content:string, tags:string[] = []) {

  // TODO: Tags

  const hash = 'fakehash_' + Math.floor(Math.random() * 1000)
  const embedding = await embed(desc + " " + content)

  db.prepare(`
    insert into items (type, hash, desc, content) values (?, ?, ?, ?)`)
    .run('text', hash, desc, content)

  db.prepare(`
    insert into vss_items (rowid, embedding) values (?, ?)`)
    .run(db.lastInsertRowid, JSON.stringify(embedding))
}

export async function fill () {

  const items = db.prepare(`
    select * from items where rowid not in (select rowid from vss_items)`)
    .all()

  if (items.length === 0) return ok(`db/fill: all ok`)

  warn(`db/fill: ${items.length} items are missing embeddings`)

  for (const item of items) {
    const embedding = await embed(item.desc + " " + item.content)
    db.prepare(`
      insert into vss_items (rowid, embedding) values (?, ?)`)
      .run(item.id, JSON.stringify(embedding))
  }

  ok(`db/fill: done`)
}

export function rehash () {

  info("db/rehash: recomputing md5 hashes")

  const items = db.prepare(`
    select hash, content from items`)
    .all()

  for (const item of items) {
    const newHash = MD5(item.content).toString()
    if (item.hash === newHash) continue
    info("db/rehash: updating", item.hash, 'to', newHash)
    db.prepare(`
      update items set hash = ? where hash = ?`)
      .run(newHash, item.hash)
  }

  ok("db/rehash: done")
}


// Export instance

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
VSS.load(db)
migrate(db)
fill()


export default db

