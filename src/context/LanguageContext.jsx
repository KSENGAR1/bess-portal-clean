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

// MyMemory free API — no key required, 5000 words/day
// GET https://api.mymemory.translated.net/get?q=TEXT&langpair=en|hi
const MYMEMORY = 'https://api.mymemory.translated.net/get'

// ── Cache helpers ──────────────────────────────────────────────────────────
function cacheKey(text, lang) {
  // short hash-like key to stay within localStorage limits
  const safe = text.slice(0, 80).replace(/\s+/g, '_')
  return `mm_${lang}_${safe}`
}
function readCache(text, lang) {
  try { return localStorage.getItem(cacheKey(text, lang)) } catch { return null }
}
function writeCache(text, lang, result) {
  try { localStorage.setItem(cacheKey(text, lang), result) } catch {}
}

// ── Translate one string via MyMemory ─────────────────────────────────────
async function callMyMemory(text, targetLang) {
  const url = `${MYMEMORY}?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
  const res  = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  // responseStatus 200 = success, 429 = quota exceeded
  if (data.responseStatus !== 200) throw new Error(`MyMemory ${data.responseStatus}`)
  return data.responseData.translatedText || text
}

// ── Context ────────────────────────────────────────────────────────────────
const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [langCode, setLangCode] = useState(
    () => localStorage.getItem('bess_lang') || 'en'
  )
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const memCache = useRef({})   // session-level cache

  const currentLang = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0]

  // ── Translate a batch object { key: 'english string', … } ────────────
  // Returns same-shaped object with translated values.
  // Strings are translated one-at-a-time (MyMemory has no batch endpoint)
  // but we parallelise them with Promise.all.
  const translateBatch = useCallback(async (strings, targetLang = langCode) => {
    if (targetLang === 'en') return strings

    const keys   = Object.keys(strings)
    const result = { ...strings }
    const toFetch = []

    // Pull from cache first
    keys.forEach(k => {
      const text = strings[k]
      if (!text) return
      const mKey = `${targetLang}::${text}`
      if (memCache.current[mKey]) { result[k] = memCache.current[mKey]; return }
      const cached = readCache(text, targetLang)
      if (cached) { memCache.current[mKey] = cached; result[k] = cached; return }
      toFetch.push(k)
    })

    if (!toFetch.length) return result

    setLoading(true)
    setError(null)

    // Translate all uncached strings in parallel
    await Promise.all(
      toFetch.map(async k => {
        try {
          const tx = await callMyMemory(strings[k], targetLang)
          result[k] = tx
          const mKey = `${targetLang}::${strings[k]}`
          memCache.current[mKey] = tx
          writeCache(strings[k], targetLang, tx)
        } catch (e) {
          console.warn(`Translation failed for "${strings[k]}":`, e.message)
          // Leave as English on failure
        }
      })
    )

    setLoading(false)
    return result
  }, [langCode])

  // ── Switch language + set html attributes ────────────────────────────
  const switchLanguage = useCallback((code) => {
    setLangCode(code)
    setError(null)
    localStorage.setItem('bess_lang', code)
    document.documentElement.setAttribute('lang', code)
    document.documentElement.setAttribute('dir',
      ['ar', 'ur'].includes(code) ? 'rtl' : 'ltr'
    )
  }, [])

  // Set on mount
  if (typeof window !== 'undefined') {
    document.documentElement.setAttribute('lang', langCode)
    document.documentElement.setAttribute('dir',
      ['ar', 'ur'].includes(langCode) ? 'rtl' : 'ltr'
    )
  }

  return (
    <LanguageContext.Provider value={{
      langCode, currentLang, loading, error,
      translateBatch, switchLanguage, LANGUAGES,
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
