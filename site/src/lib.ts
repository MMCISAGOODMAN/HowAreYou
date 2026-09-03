import type { FilterId, Profile } from './types'

type Highlight = { kind: 'struggle' | 'achievement'; text: string }

function sameMeaning(a: string, b: string) {
  return a.replace(/\s+/g, '') === b.replace(/\s+/g, '')
}

function pickShorter(a: Highlight, b: Highlight): Highlight {
  if (a.text.length === b.text.length) return a.kind === 'struggle' ? a : b
  return a.text.length <= b.text.length ? a : b
}

/** 卡片上成就/困惑二选一：跟当前筛选对齐；否则取更短、且不重复标题的那句。 */
export function cardHighlight(profile: Profile, filter: FilterId = 'all'): Highlight | null {
  const struggle: Highlight | null =
    profile.hasStruggle && profile.struggle ? { kind: 'struggle', text: profile.struggle } : null
  const achievement: Highlight | null =
    profile.hasAchievement && profile.achievement
      ? { kind: 'achievement', text: profile.achievement }
      : null

  if (filter === 'stuck' && struggle) return struggle
  if (filter === 'achievement' && achievement) return achievement

  const candidates = [struggle, achievement].filter((item): item is Highlight => {
    if (!item) return false
    if (profile.headline && sameMeaning(item.text, profile.headline)) return false
    return true
  })

  if (candidates.length === 0) {
    if (filter === 'stuck') return struggle
    if (filter === 'achievement') return achievement
    return struggle ?? achievement
  }
  if (candidates.length === 1) return candidates[0]
  return pickShorter(candidates[0], candidates[1])
}

export function matchesFilter(profile: Profile, filter: FilterId): boolean {
  switch (filter) {
    case 'all':
      return true
    case 'newcomer':
      return profile.yearsExperience !== null && profile.yearsExperience < 2
    case 'veteran':
      return profile.yearsExperience !== null && profile.yearsExperience >= 2
    case 'achievement':
      return profile.hasAchievement
    case 'stuck':
      return profile.hasStruggle
  }
}

export function matchesQuery(profile: Profile, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const hay = [
    profile.id,
    profile.headline,
    profile.current,
    profile.achievement,
    profile.struggle,
  ]
    .join('\n')
    .toLowerCase()
  return hay.includes(q)
}

export function filterProfiles(profiles: Profile[], filter: FilterId, query: string): Profile[] {
  return profiles.filter((p) => matchesFilter(p, filter) && matchesQuery(p, query))
}

export function statsFrom(profiles: Profile[]) {
  if (profiles.length === 0) {
    return {
      count: '--',
      earliestYear: '--',
      stuck: '--',
      achievements: '--',
    }
  }

  const years = profiles.map((p) => p.year).filter((y): y is number => y !== null)
  const earliest = years.length ? Math.min(...years) : null

  return {
    count: String(profiles.length),
    earliestYear: earliest === null ? '--' : String(earliest),
    stuck: String(profiles.filter((p) => p.hasStruggle).length),
    achievements: String(profiles.filter((p) => p.hasAchievement).length),
  }
}
