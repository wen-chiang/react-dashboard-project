import { useEffect, useCallback } from 'react'
import { useAuthStore } from '../store/authStore'

export const useApi = () => {
  const { credentials } = useAuthStore()

  const makeRequest = useCallback(
    async (method, endpoint, data = null) => {
      const headers = {
        'Content-Type': 'application/json',
      }

      if (credentials) {
        const encoded = btoa(`${credentials.username}:${credentials.password}`)
        headers['Authorization'] = `Basic ${encoded}`
      }

      const config = {
        method,
        headers,
      }

      if (data) {
        config.body = JSON.stringify(data)
      }

      try {
        const response = await fetch(endpoint, config)
        if (!response.ok) {
          if (response.status === 401) {
            useAuthStore.getState().logout()
            throw new Error('Unauthorized')
          }
          throw new Error(`API error: ${response.statusText}`)
        }
        return await response.json()
      } catch (error) {
        console.error('API request failed:', error)
        throw error
      }
    },
    [credentials]
  )

  return { makeRequest, credentials }
}
