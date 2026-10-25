import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: [
      'node_modules/**',
      'tests/e2e/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'resources/assets/js/helpers.js',
        'resources/assets/js/store.js',
      ],
      exclude: [
        'node_modules/',
        'resources/assets/js/__tests__/',
      ],
      thresholds: {
        lines: 97,
        statements: 97,
        functions: 97,
        branches: 97,
      },
    },
  },
});