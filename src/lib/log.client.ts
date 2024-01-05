
const SIGIL = '[LRX]'

const WHITE  = 'white'
const GREY   = '#9ca3af'
const RED    = '#ef4444'
const BLUE   = '#60a5fa'
const GREEN  = '#10b981'
const YELLOW = '#facc15'
const PINK   = '#f472b6'
const LIGHT  = '#d1d5db'


function logger (color:string, fore = color) {
  return function (first:string, ...args: any[]) {
    console.log(
      `%c${SIGIL}%c ${first}`,
      `background-color:${color}; color:black`,
      `color: ${fore}`, 
      ...args
    )
  }
}


export const log   = logger(GREY, LIGHT)
export const debug = logger(WHITE)
export const info  = logger(BLUE)
export const warn  = logger(YELLOW)
export const error = logger(RED)
export const ok    = logger(GREEN)
export const ai    = logger(PINK)

