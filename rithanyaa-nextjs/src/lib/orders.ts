export interface OrderItem {
  id: string
  productId: number
  name: string
  price: number
  originalPrice: number
  image: string
  category: string
  selectedColor?: {
    name: string
    value: string
  }
  quantity: number
  slug: string
}

export interface Order {
  id: string
  orderId: string
  paymentId: string
  amount: number
  discount: number
  finalAmount: number
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  paymentStatus: 'pending' | 'completed' | 'failed'
  items: OrderItem[]
  customerDetails: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    country: string
    notes?: string
  }
  giftCode?: {
    code: string
    discount: number
    type: 'percentage' | 'fixed'
  }
  createdAt: string
  updatedAt: string
}

// In-memory storage for orders (in production, use a database)
let orders: Order[] = []

export const saveOrder = (order: Order): void => {
  // Check if order already exists
  const existingIndex = orders.findIndex(o => o.orderId === order.orderId)
  
  if (existingIndex >= 0) {
    // Update existing order
    orders[existingIndex] = { ...order, updatedAt: new Date().toISOString() }
  } else {
    // Add new order
    orders.push({ ...order, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
  }

  // Save to localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_orders', JSON.stringify(orders))
  }
}

export const getOrders = (): Order[] => {
  // Load from localStorage if available
  if (typeof window !== 'undefined') {
    const savedOrders = localStorage.getItem('admin_orders')
    if (savedOrders) {
      try {
        orders = JSON.parse(savedOrders)
      } catch (error) {
        console.error('Error loading orders from localStorage:', error)
      }
    }
  }
  
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export const getOrderById = (orderId: string): Order | undefined => {
  const allOrders = getOrders()
  return allOrders.find(order => order.orderId === orderId)
}

export const updateOrderStatus = (orderId: string, status: Order['status']): void => {
  const orderIndex = orders.findIndex(o => o.orderId === orderId)
  if (orderIndex >= 0) {
    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
      updatedAt: new Date().toISOString()
    }
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_orders', JSON.stringify(orders))
    }
  }
}

export const getOrderStats = () => {
  const allOrders = getOrders()
  
  return {
    total: allOrders.length,
    completed: allOrders.filter(o => o.status === 'completed').length,
    pending: allOrders.filter(o => o.status === 'pending').length,
    failed: allOrders.filter(o => o.status === 'failed').length,
    totalRevenue: allOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, order) => sum + order.finalAmount, 0)
  }
}