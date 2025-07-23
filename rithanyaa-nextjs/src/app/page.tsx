'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useFeaturedProducts } from '@/lib/products-provider'
import { Product } from '@/data/products'


// Collections data
const collections = [
  {
    name: 'Chettinad Silks',
    description: 'Authentic handwoven silk sarees from Tamil Nadu',
    image: '/images/products/chettinad1.jpg',
    href: '/chettinad-silks',
    products: '25+ Designs'
  },
  {
    name: 'Soft Sico',
    description: 'Luxurious soft silk with contemporary designs',
    image: '/images/products/chettinad2.jpg',
    href: '/soft-sico',
    products: '18+ Designs'
  },
  {
    name: 'Ikath Collection',
    description: 'Traditional tie-dye technique silk sarees',
    image: '/images/products/ikath1.jpg',
    href: '/ikath',
    products: '12+ Designs'
  }
]


export default function Home() {
  const featuredProducts = useFeaturedProducts()
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-cream via-white to-primary-50">
      {/* Hero Section - 'relative' class has been removed here */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-r from-primary-800 to-primary-600 text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero1.png"
            alt="Premium Silk Collections"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        
        <div className="relative z-10 text-center container-custom">
          <h1 className="hero-title text-white mb-6">
            Premium Silk Collections
          </h1>
          <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
            Discover our exquisite range of traditional and contemporary silk sarees
          </p>
          <Link
            href="/catalog"
            className="btn-secondary text-lg px-8 py-4 inline-block"
          >
            Shop Now
          </Link>
        </div>
      </section>


      {/* Featured Products Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">Best Selling Products</h2>
            <p className="section-subtitle">
              Discover our most loved silk sarees, handpicked for their exceptional quality and timeless beauty.
            </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product: Product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="silk-card group"
              >
                {product.badge && (
                  <div className="product-badge">{product.badge}</div>
                )}
                
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>


                <div className="p-6">
                  <span className="text-sm font-medium text-primary-600">{product.category}</span>
                  <h3 className="font-display font-semibold text-lg text-primary-900 mb-3">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-primary-900">₹{product.price.toLocaleString()}</span>
                    <span className="text-sm text-neutral-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                    <span className="text-xs bg-accent-maroon text-white px-2 py-1 rounded">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                  <button className="btn-primary w-full py-2">
                    View Product
                  </button>
                </div>
              </Link>
            ))}
          </div>


          <div className="text-center mt-12">
            <Link href="/catalog" className="btn-outline">
              View All Products
            </Link>
          </div>
        </div>
      </section>


      {/* Collections Section */}
      <section className="section-padding bg-primary-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Collections</h2>
            <p className="section-subtitle">
              Explore our curated collections, each telling a unique story of Indian textile heritage.
            </p>
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <div key={collection.name} className="group relative overflow-hidden rounded-2xl bg-white shadow-traditional hover:shadow-lg transition-all duration-500">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/70 via-primary-900/20 to-transparent" />
                </div>
                
                <div className="relative p-8">
                  <div className="absolute -top-6 left-8 bg-secondary-500 text-primary-900 px-4 py-2 rounded-full text-sm font-semibold">
                    {collection.products}
                  </div>
                  
                  <h3 className="font-display text-2xl font-semibold text-primary-900 mb-3 group-hover:text-primary-700 transition-colors">
                    {collection.name}
                  </h3>
                  
                  <p className="text-neutral-600 mb-6 leading-relaxed">
                    {collection.description}
                  </p>
                  
                  <Link
                    href={collection.href}
                    className="btn-outline group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500 transition-all duration-300"
                  >
                    Explore Collection
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group hover:bg-primary-50 p-8 rounded-xl transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                🚚
              </div>
              <h3 className="font-display text-lg font-semibold text-primary-900 mb-2">Free Shipping</h3>
              <p className="text-neutral-600">On orders above ₹2000</p>
            </div>
            
            <div className="text-center group hover:bg-primary-50 p-8 rounded-xl transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                🛡️
              </div>
              <h3 className="font-display text-lg font-semibold text-primary-900 mb-2">Quality Assured</h3>
              <p className="text-neutral-600">Authentic silk guarantee</p>
            </div>
            
            <div className="text-center group hover:bg-primary-50 p-8 rounded-xl transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                💝
              </div>
              <h3 className="font-display text-lg font-semibold text-primary-900 mb-2">Easy Returns</h3>
              <p className="text-neutral-600">30-day return policy</p>
            </div>
            
            <div className="text-center group hover:bg-primary-50 p-8 rounded-xl transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                📞
              </div>
              <h3 className="font-display text-lg font-semibold text-primary-900 mb-2">24/7 Support</h3>
              <p className="text-neutral-600">Customer service</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
