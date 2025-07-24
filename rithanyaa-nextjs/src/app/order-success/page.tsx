'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircleIcon, ShoppingBagIcon, HomeIcon, PhoneIcon, MailIcon } from '@heroicons/react/24/outline'

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    // Get order details from URL parameters
    const orderId = searchParams.get('orderId')
    const paymentId = searchParams.get('paymentId')
    const amount = searchParams.get('amount')

    // If no order details in URL, redirect to home
    if (!orderId || !paymentId) {
      router.push('/')
      return
    }

    setOrderDetails({
      orderId,
      paymentId,
      amount: amount ? parseFloat(amount) : 0
    })

    // Clear cart from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart')
    }
  }, [searchParams, router])

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-cream via-white to-primary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-cream via-white to-primary-50">
      <div className="container-custom py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="h-12 w-12 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-neutral-600 mb-6">
              Thank you for your purchase. Your order has been confirmed and we'll process it shortly.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 mb-8">
            <div className="flex items-center justify-center mb-6">
              <ShoppingBagIcon className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-neutral-900">Order Details</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Order ID:</span>
                <span className="font-mono text-sm bg-neutral-100 px-3 py-1 rounded">
                  {orderDetails.orderId}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Payment ID:</span>
                <span className="font-mono text-sm bg-neutral-100 px-3 py-1 rounded">
                  {orderDetails.paymentId}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-neutral-600">Amount Paid:</span>
                <span className="text-xl font-bold text-green-600">
                  ₹{orderDetails.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-primary-50 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">What's Next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  1
                </div>
                <p className="text-neutral-700">
                  You'll receive an order confirmation email within 5 minutes
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  2
                </div>
                <p className="text-neutral-700">
                  Our team will contact you within 24 hours to confirm delivery details
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  3
                </div>
                <p className="text-neutral-700">
                  Your beautiful silk sarees will be carefully packed and shipped
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Need Help?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center justify-center text-neutral-600">
                <PhoneIcon className="h-5 w-5 mr-2" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center justify-center text-neutral-600">
                <MailIcon className="h-5 w-5 mr-2" />
                <span>support@navajothisilks.com</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="btn-primary flex items-center justify-center gap-2 py-3 px-6"
            >
              <HomeIcon className="h-5 w-5" />
              Back to Home
            </Link>
            <Link
              href="/catalog"
              className="btn-outline flex items-center justify-center gap-2 py-3 px-6"
            >
              <ShoppingBagIcon className="h-5 w-5" />
              Continue Shopping
            </Link>
          </div>

          {/* Thank You Message */}
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <p className="text-neutral-600 italic">
              "Thank you for choosing Nava Jothi Silks. We're honored to be part of your special moments."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}