
// Lil' Helpers

export const pluck = (key:string) => (xs:object) => xs[key]


// Async

export async function defer () {
  return new Promise(resolve => setTimeout(resolve, 0))
}

export function debounce (delay:number, λ:Function) {
  let timer:NodeJS.Timeout

  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => λ(...args), delay)
  }
}


// Api Helpers

export function formAsJson (data:FormData):object {
  const obj = {}
  for (const [key, value] of data.entries()) {
    obj[key] = value
  }
  return obj
}

export function getJson<T> (url:string, data:object):Promise<T> {
  const params = new URLSearchParams()

  for (const key in data) {
    params.append(key, data[key])
  }

  return fetch(url + '?' + params.toString(), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }).then(response => response.json())
}

export function postJson<T> (url:string, data:object):Promise<PostResult<T>> {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(result => {
    if (result.error) {
      return { error: true, message: result.message } as PostResult<T>
    } else {
      return { error: false, data: result } as PostResult<T>
    }
  })
  .catch(error => {
    return { error: true, message: error.message } as PostResult<T>
  })
}

export function isError (result:PostResult<any>): result is { error: true, message: string } {
  return result.error
}


// String transformers

export function slugify (text:string):string {
  return text.toLowerCase().replace(/\s+/g, '-')
}

export function unslugify (text:string):string {
  return text.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export function fillPrompt (prompt:string, data:object):string {
  return prompt
    .replace('[[stop]]', '')
    .replace(/{{(.*?)}}/g, (_, key) => data[key.trim()])
}


// Function timing

type Timer = {
  stop: () => number
  ms:   () => string
  s:    () => string
}

export function timer ():Timer {
  let time = performance.now()

  return {
    stop: () =>   performance.now() - time,
    ms:   () =>  (performance.now() - time).toFixed(3) + 'ms',
    s:    () => ((performance.now() - time) / 1000).toFixed(3) + 's',
  }
}


// SQL Helpres

export const nQueries  = (n:number) => `(${ Array(n).fill('?').join(',') })`
export const quotes    = (xs:string) => "'" + xs + "'"
export const formatRow = (xs:any|any[]) => `('${ typeof xs === 'string' ? xs : xs.join("','")}')`


// Date and Time

const M = (t = 1) => t * 60
const H = (t = 1) => 60 * M(t)
const D = (t = 1) => 24 * H(t)

export const unixRelative = (then:UnixTime):string => {
  const now  = Date.now()
  const diff = (now - then * 1000) / 1000

  const date  = new Date(then*1000) // SQL timestamps are in seconds
  const ago   = (t:number) => Math.floor(diff / t)
  const day   = () => date.getDate()
  const month = () => date.toLocaleString('default', { month: 'long' }).toLowerCase()

  if (diff < M(1))       return 'just now'
  if (diff < H(1))       return ago(M()) + 'm ago'
  if (diff < D(1))       return ago(H()) + 'h ago'
  if (diff < D(30))      return ago(D()) + 'd ago'
  if (diff < D(360))     return month()
  if (diff < D(360 * 2)) return 'last year'

  return date.getFullYear().toString()
}

