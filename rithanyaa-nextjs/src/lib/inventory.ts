export interface StockItem {
  productId: number
  stock: number
  reserved: number
  sold: number
}

// In-memory storage for inventory (in production, use a database)
let inventory: StockItem[] = []

// Initialize default stock for all products
const initializeInventory = () => {
  if (inventory.length === 0) {
    // Initialize with default stock values
    for (let i = 1; i <= 50; i++) {
      inventory.push({
        productId: i,
        stock: 10, // Default stock of 10 for each product
        reserved: 0,
        sold: 0
      })
    }
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_inventory', JSON.stringify(inventory))
    }
  }
}

export const getInventory = (): StockItem[] => {
  // Load from localStorage if available
  if (typeof window !== 'undefined') {
    const savedInventory = localStorage.getItem('admin_inventory')
    if (savedInventory) {
      try {
        inventory = JSON.parse(savedInventory)
      } catch (error) {
        console.error('Error loading inventory from localStorage:', error)
      }
    }
  }
  
  if (inventory.length === 0) {
    initializeInventory()
  }
  
  return inventory
}

export const getProductStock = (productId: number): StockItem | undefined => {
  const allInventory = getInventory()
  return allInventory.find(item => item.productId === productId)
}

export const updateStock = (productId: number, quantitySold: number): boolean => {
  const itemIndex = inventory.findIndex(item => item.productId === productId)
  
  if (itemIndex >= 0) {
    const item = inventory[itemIndex]
    
    // Check if enough stock is available
    if (item.stock >= quantitySold) {
      inventory[itemIndex] = {
        ...item,
        stock: item.stock - quantitySold,
        sold: item.sold + quantitySold
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_inventory', JSON.stringify(inventory))
      }
      
      return true
    }
    
    return false // Not enough stock
  }
  
  return false // Product not found
}

export const reserveStock = (productId: number, quantity: number): boolean => {
  const itemIndex = inventory.findIndex(item => item.productId === productId)
  
  if (itemIndex >= 0) {
    const item = inventory[itemIndex]
    
    if (item.stock >= quantity) {
      inventory[itemIndex] = {
        ...item,
        stock: item.stock - quantity,
        reserved: item.reserved + quantity
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_inventory', JSON.stringify(inventory))
      }
      
      return true
    }
  }
  
  return false
}

export const releaseReservedStock = (productId: number, quantity: number): void => {
  const itemIndex = inventory.findIndex(item => item.productId === productId)
  
  if (itemIndex >= 0) {
    const item = inventory[itemIndex]
    
    inventory[itemIndex] = {
      ...item,
      stock: item.stock + quantity,
      reserved: Math.max(0, item.reserved - quantity)
    }
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_inventory', JSON.stringify(inventory))
    }
  }
}

export const confirmReservedStock = (productId: number, quantity: number): void => {
  const itemIndex = inventory.findIndex(item => item.productId === productId)
  
  if (itemIndex >= 0) {
    const item = inventory[itemIndex]
    
    inventory[itemIndex] = {
      ...item,
      reserved: Math.max(0, item.reserved - quantity),
      sold: item.sold + quantity
    }
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_inventory', JSON.stringify(inventory))
    }
  }
}

export const restockProduct = (productId: number, quantity: number): void => {
  const itemIndex = inventory.findIndex(item => item.productId === productId)
  
  if (itemIndex >= 0) {
    inventory[itemIndex] = {
      ...inventory[itemIndex],
      stock: inventory[itemIndex].stock + quantity
    }
  } else {
    // Add new product to inventory
    inventory.push({
      productId,
      stock: quantity,
      reserved: 0,
      sold: 0
    })
  }
  
  // Save to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_inventory', JSON.stringify(inventory))
  }
}

export const getInventoryStats = () => {
  const allInventory = getInventory()
  
  return {
    totalProducts: allInventory.length,
    totalStock: allInventory.reduce((sum, item) => sum + item.stock, 0),
    totalReserved: allInventory.reduce((sum, item) => sum + item.reserved, 0),
    totalSold: allInventory.reduce((sum, item) => sum + item.sold, 0),
    lowStockItems: allInventory.filter(item => item.stock <= 2).length,
    outOfStockItems: allInventory.filter(item => item.stock === 0).length
  }
}