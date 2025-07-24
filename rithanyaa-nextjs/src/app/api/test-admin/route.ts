import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing connection to admin dashboard...')
    
    const response = await fetch('http://localhost:5000/health', {
      method: 'GET',
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({
        success: true,
        message: 'Admin dashboard is accessible',
        adminData: data
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Admin dashboard responded but with error',
        status: response.status
      })
    }
  } catch (error) {
    console.error('Connection test failed:', error)
    return NextResponse.json({
      success: false,
      message: 'Cannot connect to admin dashboard',
      error: error.message
    })
  }
}