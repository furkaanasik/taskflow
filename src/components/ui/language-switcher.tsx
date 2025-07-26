'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from './button'

const languages = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
] as const

export const LanguageSwitcher = () => {
  const { language, setLanguage, t, isReady } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === language)

  const handleLanguageChange = async (langCode: 'tr' | 'en') => {
    await setLanguage(langCode)
    setIsOpen(false)
  }

  if (!isReady) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-2 animate-pulse">
        <div className="w-20 h-4 bg-slate-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-md transition-all duration-200 min-w-[110px]"
      >
        <div className="flex items-center gap-2">
          <span>{currentLanguage?.flag}</span>
          <span className="text-sm font-medium">{currentLanguage?.name}</span>
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-20">
            <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100">
              {t('common.selectLanguage')}
            </div>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full px-3 py-2 text-left hover:bg-slate-50 transition-colors duration-200 flex items-center gap-3 ${
                  language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {language === lang.code && (
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}