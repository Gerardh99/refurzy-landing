'use client'

import { Lang } from '@/lib/i18n'

interface LangToggleProps {
  lang: Lang
  setLang: (l: Lang) => void
  variant?: 'light' | 'dark'
}

export default function LangToggle({ lang, setLang, variant = 'dark' }: LangToggleProps) {
  if (variant === 'light') {
    return (
      <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs font-medium">
        <button
          onClick={() => setLang('nl')}
          className={`px-2.5 py-1 rounded-md transition-all ${
            lang === 'nl'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          NL
        </button>
        <button
          onClick={() => setLang('en')}
          className={`px-2.5 py-1 rounded-md transition-all ${
            lang === 'en'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          EN
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center bg-white/10 rounded-lg p-0.5 text-xs font-medium">
      <button
        onClick={() => setLang('nl')}
        className={`px-2.5 py-1 rounded-md transition-colors ${
          lang === 'nl' ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        NL
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-2.5 py-1 rounded-md transition-colors ${
          lang === 'en' ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        EN
      </button>
    </div>
  )
}
