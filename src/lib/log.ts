
import * as Colors from 'colors'

const SIGIL = '[LRX]'

export function log (...args: any[]) {
  console.log(Colors.grey.inverse(SIGIL), ...args)
}

export function debug (...args: any[]) {
  console.log(Colors.brightWhite.inverse(SIGIL), ...args)
}

export function info (...args: any[]) {
  console.log(Colors.blue.inverse(SIGIL), ...args)
}

export function warn (...args: any[]) {
  console.log(Colors.yellow.inverse(SIGIL), ...args)
}

export function error (...args: any[]) {
  console.log(Colors.red.inverse(SIGIL), ...args)
}

export function ok (...args: any[]) {
  console.log(Colors.green.inverse(SIGIL), ...args)
}

export function ai (...args: any[]) {
  console.log(Colors.magenta.inverse(SIGIL), ...args)
}

