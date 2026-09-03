/*
 * LocaleContext.tsx
 *
 * Created on 2026-09-03
 *
 * Copyright (C) 2026 Volkswagen AG, All rights reserved.
 */

import {createContext, type ReactNode, useContext, useEffect, useMemo, useState} from 'react'
import {type Locale, type MessageKey, translate} from './messages'

const STORAGE_KEY = 'how-are-you:locale'

type LocaleContextValue = {
    locale: Locale
    setLocale: (locale: Locale) => void
    t: (key: MessageKey, vars?: Record<string, string | number>) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function detectLocale(): Locale {
    if (typeof navigator === 'undefined') {
        return 'zh'
    }
    return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

function readStoredLocale(): Locale {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw === 'zh' || raw === 'en') {
            return raw
        }
    } catch {
        /* ignore */
    }
    return detectLocale()
}

export function LocaleProvider({children}: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(
            () => typeof localStorage === 'undefined' ? 'zh' : readStoredLocale(),)

    useEffect(() => {
        document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
    }, [locale])

    const value = useMemo<LocaleContextValue>(() => {
        function setLocale(next: Locale) {
            setLocaleState(next)
            try {
                localStorage.setItem(STORAGE_KEY, next)
            } catch {
                /* ignore */
            }
        }

        return {
            locale, setLocale, t: (key, vars) => translate(locale, key, vars),
        }
    }, [locale])

    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
    const ctx = useContext(LocaleContext)
    if (!ctx) {
        throw new Error('useLocale must be used within LocaleProvider')
    }
    return ctx
}
