export const REPO_URL = 'https://github.com/MMCISAGOODMAN/HowAreYou'
export const CONTRIBUTING_URL = `${REPO_URL}/blob/master/CONTRIBUTING.md`
export const TEMPLATE_URL = `${REPO_URL}/blob/master/TEMPLATE.md`
export const SITE_URL = 'https://MMCISAGOODMAN.github.io/HowAreYou/'
export const CURRENT_YEAR = 2026

export function githubUserUrl(id: string) {
  return `https://github.com/${id}`
}

export function githubAvatarUrl(id: string, size = 80) {
  return `https://avatars.githubusercontent.com/${encodeURIComponent(id)}?s=${size}`
}

export function sawIssueSearchUrl(id: string) {
  const q = encodeURIComponent(`is:issue label:saw 看见了 @${id}`)
  return `${REPO_URL}/issues?q=${q}`
}

export function quoteText(profile: { message: string; headline: string; id: string }) {
  const line = profile.message || profile.headline || `@${profile.id}`
  return line
}

export function sawCopyText(profile: { headline: string; id: string }) {
  return `我看见了 @${profile.id}：${profile.headline || '写下了自己的状态'}`
}
