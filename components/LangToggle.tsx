'use client'

import { Lang } from '@/lib/i18n'

export default function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
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
