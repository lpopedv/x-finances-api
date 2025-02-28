import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		include: ['src/**/*.test.ts'],
		coverage: {
			reporter: ['text'],
		},
		poolOptions: {
			forks: {
				singleFork: true,
			},
			threads: {
				minThreads: 1,
				maxThreads: 1,
			},
		},
	},
	plugins: [tsconfigPaths()],
})
