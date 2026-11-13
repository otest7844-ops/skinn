import { useContext } from 'react'
import { LocalizationContext } from './localization-context'

export function useLocalization() {
  const value = useContext(LocalizationContext)
  if (!value) throw new Error('useLocalization must be used within LocalizationProvider')
  return value
}
