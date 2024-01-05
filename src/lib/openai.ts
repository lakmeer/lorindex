
import OpenAI from 'openai'
import MD5 from "crypto-js/md5";
import fs from 'fs'
import { ai } from '$lib/log'

import { OPENAI_API_KEY } from '$env/static/private'

console.log(MD5("Message").toString());


// Global State

const openai = new OpenAI({ apiKey: OPENAI_API_KEY })


// Memo cache

const MEMO_FILE = './src/lib/server/db/memo.json'

if (!fs.existsSync(MEMO_FILE)) {
  fs.writeFileSync(MEMO_FILE, '{}')
}

const memo:Record<string,Vector> = JSON.parse(fs.readFileSync(MEMO_FILE, 'utf8'))

function addMemo (hash:string, embedding:Vector) {
  memo[hash] = embedding
  fs.writeFileSync(MEMO_FILE, JSON.stringify(memo))
}


// Functions

export async function embed (text:string):Vector {
  const hash = MD5(text).toString()

  if (memo[hash]) {
    ai(`openai/embed: ${hash} is cached`)
    return memo[hash]
  }

  const time = performance.now()

  ai(`openai/embed: embedding ${hash}...`)

  const embedding = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
    encoding_format: 'float',
  });

  addMemo(hash, embedding.data[0].embedding)

  ai(`openai/embed: done in ${Math.floor(performance.now() - time)/1000} seconds`)

  return embedding.data[0].embedding
}

