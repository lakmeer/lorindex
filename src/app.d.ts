
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

declare type Vector = number[1536]

declare type Item = {
  id: number
  last_update: number
  hash: string
  type: 'text' | 'image' | 'audio' | 'link'
  desc: string
  content: string
  embedding: Vector
  data: Buffer
}


// Database

declare type Migration = {
  version: number
  name: string
  query: string
}

