import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [
    angular(), // This is the engine that handles templateUrl and styleUrls
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,mts,cts,tsx}'], // Focused on TS
    exclude: ['node_modules', 'dist', 'coverage', '**/mocks/**', '**/*.mock.ts'],
    reporters: ['default'],
    coverage: {
      enabled: true,
      reporter: ['html', 'lcov', 'text'],
      provider: 'v8',
    },
    ui: false,
  },
});
