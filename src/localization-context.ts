import { createContext } from 'react'
import type { Currency, Language, MessageKey } from './localization'

export type LocalizationValue = {
  language: Language
  setLanguage: (language: Language) => void
  currency: Currency
  setCurrency: (currency: Currency) => void
  languageNames: Record<Language, string>
  t: (key: MessageKey) => string
  gameTitle: (gameId: string, fallback: string) => string
  formatAmount: (amountInXof: number) => string
}

export const LocalizationContext = createContext<LocalizationValue | null>(null)
