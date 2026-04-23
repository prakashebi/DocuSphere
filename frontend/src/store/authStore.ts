import { create } from 'zustand'
import { authApi } from '../api/auth'
import type { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
  fetchMe: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const { access_token } = await authApi.login(email, password)
      localStorage.setItem('token', access_token)
      const user = await authApi.me()
      set({ token: access_token, user, loading: false })
    } catch (err: unknown) {
      const msg = extractError(err) ?? 'Login failed'
      set({ error: msg, loading: false })
      throw new Error(msg)
    }
  },

  register: async (email, username, password) => {
    set({ loading: true, error: null })
    try {
      await authApi.register(email, username, password)
      const { access_token } = await authApi.login(email, password)
      localStorage.setItem('token', access_token)
      const user = await authApi.me()
      set({ token: access_token, user, loading: false })
    } catch (err: unknown) {
      const msg = extractError(err) ?? 'Registration failed'
      set({ error: msg, loading: false })
      throw new Error(msg)
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },

  fetchMe: async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const user = await authApi.me()
      set({ user })
    } catch {
      localStorage.removeItem('token')
      set({ user: null, token: null })
    }
  },

  clearError: () => set({ error: null }),
}))

function extractError(err: unknown): string | undefined {
  if (err && typeof err === 'object' && 'response' in err) {
    const r = (err as { response?: { data?: { detail?: string } } }).response
    return r?.data?.detail?.toString()
  }
}
