
import type { Database } from 'better-sqlite3'
import { log, info, warn, ok } from '$lib/log'
import fs from 'fs'

type Db = typeof Database

const DB_MIGRATIONS_PATH = './src/lib/server/db/migrations'


// Functions

export function getUserVersion (db:Db) {
  return db.prepare(`pragma user_version`).get().user_version
}

export function setUserVersion (db:Db, version:number) {
  return db.exec(`pragma user_version = ${version}`)
}

export function getMigrations () {
  return migrations
}

export function migrate (db:Db) {

  const version = getUserVersion(db)

  let work = false

  log('db/migrate', 'current version is', version)

  for (let migration of migrations) {
    if (migration.version > version) {
      work = true
      info('db/migrate', 'running migration', migration.version, migration.name)
      db.exec(migration.query)
      setUserVersion(db, migration.version)
    }
  }

  if (work) {
    db.exec(`vacuum`)
    ok('db/migrate', 'done. new version is', getUserVersion(db))
  }
}

export function refresh (db:Db) {
  info('db/refresh', 'starting...')

  const tables = db.prepare("select name from sqlite_master where type is 'table'").pluck().all()

  for (let table of tables) {
    if (table === 'sqlite_sequence') continue

    try {
      db.exec(`drop table if exists ${table};`)
    } catch (e) {
      warn('db/refresh', `failed to drop table ${table}:`, e.message)
    }
  }

  setUserVersion(db, 0)
  db.exec(`vacuum`)

  info('db/refresh', 'done')
}


// Global State

const migrations:Migration[] = []

for (const file of fs.readdirSync(DB_MIGRATIONS_PATH)) {
  const [ version, name, ext ] = file.split('.')

  if (ext !== 'sql') continue

  migrations.push({
    version: parseInt(version),
    name: name,
    query: fs.readFileSync(DB_MIGRATIONS_PATH + '/' + file, 'utf-8')
  })
}

