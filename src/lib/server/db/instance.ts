
//
// Creates the database instance to be imported by other modules
//

import Database from 'better-sqlite3'
import * as VSS from 'sqlite-vss'
import fs from 'fs'

import { warn, ok, info, log, error } from '$lib/log'

import { migrate } from '$lib/server/db/migrations'
import { clean, refill, describe } from '$lib/server/db/housework'

import { DB_NAME } from '$env/static/private'


const PROTECT_DB = false
const BACKUP_MODE : 'filesystem' | 'memory' = 'filesystem'

const DB_PATH = `./src/lib/server/db/data/${DB_NAME}.db`


//
// Utils
//

export function total () {
  return db.prepare(`
    select count(*) as count from items`)
    .pluck()
    .get()
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
  info('db/init', 'copying test database to memory')

  //db.pragma('journal_mode = DELETE')
  const buffer = db.serialize()
  db.close()

  db = new Database(buffer)
  //db.pragma('journal_mode = WAL')
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
//db.pragma('journal_mode = WAL')
VSS.load(db)


// In-memory backup (when it works)

if (PROTECT_DB && BACKUP_MODE === 'memory') {
  memoryBackup()
}


// Housework

migrate(db)
clean(db)

await refill(db)
await describe(db)


// Done

info('db/init', 'loaded', total(), 'items')
ok('db/init', 'done')

export default db
