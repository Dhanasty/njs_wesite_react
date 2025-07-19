import Image from 'next/image'
import Link from 'next/link'

// Soft Sico products data
const softSicoProducts = [
  {
    id: 1,
    name: 'Elegant Soft Sico - Rose Gold',
    price: 2499,
    originalPrice: 3100,
    image: '/images/products/chettinad2.jpg',
    description: 'Luxurious soft sico silk with contemporary rose gold patterns',
    features: ['Soft Texture', 'Contemporary Design', 'Lightweight', 'Easy Drape'],
    badge: 'Bestseller'
  },
  {
    id: 2,
    name: 'Modern Soft Sico - Turquoise',
    price: 2799,
    originalPrice: 3400,
    image: '/images/products/chettinad1.jpg',
    description: 'Modern turquoise soft sico with geometric patterns and soft finish',
    features: ['Modern Patterns', 'Vibrant Colors', 'Comfortable Wear', 'Office Friendly'],
    badge: 'New'
  },
  {
    id: 3,
    name: 'Designer Soft Sico - Coral',
    price: 3299,
    originalPrice: 4000,
    image: '/images/products/chettinad2.jpg',
    description: 'Designer coral soft sico with artistic motifs and premium finish',
    features: ['Designer Collection', 'Artistic Motifs', 'Premium Quality', 'Party Wear'],
    badge: 'Designer'
  },
  {
    id: 4,
    name: 'Classic Soft Sico - Navy Blue',
    price: 2199,
    originalPrice: 2800,
    image: '/images/products/chettinad1.jpg',
    description: 'Classic navy blue soft sico perfect for formal occasions',
    features: ['Formal Wear', 'Professional Look', 'Easy Care', 'Versatile'],
    badge: 'Classic'
  },
  {
    id: 5,
    name: 'Premium Soft Sico - Lavender',
    price: 3599,
    originalPrice: 4200,
    image: '/images/products/chettinad2.jpg',
    description: 'Premium lavender soft sico with delicate floral patterns',
    features: ['Floral Patterns', 'Premium Finish', 'Elegant Look', 'Special Occasions'],
    badge: 'Premium'
  },
  {
    id: 6,
    name: 'Contemporary Soft Sico - Mint Green',
    price: 2699,
    originalPrice: 3200,
    image: '/images/products/chettinad1.jpg',
    description: 'Contemporary mint green soft sico with modern appeal',
    features: ['Contemporary Style', 'Fresh Colors', 'Modern Appeal', 'Trendy'],
    badge: 'Trendy'
  }
]

export default function SoftSico() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-cream via-white to-primary-50">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-r from-secondary-600 to-primary-600 text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero1.png"
            alt="Soft Sico Collection"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        
        <div className="relative z-10 container-custom text-center">
          <h1 className="hero-title text-white mb-6">
            Soft Sico Collection
          </h1>
          <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
            Luxurious soft silk sarees with contemporary designs, perfect for modern women who appreciate comfort and elegance
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

      {/* About Soft Sico */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-xl overflow-hidden">
              <Image
                src="/images/products/chettinad2.jpg"
                alt="Soft Sico Silk"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="section-title mb-6">About Soft Sico</h2>
              <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                Soft Sico represents the perfect blend of traditional silk craftsmanship and modern 
                sensibilities. These sarees are designed for the contemporary woman who values both 
                comfort and style in her wardrobe.
              </p>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                Made with premium quality silk thats specially treated for softness, these sarees 
                offer an incredibly smooth texture and elegant drape. The contemporary designs and 
                vibrant colors make them perfect for both professional and social occasions.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary-900 mb-2">Comfort</h4>
                  <p className="text-sm text-neutral-600">Soft, lightweight, and easy to drape</p>
                </div>
                <div className="bg-primary-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary-900 mb-2">Style</h4>
                  <p className="text-sm text-neutral-600">Contemporary designs with modern appeal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="section-padding bg-secondary-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Soft Sico Collection</h2>
            <p className="section-subtitle">
              Contemporary silk sarees designed for the modern woman who values comfort without compromising on elegance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {softSicoProducts.map((product) => (
              <div key={product.id} className="silk-card group">
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
                </div>

                <div className="p-6">
                  <h3 className="font-display font-semibold text-lg text-primary-900 mb-3">
                    {product.name}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.features.slice(0, 2).map((feature) => (
                      <span key={feature} className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded">
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 text-secondary-600 rounded-full mb-4">
                🌸
              </div>
              <h3 className="font-display text-lg font-semibold text-primary-900 mb-2">Soft & Comfortable</h3>
              <p className="text-neutral-600">Specially treated silk for ultimate comfort and softness</p>
            </div>
            
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                🎨
              </div>
              <h3 className="font-display text-lg font-semibold text-primary-900 mb-2">Contemporary Designs</h3>
              <p className="text-neutral-600">Modern patterns and colors for the fashionable woman</p>
            </div>
            
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 text-secondary-600 rounded-full mb-4">
                💼
              </div>
              <h3 className="font-display text-lg font-semibold text-primary-900 mb-2">Versatile Wear</h3>
              <p className="text-neutral-600">Perfect for office, parties, and casual occasions</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}