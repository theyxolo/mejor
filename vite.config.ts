import path from 'path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
// eslint-disable-next-line import/no-unresolved
import macrosPlugin from 'vite-plugin-babel-macros'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

export default defineConfig({
	plugins: [
		react(),
		eslint(),
		// Used for 'styled-components/macro'
		macrosPlugin(),
	],
	define: {
		__APP_VERSION__: JSON.stringify(process.env.npm_package_version),
	},
	resolve: {
		alias: {
			process: 'process/browser',
			global: path.resolve(__dirname, './src/global'),
			GlobalStyled: path.resolve(__dirname, './src/GlobalStyled'),
			components: path.resolve(__dirname, './src/components'),
			containers: path.resolve(__dirname, './src/containers'),
			modules: path.resolve(__dirname, './src/modules'),
			lib: path.resolve(__dirname, './src/lib'),
			assets: path.resolve(__dirname, './src/assets'),
		},
	},
	optimizeDeps: {
		esbuildOptions: {
			define: {
				global: 'globalThis',
			},
			plugins: [NodeGlobalsPolyfillPlugin({ buffer: true }) as any],
		},
	},
	build: {
		manifest: true,
		sourcemap: true,
		rollupOptions: {
			plugins: [rollupNodePolyFill({ exclude: ['fs'] })],
		},
	},
})
