import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Footer } from './Footer'
import { ProfileCard } from './ProfileCard'
import { CURRENT_YEAR, REPO_URL } from './constants'
import { filterProfiles, statsFrom } from './lib'
import type { FilterId, Profile } from './types'

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'newcomer', label: '刚入行' },
  { id: 'veteran', label: '写了好几年' },
  { id: 'achievement', label: '最近有小成就' },
  { id: 'stuck', label: '最近有点卡住' },
]

export function HomePage({ profiles }: { profiles: Profile[] }) {
  const [filter, setFilter] = useState<FilterId>('all')
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const lastRandom = useRef<string | null>(null)

  const stats = useMemo(() => statsFrom(profiles), [profiles])
  const visible = useMemo(() => filterProfiles(profiles, filter, query), [profiles, filter, query])

  const emptyKind =
    profiles.length === 0 ? 'none' : visible.length === 0 ? (query.trim() ? 'search' : 'filter') : null

  function meetSomeone() {
    const pool = profiles.length ? profiles : []
    if (pool.length === 0) return
    let pick = pool[Math.floor(Math.random() * pool.length)]
    if (pool.length > 1) {
      const others = pool.filter((p) => p.id !== lastRandom.current)
      pick = others[Math.floor(Math.random() * others.length)] ?? pick
    }
    lastRandom.current = pick.id
    navigate(`/p/${encodeURIComponent(pick.id)}`)
  }

  return (
    <div className="page">
      <header className="hero">
        <p className="brand">How Are You</p>
        <h1>最近，你还好吗？</h1>
        <p className="lede">
          开发者把真实状态写在这里。不是简历，不是年终总结——是此刻还在写代码的人，愿意被看见。
        </p>
        <p className="hint">第 1 年或第 10 年都欢迎。卡 CORS 的下午，也算一种答案。</p>
        <div className="hero-actions">
          <a className="btn primary" href={REPO_URL}>
            写下我的状态
          </a>
          <a className="btn ghost" href="#wall">
            先看看别人
          </a>
          {profiles.length > 0 ? (
            <button type="button" className="btn ghost" onClick={meetSomeone}>
              随机遇见一位
            </button>
          ) : null}
        </div>
      </header>

      <section className="stats" aria-label="统计">
        <h2>原来不只是你。</h2>
        <ul>
          <li>
            <strong>{stats.count}</strong>
            <span>位开发者写下了自己</span>
          </li>
          <li>
            <strong>{stats.earliestYear}</strong>
            <span>年，最早入行的那位</span>
          </li>
          <li>
            <strong>{stats.stuck}</strong>
            <span>条正在被卡住的困惑</span>
          </li>
          <li>
            <strong>{stats.achievements}</strong>
            <span>人，最近刚搞定一件小事</span>
          </li>
        </ul>
      </section>

      <section className="wall" id="wall">
        <div className="toolbar">
          <div className="filters" role="tablist" aria-label="筛选">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={filter === item.id}
                className={filter === item.id ? 'chip on' : 'chip'}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label className="search">
            <span className="sr-only">搜索</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜一个名字，或一句你也有过的话"
            />
          </label>
        </div>

        {emptyKind === 'none' ? (
          <div className="empty">
            <p>
              还没有人写下自己。
              <br />
              这很好——说明你来得正好。
            </p>
            <a className="btn primary" href={REPO_URL}>
              成为第一个
            </a>
          </div>
        ) : null}

        {emptyKind === 'filter' ? (
          <div className="empty">
            <p>
              这种心情，暂时还没人写到。
              <br />
              也许下一条，就是你的。
            </p>
            <div className="hero-actions">
              <button type="button" className="btn ghost" onClick={() => setFilter('all')}>
                看看全部
              </button>
              <a className="btn primary" href={REPO_URL}>
                写下我的状态
              </a>
            </div>
          </div>
        ) : null}

        {emptyKind === 'search' ? (
          <div className="empty">
            <p>
              没有找到「{query.trim()}」。
              <br />
              人还不多，话却都很具体——换个词，或直接去写一句你自己的。
            </p>
            <div className="hero-actions">
              <button type="button" className="btn ghost" onClick={() => setQuery('')}>
                看看全部
              </button>
              <a className="btn primary" href={REPO_URL}>
                写下我的状态
              </a>
            </div>
          </div>
        ) : null}

        {emptyKind === null ? (
          <div className="grid" key={`${filter}:${query.trim()}`}>
            {visible.map((profile, index) => (
              <ProfileCard key={profile.id} profile={profile} filter={filter} index={index} />
            ))}
          </div>
        ) : null}
      </section>

      <p className="year-entry">
        <Link to="/year">{CURRENT_YEAR} 编年史</Link>
        ——把此刻的话，收成一本可以慢慢读的册子。
      </p>

      <Footer />
    </div>
  )
}
