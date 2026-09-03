/*
 * LanguageSwitch.tsx
 *
 * Created on 2026-09-03
 *
 * Copyright (C) 2026 Volkswagen AG, All rights reserved.
 */

import {useLocale} from './i18n/LocaleContext'

export function LanguageSwitch() {
    const {locale, setLocale, t} = useLocale()

    return (<div className="lang-switch" role="group" aria-label="Language">
                <button
                        type="button"
                        className={locale === 'zh' ? 'lang-btn on' : 'lang-btn'}
                        onClick={() => setLocale('zh')}
                >
                    {t('langZh')}
                </button>
                <span aria-hidden="true">|</span>
                <button
                        type="button"
                        className={locale === 'en' ? 'lang-btn on' : 'lang-btn'}
                        onClick={() => setLocale('en')}
                >
                    {t('langEn')}
                </button>
            </div>)
}
