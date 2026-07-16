import { createContext, useContext, useState, useCallback, useRef } from 'react'

// ── Supported languages ────────────────────────────────────────────────────
export const LANGUAGES = [
  { code: 'en', name: 'English',    flag: '🇬🇧', nativeName: 'English'    },
  { code: 'hi', name: 'Hindi',      flag: '🇮🇳', nativeName: 'हिन्दी'      },
  { code: 'ar', name: 'Arabic',     flag: '🇸🇦', nativeName: 'العربية'    },
  { code: 'fr', name: 'French',     flag: '🇫🇷', nativeName: 'Français'   },
  { code: 'sw', name: 'Swahili',    flag: '🇰🇪', nativeName: 'Kiswahili'  },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷', nativeName: 'Português'  },
  { code: 'es', name: 'Spanish',    flag: '🇪🇸', nativeName: 'Español'    },
  { code: 'bn', name: 'Bengali',    flag: '🇧🇩', nativeName: 'বাংলা'      },
  { code: 'ur', name: 'Urdu',       flag: '🇵🇰', nativeName: 'اردو'       },
  { code: 'zh', name: 'Chinese',    flag: '🇨🇳', nativeName: '中文'        },
]

// LibreTranslate public instance — no API key required for basic use
const LIBRE_ENDPOINT = 'https://libretranslate.com/translate'

// ── Translation cache (persisted in localStorage) ─────────────────────────
function getCacheKey(text, lang) { return `lt_${lang}_${btoa(unescape(encodeURIComponent(text))).slice(0, 40)}` }

function readCache(text, lang) {
  try { return localStorage.getItem(getCacheKey(text, lang)) || null } catch { return null }
}

function writeCache(text, lang, translated) {
  try { localStorage.setItem(getCacheKey(text, lang), translated) } catch {}
}

// ── Context ────────────────────────────────────────────────────────────────
const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [langCode, setLangCode] = useState(
    () => localStorage.getItem('bess_lang') || 'en'
  )
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  // In-memory cache for current session
  const memCache = useRef({})

  const currentLang = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0]

  // ── Translate a single string ──────────────────────────────────────────
  const translate = useCallback(async (text, targetLang = langCode) => {
    if (!text || typeof text !== 'string') return text
    if (targetLang === 'en') return text

    // Check memory cache first
    const memKey = `${targetLang}::${text}`
    if (memCache.current[memKey]) return memCache.current[memKey]

    // Check localStorage cache
    const cached = readCache(text, targetLang)
    if (cached) { memCache.current[memKey] = cached; return cached }

    try {
      const res = await fetch(LIBRE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, source: 'en', target: targetLang, format: 'text' }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const result = data.translatedText || text
      memCache.current[memKey] = result
      writeCache(text, targetLang, result)
      return result
    } catch (e) {
      console.warn('LibreTranslate error:', e.message)
      return text // Fallback to original
    }
  }, [langCode])

  // ── Translate a whole object of key→string pairs in one batch ──────────
  // Returns translated object. Falls back gracefully per-key on failure.
  const translateBatch = useCallback(async (strings, targetLang = langCode) => {
    if (targetLang === 'en') return strings
    const keys   = Object.keys(strings)
    const result = { ...strings }

    // Split into cached vs uncached
    const toFetch = []
    keys.forEach(k => {
      const text = strings[k]
      if (!text) return
      const memKey = `${targetLang}::${text}`
      if (memCache.current[memKey]) { result[k] = memCache.current[memKey]; return }
      const cached = readCache(text, targetLang)
      if (cached) { memCache.current[memKey] = cached; result[k] = cached; return }
      toFetch.push(k)
    })

    if (!toFetch.length) return result

    setLoading(true)
    setError(null)
    try {
      // LibreTranslate supports array input for batch
      const texts = toFetch.map(k => strings[k])
      const res = await fetch(LIBRE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: texts, source: 'en', target: targetLang, format: 'text' }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      // Response is either array or single object
      const translated = Array.isArray(data) ? data.map(d => d.translatedText) : [data.translatedText]
      toFetch.forEach((k, i) => {
        const tx = translated[i] || strings[k]
        result[k] = tx
        memCache.current[`${targetLang}::${strings[k]}`] = tx
        writeCache(strings[k], targetLang, tx)
      })
    } catch (e) {
      console.warn('LibreTranslate batch error:', e.message)
      setError('Translation unavailable — showing English')
    } finally {
      setLoading(false)
    }
    return result
  }, [langCode])

  // ── Switch language ────────────────────────────────────────────────────
  const switchLanguage = useCallback((code) => {
    setLangCode(code)
    localStorage.setItem('bess_lang', code)
    // Set document lang attribute for accessibility
    document.documentElement.setAttribute('lang', code)
    // RTL support for Arabic / Urdu
    document.documentElement.setAttribute('dir', ['ar', 'ur'].includes(code) ? 'rtl' : 'ltr')
  }, [])

  // Set initial dir on mount
  if (typeof window !== 'undefined') {
    document.documentElement.setAttribute('lang', langCode)
    document.documentElement.setAttribute('dir', ['ar', 'ur'].includes(langCode) ? 'rtl' : 'ltr')
  }

  return (
    <LanguageContext.Provider value={{
      langCode, currentLang, loading, error,
      translate, translateBatch, switchLanguage, LANGUAGES,
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
