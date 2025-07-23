'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useCart } from '@/contexts/CartContext'

// Define types for transformed products
interface TransformedProduct {
  id: number
  slug: string
  name: string
  price: number
  originalPrice: number
  image: string
  category: string
  categoryName: string
  rating: number
  reviews: number
  badge: string
  description: string
  colors: string[]
  material: string
}

interface FilterCategory {
  id: string
  name: string
  count: number
}

const sortOptions = [
  { id: 'featured', name: 'Featured' },
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
  { id: 'rating', name: 'Highest Rated' },
  { id: 'newest', name: 'Newest First' }
]

// Image Zoom Component
function ImageZoom({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    setIsZoomed(true)
  }

  const handleMouseLeave = () => {
    setIsZoomed(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setMousePosition({ x, y })
    }
  }

  return (
    <div 
      ref={imageRef}
      className={`relative overflow-hidden cursor-zoom-in ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-transform duration-500 ease-out ${
          isZoomed ? 'scale-150' : 'scale-100 group-hover:scale-110'
        }`}
        style={{
          transformOrigin: isZoomed ? `${mousePosition.x}% ${mousePosition.y}%` : 'center'
        }}
      />
      
      {/* Zoom indicator */}
      <div className={`absolute inset-0 bg-black/10 flex items-center justify-center transition-opacity duration-300 ${
        isZoomed ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="bg-white/90 rounded-full p-2 shadow-lg">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-700" />
        </div>
      </div>
    </div>
  )
}

export default function CatalogClient({ allProducts, filterCategories }: { allProducts: TransformedProduct[], filterCategories: FilterCategory[] }) {
  const [filteredProducts, setFilteredProducts] = useState(allProducts)
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [searchQuery, setSearchQuery] = useState('')
  const [wishlist, setWishlist] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const { addItem } = useCart()

  // Filter and sort products
  useEffect(() => {
    let products = [...allProducts]

    // Apply search filter
    if (searchQuery) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.material.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filter
    if (activeFilter !== 'all') {
      products = products.filter(product => product.category === activeFilter)
    }

    // Apply sorting
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
        products.sort((a, b) => b.id - a.id)
        break
      default: // featured
        products.sort((a, b) => {
          const badges = ['Featured', 'Bestseller', 'Premium', 'New']
          const aIndex = badges.indexOf(a.badge)
          const bIndex = badges.indexOf(b.badge)
          return (aIndex === -1 ? 100 : aIndex) - (bIndex === -1 ? 100 : bIndex)
        })
    }

    setFilteredProducts(products)
  }, [activeFilter, sortBy, searchQuery, allProducts])

  const toggleWishlist = (productId: number) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleQuickAdd = (product: TransformedProduct) => {
    console.log('Quick add clicked for product:', product.name)
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.categoryName,
      slug: product.slug
    })
    console.log('Item added to cart')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-cream via-white to-primary-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-800 to-primary-600 text-white py-20">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero1.png"
            alt="Silk Collection"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        
        <div className="relative z-10 container-custom text-center">
          <motion.h1 
            className="hero-title text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Silk Collection
          </motion.h1>
          <motion.p 
            className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover {allProducts.length} exquisite silk sarees crafted with traditional techniques
          </motion.p>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex gap-6 lg:gap-8">
            {/* Sidebar Filters */}
            <aside className="w-64 lg:w-72 flex-shrink-0 hidden lg:block">
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 sticky top-4">
                <h3 className="font-display font-semibold text-lg text-primary-900 mb-6">Filter & Search</h3>
                
                {/* Search Bar */}
                <div className="relative mb-6">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search sarees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                </div>

                {/* Sort Dropdown */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                  >
                    {sortOptions.map(option => (
                      <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                  </select>
                </div>

                {/* Category Filters */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">Categories</label>
                  <div className="space-y-2">
                    {filterCategories.map((category: FilterCategory) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveFilter(category.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-between ${
                          activeFilter === category.id
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'bg-neutral-50 text-neutral-700 hover:bg-primary-50 hover:text-primary-600'
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className="text-xs opacity-75">({category.count})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Mobile Filter Overlay */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowFilters(false)}>
                <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-display font-semibold text-lg text-primary-900">Filter & Search</h3>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="relative mb-6">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Search sarees..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Sort by</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                      >
                        {sortOptions.map(option => (
                          <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Category Filters */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-3">Categories</label>
                      <div className="space-y-2">
                        {filterCategories.map((category: FilterCategory) => (
                          <button
                            key={category.id}
                            onClick={() => {
                              setActiveFilter(category.id)
                              setShowFilters(false)
                            }}
                            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-between ${
                              activeFilter === category.id
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'bg-neutral-50 text-neutral-700 hover:bg-primary-50 hover:text-primary-600'
                            }`}
                          >
                            <span>{category.name}</span>
                            <span className="text-xs opacity-75">({category.count})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Content */}
            <main className="flex-1 min-w-0">
              <div className="mb-8 flex items-center justify-between">
                <p className="text-neutral-600">
                  Showing {filteredProducts.length} of {allProducts.length} products
                </p>
                
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <AdjustmentsHorizontalIcon className="h-5 w-5" />
                  Filters
                </button>
              </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeFilter}-${sortBy}-${searchQuery}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredProducts.map((product: TransformedProduct) => (
                <motion.div
                  key={product.id}
                  className="silk-card group relative flex flex-col h-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-4 right-4 z-10 p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-110 group"
                  >
                    {wishlist.includes(product.id) ? (
                      <HeartSolidIcon className="h-5 w-5 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-neutral-600 group-hover:text-red-400 group-hover:scale-110 transition-all duration-300" />
                    )}
                  </button>

                  {/* Badge */}
                  {product.badge && (
                    <div className="product-badge">{product.badge}</div>
                  )}
                  
                  {/* Product Image with Zoom */}
                  <div className="relative flex-shrink-0">
                    <Link href={`/products/${product.slug}`} className="block">
                      <ImageZoom
                        src={product.image}
                        alt={product.name}
                        className="h-64"
                      />
                    </Link>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex flex-col flex-1 relative z-10">
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <span className="inline-block text-xs font-semibold text-primary-600 uppercase tracking-wide mb-1">
                          {product.categoryName}
                        </span>
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="font-display font-bold text-lg text-primary-900 leading-tight group-hover:text-primary-700 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                      </div>
                      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                        <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-medium text-neutral-700">{product.rating}</span>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-neutral-600 mb-3 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    
                    {/* Colors Section */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">Colors:</span>
                        <span className="text-xs text-neutral-500">({product.colors.length})</span>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {product.colors.slice(0, 3).map((color: string, index: number) => (
                          <span key={`${product.id}-color-${index}-${color}`} className="text-xs bg-gradient-to-r from-primary-50 to-primary-100 text-primary-800 px-2 py-1 rounded-full font-medium border border-primary-200">
                            {color}
                          </span>
                        ))}
                        {product.colors.length > 3 && (
                          <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full font-medium">
                            +{product.colors.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Price Section */}
                    <div className="mt-auto">
                      <div className="flex items-end justify-between mb-3">
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-primary-900 leading-none">
                            ₹{product.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-neutral-500 line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="inline-block text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full font-bold shadow-md">
                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                          </span>
                          <div className="text-xs text-green-600 font-medium mt-0.5">
                            Save ₹{(product.originalPrice - product.price).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="space-y-2 relative z-20">
                        <Link 
                          href={`/products/${product.slug}`}
                          className="btn-primary w-full text-center py-2.5 font-semibold text-sm tracking-wide uppercase transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 block"
                        >
                          View Details
                        </Link>
                        <button 
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleQuickAdd(product)
                          }}
                          className="w-full bg-accent-gold text-primary-900 font-medium py-2.5 px-4 rounded-lg hover:bg-yellow-400 transition-colors duration-200 flex items-center justify-center gap-2 border border-yellow-300"
                          title="Add to cart"
                        >
                          <ShoppingCartIcon className="h-4 w-4" />
                          <span className="text-sm">Quick Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* No Products Found */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="bg-neutral-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <MagnifyingGlassIcon className="h-8 w-8 text-neutral-400" />
                </div>
                <h3 className="font-display text-xl font-semibold text-neutral-900 mb-2">No products found</h3>
                <p className="text-neutral-600 mb-6">Try adjusting your search terms or filters</p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setActiveFilter('all')
                  }}
                  className="btn-primary"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
            </main>
          </div>
        </div>
      </section>
    </div>
  )
}