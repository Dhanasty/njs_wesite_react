'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useRazorpay } from '@/hooks/useRazorpay'
import { ArrowLeftIcon, TagIcon, CheckCircleIcon, CreditCardIcon } from '@heroicons/react/24/outline'

interface CheckoutFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  country: string
  notes: string
}

interface GiftCode {
  code: string
  discount: number
  type: 'percentage' | 'fixed'
}

const validGiftCodes: GiftCode[] = [
  { code: 'WELCOME10', discount: 10, type: 'percentage' },
  { code: 'SAVE500', discount: 500, type: 'fixed' },
  { code: 'NEWUSER', discount: 15, type: 'percentage' },
  { code: 'FESTIVE20', discount: 20, type: 'percentage' }
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalItems, totalPrice, clearCart } = useCart()
  const { isLoaded, isLoading, openRazorpay, createOrder, verifyPayment } = useRazorpay()
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    notes: ''
  })
  const [giftCode, setGiftCode] = useState('')
  const [appliedGiftCode, setAppliedGiftCode] = useState<GiftCode | null>(null)
  const [giftCodeError, setGiftCodeError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({})

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name as keyof CheckoutFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleApplyGiftCode = () => {
    const code = giftCode.trim().toUpperCase()
    const validCode = validGiftCodes.find(gc => gc.code === code)
    
    if (validCode) {
      setAppliedGiftCode(validCode)
      setGiftCodeError('')
      setGiftCode('')
    } else {
      setGiftCodeError('Invalid gift code. Please try again.')
    }
  }

  const handleRemoveGiftCode = () => {
    setAppliedGiftCode(null)
    setGiftCode('')
    setGiftCodeError('')
  }

  const calculateDiscount = () => {
    if (!appliedGiftCode) return 0
    
    if (appliedGiftCode.type === 'percentage') {
      return Math.round((totalPrice * appliedGiftCode.discount) / 100)
    } else {
      return Math.min(appliedGiftCode.discount, totalPrice)
    }
  }

  const finalTotal = totalPrice - calculateDiscount()

  const validateForm = () => {
    const newErrors: Partial<CheckoutFormData> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Invalid phone number'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required'
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid pincode'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    if (!isLoaded) {
      alert('Payment system is loading. Please try again in a moment.')
      return
    }

    setIsSubmitting(true)

    try {
      // Create Razorpay order
      const receipt = `order_${Date.now()}`
      const order = await createOrder(finalTotal, receipt)

      // Configure Razorpay options
      const razorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_key',
        amount: order.amount,
        currency: order.currency,
        name: 'Nava Jothi Silks',
        description: 'Premium Silk Sarees',
        image: '/images/logos/nava_jothi_silks_logo.jpg',
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verificationResult = await verifyPayment(response, {
              formData,
              cartItems: items,
              totalAmount: finalTotal,
              discount: calculateDiscount(),
              giftCode: appliedGiftCode,
            })

            if (verificationResult.success) {
              // Clear cart
              clearCart()
              
              // Redirect to success page with order details
              const searchParams = new URLSearchParams({
                orderId: verificationResult.orderId,
                paymentId: verificationResult.paymentId,
                amount: finalTotal.toString()
              })
              
              router.push(`/order-success?${searchParams.toString()}`)
            } else {
              // Show error popup for verification failure
              alert('❌ Payment verification failed. Please contact our support team for assistance.')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            alert('❌ Payment verification failed. Please contact our support team for assistance.')
          } finally {
            setIsSubmitting(false)
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
          specialNotes: formData.notes,
        },
        theme: {
          color: '#8B4513',
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false)
            // Show popup when user closes the payment modal
            alert('❌ Payment was cancelled. You can try again when ready.')
          },
        },
      }

      // Open Razorpay checkout
      openRazorpay(razorpayOptions)
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to initiate payment. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-cream via-white to-primary-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 mb-2">
            Checkout
          </h1>
          <p className="text-lg text-neutral-600">
            Complete your order details
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">Contact Information</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.firstName ? 'border-red-300' : 'border-neutral-300'
                    }`}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-300' : 'border-neutral-300'
                    }`}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.email ? 'border-red-300' : 'border-neutral-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.phone ? 'border-red-300' : 'border-neutral-300'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">Shipping Address</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street address, apartment, suite, etc."
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.address ? 'border-red-300' : 'border-neutral-300'
                    }`}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.city ? 'border-red-300' : 'border-neutral-300'
                      }`}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.state ? 'border-red-300' : 'border-neutral-300'
                      }`}
                    />
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit pincode"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.pincode ? 'border-red-300' : 'border-neutral-300'
                      }`}
                    />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Special Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any special instructions for delivery..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Gift Code */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Gift Code / Coupon</h2>
              
              {!appliedGiftCode ? (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={giftCode}
                      onChange={(e) => setGiftCode(e.target.value.toUpperCase())}
                      placeholder="Enter gift code"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {giftCodeError && <p className="text-red-500 text-xs mt-1">{giftCodeError}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyGiftCode}
                    disabled={!giftCode.trim()}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <TagIcon className="h-4 w-4" />
                    Apply
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      <span className="text-green-800 font-medium">
                        Gift code "{appliedGiftCode.code}" applied!
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveGiftCode}
                      className="text-green-600 hover:text-green-800 text-sm underline"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    You saved ₹{calculateDiscount().toLocaleString()}
                  </p>
                </div>
              )}

              <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-600 mb-2">Try these codes:</p>
                <div className="flex flex-wrap gap-2">
                  {validGiftCodes.map((code) => (
                    <span
                      key={code.code}
                      className="px-2 py-1 bg-white border border-neutral-200 rounded text-xs font-mono cursor-pointer hover:bg-primary-50"
                      onClick={() => setGiftCode(code.code)}
                    >
                      {code.code}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 pb-4 border-b border-neutral-100 last:border-b-0">
                    <div className="relative w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-neutral-900 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-neutral-600">{item.category}</p>
                      {item.selectedColor && (
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-neutral-600 mr-1">Color:</span>
                          <span className="text-xs font-medium">{item.selectedColor.name}</span>
                        </div>
                      )}
                      <p className="text-xs text-neutral-600 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-semibold text-neutral-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Details */}
              <div className="space-y-3 border-t border-neutral-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
                </div>
                
                {appliedGiftCode && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount ({appliedGiftCode.code})</span>
                    <span className="font-medium text-green-600">-₹{calculateDiscount().toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                
                <div className="border-t border-neutral-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-900">₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Place Order */}
            <form onSubmit={handleSubmit}>
              <button
                type="submit"
                disabled={isSubmitting || isLoading || !isLoaded}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2 ${
                  isSubmitting || isLoading || !isLoaded
                    ? 'bg-neutral-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                <CreditCardIcon className="h-5 w-5" />
                {isLoading 
                  ? 'Loading Payment...' 
                  : isSubmitting 
                    ? 'Processing...' 
                    : `Pay ₹${finalTotal.toLocaleString()} - Razorpay`
                }
              </button>
            </form>

            {/* Payment Security Info */}
            <div className="text-center mt-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                <div className="w-8 h-6 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                <div className="w-12 h-6 bg-blue-800 rounded text-white text-xs flex items-center justify-center font-bold">AMEX</div>
                <div className="w-12 h-6 bg-orange-600 rounded text-white text-xs flex items-center justify-center font-bold">UPI</div>
              </div>
              <p className="text-xs text-neutral-500">
                Secured by Razorpay. Your card details are safe with us.
              </p>
            </div>

            <p className="text-xs text-neutral-500 text-center">
              By placing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}