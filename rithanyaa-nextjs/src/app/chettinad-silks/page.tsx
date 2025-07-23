import Image from 'next/image'
import Link from 'next/link'
import { getProductsByCategory } from '@/lib/database'

export default async function ChettinadSilks() {
  const chettinadProducts = await getProductsByCategory('Chettinad Silks')
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-cream via-white to-primary-50">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-r from-primary-800 to-primary-600 text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero1.png"
            alt="Chettinad Silks Collection"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        
        <div className="relative z-10 container-custom text-center">
          <h1 className="hero-title text-white mb-6">
            Chettinad Silks Collection
          </h1>
          <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
            Authentic handwoven Chettinad silk sarees from Tamil Nadu, crafted with traditional techniques passed down through generations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#products" className="btn-secondary">
              View Collection
            </Link>
            <Link href="/catalog" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
              All Products
            </Link>
          </div>
        </div>
      </section>

      {/* About Chettinad Silks */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">About Chettinad Silks</h2>
              <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                Chettinad silk sarees are renowned for their rich texture, vibrant colors, and intricate designs. 
                Originating from the Chettinad region of Tamil Nadu, these sarees represent centuries of 
                weaving tradition and craftsmanship.
              </p>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                Each saree is handwoven with pure silk threads and features traditional motifs that tell 
                stories of Tamil culture and heritage. The distinctive gold zari work adds elegance and 
                makes these sarees perfect for weddings and special occasions.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary-900 mb-2">Heritage</h4>
                  <p className="text-sm text-neutral-600">Traditional Tamil Nadu weaving techniques</p>
                </div>
                <div className="bg-secondary-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary-900 mb-2">Quality</h4>
                  <p className="text-sm text-neutral-600">100% pure silk with gold zari work</p>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden">
              <Image
                src="/images/products/chettinad1.jpg"
                alt="Chettinad Silk Weaving"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="section-padding bg-primary-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Chettinad Collection</h2>
            <p className="section-subtitle">
              Handpicked selection of authentic Chettinad silk sarees with traditional and contemporary designs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chettinadProducts.map((product) => (
              <div key={product.id} className="silk-card group">
                {product.badge && (
                  <div className="product-badge">{product.badge}</div>
                )}
                
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={product.images?.[0] || '/images/products/default.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-6">
                  <h3 className="font-display font-semibold text-lg text-primary-900 mb-3">
                    {product.name}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
                    {product.description?.slice(0, 100)}...
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.features?.slice(0, 2).map((feature) => (
                      <span key={feature} className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-primary-900">₹{product.price.toLocaleString()}</span>
                    <span className="text-sm text-neutral-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                    <span className="text-xs bg-accent-maroon text-white px-2 py-1 rounded">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="btn-primary flex-1 py-2">
                      Add to Cart
                    </button>
                    <button className="p-2 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors">
                      💝
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/catalog" className="btn-outline">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                🏛️
              </div>
              <h3 className="font-display text-lg font-semibold text-primary-900 mb-2">Traditional Heritage</h3>
              <p className="text-neutral-600">Authentic Chettinad weaving techniques from Tamil Nadu</p>
            </div>
            
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 text-secondary-600 rounded-full mb-4">
                ✨
              </div>
              <h3 className="font-display text-lg font-semibold text-primary-900 mb-2">Premium Quality</h3>
              <p className="text-neutral-600">100% pure silk with intricate gold zari work</p>
            </div>
            
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                👑
              </div>
              <h3 className="font-display text-lg font-semibold text-primary-900 mb-2">Occasion Wear</h3>
              <p className="text-neutral-600">Perfect for weddings, festivals, and special events</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}