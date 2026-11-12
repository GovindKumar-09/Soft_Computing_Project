const API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '')
const STORAGE_KEY = 'lecture_assistant_auth'

export function getAuthSession() {
  for (const key of ['localStorage', 'sessionStorage']) {
    try {
      const storage = window[key]
      const value = storage.getItem(STORAGE_KEY)
      if (value) return JSON.parse(value)
    } catch {
      // Storage can be disabled by browser privacy settings.
    }
  }
  return null
}

export function getAccessToken() {
  return getAuthSession()?.access_token || ''
}

export function saveAuthSession(session, remember = false) {
  clearAuthSession()
  try {
    const storage = remember ? window.localStorage : window.sessionStorage
    storage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    throw new Error('Your browser blocked session storage. Enable site storage and try again.')
  }
}

export function clearAuthSession() {
  for (const key of ['localStorage', 'sessionStorage']) {
    try { window[key].removeItem(STORAGE_KEY) } catch { /* Storage may be disabled. */ }
  }
}

export async function authRequest(path, payload) {
  let response
  try {
    response = await fetch(`${API_URL}/api/auth/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  } catch {
    throw new Error('Unable to connect to the authentication service.')
  }
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.detail || 'Authentication failed.')
  return data
}

export async function authenticatedFetch(url, options = {}) {
  const headers = new Headers(options.headers || {})
  const token = getAccessToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch(url, { ...options, headers })
  if (response.status === 401) window.dispatchEvent(new Event('auth:expired'))
  return response
}
