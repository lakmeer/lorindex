
//
// Add image data to the test database
//

import fs from 'fs'
import { createImageItem } from '$db/items'
import { info, debug, log, ok, warn, error } from '$lib/log'

const path = (file:string) => './src/lib/server/db/data/' + file

const TEST_DATA = [
  { file: 'panther.webp',   desc: 'A black panther in the wild',    tags: ['panther', 'big-cat'] },
  { file: 'raspberry.webp', desc: 'A ripe red raspberry',           tags: ['raspberry', 'fruit'] },
  { file: 'violin.webp',    desc: 'A violin on a white tablecloth', tags: ['violin', 'instrument'] },
]

export default async function (db:Db):Promise<boolean> {

  info('migration/005', "Loading test images into database")

  for (const { file, desc, tags } of TEST_DATA) {
    const imageData = fs.readFileSync(path(file)).toString('base64')

    log('migration/005', file, desc, tags, imageData.length)

    try {
      await createImageItem(imageData, desc, tags)
    } catch (e) {
      error('migration/005', e.message)
      //return false
    }
  }

  ok('migration/005', "Test images loaded")

  return true

}
