import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'

/**
 * useTranslation — translate a flat { key: 'English string' } object.
 *
 * Usage:
 *   const { t, ready } = useTranslation({
 *     title:    'Dashboard',
 *     subtitle: 'Welcome back',
 *   })
 *   <h1>{t.title}</h1>
 *
 * - Immediately returns English (no flash of untranslated text).
 * - Fetches translation from MyMemory API, updates once done.
 * - Results cached in localStorage — instant on subsequent renders.
 * - Pass dynamic strings in `deps` to re-translate when they change.
 */
export function useTranslation(strings, deps = []) {
  const { langCode, translateBatch } = useLanguage()
  const [translated, setTranslated] = useState(strings)
  const [ready, setReady]           = useState(langCode === 'en')

  useEffect(() => {
    let cancelled = false

    if (langCode === 'en') {
      setTranslated(strings)
      setReady(true)
      return
    }

    setReady(false)
    translateBatch(strings, langCode).then(result => {
      if (!cancelled) { setTranslated(result); setReady(true) }
    })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langCode, ...deps])

  return { t: translated, ready, langCode }
}
