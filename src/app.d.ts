import type { Database } from 'better-sqlite3'

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

  type Item = {
    id:   number
    time: UnixTime
    hash: MD5Hash
    type: 'text' | 'image' | 'audio' | 'link'
    desc: string
    content?: string
    data?: Buffer
    distance: number
  }

  type Settings = {
    limit: number
    threshold: number
  }


  // Database

  type Migration = {
    version: number
    name: string
    query: string
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
  }

  type QueryResult = ItemRow & {
    distance?: number
  }


  // Other

  type Status = 'modified' | 'pending' | 'done' | 'nothing'

  type PostResult<T> = { error: true, message: string } | { error: false, data: T }
}

