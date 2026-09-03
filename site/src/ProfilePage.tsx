/*
 * ProfilePage.tsx
 *
 * Created on 2026-09-03
 *
 * Copyright (C) 2026 Volkswagen AG, All rights reserved.
 */

import {Link, useParams} from 'react-router-dom'
import {useState} from 'react'
import {Badges} from './Badges'
import {Footer} from './Footer'
import {LanguageSwitch} from './LanguageSwitch'
import {githubAvatarUrl, githubUserUrl, quoteText, sawCopyText, sawIssueOpenUrl} from './constants'
import {useLocale} from './i18n/LocaleContext'
import {downloadShareCard} from './shareCard'
import type {MessageKey} from './i18n/messages'
import type {Profile} from './types'

const FIELD_KEYS: { key: keyof Profile; labelKey: MessageKey }[] = [{key: 'current', labelKey: 'fieldCurrent'},
    {key: 'side', labelKey: 'fieldSide'}, {key: 'achievement', labelKey: 'fieldAchievement'},
    {key: 'struggle', labelKey: 'fieldStruggle'}, {key: 'message', labelKey: 'fieldMessage'},
    {key: 'easterEgg', labelKey: 'fieldEasterEgg'}, {key: 'startedAt', labelKey: 'fieldStarted'},
]

const SAW_KEY = (id: string) => `how-are-you:saw:${id}`

export function ProfilePage({ profiles }: { profiles: Profile[] }) {
  const { githubId } = useParams()
    const {t, locale} = useLocale()
  const profile = profiles.find((p) => p.id === githubId)
  const [copied, setCopied] = useState('')
  const [sawMine, setSawMine] = useState(() =>
    typeof localStorage === 'undefined' ? false : localStorage.getItem(SAW_KEY(githubId || '')) === '1',
  )

  if (!profile) {
    return (
      <div className="page">
          <LanguageSwitch/>
        <main className="detail">
          <Link className="back" to="/">
              {t('backToWall')}
          </Link>
            <h1>{t('notFoundTitle')}</h1>
            <p>{t('notFoundBody')}</p>
        </main>
        <Footer />
      </div>
    )
  }

  const person = profile

  async function copyQuote() {
    const text = quoteText(person)
    await navigator.clipboard.writeText(text)
      setCopied(t('copiedQuote'))
  }

  async function markSaw() {
      const text = sawCopyText(person, locale)
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      /* ignore */
    }
    localStorage.setItem(SAW_KEY(person.id), '1')
    setSawMine(true)
      setCopied(person.sawIssueUrl ? t('copiedSawExisting') : t('copiedSawCreate'))
    window.open(sawIssueOpenUrl(person), '_blank', 'noopener,noreferrer')
  }

  const sawLabel = person.sawCount > 0 ? t('sawCount', {n: person.sawCount}) : sawMine ? t('sawYou') : t('saw')

  return (
    <div className="page">
        <LanguageSwitch/>
      <main className="detail">
        <Link className="back" to="/">
            {t('backToWall')}
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
                {t('viewOnGithub', {id: person.id})}
            </a>
          </div>
        </div>
        <h1>{person.headline || `@${person.id}`}</h1>
        <Badges profile={person} />
        <div className="detail-actions">
          <button type="button" className="btn ghost" onClick={() => downloadShareCard(person)}>
              {t('saveShare')}
          </button>
          <button type="button" className="btn ghost" onClick={() => void copyQuote()}>
              {t('copyQuote')}
          </button>
          <button type="button" className="btn ghost" onClick={() => void markSaw()}>
            {sawLabel}
          </button>
        </div>
        {copied ? <p className="flash">{copied}</p> : null}
          <p className="saw-hint">{t('sawHint')}</p>
          {FIELD_KEYS.map(({key, labelKey}) => {
          const value = person[key]
          if (typeof value !== 'string' || !value) return null
          return (
            <section key={key} className="detail-section">
                <h2>{t(labelKey)}</h2>
              <p>{value}</p>
            </section>
          )
        })}
      </main>
      <Footer />
    </div>
  )
}
