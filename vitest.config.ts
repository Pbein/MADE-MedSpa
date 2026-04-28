import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // server-only throws by design when imported outside a Server Component.
      // Alias to its empty stub for tests so route handlers can be imported.
      'server-only': path.resolve(__dirname, './node_modules/server-only/empty.js'),
    },
  },
});
