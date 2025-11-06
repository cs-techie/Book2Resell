import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'

type User = { id: number, name: string, email: string, is_admin: boolean }

type Ctx = {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (payload: { name: string, email: string, password: string, college?: string, contact_no?: string }) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<Ctx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  const value = useMemo<Ctx>(() => ({
    token,
    user,
    isAuthenticated: !!token,
    login: async (email, password) => {
      try {
        const res = await api.post('/api/auth/login', { email, password })
        setToken(res.data.access_token)
        // Basic user inference: fetch profile through /me/listings or extend backend later
        setUser({ id: 0, name: email.split('@')[0], email, is_admin: false })
        return true
      } catch {
        return false
      }
    },
    signup: async (payload) => {
      try {
        await api.post('/api/auth/signup', payload)
        return true
      } catch {
        return false
      }
    },
    logout: () => {
      setToken(null)
      setUser(null)
    }
  }), [token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

