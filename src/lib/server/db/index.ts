
import Database from 'better-sqlite3';
import * as VSS from 'sqlite-vss'
import { runMigrations } from '$lib/server/db/migrations'

const DB_PATH = './src/lib/server/db/main.db'


// New DB Connection

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
VSS.load(db)
runMigrations(db)


// Export

export default db
