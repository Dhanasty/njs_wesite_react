'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, HeartIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

// Product data
const allProducts = [
  {
    id: 1,
    name: 'Ivory - Chettinad Silk',
    price: 3455,
    originalPrice: 4200,
    image: '/images/products/chettinad1.jpg',
    category: 'chettinad',
    categoryName: 'Chettinad Silks',
    rating: 4.8,
    reviews: 124,
    badge: 'Featured',
    description: 'Traditional handwoven silk with intricate patterns',
    colors: ['Ivory', 'Gold'],
    material: 'Pure Silk'
  },
  {
    id: 2,
    name: 'Premium Chettinad Silk',
    price: 3305,
    originalPrice: 4000,
    image: '/images/products/chettinad3.jpg',
    category: 'chettinad',
    categoryName: 'Chettinad Silks',
    rating: 4.7,
    reviews: 98,
    badge: 'Traditional',
    description: 'Authentic Tamil Nadu craftsmanship',
    colors: ['Red', 'Gold'],
    material: 'Pure Silk'
  },
  {
    id: 3,
    name: 'Rajmudra - Chettinad Silk',
    price: 3305,
    originalPrice: 3900,
    image: '/images/products/chettinad4.jpg',
    category: 'chettinad',
    categoryName: 'Chettinad Silks',
    rating: 4.9,
    reviews: 156,
    badge: 'Royal',
    description: 'Royal designs with golden accents',
    colors: ['Maroon', 'Gold'],
    material: 'Pure Silk'
  },
  {
    id: 4,
    name: 'Royal - Chettinad Silk',
    price: 3305,
    originalPrice: 4100,
    image: '/images/products/chettinad5.jpg',
    category: 'chettinad',
    categoryName: 'Chettinad Silks',
    rating: 4.8,
    reviews: 203,
    badge: 'Premium',
    description: 'Luxurious patterns for special occasions',
    colors: ['Navy', 'Gold'],
    material: 'Pure Silk'
  },
  {
    id: 5,
    name: 'Elegant Soft Sico',
    price: 2499,
    originalPrice: 3100,
    image: '/images/products/chettinad2.jpg',
    category: 'soft-sico',
    categoryName: 'Soft Sico',
    rating: 4.9,
    reviews: 89,
    badge: 'Bestseller',
    description: 'Contemporary design with traditional appeal',
    colors: ['Pink', 'Silver'],
    material: 'Soft Silk'
  },
  {
    id: 6,
    name: 'Aabharana - Soft Sico',
    price: 2415,
    originalPrice: 2900,
    image: '/images/products/softsico1.jpg',
    category: 'soft-sico',
    categoryName: 'Soft Sico',
    rating: 4.6,
    reviews: 67,
    badge: 'New',
    description: 'Ornamental beauty in soft silk',
    colors: ['Green', 'Gold'],
    material: 'Soft Silk'
  },
  {
    id: 7,
    name: 'Rudra Rekha - Soft Sico',
    price: 2365,
    originalPrice: 2800,
    image: '/images/products/softsico2.jpg',
    category: 'soft-sico',
    categoryName: 'Soft Sico',
    rating: 4.7,
    reviews: 112,
    badge: 'Limited',
    description: 'Divine patterns in luxurious silk',
    colors: ['Purple', 'Gold'],
    material: 'Soft Silk'
  },
  {
    id: 8,
    name: 'Traditional Ikath',
    price: 2365,
    originalPrice: 2800,
    image: '/images/products/ikath1.jpg',
    category: 'ikath',
    categoryName: 'Ikath',
    rating: 4.7,
    reviews: 156,
    badge: 'Heritage',
    description: 'Authentic tie-dye technique silk',
    colors: ['Multi-color'],
    material: 'Handloom Silk'
  },
  {
    id: 9,
    name: 'Designer Ikath',
    price: 4299,
    originalPrice: 5200,
    image: '/images/products/ikath2.jpg',
    category: 'ikath',
    categoryName: 'Ikath',
    rating: 4.9,
    reviews: 203,
    badge: 'Designer',
    description: 'Modern interpretation of classic patterns',
    colors: ['Blue', 'White'],
    material: 'Pure Silk'
  }
]

