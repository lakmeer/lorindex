
import OpenAI from 'openai'
import MD5 from "crypto-js/md5"
import fs from 'fs'

import { ai, log, info, warn } from '$lib/log'
import { fillPrompt, slugify, timer } from '$lib/utils'
import { getCachedEmbedding, saveCachedEmbedding } from '$lib/server/db/cache'
import { getCachedSummary, saveCachedSummary } from '$lib/server/db/cache'

import { OPENAI_API_KEY } from '$env/static/private'

import SUMMARY_PROMPT from '$lib/openai/prompts/summary?raw'
import AUTOTAG_PROMPT from '$lib/openai/prompts/autotag?raw'

const { min } = Math

const MIN_TEXT_LENGTH = 20
const MAX_AUTOTAGS    = 5


// Global State

const openai = new OpenAI({ apiKey: OPENAI_API_KEY })


// Embed new text

export async function embed (db:Db, text:string):Promise<Vector> {
  const hash = MD5(text).toString()

  let embedding = getCachedEmbedding(db, hash)

  if (embedding) {
    log('openai/embed', `${hash} is cached`)
    return embedding
  }

  const t = timer()

  ai('openai/embed', `embedding ${hash}...`)

  embedding = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
    encoding_format: 'float',
  })

  saveCachedEmbedding(db, hash, embedding.data[0].embedding)

  ai('openai/embed', `done in ${t.s()}`)

  return embedding.data[0].embedding
}


// Summarise a text snippet

export async function summary (db:Db, text:string):Promise<string> {

  if (text.length < MIN_TEXT_LENGTH) {
    warn('openai/summary', `text too short: ${text}`)
    return ""
  }

  const hash = MD5(text).toString()
  const t = timer()

  let summary = getCachedSummary(db, hash)

  if (summary) {
    log('openai/summary', `${hash} is cached`)
    return summary
  }

  const completion = await openai.completions.create({
    model: 'gpt-3.5-turbo-instruct',
    prompt: fillPrompt(SUMMARY_PROMPT, { text }),
    temperature: 0.1,
    max_tokens: 64,
    stop: ['\n', '.'],
  })

  // 🔴 Look for failure cases like 'Unknown topic'

  summary = completion.choices[0].text.trim()

  saveCachedSummary(db, hash, summary)

  const totalTime = t.s()
  const tokens    = completion.usage.prompt_tokens + '+' + completion.usage.completion_tokens

  ai('openai/summary', `#${hash.slice(0,8)} -> "${summary}" in ${totalTime}, ${tokens}tk`)

  return summary
}


// Auto-generate tags for a text snippet

export async function autotag (db:Db, text:string):Promise<string[]> {

  if (text.length < MIN_TEXT_LENGTH) {
    warn('openai/autotag', `text too short: ${text}`)
    return []
  }

  const t = timer()

  const completion = await openai.completions.create({
    model: 'gpt-3.5-turbo-instruct',
    prompt: fillPrompt(AUTOTAG_PROMPT, { text }),
    temperature: 0.1,
    max_tokens: 64,
    stop: ['\n\n', '###'],
  })

  const tagString = completion.choices[0].text.trim()

  const tags = tagString.split('\n')
    .map(tag => tag.trim())
    .map(it => it.replace('#', ''))
    .map(slugify)

  const totalTime = t.s()
  const tokens    = completion.usage.prompt_tokens + '+' + completion.usage.completion_tokens

  ai('openai/autotag', `generated ${tags.length} tags in ${totalTime} ${tokens}tk`)

  return tags.slice(0, MAX_AUTOTAGS)
}

