import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import AppLayout from './components/AppLayout'
import DashboardPage from './pages/DashboardPage'
import OrdersPage from './pages/OrdersPage'
import CustomersPage from './pages/CustomersPage'
import SearchPage from './pages/SearchPage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import PlaceholderPage from './pages/PlaceholderPage'
import ElementsPage from './pages/ElementsPage'
import ErrorPage from './pages/ErrorPage'
import PipelinePage from './pages/PipelinePage'
import OrderFlowPage from './pages/OrderFlowPage'
import ProductsPage from './pages/ProductsPage'
import CategoriesPage from './pages/CategoriesPage'

import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <Router>
      {!isAuthenticated ? (
        <LoginPage />
      ) : (
        <AppLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/pending" element={<ElementsPage />} />
            <Route path="/orders/completed" element={<PlaceholderPage title="Completed Orders" parent="Orders" />} />
            <Route path="/orders/cancelled" element={<ErrorPage />} />
            <Route path="/orders/pipeline" element={<PipelinePage />} />
            <Route path="/orders/flow" element={<OrderFlowPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/categories" element={<CategoriesPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/reports/sales" element={<PlaceholderPage title="Sales Report" parent="Reports" />} />
            <Route path="/reports/traffic" element={<PlaceholderPage title="Traffic Report" parent="Reports" />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </AppLayout>
      )}
      <ToastContainer position="bottom-right" autoClose={5000} />
    </Router>
  )
}

export default App
