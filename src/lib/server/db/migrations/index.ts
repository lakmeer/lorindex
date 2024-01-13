
import { log, info, warn, ok, error } from '$lib/log'
import fs from 'fs'

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

export async function migrate (db:Db) {

  const version = getUserVersion(db)

  let work = false

  for (let migration of migrations) {
    if (migration.version > version) {
      work = true
      info('db/migrate', 'running migration', migration.version, migration.name)

      let success = false

      switch (migration.type) {
        case 'sql':
          try {
            db.exec(migration.query)
            success = true
          } catch (e) {
            error('db/migrate', `migration ${migration.version} failed:`, e.message)
            success = false
          }
          break

        case 'script':
          try {
            success = await migration.script(db)
          } catch (e) {
            error('db/migrate', `migration ${migration.version} failed:`, e.message)
            success = false
          }
          if (!success) error('db/migrate', `migration ${migration.version} failed`)
          break

        default: warn('db/migrate', `unknown migration type: ${migration.type}`)
      }

      if (success) {
        setUserVersion(db, migration.version)
      } else {
        return error('db/migrate', `migration failed`)
      }
    }
  }

  if (work) {
    db.exec(`vacuum`)
    ok('db/migrate', 'done. new version is', getUserVersion(db))
  } else {
    log('db/migrate', `✔ v${version}`)
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

  switch (ext) {
    case 'sql':
      migrations.push({
        type: 'sql',
        version: parseInt(version),
        name: name,
        query: fs.readFileSync(DB_MIGRATIONS_PATH + '/' + file, 'utf-8')
      })
      break

    case 'js':
    case 'ts':
      migrations.push({
        type: 'script',
        version: parseInt(version),
        name: name,
        script: (await import(/* @vite-ignore */ './' + file)).default
      })
      break

    default:
      warn('db/migrations', `unknown migration type: ${ext}`)
  }
}

