import { NextRequest, NextResponse } from 'next/server'
import { getInventory, getInventoryStats, restockProduct } from '@/lib/inventory'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeStats = searchParams.get('stats') === 'true'
    
    const inventory = getInventory()
    
    if (includeStats) {
      const stats = getInventoryStats()
      return NextResponse.json({
        inventory,
        stats
      })
    }
    
    return NextResponse.json({ inventory })
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json()
    
    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'Valid productId and quantity are required' },
        { status: 400 }
      )
    }
    
    restockProduct(productId, quantity)
    
    return NextResponse.json({
      success: true,
      message: `Successfully restocked product ${productId} with ${quantity} units`
    })
  } catch (error) {
    console.error('Error restocking product:', error)
    return NextResponse.json(
      { error: 'Failed to restock product' },
      { status: 500 }
    )
  }
}