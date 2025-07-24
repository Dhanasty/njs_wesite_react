import { NextRequest, NextResponse } from 'next/server'
import { verifyRazorpaySignature } from '@/lib/razorpay'
import { saveOrder, Order } from '@/lib/orders'
import { updateStock } from '@/lib/inventory'

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentId, signature, formData, cartItems, totalAmount, discount, giftCode } = await request.json()

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: 'Missing required payment verification data' },
        { status: 400 }
      )
    }

    // Verify the payment signature
    const isValidSignature = verifyRazorpaySignature(orderId, paymentId, signature)

    if (!isValidSignature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Create order object
    const order: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderId,
      paymentId,
      amount: totalAmount + (discount || 0),
      discount: discount || 0,
      finalAmount: totalAmount,
      status: 'completed',
      paymentStatus: 'completed',
      items: cartItems,
      customerDetails: formData,
      giftCode: giftCode || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Save the order locally
    saveOrder(order)

    // Send order to admin dashboard
    try {
      console.log('Attempting to send order to admin dashboard:', order.orderId)
      
      const adminDashboardResponse = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order)
      })

      if (adminDashboardResponse.ok) {
        const responseData = await adminDashboardResponse.json()
        console.log('Successfully saved order to admin dashboard:', responseData)
      } else {
        const errorData = await adminDashboardResponse.text()
        console.warn('Failed to save order to admin dashboard:', adminDashboardResponse.status, errorData)
      }
    } catch (error) {
      console.error('Could not connect to admin dashboard:', error)
    }

    // Update inventory - reduce stock for each item
    let stockUpdateSuccess = true
    const stockUpdates: { productId: number; quantity: number; success: boolean }[] = []

    for (const item of cartItems) {
      const success = updateStock(item.productId, item.quantity)
      stockUpdates.push({
        productId: item.productId,
        quantity: item.quantity,
        success
      })
      
      if (!success) {
        stockUpdateSuccess = false
        console.warn(`Failed to update stock for product ${item.productId}`)
      }
    }

    console.log('Payment verified successfully:', {
      orderId,
      paymentId,
      totalAmount,
      stockUpdates,
      stockUpdateSuccess
    })

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      orderId,
      paymentId,
      stockUpdateSuccess,
      stockUpdates
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}