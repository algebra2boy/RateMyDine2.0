import adapter from '@sveltejs/adapter-node';
import preprocess from "svelte-preprocess";
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		// add preprocessor to process vite
		vitePreprocess(),
		// add preprocessor to process postcss
		preprocess({
			postcss: {
				configFilePath: join(__dirname, 'postcss.config.js')
			},
		}),
	],
	kit: {
		adapter: adapter({ out: 'build' })
	}
};

export default config;
