/**
 * Redirect after auth success
 */
export const redirectAfterLogin = (navigate, defaultPath = '/') => {
  const redirectTo = localStorage.getItem('redirectAfterLogin') || defaultPath
  localStorage.removeItem('redirectAfterLogin')
  navigate(redirectTo)
}

/**
 * Store redirect path before login
 */
export const setRedirectAfterLogin = (path) => {
  localStorage.setItem('redirectAfterLogin', path)
}

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

/**
 * Format date
 */
export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Get status badge color
 */
export const getStatusBadgeClass = (status) => {
  const statusMap = {
    COMPLETED: 'success',
    PENDING: 'warning',
    CANCELLED: 'danger',
  }
  return statusMap[status] || 'secondary'
}
