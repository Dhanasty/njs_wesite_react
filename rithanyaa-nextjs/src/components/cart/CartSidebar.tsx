'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { XMarkIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'

export default function CartSidebar() {
  const { items, totalItems, totalPrice, isOpen, closeCart, updateQuantity, removeItem } = useCart()

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeCart}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
                      <Dialog.Title className="text-lg font-semibold text-neutral-900">
                        Shopping Cart ({totalItems})
                      </Dialog.Title>
                      <button
                        type="button"
                        className="relative -m-2 p-2 text-neutral-400 hover:text-neutral-500"
                        onClick={closeCart}
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    {items.length === 0 ? (
                      /* Empty cart state */
                      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                        <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                          <ShoppingBagIcon className="h-8 w-8 text-neutral-400" />
                        </div>
                        <h3 className="text-lg font-medium text-neutral-900 mb-2">Your cart is empty</h3>
                        <p className="text-neutral-600 text-center mb-6">
                          Add some beautiful silk sarees to get started
                        </p>
                        <Link
                          href="/catalog"
                          onClick={closeCart}
                          className="btn-primary"
                        >
                          Continue Shopping
                        </Link>
                      </div>
                    ) : (
                      <>
                        {/* Cart items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                          <div className="space-y-4">
                            {items.map((item) => (
                              <div key={item.id} className="flex items-center space-x-4 bg-neutral-50 rounded-lg p-4">
                                {/* Product image */}
                                <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>

                                {/* Product details */}
                                <div className="flex-1 min-w-0">
                                  <Link
                                    href={`/products/${item.slug}`}
                                    onClick={closeCart}
                                    className="block"
                                  >
                                    <h3 className="text-sm font-medium text-neutral-900 hover:text-primary-600 transition-colors line-clamp-2">
                                      {item.name}
                                    </h3>
                                  </Link>
                                  <p className="text-xs text-neutral-600 mt-1">{item.category}</p>
                                  {item.selectedColor && (
                                    <div className="flex items-center mt-1">
                                      <span className="text-xs text-neutral-600 mr-2">Color:</span>
                                      <span className="text-xs font-medium">{item.selectedColor.name}</span>
                                      <div
                                        className="w-3 h-3 rounded-full border ml-2"
                                        style={{ backgroundColor: item.selectedColor.value }}
                                      />
                                    </div>
                                  )}
                                  
                                  {/* Price and quantity controls */}
                                  <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-semibold text-primary-900">
                                        ₹{item.price.toLocaleString()}
                                      </span>
                                      {item.originalPrice > item.price && (
                                        <span className="text-xs text-neutral-500 line-through">
                                          ₹{item.originalPrice.toLocaleString()}
                                        </span>
                                      )}
                                    </div>
                                    
                                    {/* Quantity controls */}
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                                      >
                                        <MinusIcon className="h-3 w-3" />
                                      </button>
                                      <span className="text-sm font-medium min-w-[24px] text-center">
                                        {item.quantity}
                                      </span>
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                                      >
                                        <PlusIcon className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Remove button */}
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-neutral-400 hover:text-red-500 transition-colors"
                                >
                                  <XMarkIcon className="h-5 w-5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-neutral-200 px-6 py-4 space-y-4">
                          {/* Total */}
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-neutral-900">Total</span>
                            <span className="text-xl font-bold text-primary-900">
                              ₹{totalPrice.toLocaleString()}
                            </span>
                          </div>

                          {/* Action buttons */}
                          <div className="space-y-3">
                            <button className="btn-primary w-full py-3">
                              Proceed to Checkout
                            </button>
                            <Link
                              href="/catalog"
                              onClick={closeCart}
                              className="btn-outline w-full py-3 text-center block"
                            >
                              Continue Shopping
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}