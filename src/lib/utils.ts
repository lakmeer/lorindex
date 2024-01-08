
export function formAsJson (data:FormData):object {
  const obj = {}
  for (const [key, value] of data.entries()) {
    obj[key] = value
  }
  return obj
}


export function debounce (delay:number, λ:Function) {
  let timer:NodeJS.Timeout

  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => λ(...args), delay)
  }
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

export async function defer () {
  return new Promise(resolve => setTimeout(resolve, 0))
}

