/*
 * YearPage.tsx
 *
 * Created on 2026-09-03
 *
 * Copyright (C) 2026 Volkswagen AG, All rights reserved.
 */

import {Link} from 'react-router-dom'
import {Badges} from './Badges'
import {Footer} from './Footer'
import {LanguageSwitch} from './LanguageSwitch'
import {CURRENT_YEAR, githubAvatarUrl} from './constants'
import {useLocale} from './i18n/LocaleContext'
import type {Profile} from './types'

export function YearPage({ profiles }: { profiles: Profile[] }) {
    const {t} = useLocale()
  const touchedThisYear = profiles.filter((p) => p.updatedYears.includes(CURRENT_YEAR))
  const rest = [...profiles].sort((a, b) => {
    const ay = a.year ?? 9999
    const by = b.year ?? 9999
    if (ay !== by) return ay - by
    return a.id.localeCompare(b.id)
  })

  return (
    <div className="page">
        <LanguageSwitch/>
      <main className="chronicle">
        <Link className="back" to="/">
            {t('backToWall')}
        </Link>
        <p className="brand">{CURRENT_YEAR}</p>
          <h1>{t('yearTitle', {year: CURRENT_YEAR})}</h1>
          <p className="lede">{t('yearLede')}</p>

        {touchedThisYear.length > 0 ? (
          <section className="chronicle-block">
              <h2>{t('yearTouched')}</h2>
            <ol>
              {touchedThisYear.map((profile) => (
                <li key={`y-${profile.id}`}>
                  <Link to={`/p/${encodeURIComponent(profile.id)}`}>{profile.headline || `@${profile.id}`}</Link>
                  <span> @{profile.id}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : (<p className="hint">{t('yearHint')}</p>
        )}

        <section className="chronicle-block">
            <h2>{t('yearAll')}</h2>
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
                    {profile.year ? ` · ${t('startedIn', {year: profile.year})}` : ''}
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
