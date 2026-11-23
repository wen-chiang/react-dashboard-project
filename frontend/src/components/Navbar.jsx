import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import { useNavigate } from 'react-router-dom'
import { Menu, Search, Moon, Sun, Bell, Mail } from 'react-feather'

export default function Navbar({ onToggleSidebar }) {
  const { user } = useAuthStore()
  const { isDarkMode, toggleTheme } = useThemeStore()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const username = user?.username || 'admin'
  const initials = username.slice(0, 2).toUpperCase()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <nav className="topnav">
      <button className="sidebar-toggle" type="button" aria-label="Toggle sidebar" onClick={onToggleSidebar}>
        <Menu />
      </button>

      <form className="topnav-search" onSubmit={handleSearch}>
        <Search />
        <input
          type="text"
          placeholder="Search orders, customers…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <div className="topnav-actions">
        <button className="icon-btn" type="button" onClick={toggleTheme} aria-label="Toggle dark mode">
          {isDarkMode ? <Sun /> : <Moon />}
        </button>
        <button className="icon-btn" type="button" aria-label="Notifications">
          <Bell />
          <span className="badge-dot"></span>
        </button>
        <button className="icon-btn" type="button" aria-label="Messages">
          <Mail />
        </button>
        <div className="topnav-user">
          <div className="avatar-circle">{initials}</div>
          <span className="user-name">{username}</span>
        </div>
      </div>
    </nav>
  )
}
