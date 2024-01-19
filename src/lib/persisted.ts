
import { browser } from '$app/environment'
import { writable, type Writable } from 'svelte/store';
import { info, warn } from '$lib/log.client'


//
// LocalStorage persisted stores
//

export type Persisted<T> = Writable<T>

export function persisted<T> (key:string, revision:number, defaultValue:T): Persisted<T> {
  let store:Writable<T> = writable(defaultValue)

  if (browser) {
    const currentVersion = parseInt(localStorage.getItem(key + '_rev') ?? '0')

    if (currentVersion < revision) {
      warn(key, `Revision ${currentVersion} is out of date - applying v${revision} defaults`)
      localStorage.setItem(key + '_rev', revision.toString())
      store.set(defaultValue)
    } else {
      info(key, `loaded v${revision}`)
      store.set(JSON.parse(localStorage.getItem(key) ?? 'null') ?? defaultValue)
    }
  }

  store.subscribe((state) => {
    if (browser) {
      localStorage.setItem(key, JSON.stringify(state))
    }
  })

  return store
}
