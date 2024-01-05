
import fs from 'fs'
import CsvStream from 'csv-reader'

import { ok, info, log, warn, error } from '$lib/log'

const SOURCE = './src/lib/server/db/data/lore_rows.csv'
const TARGET = './src/lib/server/db/data/longbridge.json'


export function fromCsv () {

  let inStream = fs.createReadStream(SOURCE, 'utf8')

  let rows = []

  inStream
    .pipe(new CsvStream({ 
      asObject: true,
      parseNumbers: true,
      parseBooleans: true,
      trim: true
    }))
    .on('data', (row) => {
      rows.push({
        id: row.id,
        content: row.text,
        embedding: JSON.parse(row.embedding),
      })
    })
    .on('end', () => {
      info('csv', rows.length, 'rows extracted')

      fs.writeFileSync(TARGET, JSON.stringify(rows, null, 2))

      ok('csv', 'done')
    })
}

export function loadFromJson (target) {

  info('csv', 'looking for json', target)

  const TARGET = `./src/lib/server/db/data/${target}.json`

  if (!fs.existsSync(TARGET)) {
    error('csv', 'file not found', TARGET)
    return
  }

  info('csv', 'loading from', TARGET)

  let rows = JSON.parse(fs.readFileSync(TARGET, 'utf8'))

  info('csv', rows.length, 'rows loaded')

  return rows
}

