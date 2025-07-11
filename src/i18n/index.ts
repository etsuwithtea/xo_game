import type { Language, Translations } from '../types/language'
import { en } from './en'
import { th } from './th'

const translations: Record<Language, Translations> = {
  en,
  th
}

export const getTranslations = (language: Language): Translations => {
  return translations[language]
}

export const t = (key: string, translations: Translations, params?: Record<string, string>): string => {
  const keys = key.split('.')
  let value: any = translations
  
  for (const k of keys) {
    value = value?.[k]
  }
  
  if (typeof value !== 'string') {
    return key
  }
  
  if (params) {
    return Object.entries(params).reduce((str, [param, replacement]) => {
      return str.replace(`{${param}}`, replacement)
    }, value)
  }
  
  return value
}
