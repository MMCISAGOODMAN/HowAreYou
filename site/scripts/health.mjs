#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = fileURLToPath(new URL('../..', import.meta.url))
const SAMPLE_IDS = new Set(['cors-afternoon', 'three-months'])
const USERNAME_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/

const problems = []
const warnings = []

function add(list, msg) {
  list.push(msg)
}

const required = ['TEMPLATE.md', 'CONTRIBUTING.md', 'README.md']
for (const file of required) {
  if (!existsSync(join(repoRoot, file))) add(problems, `缺少文件：${file}`)
}

const readme = existsSync(join(repoRoot, 'README.md')) ? readFileSync(join(repoRoot, 'README.md'), 'utf8') : ''
const contributing = existsSync(join(repoRoot, 'CONTRIBUTING.md'))
  ? readFileSync(join(repoRoot, 'CONTRIBUTING.md'), 'utf8')
  : ''
const docs = `${readme}\n${contributing}`

for (const match of docs.matchAll(/\]\((?!https?:)([^)]+)\)/g)) {
  const target = match[1].split('#')[0]
  if (!target) continue
  if (target.startsWith('mailto:')) continue
  const path = join(repoRoot, target)
  if (!existsSync(path)) add(problems, `断链：${target}`)
}

const profilesDir = join(repoRoot, 'profiles')
let files = []
if (existsSync(profilesDir)) {
  files = readdirSync(profilesDir).filter((name) => name.endsWith('.md'))
}

for (const name of files) {
  if (!name.startsWith('@')) {
    add(problems, `文件名应以 @ 开头：profiles/${name}`)
    continue
  }
  const id = name.slice(1, -3)
  if (!USERNAME_RE.test(id)) {
    add(problems, `GitHub ID 不合法：profiles/${name}`)
  }
}

async function checkUsers() {
  const token = process.env.GITHUB_TOKEN
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'how-are-you-health',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (token) headers.Authorization = `Bearer ${token}`

  for (const name of files) {
    if (!name.startsWith('@') || !name.endsWith('.md')) continue
    const id = name.slice(1, -3)
    if (SAMPLE_IDS.has(id)) continue
    if (!USERNAME_RE.test(id)) continue
    const res = await fetch(`https://api.github.com/users/${id}`, { headers })
    if (res.status === 404) add(warnings, `GitHub 上找不到用户：@${id}`)
    else if (!res.ok) add(warnings, `查询 @${id} 失败：HTTP ${res.status}`)
  }
}

function printReport() {
  if (problems.length) {
    console.error('失效检查未通过：')
    for (const p of problems) console.error(`- ${p}`)
  }
  if (warnings.length) {
    console.warn('警告：')
    for (const w of warnings) console.warn(`- ${w}`)
  }
  if (!problems.length && !warnings.length) console.log('仓库看起来健康。')
}

async function upsertHealthIssue() {
  const repo = process.env.GITHUB_REPOSITORY
  const token = process.env.GITHUB_TOKEN
  if (!repo || !token) return

  const [owner, name] = repo.split('/')
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'how-are-you-health',
  }

  const labelsList = await fetch(`https://api.github.com/repos/${owner}/${name}/labels?per_page=100`, { headers })
  const labels = labelsList.ok ? await labelsList.json() : []
  if (Array.isArray(labels) && !labels.some((l) => l.name === 'health')) {
    await fetch(`https://api.github.com/repos/${owner}/${name}/labels`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'health', color: '6f6456', description: '仓库巡检' }),
    })
  }
  const q = encodeURIComponent(`repo:${repo} is:issue label:health in:title 仓库健康检查`)
  const search = await fetch(`https://api.github.com/search/issues?q=${q}`, { headers })
  const data = search.ok ? await search.json() : { items: [] }
  const existing = data.items?.[0]
  const body = ['自动巡检结果。', '', ...problems.map((p) => `- [ ] ${p}`), ...warnings.map((w) => `- [ ] （警告）${w}`)].join(
    '\n',
  )
  const hasFail = problems.length > 0 || warnings.length > 0

  if (hasFail && existing) {
    await fetch(`https://api.github.com/repos/${owner}/${name}/issues/${existing.number}`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: 'open', body }),
    })
  } else if (hasFail) {
    await fetch(`https://api.github.com/repos/${owner}/${name}/issues`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '仓库健康检查', labels: ['health'], body }),
    })
  } else if (existing && existing.state === 'open') {
    await fetch(`https://api.github.com/repos/${owner}/${name}/issues/${existing.number}`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: 'closed', body: '最近一次巡检已通过。' }),
    })
  }
}

await checkUsers()
printReport()
await upsertHealthIssue()
if (problems.length) process.exit(1)
