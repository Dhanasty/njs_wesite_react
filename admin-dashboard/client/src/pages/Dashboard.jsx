import { useQuery } from '@tanstack/react-query'
import { productsService } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { Package, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  // Fetch product stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['product-stats'],
    queryFn: async () => {
      try {
        const res = await productsService.getStats()
        return res.data.data.stats
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        return null
      }
    }
  })

  // Fetch low stock products
  const { data: lowStock, isLoading: lowStockLoading } = useQuery({
    queryKey: ['low-stock'],
    queryFn: async () => {
      try {
        const res = await productsService.getLowStock()
        return res.data.data
      } catch (error) {
        console.error('Failed to fetch low stock:', error)
        return { count: 0, products: [] }
      }
    }
  })

  // Fetch recent products
  const { data: recentProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['recent-products'],
    queryFn: async () => {
      try {
        const res = await productsService.getAll({ limit: 5, offset: 0 })
        return res.data.data.products || []
      } catch (error) {
        console.error('Failed to fetch recent products:', error)
        return []
      }
    }
  })

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    )
  }

  const statCards = [
    {
      name: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Inventory Value',
      value: `₹${(stats?.totalInventoryValue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Low Stock Items',
      value: stats?.lowStockProducts || 0,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      name: 'Categories',
      value: Object.keys(stats?.categories || {}).length,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-primary-100">
          Manage your Nava Jothi Silks inventory and track performance metrics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="card">
            <div className="card-body p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-neutral-900 flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              Low Stock Alerts
            </h3>
          </div>
          <div className="card-body">
            {lowStockLoading ? (
              <div className="text-center py-8">
                <LoadingSpinner size="md" />
              </div>
            ) : lowStock?.products?.length > 0 ? (
              <div className="space-y-3">
                {lowStock.products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-neutral-900">{product.name}</p>
                      <p className="text-sm text-neutral-600">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">
                        {product.stockQuantity} left
                      </p>
                      <p className="text-xs text-neutral-500">
                        ₹{product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-center py-8">
                No low stock items
              </p>
            )}
          </div>
        </div>

        {/* Recent Products */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-neutral-900 flex items-center">
              <Package className="h-5 w-5 text-primary-600 mr-2" />
              Recent Products
            </h3>
          </div>
          <div className="card-body">
            {productsLoading ? (
              <div className="text-center py-8">
                <LoadingSpinner size="md" />
              </div>
            ) : recentProducts?.length > 0 ? (
              <div className="space-y-3">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg transition-colors">
                    <div>
                      <p className="font-medium text-neutral-900">{product.name}</p>
                      <p className="text-sm text-neutral-600">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-neutral-900">
                        ₹{product.price.toLocaleString()}
                      </p>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                        product.stockStatus === 'low' ? 'bg-red-100 text-red-800' :
                        product.stockStatus === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {product.stockQuantity} in stock
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-center py-8">
                No products found
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {stats?.categories && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-neutral-900">
              Products by Category
            </h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(stats.categories).map(([category, count]) => (
                <div key={category} className="text-center p-4 bg-neutral-50 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600">{count}</p>
                  <p className="text-sm font-medium text-neutral-600">{category}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard