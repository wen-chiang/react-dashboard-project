import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Box, Home, ShoppingCart, Package, Users, BarChart2, Settings, LogOut, ChevronDown } from 'react-feather'
import { useAuthStore } from '../store/authStore'

const PAGES = [
  { type: 'link', label: 'Dashboard', icon: Home, to: '/dashboard' },
  {
    type: 'submenu', label: 'Orders', icon: ShoppingCart, base: '/orders',
    children: [
      { label: 'All Orders', to: '/orders' },
      { label: 'Pending', to: '/orders/pending' },
      { label: 'Completed', to: '/orders/completed' },
      { label: 'Cancelled', to: '/orders/cancelled' },
      { label: 'Fulfillment Pipeline', to: '/orders/pipeline' },
      { label: 'Order Flow (BPMN)', to: '/orders/flow' },
    ],
  },
  {
    type: 'submenu', label: 'Products', icon: Package, base: '/products',
    children: [
      { label: 'All Products', to: '/products' },
      { label: 'Categories', to: '/products/categories' },
    ],
  },
  { type: 'link', label: 'Customers', icon: Users, to: '/customers' },
  {
    type: 'submenu', label: 'Reports', icon: BarChart2, base: '/reports',
    children: [
      { label: 'Sales', to: '/reports/sales' },
      { label: 'Traffic', to: '/reports/traffic' },
    ],
  },
]

export default function Sidebar() {
  const location = useLocation()
  const { logout } = useAuthStore()

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')
  const inSection = (base) => location.pathname === base || location.pathname.startsWith(base + '/')

  const [open, setOpen] = useState(() =>
    Object.fromEntries(PAGES.filter((p) => p.type === 'submenu').map((p) => [p.label, inSection(p.base)]))
  )
  const toggle = (label) => setOpen((o) => ({ ...o, [label]: !o[label] }))

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <Box size={22} />
        <span>Sample Dashboard</span>
      </div>

      <div className="sidebar-section-title">Pages</div>
      <ul className="sidebar-nav">
        {PAGES.map((item) => {
          const Icon = item.icon
          if (item.type === 'link') {
            return (
              <li key={item.label} className={`nav-item ${isActive(item.to) ? 'active' : ''}`}>
                <Link className="nav-link" to={item.to}><Icon /><span>{item.label}</span></Link>
              </li>
            )
          }
          return (
            <li key={item.label} className={`nav-item has-submenu ${inSection(item.base) ? 'active open' : ''}`}>
              <button
                type="button"
                className="nav-link submenu-toggle"
                aria-expanded={!!open[item.label]}
                onClick={() => toggle(item.label)}
              >
                <Icon /><span>{item.label}</span>
                <ChevronDown className="chevron" />
              </button>
              {open[item.label] && (
                <ul className="submenu">
                  {item.children.map((c) => (
                    <li key={c.to} className={location.pathname === c.to ? 'active' : ''}>
                      <Link to={c.to}>{c.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>

      <div className="sidebar-section-title">Account</div>
      <ul className="sidebar-nav">
        <li className={`nav-item ${isActive('/settings') ? 'active' : ''}`}>
          <Link className="nav-link" to="/settings"><Settings /><span>Settings</span></Link>
        </li>
        <li className="nav-item">
          <button type="button" className="nav-link sign-out-btn" onClick={logout}>
            <LogOut /><span>Sign Out</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
