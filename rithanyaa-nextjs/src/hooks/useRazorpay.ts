'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  image: string
  order_id: string
  handler: (response: any) => void
  prefill: {
    name: string
    email: string
    contact: string
  }
  notes: Record<string, string>
  theme: {
    color: string
  }
  modal: {
    ondismiss: () => void
  }
}

export const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if Razorpay script is already loaded
    if (window.Razorpay) {
      setIsLoaded(true)
      setIsLoading(false)
      return
    }

    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    
    script.onload = () => {
      setIsLoaded(true)
      setIsLoading(false)
    }
    
    script.onerror = () => {
      console.error('Failed to load Razorpay script')
      setIsLoading(false)
    }

    document.body.appendChild(script)

    return () => {
      // Clean up script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const openRazorpay = (options: RazorpayOptions) => {
    if (!isLoaded || !window.Razorpay) {
      console.error('Razorpay is not loaded')
      return
    }

    const razorpayInstance = new window.Razorpay(options)
    razorpayInstance.open()
  }

  const createOrder = async (amount: number, receipt: string) => {
    try {
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, receipt }),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  const verifyPayment = async (paymentData: any, additionalData: any) => {
    try {
      const response = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: paymentData.razorpay_order_id,
          paymentId: paymentData.razorpay_payment_id,
          signature: paymentData.razorpay_signature,
          ...additionalData,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to verify payment')
      }

      return await response.json()
    } catch (error) {
      console.error('Error verifying payment:', error)
      throw error
    }
  }

  return {
    isLoaded,
    isLoading,
    openRazorpay,
    createOrder,
    verifyPayment,
  }
}