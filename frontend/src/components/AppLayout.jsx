import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { useAuthStore } from '../store/authStore'
import { connectWebSocket, disconnectWebSocket } from '../services/websocket'

export default function AppLayout({ children }) {
  const { credentials } = useAuthStore()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (credentials) {
      connectWebSocket(credentials).catch((error) => {
        console.error('Failed to connect WebSocket:', error)
      })

      return () => {
        disconnectWebSocket()
      }
    }
  }, [credentials])

  return (
    <div className={`wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="main-content">
        <Navbar onToggleSidebar={() => setSidebarCollapsed((v) => !v)} />
        <div className="content-area">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  )
}
