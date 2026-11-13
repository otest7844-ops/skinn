export function getMultiplayerUrl() {
  const configuredUrl = import.meta.env.VITE_MULTIPLAYER_URL?.trim()
  if (!configuredUrl) return `${window.location.protocol}//${window.location.hostname}:3001`
  if (/^https?:\/\//i.test(configuredUrl)) return configuredUrl
  return `${window.location.protocol}//${configuredUrl}`
}

export function getAuthApiBaseUrl() {
  return import.meta.env.DEV ? '' : getMultiplayerUrl()
}
