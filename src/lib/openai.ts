
import OpenAI from 'openai'
import MD5 from "crypto-js/md5"
import fs from 'fs'
import { ai } from '$lib/log'

import { getCachedEmbedding, saveCachedEmbedding } from '$lib/server/db'

import { OPENAI_API_KEY } from '$env/static/private'



// Global State

const openai = new OpenAI({ apiKey: OPENAI_API_KEY })


// Functions

export async function embed (text:string):Vector {
  const hash = MD5(text).toString()

  let embedding = getCachedEmbedding(hash)

  if (embedding) {
    ai('openai/embed', `${hash} is cached`)
    return embedding
  }

  const time = performance.now()

  ai('openai/embed', `embedding ${hash}...`)

  embedding = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
    encoding_format: 'float',
  })

  saveCachedEmbedding(hash, embedding.data[0].embedding)

  ai('openai/embed', `done in ${Math.floor(performance.now() - time)/1000} seconds`)

  return embedding.data[0].embedding
}

