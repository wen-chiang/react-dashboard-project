import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  credentials: null,
  user: null,

  login: (username, password) => {
    const credentials = { username, password }
    localStorage.setItem('auth_credentials', JSON.stringify(credentials))
    set(() => ({
      isAuthenticated: true,
      credentials,
      user: { username },
    }))
  },

  logout: () => {
    localStorage.removeItem('auth_credentials')
    set(() => ({
      isAuthenticated: false,
      credentials: null,
      user: null,
    }))
  },

  checkAuth: () => {
    const stored = localStorage.getItem('auth_credentials')
    if (stored) {
      const credentials = JSON.parse(stored)
      set(() => ({
        isAuthenticated: true,
        credentials,
        user: { username: credentials.username },
      }))
    }
  },
}))
