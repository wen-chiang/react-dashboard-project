import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { useNotificationStore } from '../store/notificationStore'

let client = null

export const connectWebSocket = (credentials) => {
  return new Promise((resolve, reject) => {
    const socket = new SockJS('http://localhost:8080/ws')
    client = new Client({ webSocketFactory: () => socket })

    const headers = {}
    if (credentials) {
      const encoded = btoa(`${credentials.username}:${credentials.password}`)
      headers['Authorization'] = `Basic ${encoded}`
    }

    client.connect(headers, () => {
      console.log('WebSocket connected')
      
      // Subscribe to order notifications
      client.subscribe('/topic/orders', (message) => {
        const notification = JSON.parse(message.body)
        useNotificationStore.getState().addNotification(notification)
      })

      resolve(client)
    }, (error) => {
      console.error('WebSocket connection error:', error)
      reject(error)
    })
  })
}

export const disconnectWebSocket = () => {
  if (client && client.connected) {
    client.disconnect(() => {
      console.log('WebSocket disconnected')
    })
  }
}

export const getWebSocketClient = () => client
