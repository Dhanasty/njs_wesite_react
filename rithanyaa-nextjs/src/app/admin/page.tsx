'use client'

import { useState, useEffect } from 'react'
import { 
  ShoppingBagIcon, 
  CubeIcon, 
  CurrencyRupeeIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline'

interface DashboardStats {
  orders: {
    total: number
    completed: number
    pending: number
    failed: number
    totalRevenue: number
  }
  inventory: {
    totalProducts: number
    totalStock: number
    totalReserved: number
    totalSold: number
    lowStockItems: number
    outOfStockItems: number
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, inventoryRes] = await Promise.all([
          fetch('/api/admin/orders?stats=true'),
          fetch('/api/admin/inventory?stats=true')
        ])

        const ordersData = await ordersRes.json()
        const inventoryData = await inventoryRes.json()

        setStats({
          orders: ordersData.stats,
          inventory: inventoryData.stats
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-300 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-4 bg-neutral-300 rounded w-24 mb-4"></div>
                <div className="h-8 bg-neutral-300 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600">Welcome to Nava Jothi Silks Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600">Total Orders</p>
              <p className="text-2xl font-bold text-neutral-900">{stats?.orders.total || 0}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600">{stats?.orders.completed || 0} completed</span>
            <span className="text-yellow-600 ml-4">{stats?.orders.pending || 0} pending</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyRupeeIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600">Total Revenue</p>
              <p className="text-2xl font-bold text-neutral-900">
                ₹{stats?.orders.totalRevenue?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
          <div className="mt-4 text-sm text-neutral-500">
            From completed orders
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CubeIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600">Total Stock</p>
              <p className="text-2xl font-bold text-neutral-900">{stats?.inventory.totalStock || 0}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-600">{stats?.inventory.lowStockItems || 0} low stock</span>
            <span className="text-red-800 ml-4">{stats?.inventory.outOfStockItems || 0} out of stock</span>
          </div>
        </div>

        {/* Products Sold */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600">Products Sold</p>
              <p className="text-2xl font-bold text-neutral-900">{stats?.inventory.totalSold || 0}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-neutral-500">
            Total items sold
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-neutral-600">New order received</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <span className="text-neutral-600">Low stock alert for 3 products</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-neutral-600">Payment verified successfully</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors">
              <div className="font-medium text-neutral-900">View Recent Orders</div>
              <div className="text-sm text-neutral-600">Check latest customer orders</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors">
              <div className="font-medium text-neutral-900">Manage Inventory</div>
              <div className="text-sm text-neutral-600">Update stock levels</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}