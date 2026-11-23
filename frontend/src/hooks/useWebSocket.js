import { useEffect, useRef } from 'react'
import { connectWebSocket, disconnectWebSocket } from '../services/websocket'

export const useWebSocket = (credentials) => {
  const connectionRef = useRef(null)

  useEffect(() => {
    if (credentials && !connectionRef.current) {
      connectWebSocket(credentials)
        .then((client) => {
          connectionRef.current = client
        })
        .catch((error) => {
          console.error('WebSocket connection failed:', error)
        })

      return () => {
        if (connectionRef.current) {
          disconnectWebSocket()
          connectionRef.current = null
        }
      }
    }
  }, [credentials])

  return connectionRef.current
}
