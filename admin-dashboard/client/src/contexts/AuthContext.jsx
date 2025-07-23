import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState(() => {
    return localStorage.getItem('admin_token')
  })

  // Set up axios default header
  useEffect(() => {
    if (token) {
      authAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete authAPI.defaults.headers.common['Authorization']
    }
  }, [token])

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const response = await authAPI.get('/auth/me')
        if (response.data.success) {
          setAdmin(response.data.data.admin)
          setIsAuthenticated(true)
        } else {
          throw new Error('Token verification failed')
        }
      } catch (error) {
        console.error('Token verification failed:', error)
        localStorage.removeItem('admin_token')
        setToken(null)
        setAdmin(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [token])

  const login = async (email, password) => {
    try {
      setIsLoading(true)
      const response = await authAPI.post('/auth/login', { email, password })
      
      if (response.data.success) {
        const { token: newToken, admin: adminData } = response.data.data
        
        localStorage.setItem('admin_token', newToken)
        setToken(newToken)
        setAdmin(adminData)
        setIsAuthenticated(true)
        
        return { success: true }
      } else {
        throw new Error(response.data.message || 'Login failed')
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed'
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authAPI.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('admin_token')
      setToken(null)
      setAdmin(null)
      setIsAuthenticated(false)
    }
  }

  const updateProfile = async (profileData) => {
    try {
      setAdmin(prev => ({ ...prev, ...profileData }))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authAPI.put('/auth/change-password', {
        currentPassword,
        newPassword
      })
      
      if (response.data.success) {
        return { success: true, message: response.data.message }
      } else {
        throw new Error(response.data.message || 'Password change failed')
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Password change failed'
      return { success: false, error: message }
    }
  }

  const value = {
    admin,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateProfile,
    changePassword
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}