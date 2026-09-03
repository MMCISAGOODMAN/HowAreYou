/*
 * HomePage.tsx
 *
 * Created on 2026-09-03
 *
 * Copyright (C) 2026 Volkswagen AG, All rights reserved.
 */

import {useEffect, useMemo, useRef, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Footer} from './Footer'
import {LanguageSwitch} from './LanguageSwitch'
import {ProfileCard} from './ProfileCard'
import {CURRENT_YEAR, PAGE_SIZE, writeStatusUrl} from './constants'
import {useLocale} from './i18n/LocaleContext'
import {filterProfiles, statsFrom} from './lib'
import type {FilterId, Profile} from './types'

const FILTER_IDS: FilterId[] = ['all', 'newcomer', 'veteran', 'achievement', 'stuck']

export function HomePage({ profiles }: { profiles: Profile[] }) {
    const {t, locale} = useLocale()
  const [filter, setFilter] = useState<FilterId>('all')
  const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const lastRandom = useRef<string | null>(null)
    const prevBatchStart = useRef(0)

  const stats = useMemo(() => statsFrom(profiles), [profiles])
  const visible = useMemo(() => filterProfiles(profiles, filter, query), [profiles, filter, query])
    const shown = useMemo(() => visible.slice(0, page * PAGE_SIZE), [visible, page])
    const hasMore = shown.length < visible.length

    useEffect(() => {
        setPage(1)
        prevBatchStart.current = 0
    }, [filter, query])

  const emptyKind =
    profiles.length === 0 ? 'none' : visible.length === 0 ? (query.trim() ? 'search' : 'filter') : null

    const filterLabels: Record<FilterId, string> = {
        all: t('filterAll'),
        newcomer: t('filterNewcomer'),
        veteran: t('filterVeteran'),
        achievement: t('filterAchievement'),
        stuck: t('filterStuck'),
    }

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

    function loadMore() {
        prevBatchStart.current = shown.length
        setPage((p) => p + 1)
    }

  return (
    <div className="page">
        <LanguageSwitch/>
      <header className="hero">
          <p className="brand">{t('brand')}</p>
          <h1>{t('heroTitle')}</h1>
          <p className="lede">{t('heroLede')}</p>
          <p className="hint">{t('heroHint')}</p>
        <div className="hero-actions">
            <a className="btn primary" href={writeStatusUrl(locale)}>
                {t('writeStatus')}
          </a>
          <a className="btn ghost" href="#wall">
              {t('seeOthers')}
          </a>
          {profiles.length > 0 ? (
            <button type="button" className="btn ghost" onClick={meetSomeone}>
                {t('meetRandom')}
            </button>
          ) : null}
        </div>
      </header>

        <section className="stats" aria-label={t('statsAria')}>
            <h2>{t('statsTitle')}</h2>
        <ul>
          <li>
            <strong>{stats.count}</strong>
              <span>{t('statsDevelopers')}</span>
          </li>
          <li>
            <strong>{stats.earliestYear}</strong>
              <span>{t('statsEarliest')}</span>
          </li>
          <li>
            <strong>{stats.stuck}</strong>
              <span>{t('statsStuck')}</span>
          </li>
          <li>
            <strong>{stats.achievements}</strong>
              <span>{t('statsAchievements')}</span>
          </li>
        </ul>
      </section>

      <section className="wall" id="wall">
        <div className="toolbar">
            <div className="filters" role="tablist" aria-label={t('filterAria')}>
                {FILTER_IDS.map((id) => (
              <button
                      key={id}
                type="button"
                role="tab"
                      aria-selected={filter === id}
                      className={filter === id ? 'chip on' : 'chip'}
                      onClick={() => setFilter(id)}
              >
                  {filterLabels[id]}
              </button>
            ))}
          </div>
          <label className="search">
              <span className="sr-only">{t('searchAria')}</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
            />
          </label>
        </div>

        {emptyKind === 'none' ? (
          <div className="empty">
              <p style={{whiteSpace: 'pre-line'}}>{t('emptyNone')}</p>
              <a className="btn primary" href={writeStatusUrl(locale)}>
                  {t('emptyFirst')}
            </a>
          </div>
        ) : null}

        {emptyKind === 'filter' ? (
          <div className="empty">
              <p style={{whiteSpace: 'pre-line'}}>{t('emptyFilter')}</p>
            <div className="hero-actions">
              <button type="button" className="btn ghost" onClick={() => setFilter('all')}>
                  {t('seeAll')}
              </button>
                <a className="btn primary" href={writeStatusUrl(locale)}>
                    {t('writeStatus')}
              </a>
            </div>
          </div>
        ) : null}

        {emptyKind === 'search' ? (
          <div className="empty">
              <p style={{whiteSpace: 'pre-line'}}>{t('emptySearch', {query: query.trim()})}</p>
            <div className="hero-actions">
              <button type="button" className="btn ghost" onClick={() => setQuery('')}>
                  {t('seeAll')}
              </button>
                <a className="btn primary" href={writeStatusUrl(locale)}>
                    {t('writeStatus')}
              </a>
            </div>
          </div>
        ) : null}

        {emptyKind === null ? (<>
                    <p className="wall-count">
                        {t('showingCount', {shown: shown.length, total: visible.length})}
                    </p>
                    <div className="grid" key={`${filter}:${query.trim()}`}>
                        {shown.map((profile, index) => (<ProfileCard
                                        key={profile.id}
                                        profile={profile}
                                        filter={filter}
                                        index={Math.max(0, index - prevBatchStart.current)}
                                />))}
                    </div>
                    <div className="wall-more">
                        {hasMore ? (<button type="button" className="btn ghost" onClick={loadMore}>
                                    {t('loadMore')}
                                </button>) : (<p className="wall-end">{t('endOfList')}</p>)}
                    </div>
                </>
        ) : null}
      </section>

      <p className="year-entry">
          <Link to="/year">{t('yearEntryLink', {year: CURRENT_YEAR})}</Link>
          {t('yearEntrySuffix')}
      </p>

      <Footer />
    </div>
  )
}
