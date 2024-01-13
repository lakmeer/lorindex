import type { Database } from 'better-sqlite3'

export {}

declare global {

  // SvelteKit App

  namespace App {
    interface Locals {
      db: string
      topic: string
      settings: Settings
    }

    // interface PageData {}
    // interface Error {}
    // interface Platform {}
  }


  // External Modules

  module 'better-sqlite3'
  type Db = typeof Database


  // Domain Objects

  type UnixTime = number
  type MD5Hash  = string
  type Vector   = number[1536]
  type Base64   = string

  type Item = {
    id:   number
    time: UnixTime
    hash: MD5Hash
    type: 'text' | 'image' | 'audio' | 'link'
    desc: string
    content?: string
    data: Buffer
    distance: number
    tags: string[]
  }

  type Settings = {
    limit: number
    threshold: number
  }


  // Database

  type Migration = {
    type: string
    version: number
    name: string
    query?: string
    script?: (db:Db) => Promise<boolean>
  }

  type ItemRow = {
    id: number
    last_update: number
    hash: string
    type: 'text' | 'image' | 'audio' | 'link'
    desc: string
    content: string
    embedding: Vector
    data: Buffer
    tags: string[]
  }

  type QueryResult = ItemRow & {
    distance?: number
    tags: string
  }


  // Other

  type Status = 'modified' | 'pending' | 'done' | 'nothing'

  type PostResult<T> = { error: true, message: string } | { error: false, data: T }
}

