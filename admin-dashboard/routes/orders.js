const express = require('express')
const router = express.Router()
const fs = require('fs').promises
const path = require('path')

// Path to store orders data
const ORDERS_FILE = path.join(__dirname, '../data/orders.json')
const INVENTORY_FILE = path.join(__dirname, '../data/inventory.json')

// Ensure data directory exists
const ensureDataDir = async () => {
  const dataDir = path.dirname(ORDERS_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Read orders from file
const readOrders = async () => {
  try {
    await ensureDataDir()
    const data = await fs.readFile(ORDERS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, return empty array
    return []
  }
}

// Write orders to file
const writeOrders = async (orders) => {
  await ensureDataDir()
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2))
}

// Read inventory from file
const readInventory = async () => {
  try {
    await ensureDataDir()
    const data = await fs.readFile(INVENTORY_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    // Initialize with default inventory
    const defaultInventory = []
    for (let i = 1; i <= 50; i++) {
      defaultInventory.push({
        productId: i,
        stock: 10,
        reserved: 0,
        sold: 0
      })
    }
    await writeInventory(defaultInventory)
    return defaultInventory
  }
}

// Write inventory to file
const writeInventory = async (inventory) => {
  await ensureDataDir()
  await fs.writeFile(INVENTORY_FILE, JSON.stringify(inventory, null, 2))
}

// GET /api/orders - Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await readOrders()
    const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    const stats = {
      total: orders.length,
      completed: orders.filter(o => o.status === 'completed').length,
      pending: orders.filter(o => o.status === 'pending').length,
      failed: orders.filter(o => o.status === 'failed').length,
      totalRevenue: orders
        .filter(o => o.status === 'completed')
        .reduce((sum, order) => sum + (order.finalAmount || 0), 0)
    }

    res.json({
      success: true,
      orders: sortedOrders,
      stats
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    })
  }
})

// POST /api/orders - Create new order (from website)
router.post('/', async (req, res) => {
  try {
    const orderData = req.body
    console.log('Received order data:', orderData)
    
    // Validate required fields
    if (!orderData.orderId || !orderData.paymentId) {
      console.log('Missing required fields:', { orderId: orderData.orderId, paymentId: orderData.paymentId })
      return res.status(400).json({
        success: false,
        message: 'Order ID and Payment ID are required'
      })
    }

    const orders = await readOrders()
    
    // Check if order already exists
    const existingOrder = orders.find(o => o.orderId === orderData.orderId)
    if (existingOrder) {
      return res.status(409).json({
        success: false,
        message: 'Order already exists'
      })
    }

    // Create new order
    const newOrder = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    orders.push(newOrder)
    await writeOrders(orders)

    // Update inventory
    const inventory = await readInventory()
    let stockUpdateSuccess = true
    
    if (orderData.items && Array.isArray(orderData.items)) {
      for (const item of orderData.items) {
        const inventoryItem = inventory.find(inv => inv.productId === item.productId)
        if (inventoryItem) {
          if (inventoryItem.stock >= item.quantity) {
            inventoryItem.stock -= item.quantity
            inventoryItem.sold += item.quantity
          } else {
            stockUpdateSuccess = false
            console.warn(`Insufficient stock for product ${item.productId}`)
          }
        }
      }
      await writeInventory(inventory)
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: newOrder,
      stockUpdateSuccess
    })
  } catch (error) {
    console.error('Error creating order:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    })
  }
})

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['pending', 'completed', 'failed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      })
    }

    const orders = await readOrders()
    const orderIndex = orders.findIndex(o => o.orderId === id || o.id === id)

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    orders[orderIndex].status = status
    orders[orderIndex].updatedAt = new Date().toISOString()

    await writeOrders(orders)

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: orders[orderIndex]
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    })
  }
})

// GET /api/orders/stats - Get order statistics
router.get('/stats', async (req, res) => {
  try {
    const orders = await readOrders()
    
    const stats = {
      total: orders.length,
      completed: orders.filter(o => o.status === 'completed').length,
      pending: orders.filter(o => o.status === 'pending').length,
      failed: orders.filter(o => o.status === 'failed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter(o => o.status === 'completed')
        .reduce((sum, order) => sum + (order.finalAmount || 0), 0),
      averageOrderValue: orders.length > 0 
        ? orders.reduce((sum, order) => sum + (order.finalAmount || 0), 0) / orders.length 
        : 0,
      recentOrders: orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    }

    res.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Error fetching order stats:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics'
    })
  }
})

module.exports = router