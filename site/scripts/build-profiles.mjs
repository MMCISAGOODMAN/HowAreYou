/*
 * build-profiles.mjs
 *
 * Created on 2026-09-03
 *
 * Copyright (C) 2026 Volkswagen AG, All rights reserved.
 */

import {execFileSync} from 'node:child_process'
import {mkdirSync, readdirSync, readFileSync, writeFileSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(__dirname, '../..')
const profilesDir = join(repoRoot, 'profiles')
const outFile = join(__dirname, '../src/data/profiles.json')

const CURRENT_YEAR = 2026

function sectionKey(heading) {
    const h = heading.replace(/^[^\w\u4e00-\u9fff]+/, '').trim()
    if (/我是|I am\b|^About\b/i.test(h)) {
        return 'headline'
    }
    if (/入行时间|Started|Start year|Year (I )?started/i.test(h)) {
        return 'startedAt'
    }
    if (/当前状态|Current status|Right now/i.test(h)) {
        return 'current'
    }
    if (/业余|Side projects|After hours/i.test(h)) {
        return 'side'
    }
    if (/小成就|small (win|achievement)|Recent win/i.test(h)) {
        return 'achievement'
    }
    if (/小困惑|stuck|Recent struggle/i.test(h)) {
        return 'struggle'
    }
    if (/想对路过|passers-by|Note for|Message to/i.test(h)) {
        return 'message'
    }
    if (/彩蛋|Easter egg/i.test(h)) {
        return 'easterEgg'
    }
    return null
}

function clean(text) {
  return text
    .replace(/^>\s*示例：.*$/gm, '')
    .replace(/^>\s*Example:.*$/gim, '')
    .replace(/^>\s*$/gm, '')
    .replace(/^\s*\[[^\]]+\]\s*$/gm, '')
    .replace(/^---\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function isFilled(text) {
  return clean(text).length > 0
}

function parseYear(startedAt) {
  const yearMatch = startedAt.match(/\b((?:19|20)\d{2})\b/)
  if (yearMatch) return Number(yearMatch[1])
  if (/入行第\s*\d+\s*个?月/.test(startedAt)) return CURRENT_YEAR
  return null
}

function parseSections(markdown) {
  const fields = {
    headline: '',
    startedAt: '',
    current: '',
    side: '',
    achievement: '',
    struggle: '',
    message: '',
    easterEgg: '',
  }

  const parts = markdown.split(/^##\s+/m)
  for (const part of parts) {
    const nl = part.indexOf('\n')
    const heading = (nl === -1 ? part : part.slice(0, nl)).trim()
    const body = nl === -1 ? '' : part.slice(nl + 1)
    const key = sectionKey(heading)
    if (key) fields[key] = clean(body)
  }

  return fields
}

function commitYears(filename) {
  try {
    const out = execFileSync(
      'git',
      ['log', '--follow', '--format=%ad', '--date=format:%Y', '--', join('profiles', filename)],
      { encoding: 'utf8', cwd: repoRoot, stdio: ['ignore', 'pipe', 'ignore'] },
    )
    const years = [
      ...new Set(
        out
          .split('\n')
          .map((y) => y.trim())
          .filter((y) => /^(19|20)\d{2}$/.test(y))
          .map(Number),
      ),
    ].sort()
    return years
  } catch {
    return []
  }
}

function stillHere(years) {
  if (years.length >= 2) return true
  if (years.length === 0) return false
  const earliest = Math.min(...years)
  return earliest < CURRENT_YEAR && years.includes(CURRENT_YEAR)
}

async function fetchSawMeta() {
  const repo = process.env.GITHUB_REPOSITORY || 'MMCISAGOODMAN/HowAreYou'
  const token = process.env.GITHUB_TOKEN
  /** @type {Record<string, { count: number, url: string | null }>} */
  const meta = {}
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'how-are-you-build',
  }
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    const url = `https://api.github.com/repos/${repo}/issues?labels=saw&state=open&per_page=100`
    const res = await fetch(url, { headers })
    if (!res.ok) return meta
    const issues = await res.json()
    if (!Array.isArray(issues)) return meta
    for (const issue of issues) {
      const match = String(issue.title || '').match(/看见了\s+@([A-Za-z0-9-]+)/)
      if (!match) continue
      meta[match[1]] = {
        count: Number(issue.reactions?.eyes ?? 0),
        url: issue.html_url || null,
      }
    }
  } catch {
    return meta
  }
  return meta
}

function parseProfile(filename, markdown, sawMeta) {
  const id = filename.replace(/^@/, '').replace(/\.md$/, '')
  const fields = parseSections(markdown)
  const year = parseYear(fields.startedAt)
  const yearsExperience = year === null ? null : CURRENT_YEAR - year
  const years = commitYears(filename)
  const saw = sawMeta[id] || { count: 0, url: null }

  return {
    id,
    headline: fields.headline,
    startedAt: fields.startedAt,
    year,
    yearsExperience,
    current: fields.current,
    side: fields.side,
    achievement: fields.achievement,
    struggle: fields.struggle,
    message: fields.message,
    easterEgg: fields.easterEgg,
    hasAchievement: isFilled(fields.achievement),
    hasStruggle: isFilled(fields.struggle),
    badges: {
      first: true,
      stillHere: stillHere(years),
    },
    updatedYears: years,
    sawCount: saw.count,
    sawIssueUrl: saw.url,
  }
}

async function main() {
  let files = []
  try {
    files = readdirSync(profilesDir).filter((name) => name.startsWith('@') && name.endsWith('.md'))
  } catch {
    files = []
  }

  const sawMeta = await fetchSawMeta()
  const profiles = files
    .map((name) => parseProfile(name, readFileSync(join(profilesDir, name), 'utf8'), sawMeta))
    .sort((a, b) => a.id.localeCompare(b.id, 'en'))

  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(outFile, `${JSON.stringify(profiles, null, 2)}\n`)
  writeStats(profiles)
  updateReadmeBadges(profiles)
  updateReadmeContributors(profiles)
  console.log(`Wrote ${profiles.length} profile(s) to ${outFile}`)
}

function computeStats(profiles) {
  if (profiles.length === 0) {
    return { count: '--', avgYears: '--', stuck: '--', loving: '--' }
  }
  const exps = profiles.map((p) => p.yearsExperience).filter((n) => n !== null)
  const avg =
    exps.length === 0
      ? '--'
      : String(Math.round((exps.reduce((a, b) => a + b, 0) / exps.length) * 10) / 10)
  return {
    count: String(profiles.length),
    avgYears: avg,
    stuck: String(profiles.filter((p) => p.hasStruggle).length),
    loving: String(profiles.filter((p) => p.badges.stillHere || p.hasAchievement).length),
  }
}

function badgeImg(label, message, color) {
  const src = `https://img.shields.io/static/v1?label=${encodeURIComponent(label)}&message=${encodeURIComponent(message)}&color=${color}`
  return `![${label}](${src})`
}

function writeStats(profiles) {
  const stats = computeStats(profiles)
  const publicDir = join(__dirname, '../public')
  mkdirSync(publicDir, { recursive: true })
  writeFileSync(join(publicDir, 'stats.json'), `${JSON.stringify(stats, null, 2)}\n`)
}

function updateReadmeBadges(profiles) {
  const readmePath = join(repoRoot, 'README.md')
  const readme = readFileSync(readmePath, 'utf8')
  const stats = computeStats(profiles)
  const block = [
    '<!-- stats-badges:start -->',
    badgeImg('参与者', `${stats.count} 位`, '0ea5e9'),
    badgeImg('平均入行', `${stats.avgYears} 年`, '6366f1'),
    badgeImg('最近有点卡住', `${stats.stuck} 人`, 'f59e0b'),
    badgeImg('还在热爱', `${stats.loving} 人`, '10b981'),
    '<!-- stats-badges:end -->',
  ].join('\n')

  const next = readme.includes('<!-- stats-badges:start -->')
    ? readme.replace(/<!-- stats-badges:start -->[\s\S]*?<!-- stats-badges:end -->/, block)
    : readme.replace(
        /!\[参与者\][^\n]*\n!\[平均入行\][^\n]*\n!\[正在被卡住\][^\n]*\n!\[还在热爱\][^\n]*/,
        block,
      )

  if (next !== readme) {
    writeFileSync(readmePath, next)
    console.log('Updated README stats badges')
  }
}

const SAMPLE_IDS = new Set(['cors-afternoon', 'three-months'])

function updateReadmeContributors(profiles) {
  const readmePath = join(repoRoot, 'README.md')
  const readme = readFileSync(readmePath, 'utf8')
  const people = profiles.filter((p) => !SAMPLE_IDS.has(p.id))
  const samples = profiles.filter((p) => SAMPLE_IDS.has(p.id))

  let inner
  if (people.length === 0 && samples.length === 0) {
    inner = `<p align="center">\n  <sub>还没有人。这很好：说明你来得正好。</sub>\n</p>`
  } else {
    const avatars = (list) =>
      list
        .map(
          (p) =>
            `<a href="https://github.com/${p.id}" title="@${p.id}"><img src="https://avatars.githubusercontent.com/${p.id}?s=96" width="48" height="48" alt="@${p.id}" /></a>`,
        )
        .join('\n  ')
    const parts = []
    if (people.length) {
      parts.push(`<p align="center">\n  ${avatars(people)}\n</p>`)
      parts.push(
        `<p align="center">\n  ${people.map((p) => `[@${p.id}](https://github.com/${p.id})`).join(' · ')}\n</p>`,
      )
    }
    if (samples.length) {
      parts.push(
        `<p align="center">\n  <sub>氛围示例（可删）：${samples.map((p) => `@${p.id}`).join(' · ')}</sub>\n</p>`,
      )
    }
    inner = parts.join('\n')
  }

  const block = `<!-- contributors:start -->\n${inner}\n<!-- contributors:end -->`
  if (!readme.includes('<!-- contributors:start -->')) {
    console.warn('README missing contributors markers; skip')
    return
  }
  const next = readme.replace(/<!-- contributors:start -->[\s\S]*?<!-- contributors:end -->/, block)
  if (next !== readme) {
    writeFileSync(readmePath, next)
    console.log('Updated README contributors')
  }
}

main()
