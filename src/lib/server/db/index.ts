
import db from '$db/instance'

import { migrate } from '$db/migrations'
import { clean, refill, describe, resetTable } from '$db/housework'


// Housework

await migrate(db)
await clean(db)
await refill(db)
await describe(db)


// Done

export default db
