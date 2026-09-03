import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { Badges } from './Badges'
import { Footer } from './Footer'
import { githubAvatarUrl, githubUserUrl, quoteText, sawCopyText, sawIssueOpenUrl } from './constants'
import { downloadShareCard } from './shareCard'
import type { Profile } from './types'

const FIELDS: { key: keyof Profile; label: string }[] = [
  { key: 'headline', label: '我是' },
  { key: 'current', label: '当前状态' },
  { key: 'side', label: '业余在折腾什么' },
  { key: 'achievement', label: '最近的小成就' },
  { key: 'struggle', label: '最近的小困惑' },
  { key: 'message', label: '想对路过的人说' },
  { key: 'easterEgg', label: '彩蛋' },
  { key: 'startedAt', label: '入行时间' },
]

const SAW_KEY = (id: string) => `how-are-you:saw:${id}`

export function ProfilePage({ profiles }: { profiles: Profile[] }) {
  const { githubId } = useParams()
  const profile = profiles.find((p) => p.id === githubId)
  const [copied, setCopied] = useState('')
  const [sawMine, setSawMine] = useState(() =>
    typeof localStorage === 'undefined' ? false : localStorage.getItem(SAW_KEY(githubId || '')) === '1',
  )

  if (!profile) {
    return (
      <div className="page">
        <main className="detail">
          <Link className="back" to="/">
            ← 回到卡片墙
          </Link>
          <h1>没有找到这个人</h1>
          <p>也许文件名改了，也许还没合并进来。先回到墙上，看看还在的那些状态。</p>
        </main>
        <Footer />
      </div>
    )
  }

  const person = profile

  async function copyQuote() {
    const text = quoteText(person)
    await navigator.clipboard.writeText(text)
    setCopied('金句已复制，带去即刻、推特或朋友圈都行。')
  }

  async function markSaw() {
    const text = sawCopyText(person)
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      /* ignore */
    }
    localStorage.setItem(SAW_KEY(person.id), '1')
    setSawMine(true)
    setCopied(person.sawIssueUrl ? '已复制。打开 Issue，点个 👀 就好。' : '已复制。打开新建页提交后，再点个 👀。')
    window.open(sawIssueOpenUrl(person), '_blank', 'noopener,noreferrer')
  }

  const sawLabel =
    person.sawCount > 0 ? `${person.sawCount} 人看见了` : sawMine ? '你看见了' : '看见了'

  return (
    <div className="page">
      <main className="detail">
        <Link className="back" to="/">
          ← 回到卡片墙
        </Link>
        <div className="detail-identity">
          <img
            className="detail-avatar"
            src={githubAvatarUrl(person.id, 128)}
            alt=""
            width={64}
            height={64}
          />
          <div>
            <p className="detail-kicker">@{person.id}</p>
            <a className="github-link" href={githubUserUrl(person.id)} target="_blank" rel="noreferrer">
              在 GitHub 上看 @{person.id}
            </a>
          </div>
        </div>
        <h1>{person.headline || `@${person.id}`}</h1>
        <Badges profile={person} />
        <div className="detail-actions">
          <button type="button" className="btn ghost" onClick={() => downloadShareCard(person)}>
            保存分享图
          </button>
          <button type="button" className="btn ghost" onClick={() => void copyQuote()}>
            复制金句
          </button>
          <button type="button" className="btn ghost" onClick={() => void markSaw()}>
            {sawLabel}
          </button>
        </div>
        {copied ? <p className="flash">{copied}</p> : null}
        <p className="saw-hint">
          点「看见了」会复制一句短话，并打开对应的 GitHub Issue；还没有的话会帮你打开新建页。提交后点 👀 轻轻打个招呼。
        </p>
        {FIELDS.map(({ key, label }) => {
          const value = person[key]
          if (typeof value !== 'string' || !value) return null
          if (key === 'headline') return null
          return (
            <section key={key} className="detail-section">
              <h2>{label}</h2>
              <p>{value}</p>
            </section>
          )
        })}
      </main>
      <Footer />
    </div>
  )
}
