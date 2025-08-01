import adapter from '@sveltejs/adapter-netlify';

const config = {
	kit: {
		adapter: adapter(),
		paths: {
			base: ''
		}
	}
};

export default config;