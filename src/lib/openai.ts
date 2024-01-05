
import OpenAI from 'openai'
import MD5 from "crypto-js/md5"
import fs from 'fs'
import { ai, log } from '$lib/log'

import { getCachedEmbedding, saveCachedEmbedding } from '$lib/server/db'

import { OPENAI_API_KEY } from '$env/static/private'


// Global State

const openai = new OpenAI({ apiKey: OPENAI_API_KEY })


// Embed new text

export async function embed (text:string):Vector {
  const hash = MD5(text).toString()

  let embedding = getCachedEmbedding(hash)

  if (embedding) {
    log('openai/embed', `${hash} is cached`)
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


// Generate description of text

export async function describe (text:string):string {
  const hash = MD5(text).toString()

  const time = performance.now()

  ai('openai/describe', `describing ${hash}...`)

  const description = await openai.completions.create({
    engine: 'davinci-text-003',
    prompt: `This is a description of a text snippet.\n\nText: ${text}\n\nDescription:`,
    temperature: 0.1,
    max_tokens: 64,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ['\n'],
  })

  ai('openai/describe', `done in ${Math.floor(performance.now() - time)/1000} seconds`)

  return description.data.choices[0].text.trim()
}
