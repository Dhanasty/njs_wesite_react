'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/data/products'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/contexts/CartContext'

interface ProductPageClientProps {
  product: Product
  relatedProducts: Product[]
}

// Image Zoom Component for Product Page
function ImageZoom({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const imageRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    setIsZoomed(true)
  }

  const handleMouseLeave = () => {
    setIsZoomed(false)
    setMousePosition({ x: 50, y: 50 })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setMousePosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
    }
  }

  return (
    <div 
      ref={imageRef}
      className={`relative overflow-hidden cursor-zoom-in bg-neutral-100 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 ease-out"
        style={{
          transform: isZoomed ? `scale(1.8)` : 'scale(1)',
          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
        }}
      />
      
      {/* Zoom indicator */}
      {isZoomed && (
        <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2 shadow-lg border">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-700" />
        </div>
      )}
    </div>
  )
}

export default function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'care'>('description')
  const { addItem } = useCart()

  const currentImages = product.colors.length > 0 
    ? [product.colors[selectedColor].image, ...product.images.slice(1)]
    : product.images

  const discountPercentage = Math.round((1 - product.price / product.originalPrice) * 100)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        category: product.category,
        selectedColor: product.colors.length > 0 ? {
          name: product.colors[selectedColor].name,
          value: product.colors[selectedColor].value
        } : undefined,
        slug: product.slug
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-primary-50 py-4">
        <div className="container-custom">
          <nav className="flex text-sm text-neutral-600">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/catalog" className="hover:text-primary-600 transition-colors">Catalog</Link>
            <span className="mx-2">/</span>
            <span className="text-primary-600">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl bg-neutral-100">
                <ImageZoom
                  src={currentImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full rounded-2xl"
                />
                {product.badge && (
                  <div className="absolute top-4 left-4 bg-accent-maroon text-white px-3 py-1 rounded-full text-sm font-semibold z-20">
                    {product.badge}
                  </div>
                )}
              </div>
              
              {/* Thumbnail Navigation */}
              <div className="grid grid-cols-4 gap-3">
                {currentImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-primary-500 ring-2 ring-primary-200' 
                        : 'border-neutral-200 hover:border-primary-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <p className="text-primary-600 font-medium mb-2">{product.category}</p>
                <h1 className="font-display text-3xl lg:text-4xl font-bold text-primary-900 mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary-900">₹{product.price.toLocaleString()}</span>
                  <span className="text-xl text-neutral-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {discountPercentage}% OFF
                  </span>
                </div>
                {product.inStock ? (
                  <p className="text-green-600 font-medium mt-2">✓ In Stock</p>
                ) : (
                  <p className="text-red-600 font-medium mt-2">✗ Out of Stock</p>
                )}
              </div>

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div>
                  <h3 className="font-semibold text-primary-900 mb-3">Color: {product.colors[selectedColor].name}</h3>
                  <div className="flex gap-3">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedColor(index)
                          setSelectedImage(0)
                        }}
                        className={`w-12 h-12 rounded-full border-4 transition-all ${
                          selectedColor === index 
                            ? 'border-primary-500 ring-2 ring-primary-200' 
                            : 'border-neutral-200 hover:border-primary-300'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="font-semibold text-primary-900 mb-3">Quantity</h3>
                <div className="flex items-center border border-neutral-300 rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-neutral-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-neutral-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  className="btn-primary w-full py-4 text-lg"
                  disabled={!product.inStock}
                  onClick={handleAddToCart}
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button className="btn-outline w-full py-4 text-lg">
                  Add to Wishlist ♡
                </button>
              </div>

              {/* Key Features */}
              <div className="bg-primary-50 p-6 rounded-xl">
                <h3 className="font-semibold text-primary-900 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-neutral-700">
                      <span className="text-primary-600 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <div className="border-b border-neutral-200">
              <nav className="flex space-x-8">
                {[
                  { id: 'description', label: 'Description' },
                  { id: 'specifications', label: 'Specifications' },
                  { id: 'care', label: 'Care Instructions' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-4 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-neutral-600 hover:text-primary-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="py-8">
              {activeTab === 'description' && (
                <div className="prose prose-primary max-w-none">
                  <p className="text-lg text-neutral-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-primary-900 mb-4">Product Specifications</h4>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-neutral-600">Fabric</dt>
                        <dd className="text-neutral-900">{product.specifications.fabric}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-neutral-600">Length</dt>
                        <dd className="text-neutral-900">{product.specifications.length}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-neutral-600">Width</dt>
                        <dd className="text-neutral-900">{product.specifications.width}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-neutral-600">Weight</dt>
                        <dd className="text-neutral-900">{product.specifications.weight}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}

              {activeTab === 'care' && (
                <div>
                  <h4 className="font-semibold text-primary-900 mb-4">Care Instructions</h4>
                  <ul className="space-y-2">
                    {product.specifications.washCare.map((instruction, index) => (
                      <li key={index} className="flex items-center text-neutral-700">
                        <span className="text-primary-600 mr-2">•</span>
                        {instruction}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <div className="text-center mb-12">
                <h2 className="section-title">You May Also Like</h2>
                <p className="section-subtitle">More from our {product.category} collection</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/products/${relatedProduct.slug}`}
                    className="silk-card group"
                  >
                    {relatedProduct.badge && (
                      <div className="product-badge">{relatedProduct.badge}</div>
                    )}
                    
                    <div className="relative h-80 overflow-hidden">
                      <Image
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-6">
                      <span className="text-sm font-medium text-primary-600">{relatedProduct.category}</span>
                      <h3 className="font-display font-semibold text-lg text-primary-900 mb-3">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-primary-900">₹{relatedProduct.price.toLocaleString()}</span>
                        <span className="text-sm text-neutral-500 line-through">₹{relatedProduct.originalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}