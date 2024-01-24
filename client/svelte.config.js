import adapter from '@sveltejs/adapter-node';
import preprocess from "svelte-preprocess";
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		// add preprocessor to process vite
		vitePreprocess(),
		// add preprocessor to process postcss
		preprocess({
			postcss: true,
		}),
	],
	kit: {
		adapter: adapter({ out: 'build' })
	}
};

export default config;
