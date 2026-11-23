import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  isDarkMode: localStorage.getItem('theme') === 'dark',

  toggleTheme: () => {
    set((state) => {
      const newMode = !state.isDarkMode
      localStorage.setItem('theme', newMode ? 'dark' : 'light')
      if (newMode) {
        document.documentElement.setAttribute('data-bs-theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-bs-theme')
      }
      return { isDarkMode: newMode }
    })
  },
}))
