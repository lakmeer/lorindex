import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
    alias: {
      '$db':     './src/lib/server/db/',
      '$comp':   './src/components/',
      '$panes':  './src/panes/',
      '$stores': './src/stores/',
    }
	}
}
