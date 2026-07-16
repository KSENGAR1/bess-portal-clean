import { useState, useRef, useEffect } from 'react'
import { Globe, Check, Loader2 } from 'lucide-react'
import { useLanguage, LANGUAGES } from '../context/LanguageContext'

export default function LanguageSwitcher({ variant = 'sidebar' }) {
  const { currentLang, switchLanguage, loading } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (code) => {
    switchLanguage(code)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
          bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300
          border border-slate-200 dark:border-slate-700
          hover:bg-slate-200 dark:hover:bg-slate-700"
        title="Change language"
      >
        {loading
          ? <Loader2 size={13} className="animate-spin" />
          : <Globe size={13} />
        }
        <span className="hidden sm:inline">{currentLang.flag} {currentLang.code.toUpperCase()}</span>
        <span className="sm:hidden">{currentLang.flag}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="
          absolute top-full mt-2 right-0 z-50 w-52
          bg-white dark:bg-slate-800
          border border-slate-200 dark:border-slate-700
          rounded-xl shadow-xl overflow-hidden
          animate-fade-in
        ">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Select Language
            </p>
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {LANGUAGES.map(lang => {
              const isActive = lang.code === currentLang.code
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2.5
                    text-left text-sm transition-colors
                    ${isActive
                      ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <div>
                      <p className="text-xs font-semibold leading-tight">{lang.nativeName}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">{lang.name}</p>
                    </div>
                  </div>
                  {isActive && <Check size={12} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />}
                </button>
              )
            })}
          </div>
          <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <p className="text-[9px] text-slate-400 dark:text-slate-600 leading-tight">
              Powered by LibreTranslate · UI text only
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
