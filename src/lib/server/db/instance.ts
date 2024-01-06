
//
// Creates the database instance to be imported by other modules
//

import Database from 'better-sqlite3'
import * as VSS from 'sqlite-vss'
import fs from 'fs'

import { warn, ok, info, log, error } from '$lib/log'
import { migrate } from '$lib/server/db/migrations'
import { embed, summary } from '$lib/openai'

import { DB_NAME } from '$env/static/private'


const PROTECT_DB = false
const BACKUP_MODE : 'filesystem' | 'memory' = 'filesystem'

const DB_PATH = `./src/lib/server/db/data/${DB_NAME}.db`


//
// Utils
//

// Count items

export function total () {
  return db.prepare(`
    select count(*) as count from items`)
    .pluck()
    .get()
}


// Check for missing embeddings and fill them in

export async function refill () {
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

export async function clean () {
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

export async function describe () {
  const items = db.prepare(`
    select * from items where desc is null`)
    .all()

  if (items.length === 0) return log('db/describe', '✔')

  warn('db/describe', `${items.length} items are missing descriptions`)

  for (const item of items) {
    log('db/describe', item)
    const desc = await summary(item.content)

    db.prepare(`
      update items set desc = ? where id = ?`)
      .run(desc, item.id)
  }

  ok('db/describe', 'done')
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


function filesystemBackup () {
  if (PROTECT_DB) {
    if (fs.existsSync(DB_PATH + '.backup')) {
      warn('db/init', 'restoring test database from backup')
      fs.copyFileSync(DB_PATH + '.backup', DB_PATH)
    } else {
      warn('db/init', 'creating test database backup')
      fs.copyFileSync(DB_PATH, DB_PATH + '.backup')
    }
  }
}

function memoryBackup () {

  // 🔴 Currently doesnt work

  info('db/init', 'copying test database to memory')

  const buffer = db.serialize()
  db.close()

  db = new Database(buffer)
  db.pragma('journal_mode = WAL')
  VSS.load(db)

}



//
// Init Procedure
//

// Check that target exists

if (!fs.existsSync(DB_PATH)) {
  warn('db/init', `database '${DB_NAME}' not found at ${DB_PATH}`)
  warn('db/init', 'a new one will be created')
}


// Create or restore transient backup

if (PROTECT_DB && BACKUP_MODE === 'filesystem') {
  filesystemBackup()
}


// Create and configure

info('db/init', `loading database '${DB_NAME}'`)

let db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
VSS.load(db)


// In-memory backup (when it works)

if (PROTECT_DB && BACKUP_MODE === 'memory') {
  memoryBackup()
}


info('db/init', 'loaded', total(), 'items')


// Housework

migrate(db)
clean()

await refill()
await describe()

ok('db/init', 'done')

export default db
