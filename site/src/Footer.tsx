/*
 * Footer.tsx
 *
 * Created on 2026-09-03
 *
 * Copyright (C) 2026 Volkswagen AG, All rights reserved.
 */

import {Link} from 'react-router-dom'
import {contributingUrl, CURRENT_YEAR, REPO_URL} from './constants'
import {useLocale} from './i18n/LocaleContext'

export function Footer() {
    const {t, locale} = useLocale()
  return (
    <footer className="site-footer">
        <p className="footer-main">{t('footerMain')}</p>
      <p className="footer-links">
          <a href={REPO_URL}>{t('footerJoin')}</a>
        <span aria-hidden="true"> · </span>
          <a href={contributingUrl(locale)}>{t('footerGuide')}</a>
        <span aria-hidden="true"> · </span>
          <Link to="/year">{t('yearEntryLink', {year: CURRENT_YEAR})}</Link>
        <span aria-hidden="true"> · </span>
        <Link to="/">How Are You</Link>
      </p>
        <p className="footer-note">{t('footerNote')}</p>
    </footer>
  )
}
