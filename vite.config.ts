import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // Configure reporters
    reporters: ['default'],
    // Enable code coverage with the --coverage flag
    coverage: {
      enabled: true,
      reporter: ['html', 'lcov', 'text'],
    },
    // Use the Vitest UI for interactive testing (requires @vitest/ui package)
    ui: false,
  },
});
