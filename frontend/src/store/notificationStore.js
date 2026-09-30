import { create } from 'zustand'
import { toast } from 'react-toastify'

export const useNotificationStore = create((set) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = Date.now()
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }))
    
    toast.info(`Order ${notification.orderNumber}: ${notification.message}`, {
      autoClose: 5000,
    })
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  clearNotifications: () => {
    set({ notifications: [] })
  },
}))
