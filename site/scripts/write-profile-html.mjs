import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')
const indexPath = join(dist, 'index.html')
const dataPath = join(root, 'src/data/profiles.json')

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function main() {
  if (!existsSync(indexPath) || !existsSync(dataPath)) return
  const index = readFileSync(indexPath, 'utf8')
  const profiles = JSON.parse(readFileSync(dataPath, 'utf8'))
  if (!Array.isArray(profiles)) return

  for (const profile of profiles) {
    const title = escapeHtml((profile.headline || `@${profile.id}`).replace(/\s+/g, ' ').slice(0, 80))
    const desc = escapeHtml(
      (profile.message || profile.current || '开发者把真实状态写在这里。').replace(/\s+/g, ' ').slice(0, 160),
    )
    let html = index
      .replace(/<title>[^<]*<\/title>/, `<title>${title} · How Are You</title>`)
      .replace(/property="og:title" content="[^"]*"/, `property="og:title" content="${title} · How Are You"`)
      .replace(/name="twitter:title" content="[^"]*"/, `name="twitter:title" content="${title} · How Are You"`)
      .replace(/name="description" content="[^"]*"/, `name="description" content="${desc}"`)
      .replace(/property="og:description" content="[^"]*"/, `property="og:description" content="${desc}"`)
      .replace(/name="twitter:description" content="[^"]*"/, `name="twitter:description" content="${desc}"`)

    const dir = join(dist, 'p', profile.id)
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'index.html'), html)
  }
  console.log(`Wrote ${profiles.length} profile HTML stub(s)`)
}

main()
