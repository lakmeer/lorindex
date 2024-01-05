
import type { Database } from 'better-sqlite3'
import { log, info, warn, error, ok } from '$lib/log'
import fs from 'fs'

const DB_MIGRATIONS_PATH = './src/lib/server/db/migrations'


// Types

export type Migration = {
  version: number
  name: string
  query: string
}


// Functions

export function getUserVersion (db:Database) {
  return db.prepare(`pragma user_version`).get().user_version
}

export function setUserVersion (db:Database, version:number) {
  return db.exec(`pragma user_version = ${version}`)
}

export function getMigrations () {
  return migrations
}

export function runMigrations (db:Database) {

  const version = getUserVersion(db)
  const lastMigration = migrations[migrations.length - 1].version

  let work = false

  log('runMigrations: current version is', version)

  for (let migration of migrations) {
    if (migration.version > version) {
      work = true
      info('runMigrations: running migration', migration.version, migration.name)
      db.exec(migration.query)
      setUserVersion(db, migration.version)
    }
  }

  if (work) {
    db.exec(`vacuum`)
    ok('runMigrations: done. new version is', getUserVersion(db))
  }
}

export function refresh (db:Database) {
  info('refresh: starting...')

  const tables = db.prepare("select name from sqlite_master where type is 'table'").pluck().all()

  for (let table of tables) {
    if (table === 'sqlite_sequence') continue

    try {
      db.exec(`drop table if exists ${table};`)
    } catch (e) {
      warn(`failed to drop table ${table}:`, e.message)
    }
  }

  setUserVersion(db, 0)
  db.exec(`vacuum`)

  info('refresh: done')
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

