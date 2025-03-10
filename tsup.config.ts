import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/server.ts'],
	format: ['esm', 'cjs'],
	minify: true,
	sourcemap: false,
	clean: true,
	dts: true,
	target: 'node22',
})
