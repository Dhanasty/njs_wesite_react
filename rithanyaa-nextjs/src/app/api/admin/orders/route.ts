import { NextRequest, NextResponse } from 'next/server'
import { getOrders, getOrderStats } from '@/lib/orders'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeStats = searchParams.get('stats') === 'true'
    
    const orders = getOrders()
    
    if (includeStats) {
      const stats = getOrderStats()
      return NextResponse.json({
        orders,
        stats
      })
    }
    
    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}