'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageSwitcher } from '@/components/ui/language-switcher'

export function Navbar() {
  const { user, logout, loading } = useAuth()
  const { t, language, isReady } = useLanguage()

  if (loading) {
    return (
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">TF</span>
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TaskFlow</span>
            </Link>
          </div>
          <div className="ml-auto flex items-center space-x-3">
            <span>{isReady ? t('common.loading') : 'Yükleniyor...'}</span>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">TF</span>
            </div>
            <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TaskFlow</span>
          </Link>
        </div>
        
        <div className="ml-auto flex items-center space-x-2">
          {user ? (
            <>
              <Button variant="ghost" className="hover:bg-blue-50 hover:text-blue-700 transition-colors" asChild>
                <Link href="/projects">{isReady ? t('nav.projects') : 'Projeler'}</Link>
              </Button>
              <Button variant="ghost" className="hover:bg-blue-50 hover:text-blue-700 transition-colors" asChild>
                <Link href="/issues">{isReady ? t('nav.tasks') : 'Görevler'}</Link>
              </Button>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {language === 'tr' ? `Merhaba, ${user.name}` : `Hello, ${user.name}`}
                </span>
                <LanguageSwitcher />
                <Button 
                  variant="outline" 
                  onClick={logout}
                  className="hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
                >
                  {isReady ? t('nav.logout') : 'Çıkış'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <LanguageSwitcher />
              <Button variant="ghost" className="hover:bg-blue-50 hover:text-blue-700 transition-colors" asChild>
                <Link href="/register">{isReady ? t('nav.register') : 'Kayıt Ol'}</Link>
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all rounded-lg" asChild>
                <Link href="/login">{isReady ? t('nav.login') : 'Giriş Yap'}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}