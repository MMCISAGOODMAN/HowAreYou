import { Link } from 'react-router-dom'
import { Badges } from './Badges'
import { Footer } from './Footer'
import { CURRENT_YEAR, githubAvatarUrl } from './constants'
import type { Profile } from './types'

export function YearPage({ profiles }: { profiles: Profile[] }) {
  const touchedThisYear = profiles.filter((p) => p.updatedYears.includes(CURRENT_YEAR))
  const rest = [...profiles].sort((a, b) => {
    const ay = a.year ?? 9999
    const by = b.year ?? 9999
    if (ay !== by) return ay - by
    return a.id.localeCompare(b.id)
  })

  return (
    <div className="page">
      <main className="chronicle">
        <Link className="back" to="/">
          ← 回到卡片墙
        </Link>
        <p className="brand">{CURRENT_YEAR}</p>
        <h1>{CURRENT_YEAR} 编年史</h1>
        <p className="lede">此刻的一本。不是年终总结，是这一年里，普通开发者愿意被看见的那些句子。</p>

        {touchedThisYear.length > 0 ? (
          <section className="chronicle-block">
            <h2>今年还回来改过自己的人</h2>
            <ol>
              {touchedThisYear.map((profile) => (
                <li key={`y-${profile.id}`}>
                  <Link to={`/p/${encodeURIComponent(profile.id)}`}>{profile.headline || `@${profile.id}`}</Link>
                  <span> @{profile.id}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : (
          <p className="hint">git 历史还太短，或本地没有完整提交记录——下面是此刻墙上的全部状态。</p>
        )}

        <section className="chronicle-block">
          <h2>所有留下的话</h2>
          <ol className="chronicle-list">
            {rest.map((profile) => (
              <li key={profile.id}>
                <p className="chronicle-quote">
                  <Link to={`/p/${encodeURIComponent(profile.id)}`}>{profile.headline || `@${profile.id}`}</Link>
                </p>
                <p className="chronicle-meta">
                  <img
                    className="card-avatar"
                    src={githubAvatarUrl(profile.id, 48)}
                    alt=""
                    width={24}
                    height={24}
                    loading="lazy"
                  />
                  @{profile.id}
                  {profile.year ? ` · ${profile.year} 年入行` : ''}
                </p>
                <Badges profile={profile} />
              </li>
            ))}
          </ol>
        </section>
      </main>
      <Footer />
    </div>
  )
}
