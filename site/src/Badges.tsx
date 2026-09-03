/*
 * Badges.tsx
 *
 * Created on 2026-09-03
 *
 * Copyright (C) 2026 Volkswagen AG, All rights reserved.
 */

import type {Profile} from './types'
import {useLocale} from './i18n/LocaleContext'

export function Badges({ profile }: { profile: Profile }) {
    const {t} = useLocale()
  return (
    <ul className="badges">
        {profile.badges.first ? <li className="badge">{t('badgeFirst')}</li> : null}
        {profile.badges.stillHere ? <li className="badge still">{t('badgeStill')}</li> : null}
    </ul>
  )
}
