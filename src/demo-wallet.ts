const WALLET_ID_KEY = 'chicago-demo-wallet-id'

export function getDemoWalletId() {
  const saved = window.localStorage.getItem(WALLET_ID_KEY)
  if (saved && /^[a-z0-9-]{8,64}$/i.test(saved)) return saved
  const walletId = typeof window.crypto.randomUUID === 'function'
    ? window.crypto.randomUUID()
    : createUuidFromSecureRandom()
  window.localStorage.setItem(WALLET_ID_KEY, walletId)
  return walletId
}

function createUuidFromSecureRandom() {
  const bytes = window.crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}
