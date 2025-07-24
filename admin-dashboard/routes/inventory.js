const express = require('express')
const router = express.Router()
const fs = require('fs').promises
const path = require('path')

// Path to store inventory data
const INVENTORY_FILE = path.join(__dirname, '../data/inventory.json')

// Ensure data directory exists
const ensureDataDir = async () => {
  const dataDir = path.dirname(INVENTORY_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
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

// GET /api/inventory - Get all inventory
router.get('/', async (req, res) => {
  try {
    const inventory = await readInventory()
    
    const stats = {
      totalProducts: inventory.length,
      totalStock: inventory.reduce((sum, item) => sum + item.stock, 0),
      totalReserved: inventory.reduce((sum, item) => sum + item.reserved, 0),
      totalSold: inventory.reduce((sum, item) => sum + item.sold, 0),
      lowStockItems: inventory.filter(item => item.stock <= 2 && item.stock > 0).length,
      outOfStockItems: inventory.filter(item => item.stock === 0).length
    }

    res.json({
      success: true,
      inventory,
      stats
    })
  } catch (error) {
    console.error('Error fetching inventory:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory'
    })
  }
})

// GET /api/inventory/:productId - Get inventory for specific product
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params
    const inventory = await readInventory()
    
    const item = inventory.find(inv => inv.productId === parseInt(productId))
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in inventory'
      })
    }

    res.json({
      success: true,
      item
    })
  } catch (error) {
    console.error('Error fetching product inventory:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product inventory'
    })
  }
})

// POST /api/inventory/restock - Restock products
router.post('/restock', async (req, res) => {
  try {
    const { productId, quantity } = req.body
    
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid product ID and quantity are required'
      })
    }

    const inventory = await readInventory()
    const itemIndex = inventory.findIndex(inv => inv.productId === parseInt(productId))
    
    if (itemIndex === -1) {
      // Add new product to inventory
      inventory.push({
        productId: parseInt(productId),
        stock: quantity,
        reserved: 0,
        sold: 0
      })
    } else {
      // Update existing product stock
      inventory[itemIndex].stock += quantity
    }

    await writeInventory(inventory)

    res.json({
      success: true,
      message: `Successfully restocked product ${productId} with ${quantity} units`,
      item: inventory[itemIndex] || inventory[inventory.length - 1]
    })
  } catch (error) {
    console.error('Error restocking product:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to restock product'
    })
  }
})

// PUT /api/inventory/:productId - Update product inventory
router.put('/:productId', async (req, res) => {
  try {
    const { productId } = req.params
    const { stock, reserved, sold } = req.body
    
    const inventory = await readInventory()
    const itemIndex = inventory.findIndex(inv => inv.productId === parseInt(productId))
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in inventory'
      })
    }

    // Update only provided fields
    if (typeof stock === 'number' && stock >= 0) {
      inventory[itemIndex].stock = stock
    }
    if (typeof reserved === 'number' && reserved >= 0) {
      inventory[itemIndex].reserved = reserved
    }
    if (typeof sold === 'number' && sold >= 0) {
      inventory[itemIndex].sold = sold
    }

    await writeInventory(inventory)

    res.json({
      success: true,
      message: 'Inventory updated successfully',
      item: inventory[itemIndex]
    })
  } catch (error) {
    console.error('Error updating inventory:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update inventory'
    })
  }
})

// POST /api/inventory/adjust-stock - Adjust stock for order fulfillment
router.post('/adjust-stock', async (req, res) => {
  try {
    const { items, operation } = req.body // operation: 'reserve', 'confirm', 'release'
    
    if (!items || !Array.isArray(items) || !operation) {
      return res.status(400).json({
        success: false,
        message: 'Items array and operation are required'
      })
    }

    const inventory = await readInventory()
    let allUpdatesSuccessful = true
    const updateResults = []

    for (const item of items) {
      const { productId, quantity } = item
      const invIndex = inventory.findIndex(inv => inv.productId === parseInt(productId))
      
      if (invIndex === -1) {
        allUpdatesSuccessful = false
        updateResults.push({
          productId,
          success: false,
          message: 'Product not found'
        })
        continue
      }

      const invItem = inventory[invIndex]

      switch (operation) {
        case 'reserve':
          if (invItem.stock >= quantity) {
            invItem.stock -= quantity
            invItem.reserved += quantity
            updateResults.push({ productId, success: true, message: 'Reserved successfully' })
          } else {
            allUpdatesSuccessful = false
            updateResults.push({ productId, success: false, message: 'Insufficient stock' })
          }
          break

        case 'confirm':
          if (invItem.reserved >= quantity) {
            invItem.reserved -= quantity
            invItem.sold += quantity
            updateResults.push({ productId, success: true, message: 'Confirmed successfully' })
          } else {
            allUpdatesSuccessful = false
            updateResults.push({ productId, success: false, message: 'Insufficient reserved stock' })
          }
          break

        case 'release':
          if (invItem.reserved >= quantity) {
            invItem.reserved -= quantity
            invItem.stock += quantity
            updateResults.push({ productId, success: true, message: 'Released successfully' })
          } else {
            allUpdatesSuccessful = false
            updateResults.push({ productId, success: false, message: 'Insufficient reserved stock' })
          }
          break

        default:
          allUpdatesSuccessful = false
          updateResults.push({ productId, success: false, message: 'Invalid operation' })
      }
    }

    await writeInventory(inventory)

    res.json({
      success: allUpdatesSuccessful,
      message: allUpdatesSuccessful ? 'All stock adjustments completed' : 'Some stock adjustments failed',
      results: updateResults
    })
  } catch (error) {
    console.error('Error adjusting stock:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to adjust stock'
    })
  }
})

// GET /api/inventory/stats - Get inventory statistics
router.get('/stats', async (req, res) => {
  try {
    const inventory = await readInventory()
    
    const stats = {
      totalProducts: inventory.length,
      totalStock: inventory.reduce((sum, item) => sum + item.stock, 0),
      totalReserved: inventory.reduce((sum, item) => sum + item.reserved, 0),
      totalSold: inventory.reduce((sum, item) => sum + item.sold, 0),
      lowStockItems: inventory.filter(item => item.stock <= 2 && item.stock > 0),
      outOfStockItems: inventory.filter(item => item.stock === 0),
      topSellingItems: inventory
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
        .map(item => ({
          productId: item.productId,
          sold: item.sold,
          stock: item.stock
        }))
    }

    res.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Error fetching inventory stats:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory statistics'
    })
  }
})

module.exports = router