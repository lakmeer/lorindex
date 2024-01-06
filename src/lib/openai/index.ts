
import OpenAI from 'openai'
import MD5 from "crypto-js/md5"
import fs from 'fs'
import { ai, log, info } from '$lib/log'
import { fillPrompt } from '$lib/utils'

import { getCachedEmbedding, saveCachedEmbedding } from '$lib/server/db/cache'

import { OPENAI_API_KEY } from '$env/static/private'

import SUMMARY_PROMPT from '$lib/openai/prompts/summary?raw'

const MIN_TEXT_LENGTH = 20


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


// Summarise a text snippet

export async function summary (text:string):string {

  if (text.length < MIN_TEXT_LENGTH) {
    warn('openai/summary', `text too short: ${text}`)
    return ""
  }

  const hash = MD5(text).toString()
  const time = performance.now()

  const completion = await openai.completions.create({
    model: 'gpt-3.5-turbo-instruct',
    prompt: fillPrompt(SUMMARY_PROMPT, { text }),
    temperature: 0.1,
    max_tokens: 64,
    stop: ['\n', '.'],
  })

  // 🔴 Look for failure cases like 'Unknown topic'

  const summary   = completion.choices[0].text.trim()
  const totalTime = Math.floor(performance.now() - time)/1000
  const tokens    = completion.usage.prompt_tokens + '+' + completion.usage.completion_tokens

  ai('openai/summary', `#${hash.slice(0,8)} -> "${summary}" in ${totalTime}s, ${tokens}tk`)

  return summary
}

