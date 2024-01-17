
import db from '$db/instance'

import { ok } from '$lib/log'
import { migrate } from '$db/migrations'
import { clean, rehash, refill, describe, resetTable } from '$db/housework'


// Housework

await migrate(db)
await clean(db)
await rehash(db)
await refill(db)
await describe(db)

let count = db.prepare(`
  select count(*) as count from items`)
  .pluck()
  .get()

ok('db/init', `loaded ${count} items`)


// Done

export default db
