import client from './client'
import type { User } from '../types'

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await client.post<{ access_token: string; token_type: string }>('/auth/login', {
      email,
      password,
    })
    return res.data
  },

  register: async (email: string, username: string, password: string) => {
    const res = await client.post<User>('/auth/register', { email, username, password })
    return res.data
  },

  me: async () => {
    const res = await client.get<User>('/users/me')
    return res.data
  },
}
