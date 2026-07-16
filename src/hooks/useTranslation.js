import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'

/**
 * useTranslation — translate a flat object of key→string pairs.
 *
 * Usage:
 *   const { t, ready } = useTranslation({
 *     title:    'Dashboard',
 *     subtitle: 'Welcome back',
 *   })
 *   // Use as: <h1>{t.title}</h1>
 *
 * - Returns English immediately (no flash), then updates once translation arrives.
 * - Results are cached in localStorage so subsequent renders are instant.
 * - Pass `deps` array to re-translate when dynamic strings change.
 */
export function useTranslation(strings, deps = []) {
  const { langCode, translateBatch } = useLanguage()
  const [translated, setTranslated] = useState(strings)
  const [ready, setReady]           = useState(langCode === 'en')
  const prevLang = useRef(langCode)

  useEffect(() => {
    let cancelled = false

    async function run() {
      setReady(false)
      const result = await translateBatch(strings, langCode)
      if (!cancelled) {
        setTranslated(result)
        setReady(true)
        prevLang.current = langCode
      }
    }

    if (langCode === 'en') {
      setTranslated(strings)
      setReady(true)
    } else {
      run()
    }

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langCode, ...deps])

  return { t: translated, ready, langCode }
}
