'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import type locals from '@/constants/locals'
import { getLanguageText } from '@/constants/locals'

export interface LanguageContextValue {
  language: string
  supports: string[]
  changeLanguage: (lang: string) => void
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  supports: ['en'],
  changeLanguage: () => {},
})

export interface LanguageProviderProps {
  children: React.ReactNode
  serverLanguage: string
}

export function LanguageProvider({ children, serverLanguage }: LanguageProviderProps) {
  const [language, setLanguage] = useState(serverLanguage)
  const [supports, setSupports] = useState<string[]>([serverLanguage])

  const changeLanguage = useCallback((lang: string) => {
    setLanguage(lang)
  }, [])

  useEffect(() => {
    const clientLang = navigator.language || 'en'
    setLanguage(clientLang)
    setSupports([...navigator.languages])
  }, [])

  return <LanguageContext.Provider value={{ language, supports, changeLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const { language, supports, changeLanguage } = useContext(LanguageContext)
  const isChinese = useMemo(() => /zh/.test(language), [language])
  const supportChinese = useMemo(() => supports.includes('zh'), [supports])
  const t = useCallback((text: string) => getLanguageText(text, language), [language])
  const tl = useCallback(
    (text: string, language: keyof typeof locals) => {
      if (supports.includes(language)) {
        return getLanguageText(text, language)
      }

      return text
    },
    [supports]
  )

  return { language, isChinese, supportChinese, t, tl, changeLanguage }
}
