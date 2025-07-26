'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../lib/i18n' // Import i18n configuration

type Language = 'tr' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, options?: any) => string
  isReady: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n, ready } = useTranslation('common')
  const [language, setLanguageState] = useState<Language>('tr')
  const [isReady, setIsReady] = useState(false)

  // Load language from localStorage on mount
  useEffect(() => {
    if (ready) {
      const savedLanguage = localStorage.getItem('language') as Language
      if (savedLanguage && (savedLanguage === 'tr' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage)
        i18n.changeLanguage(savedLanguage)
      }
      setIsReady(true)
    }
  }, [i18n, ready])

  // Sync state with i18n current language
  useEffect(() => {
    if (ready && i18n.language) {
      const currentLang = i18n.language as Language
      if (currentLang !== language) {
        setLanguageState(currentLang)
      }
    }
  }, [i18n.language, ready, language])

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang)
    await i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
    
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang
    }
  }

  const value = {
    language,
    setLanguage,
    t,
    isReady
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}