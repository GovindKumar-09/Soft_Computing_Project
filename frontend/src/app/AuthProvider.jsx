import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './authContext'
import {
  authRequest,
  clearAuthSession,
  getAuthSession,
  saveAuthSession
} from '../services/authService'

function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getAuthSession())

  useEffect(() => {
    const expire = () => {
      clearAuthSession()
      setSession(null)
    }
    window.addEventListener('auth:expired', expire)
    return () => window.removeEventListener('auth:expired', expire)
  }, [])

  const value = useMemo(() => ({
    user: session?.user || null,
    isAuthenticated: Boolean(session?.access_token),
    login: async (email, password, remember = false) => {
      const next = await authRequest('login', { email, password })
      saveAuthSession(next, remember)
      setSession(next)
      return next.user
    },
    register: async (name, email, password) => {
      const next = await authRequest('register', { name, email, password })
      saveAuthSession(next, false)
      setSession(next)
      return next.user
    },
    logout: () => {
      clearAuthSession()
      setSession(null)
    }
  }), [session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
