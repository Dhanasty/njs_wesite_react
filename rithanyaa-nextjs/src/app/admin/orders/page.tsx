'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Order } from '@/lib/orders'
import { 
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline'

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/admin/orders')
        const data = await response.json()
        setOrders(data.orders || [])
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerDetails.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.customerDetails.firstName} ${order.customerDetails.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-600" />
      default:
        return <ClockIcon className="h-5 w-5 text-neutral-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-neutral-100 text-neutral-800'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-300 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="h-4 bg-neutral-300 rounded w-48 mb-2"></div>
                <div className="h-4 bg-neutral-300 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Order History</h1>
        <p className="text-neutral-600">Manage and track all customer orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by order ID, email, or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-200 text-center">
            <div className="text-neutral-400 mb-4">
              <ShoppingBagIcon className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-neutral-600">No orders found matching your criteria.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold text-neutral-900">Order #{order.orderId}</h3>
                    <p className="text-sm text-neutral-600">
                      {order.customerDetails.firstName} {order.customerDetails.lastName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center text-lg font-bold text-neutral-900">
                      <CurrencyRupeeIcon className="h-5 w-5" />
                      {order.finalAmount.toLocaleString()}
                    </div>
                    <p className="text-xs text-neutral-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-50"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="flex items-center space-x-2 text-sm text-neutral-600">
                <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                <span>•</span>
                <span>{order.customerDetails.email}</span>
                <span>•</span>
                <span>{order.customerDetails.phone}</span>
              </div>

              {/* Items Preview */}
              <div className="mt-4 flex space-x-2 overflow-x-auto">
                {order.items.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex-shrink-0 flex items-center space-x-2 bg-neutral-50 rounded-lg p-2">
                    <div className="relative w-10 h-10 rounded overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-neutral-900 truncate w-24">
                        {item.name}
                      </p>
                      <p className="text-xs text-neutral-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="flex-shrink-0 flex items-center justify-center w-16 h-14 bg-neutral-100 rounded-lg text-xs text-neutral-600">
                    +{order.items.length - 3} more
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setSelectedOrder(null)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-neutral-900">
                    Order Details #{selectedOrder.orderId}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Customer Details */}
                <div className="mb-6">
                  <h3 className="font-semibold text-neutral-900 mb-3">Customer Information</h3>
                  <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedOrder.customerDetails.firstName} {selectedOrder.customerDetails.lastName}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.customerDetails.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedOrder.customerDetails.phone}</p>
                    <p><span className="font-medium">Address:</span> {selectedOrder.customerDetails.address}, {selectedOrder.customerDetails.city}, {selectedOrder.customerDetails.state} - {selectedOrder.customerDetails.pincode}</p>
                    {selectedOrder.customerDetails.notes && (
                      <p><span className="font-medium">Notes:</span> {selectedOrder.customerDetails.notes}</p>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-semibold text-neutral-900 mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-lg">
                        <div className="relative w-16 h-16 rounded overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-neutral-900">{item.name}</h4>
                          <p className="text-sm text-neutral-600">{item.category}</p>
                          {item.selectedColor && (
                            <p className="text-sm text-neutral-600">Color: {item.selectedColor.name}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{item.price.toLocaleString()}</p>
                          <p className="text-sm text-neutral-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{selectedOrder.amount.toLocaleString()}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-₹{selectedOrder.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>₹{selectedOrder.finalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}