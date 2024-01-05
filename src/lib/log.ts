
import * as Colors from 'colors'

const SIGIL = '[LRX]'

export function log (...args: any[]) {
  console.log(Colors.grey.inverse(SIGIL), ...args)
}

export function debug (first:string, ...args: any[]) {
  console.log(Colors.white.inverse(SIGIL), Colors.white(first),...args)
}

export function info (first:string, ...args: any[]) {
  console.log(Colors.blue.inverse(SIGIL), Colors.blue(first), ...args)
}

export function warn (first:string, ...args: any[]) {
  console.log(Colors.yellow.inverse(SIGIL), Colors.yellow(first), ...args)
}

export function error (first:string, ...args: any[]) {
  console.log(Colors.red.inverse(SIGIL), Colors.red(first), ...args)
}

export function ok (first:string, ...args: any[]) {
  console.log(Colors.green.inverse(SIGIL), Colors.green(first), ...args)
}

export function ai (first:string, ...args: any[]) {
  console.log(Colors.magenta.inverse(SIGIL), Colors.magenta(first), ...args)
}

