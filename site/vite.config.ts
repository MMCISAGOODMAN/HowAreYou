import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const root = fileURLToPath(new URL('.', import.meta.url))

function copy404AndProfiles() {
  return {
    name: 'copy-404-and-profiles',
    closeBundle() {
      const index = resolve(root, 'dist/index.html')
      if (existsSync(index)) {
        copyFileSync(index, resolve(root, 'dist/404.html'))
      }
      execFileSync(process.execPath, [resolve(root, 'scripts/write-profile-html.mjs')], {
        stdio: 'inherit',
      })
    },
  }
}

export default defineConfig({
  base: '/HowAreYou/',
  plugins: [react(), copy404AndProfiles()],
})
