import Razorpay from 'razorpay'

// Initialize Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Razorpay configuration for frontend
export const razorpayConfig = {
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  currency: 'INR',
  name: 'Nava Jothi Silks',
  description: 'Premium Silk Sarees',
  image: '/images/logos/nava_jothi_silks_logo.jpg',
  theme: {
    color: '#8B4513',
  },
}

// Types for Razorpay
export interface RazorpayOrderData {
  amount: number
  currency: string
  receipt: string
  notes?: Record<string, string>
}

export interface RazorpayPaymentData {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export interface CheckoutFormData {
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

// Create order function
export const createRazorpayOrder = async (amount: number, receipt: string) => {
  try {
    const options: RazorpayOrderData = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt,
      notes: {
        timestamp: new Date().toISOString(),
      },
    }

    const order = await razorpay.orders.create(options)
    return order
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    throw new Error('Failed to create payment order')
  }
}

// Verify payment signature
export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  try {
    const crypto = require('crypto')
    const text = orderId + '|' + paymentId
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text.toString())
      .digest('hex')

    return expectedSignature === signature
  } catch (error) {
    console.error('Error verifying signature:', error)
    return false
  }
}