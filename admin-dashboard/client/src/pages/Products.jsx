import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { productsService } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import { Package } from 'lucide-react';

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', searchQuery, selectedCategory],
    queryFn: async () => {
      try {
        const res = await productsService.getAll({ 
          q: searchQuery || undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined 
        })
        return res.data.data || { products: [], pagination: {} }
      } catch (error) {
        console.error('Failed to fetch products:', error)
        return { products: [], pagination: {} }
      }
    }
  })

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Chettinad Silks', label: 'Chettinad Silks' },
    { value: 'Soft Sico', label: 'Soft Sico' },
    { value: 'Ikath', label: 'Ikath' }
  ]

  const getStockBadge = (quantity) => {
    if (quantity <= 5) return 'bg-red-100 text-red-800'
    if (quantity <= 20) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading products..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
          <p className="text-neutral-600">
            Manage your silk saree inventory ({productsData?.products?.length || 0} products)
          </p>
        </div>
        <Link to="/products/new" className="btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-select"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productsData?.products?.map((product) => (
                <tr key={product._id || product.id}>
                  <td>
                    <div className="flex items-center">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:3001${product.images[0]}`}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover mr-3"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyN0MyMy4zMTM3IDI3IDI2IDI0LjMxMzcgMjYgMjFDMjYgMTcuNjg2MyAyMy4zMTM3IDE1IDIwIDE1QzE2LjY4NjMgMTUgMTQgMTcuNjg2MyAxNCAyMUMxNCAyNC4zMTM3IDE2LjY4NjMgMjcgMjAgMjdaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K'
                          }}
                        />
                      )}
                      <div>
                        <p className="font-medium text-neutral-900">{product.name}</p>
                        <p className="text-sm text-neutral-500">
                          {product.description?.slice(0, 50)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm text-neutral-600">
                      {product.category}
                    </span>
                  </td>
                  <td>
                    <div>
                      <p className="font-medium">₹{product.price.toLocaleString()}</p>
                      {product.originalPrice && (
                        <p className="text-sm text-neutral-500 line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${getStockBadge(product.stockQuantity)}`}>
                      {product.stockQuantity}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${product.inStock ? 'success' : 'danger'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-neutral-600 hover:text-primary-600 rounded-lg hover:bg-primary-50">
                        <Eye className="h-4 w-4" />
                      </button>
                      <Link
                        to={`/products/edit/${product.id}`}
                        className="p-2 text-neutral-600 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button className="p-2 text-neutral-600 hover:text-red-600 rounded-lg hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {(!productsData?.products || productsData.products.length === 0) && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-500 mb-4">No products found</p>
            <Link to="/products/new" className="btn-primary">
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Product
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products