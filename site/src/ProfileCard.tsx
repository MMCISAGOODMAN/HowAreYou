/*
 * ProfileCard.tsx
 *
 * Created on 2026-09-03
 *
 * Copyright (C) 2026 Volkswagen AG, All rights reserved.
 */

import {Link} from 'react-router-dom'
import {githubAvatarUrl, githubUserUrl} from './constants'
import {useLocale} from './i18n/LocaleContext'
import {cardHighlight} from './lib'
import {Badges} from './Badges'
import type {FilterId, Profile} from './types'

export function ProfileCard({
  profile,
  filter = 'all',
  index = 0,
}: {
  profile: Profile
  filter?: FilterId
  index?: number
}) {
    const {t} = useLocale()
  const highlight = cardHighlight(profile, filter)

  return (
    <article className="card" style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}>
      <Link className="card-body" to={`/p/${encodeURIComponent(profile.id)}`}>
          <p className="card-headline">{profile.headline || t('noHeadline')}</p>
        {profile.current ? <p className="card-current">{profile.current}</p> : null}
        {highlight ? (
          <p className={`card-highlight is-${highlight.kind}`}>
              {highlight.kind === 'struggle' ? t('highlightStuck') : t('highlightAchievement')}
            <span>{highlight.text}</span>
          </p>
        ) : null}
        <Badges profile={profile} />
      </Link>
      <div className="card-meta">
          {profile.year !== null ? (<span>{t('startedIn', {year: profile.year})}</span>) : (
                  <span>{t('startedUnknown')}</span>)}
        <a className="card-id" href={githubUserUrl(profile.id)} target="_blank" rel="noreferrer">
          <img
            className="card-avatar"
            src={githubAvatarUrl(profile.id, 64)}
            alt=""
            width={28}
            height={28}
            loading="lazy"
          />
          @{profile.id}
        </a>
      </div>
    </article>
  )
}
