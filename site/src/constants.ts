/*
 * constants.ts
 *
 * Created on 2026-09-03
 *
 * Copyright (C) 2026 Volkswagen AG, All rights reserved.
 */

export const REPO_URL = 'https://github.com/MMCISAGOODMAN/HowAreYou'
export const CONTRIBUTING_URL = `${REPO_URL}/blob/master/CONTRIBUTING.md`
export const CONTRIBUTING_EN_URL = `${REPO_URL}/blob/master/CONTRIBUTING.en.md`
export const TEMPLATE_URL = `${REPO_URL}/blob/master/TEMPLATE.md`
export const TEMPLATE_EN_URL = `${REPO_URL}/blob/master/TEMPLATE.en.md`
export const SITE_URL = 'https://MMCISAGOODMAN.github.io/HowAreYou/'
export const CURRENT_YEAR = 2026
export const PAGE_SIZE = 24

export function contributingUrl(locale: 'zh' | 'en') {
    return locale === 'en' ? CONTRIBUTING_EN_URL : CONTRIBUTING_URL
}

export function templateUrl(locale: 'zh' | 'en') {
    return locale === 'en' ? TEMPLATE_EN_URL : TEMPLATE_URL
}

export function writeStatusUrl(locale: 'zh' | 'en') {
    return templateUrl(locale)
}

export function githubUserUrl(id: string) {
  return `https://github.com/${id}`
}

export function githubAvatarUrl(id: string, size = 80) {
  return `https://avatars.githubusercontent.com/${encodeURIComponent(id)}?s=${size}`
}

export function sawIssueSearchUrl(id: string) {
  const q = encodeURIComponent(`is:issue in:title "看见了 @${id}"`)
  return `${REPO_URL}/issues?q=${q}`
}

export function sawIssueCreateUrl(id: string) {
  const title = `看见了 @${id}`
  const body = [
    `路过的人可以在下面点个 👀，让 @${id} 知道有人读到了。`,
    '',
    `- 档案：profiles/@${id}.md`,
    `- 展示页：${SITE_URL}p/${id}`,
  ].join('\n')
  const params = new URLSearchParams({ title, body, labels: 'saw' })
  return `${REPO_URL}/issues/new?${params.toString()}`
}

export function sawIssueOpenUrl(profile: { id: string; sawIssueUrl?: string | null }) {
  return profile.sawIssueUrl || sawIssueCreateUrl(profile.id)
}

export function quoteText(profile: { message: string; headline: string; id: string }) {
  const line = profile.message || profile.headline || `@${profile.id}`
  return line
}

export function sawCopyText(profile: { headline: string; id: string }, locale: 'zh' | 'en' = 'zh') {
    if (locale === 'en') {
        return `I see you @${profile.id}: ${profile.headline || 'left their status here'}`
    }
  return `我看见了 @${profile.id}：${profile.headline || '写下了自己的状态'}`
}
