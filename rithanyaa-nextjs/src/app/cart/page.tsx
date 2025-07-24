'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { MinusIcon, PlusIcon, XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-cream via-white to-primary-50">
        <div className="container-custom py-16">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBagIcon className="h-12 w-12 text-neutral-400" />
            </div>
            <h1 className="text-3xl font-display font-bold text-neutral-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-lg text-neutral-600 mb-8">
              Looks like you haven't added any beautiful silk sarees to your cart yet.
            </p>
            <Link href="/catalog" className="btn-primary">
              Explore Our Collections
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-cream via-white to-primary-50">
      <div className="container-custom py-16">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-lg text-neutral-600">
            Review your items and proceed to checkout
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Cart Items */}
          <div className="space-y-6 mb-8">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      className="block hover:text-primary-600 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-neutral-600 mb-2">{item.category}</p>
                    
                    {item.selectedColor && (
                      <div className="flex items-center mb-3">
                        <span className="text-sm text-neutral-600 mr-2">Color:</span>
                        <span className="text-sm font-medium mr-2">{item.selectedColor.name}</span>
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: item.selectedColor.value }}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-primary-900">
                          ₹{item.price.toLocaleString()}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-sm text-neutral-500 line-through">
                            ₹{item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 bg-neutral-100 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-md bg-white border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="text-sm font-semibold min-w-[32px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-md bg-white border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-neutral-900">Items ({totalItems})</span>
              <span className="text-lg font-semibold text-primary-900">₹{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-neutral-600">Shipping</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
            <div className="border-t border-neutral-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-neutral-900">Total</span>
                <span className="text-2xl font-bold text-primary-900">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link href="/checkout" className="btn-primary flex-1 py-3 text-center">
              Proceed to Checkout
            </Link>
            <Link href="/catalog" className="btn-outline flex-1 py-3 text-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}