import axios from 'axios'
import toast from 'react-hot-toast'

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
export const authAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true
})

// Request interceptor
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('admin_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authService = {
  login: (credentials) => authAPI.post('/auth/login', credentials),
  logout: () => authAPI.post('/auth/logout'),
  verify: () => authAPI.get('/auth/me'),
  getProfile: () => authAPI.get('/auth/me'),
  changePassword: (data) => authAPI.put('/auth/change-password', data)
}

// Products API
export const productsService = {
  getAll: (params = {}) => authAPI.get('/products', { params }),
  getById: (id) => authAPI.get(`/products/${id}`),
  create: (data) => authAPI.post('/products', data),
  update: (id, data) => authAPI.put(`/products/${id}`, data),
  delete: (id) => authAPI.delete(`/products/${id}`),
  updateStock: (id, data) => authAPI.patch(`/products/${id}/stock`, data),
  getStats: () => authAPI.get('/products/stats/overview'),
  getLowStock: () => authAPI.get('/products/alerts/low-stock'),
  bulkUpdateStock: (updates) => authAPI.post('/products/bulk/update-stock', { updates }),
  search: (query) => authAPI.get('/products', { params: { q: query } })
}

// Upload API
export const uploadService = {
  uploadImages: (formData) => {
    return authAPI.post('/upload/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  uploadSingle: (formData) => {
    return authAPI.post('/upload/products/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deleteImage: (filename) => authAPI.delete(`/upload/products/${filename}`),
  getStats: () => authAPI.get('/upload/stats')
}

// Generic API error handler
export const handleAPIError = (error, defaultMessage = 'An error occurred') => {
  const message = error.response?.data?.message || error.message || defaultMessage
  toast.error(message)
  console.error('API Error:', error)
  return message
}

// Generic API success handler
export const handleAPISuccess = (response, defaultMessage = 'Success') => {
  const message = response.data?.message || defaultMessage
  toast.success(message)
  return response.data
}

export default authAPI