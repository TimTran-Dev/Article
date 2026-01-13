import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.ts'],
    exclude: ['node_modules', 'dist', 'coverage', '**/mocks/**', '**/*.mock.ts'],

    /**
     * Vitest 4 Concurrency Control
     * fileParallelism: false forces tests to run one-by-one.
     * maxWorkers: 1 ensures only a single worker process is created in CI.
     */
    fileParallelism: !process.env.CI,
    maxWorkers: process.env.CI ? 1 : undefined,

    reporters: ['default'],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
    },
  },
});
