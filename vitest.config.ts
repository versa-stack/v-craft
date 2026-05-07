import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    coverage: {
      exclude: [
        'docs/**',
        'tests/**',
        'scripts/**',
        'src/index.ts',
        '*.config.{js,ts}',
        '**/node_modules/**',
        '**/dist/**',
        ''
      ],
    },
  },
})