
// SvelteKit App

declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
}


// External Modules

declare module 'better-sqlite3'


// Domain Objects

declare type UnixTime = number
declare type MD5Hash  = string
declare type Vector   = number[1536]

declare type Item = {
  id:   number
  time: UnixTime
  hash: MD5Hash
  type: 'text' | 'image' | 'audio' | 'link'
  desc: string
  content?: string
  data?: Buffer
  distance: number
}


// Database

declare type Migration = {
  version: number
  name: string
  query: string
}

declare type ItemRow = {
  id: number
  last_update: number
  hash: string
  type: 'text' | 'image' | 'audio' | 'link'
  desc: string
  content: string
  embedding: Vector
  data: Buffer
}


// Other

declare type Status = 'modified' | 'pending' | 'done'

declare type PostResult<T> = { error: true, message: string } | { error: false, data: T }

