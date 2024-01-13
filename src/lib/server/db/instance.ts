
//
// Creates the database instance to be imported by other modules
//

import Database from 'better-sqlite3'
import * as VSS from 'sqlite-vss'
import fs from 'fs'

import { warn, ok, info, log, error, debug } from '$lib/log'
import { defer } from '$lib/utils'

import { migrate } from '$lib/server/db/migrations'
import { clean, refill, describe } from '$lib/server/db/housework'

import { DB_NAME, FREEZE_MODE } from '$env/static/private'

const DB_FREEZE = false
const DB_PATH   = `./src/lib/server/db/data/${DB_NAME}.db`
const DB_VERBOSE = false


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
  if (DB_FREEZE) {
    if (fs.existsSync(DB_PATH + '.backup')) {
      warn('db/init/freeze', 'restoring database from backup')
      fs.copyFileSync(DB_PATH + '.backup', DB_PATH)
    } else {
      warn('db/init/freeze', 'creating database backup')
      fs.copyFileSync(DB_PATH, DB_PATH + '.backup')
    }
  }
}

function memoryBackup () {
  warn('db/init/freeze', 'copying database to memory')

  db.pragma('journal_mode = DELETE')
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


// Create and configure

info('db/init', `loading database '${DB_NAME}'`)

if (DB_FREEZE && FREEZE_MODE === 'filesystem') filesystemBackup()

let db = new Database(DB_PATH, DB_VERBOSE ? { verbose: (...args) => debug('db/sqlite', ...args) } : {})
db.pragma('journal_mode = WAL')
VSS.load(db)

if (DB_FREEZE && FREEZE_MODE === 'memory') memoryBackup()


// Housework

migrate(db)
clean(db)

await refill(db)
await describe(db)


// Done

log('db/init', `loaded ${total()} items`)
ok('db/init', 'done')

export default db
