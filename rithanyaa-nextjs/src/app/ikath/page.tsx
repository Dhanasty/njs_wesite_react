import Image from 'next/image'
import Link from 'next/link'

// Ikath products data
const ikathProducts = [
  {
    id: 1,
    name: 'Traditional Ikath - Indigo Blue',
    price: 2365,
    originalPrice: 2800,
    image: '/images/products/ikath1.jpg',
    description: 'Classic indigo blue Ikath with traditional tie-dye patterns',
    features: ['Tie-Dye Technique', 'Natural Indigo', 'Traditional Patterns', 'Handwoven'],
    badge: 'Traditional'
  },
  {
    id: 2,
    name: 'Designer Ikath - Crimson Red',
    price: 4299,
    originalPrice: 5200,
    image: '/images/products/ikath2.jpg',
    description: 'Designer crimson red Ikath with intricate geometric patterns',
    features: ['Geometric Patterns', 'Rich Colors', 'Premium Quality', 'Designer Collection'],
    badge: 'Premium'
  },
  {
    id: 3,
    name: 'Modern Ikath - Teal Green',
    price: 3199,
    originalPrice: 3800,
    image: '/images/products/ikath1.jpg',
    description: 'Modern teal green Ikath with contemporary tie-dye designs',
    features: ['Contemporary Design', 'Modern Colors', 'Artistic Patterns', 'Trendy'],
    badge: 'Modern'
  },
  {
    id: 4,
    name: 'Classic Ikath - Maroon',
    price: 2899,
    originalPrice: 3400,
    image: '/images/products/ikath2.jpg',
    description: 'Classic maroon Ikath perfect for traditional occasions',
    features: ['Classic Design', 'Traditional Colors', 'Festive Wear', 'Authentic'],
    badge: 'Classic'
  },
  {
    id: 5,
    name: 'Royal Ikath - Deep Purple',
    price: 4899,
    originalPrice: 5800,
    image: '/images/products/ikath1.jpg',
    description: 'Royal deep purple Ikath with elaborate tie-dye work',
    features: ['Royal Collection', 'Elaborate Patterns', 'Luxury Silk', 'Wedding Special'],
    badge: 'Royal'
  },
  {
    id: 6,
    name: 'Elegant Ikath - Mustard Yellow',
    price: 2699,
    originalPrice: 3200,
    image: '/images/products/ikath2.jpg',
    description: 'Elegant mustard yellow Ikath with artistic motifs',
    features: ['Artistic Motifs', 'Elegant Design', 'Bright Colors', 'Celebration Wear'],
    badge: 'Elegant'
  }
]

export default function Ikath() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-cream via-white to-primary-50">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-r from-accent-maroon to-primary-700 text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero1.png"
            alt="Ikath Collection"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        
        <div className="relative z-10 container-custom text-center">
          <h1 className="hero-title text-white mb-6">
            Ikath Collection
          </h1>
          <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
            Exquisite tie-dye silk sarees showcasing the ancient art of Ikath weaving with intricate patterns and vibrant colors
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

      {/* About Ikath */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">The Art of Ikath</h2>
              <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                Ikath, also known as Ikat, is an ancient resist-dyeing technique that creates stunning 
                geometric patterns on silk fabric. This intricate art form involves tying and dyeing 
                the yarn before weaving, resulting in beautiful, slightly blurred patterns.
              </p>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                Our Ikath collection celebrates this traditional craft with both classic and contemporary 
                designs. Each saree is a masterpiece that represents the skill and artistry of our weavers, 
                making every piece unique and special.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-accent-maroon/10 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary-900 mb-2">Technique</h4>
                  <p className="text-sm text-neutral-600">Ancient tie-dye resist dyeing method</p>
                </div>
                <div className="bg-primary-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary-900 mb-2">Uniqueness</h4>
                  <p className="text-sm text-neutral-600">Each pattern is one-of-a-kind artwork</p>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden">
              <Image
                src="/images/products/ikath1.jpg"
                alt="Ikath Weaving Process"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="section-padding bg-gradient-to-br from-accent-maroon/5 to-primary-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Ikath Collection</h2>
            <p className="section-subtitle">
              Traditional and contemporary Ikath designs that showcase the beauty of this ancient art form
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ikathProducts.map((product) => (
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
                      <span key={feature} className="text-xs bg-accent-maroon/10 text-accent-maroon px-2 py-1 rounded">
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

      {/* Ikath Process Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">The Ikath Process</h2>
            <p className="section-subtitle">
              Understanding the intricate steps that create these beautiful tie-dye patterns
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                🧵
              </div>
              <h3 className="font-display text-lg font-semibold text-primary-900 mb-2">1. Yarn Preparation</h3>
              <p className="text-neutral-600 text-sm">High-quality silk yarns are carefully selected and prepared</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-maroon/10 text-accent-maroon rounded-full mb-4">
                🎯
              </div>
              <h3 className="font-display text-lg font-semibold text-primary-900 mb-2">2. Pattern Binding</h3>
              <p className="text-neutral-600 text-sm">Yarns are tied in specific patterns using resist-dye technique</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 text-secondary-600 rounded-full mb-4">
                🎨
              </div>
              <h3 className="font-display text-lg font-semibold text-primary-900 mb-2">3. Dyeing Process</h3>
              <p className="text-neutral-600 text-sm">Multiple dyeing cycles create the vibrant color patterns</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                🧶
              </div>
              <h3 className="font-display text-lg font-semibold text-primary-900 mb-2">4. Weaving</h3>
              <p className="text-neutral-600 text-sm">Dyed yarns are skillfully woven to create the final saree</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}