const filterCategories = [
  { id: 'all', name: 'All Products', count: allProducts.length },
  { id: 'chettinad', name: 'Chettinad Silks', count: allProducts.filter(p => p.category === 'chettinad').length },
  { id: 'soft-sico', name: 'Soft Sico', count: allProducts.filter(p => p.category === 'soft-sico').length },
  { id: 'ikath', name: 'Ikath', count: allProducts.filter(p => p.category === 'ikath').length }
]

const sortOptions = [
  { id: 'featured', name: 'Featured' },
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
  { id: 'rating', name: 'Highest Rated' },
  { id: 'newest', name: 'Newest First' }
]

export default function Catalog() {
  const [filteredProducts, setFilteredProducts] = useState(allProducts)
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [searchQuery, setSearchQuery] = useState('')
  const [wishlist, setWishlist] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort products
  useEffect(() => {
    let products = [...allProducts]

    // Filter by category
    if (activeFilter !== 'all') {
      products = products.filter(product => product.category === activeFilter)
    }

    // Filter by search query
    if (searchQuery) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        products.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        products.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        // Assuming newer products have higher IDs
        products.sort((a, b) => b.id - a.id)
        break
      default:
        // Featured - keep original order
        break
    }

    setFilteredProducts(products)
  }, [activeFilter, sortBy, searchQuery])

  const toggleWishlist = (productId: number) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-cream via-white to-primary-50/30">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="hero-title text-white mb-6">Our Complete Catalog</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Explore our entire collection of premium silk sarees, each piece crafted with love and tradition.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="card-elegant sticky top-24">
              <h3 className="font-display text-xl font-semibold text-primary-900 mb-6">Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">Search Products</label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by name, category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-neutral-900 mb-4">Categories</h4>
                <div className="space-y-2">
                  {filterCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveFilter(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                        activeFilter === category.id
                          ? 'bg-primary-500 text-white'
                          : 'bg-neutral-50 hover:bg-primary-50 text-neutral-700 hover:text-primary-700'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        activeFilter === category.id
                          ? 'bg-primary-400 text-white'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="font-medium text-neutral-900 mb-4">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle & Results Count */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden btn-outline px-4 py-2 flex items-center gap-2"
                >
                  <AdjustmentsHorizontalIcon className="h-5 w-5" />
                  Filters
                </button>
                <p className="text-neutral-600">
                  Showing <span className="font-semibold text-primary-700">{filteredProducts.length}</span> products
                </p>
              </div>
              
              <div className="hidden sm:block">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <AnimatePresence mode="wait">
              {filteredProducts.length > 0 ? (
                <motion.div
                  key={`${activeFilter}-${sortBy}-${searchQuery}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="silk-card group"
                    >
                      {product.badge && (
                        <div className="product-badge">{product.badge}</div>
                      )}
                      
                      <div className="relative h-80 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                          >
                            {wishlist.includes(product.id) ? (
                              <HeartSolidIcon className="h-5 w-5 text-red-500" />
                            ) : (
                              <HeartIcon className="h-5 w-5 text-neutral-600" />
                            )}
                          </button>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <div className="flex gap-2">
                            <Link
                              href={`/products/${product.id}`}
                              className="btn-secondary flex-1 text-center py-2 text-sm"
                            >
                              Quick View
                            </Link>
                            <button className="btn-primary flex-1 py-2 text-sm">
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-primary-600">{product.categoryName}</span>
                          <div className="flex items-center gap-1">
                            <StarSolidIcon className="h-4 w-4 text-secondary-500" />
                            <span className="text-sm text-neutral-600">{product.rating}</span>
                            <span className="text-xs text-neutral-400">({product.reviews})</span>
                          </div>
                        </div>
                        
                        <h3 className="font-display font-semibold text-lg text-primary-900 mb-2 group-hover:text-primary-700 transition-colors">
                          {product.name}
                        </h3>
                        
                        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm text-neutral-500">{product.material}</span>
                          <span className="text-neutral-300">•</span>
                          <span className="text-sm text-neutral-500">{product.colors.join(', ')}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-primary-900">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-neutral-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                          </div>
                          <span className="text-xs bg-accent-maroon text-white px-2 py-1 rounded">
                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MagnifyingGlassIcon className="h-12 w-12 text-neutral-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">No products found</h3>
                    <p className="text-neutral-600 mb-6">
                      Try adjusting your filters or search terms to find what youre looking for.
                    </p>
                    <button
                      onClick={() => {
                        setActiveFilter('all')
                        setSearchQuery('')
                        setSortBy('featured')
                      }}
                      className="btn-primary"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}