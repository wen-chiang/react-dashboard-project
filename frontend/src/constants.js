/**
 * API Configuration constants
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
}

/**
 * Authentication constants
 */
export const AUTH_CONFIG = {
  STORAGE_KEY: 'auth_credentials',
  DEMO_USERNAME: 'admin',
  DEMO_PASSWORD: 'admin123',
}

/**
 * WebSocket configuration
 */
export const WS_CONFIG = {
  URL: 'http://localhost:8080/ws',
  RECONNECT_INTERVAL: 5000,
  RECONNECT_ATTEMPTS: 5,
}

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [5, 10, 25, 50],
}

/**
 * Order statuses
 */
export const ORDER_STATUS = {
  COMPLETED: 'COMPLETED',
  PENDING: 'PENDING',
  CANCELLED: 'CANCELLED',
}

/**
 * Status labels
 */
export const STATUS_LABELS = {
  [ORDER_STATUS.COMPLETED]: 'Completed',
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
}

/**
 * Toast notification types
 */
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
}
