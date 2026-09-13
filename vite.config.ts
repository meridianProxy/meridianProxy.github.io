import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  /* relative asset paths so the build works from any URL,
     including https://user.github.io/repo/ */
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    watch: {
      /* Vite bundles this config into a sibling `.vite.config.ts.<pid>.<hash>.tmpdir`
         on every reload. On Windows that temp file is still locked when chokidar
         calls watch() → EBUSY, which is fatal to the dev server. Ignore it. */
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/.vite.config.*.tmpdir/**',
        '**/*.tmpdir/**',
      ],
    },
  },
})
