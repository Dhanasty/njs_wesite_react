import { useState, useEffect } from 'react'
import { Search, Eye, CheckCircle, Clock, XCircle, IndianRupee, Filter } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import { ordersService, handleAPIError } from '../services/api'
import toast from 'react-hot-toast'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      
      // First, check localStorage for any orders
      const savedOrders = localStorage.getItem('admin_orders')
      console.log('localStorage orders:', savedOrders)
      
      try {
        const response = await ordersService.getAll()
        console.log('API response:', response.data)
        setOrders(response.data.orders || [])
      } catch (apiError) {
        console.warn('API failed, using localStorage fallback:', apiError)
        handleAPIError(apiError, 'Failed to fetch orders from API, using local data')
        
        // Fallback to localStorage if API fails
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders)
          setOrders(parsedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
          console.log('Loaded from localStorage:', parsedOrders.length, 'orders')
        } else {
          console.log('No orders found in localStorage either')
          setOrders([])
        }
      }
    } catch (error) {
      console.error('Error in fetchOrders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.customerDetails?.firstName} ${order.customerDetails?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-neutral-600" />
    }
  }

  const getStatusColor = (status) => {
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

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersService.updateStatus(orderId, newStatus)
      
      const updatedOrders = orders.map(order => 
        order.orderId === orderId 
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      )
      setOrders(updatedOrders)
      
      // Also update localStorage as fallback
      localStorage.setItem('admin_orders', JSON.stringify(updatedOrders))
      
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
      
      toast.success('Order status updated successfully')
    } catch (error) {
      handleAPIError(error, 'Failed to update order status')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Order History</h1>
          <p className="mt-1 text-neutral-600">Manage and track all customer orders</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex items-center space-x-2 text-sm text-neutral-600">
            <span>Total Orders: {orders.length}</span>
            <span>•</span>
            <span>Completed: {orders.filter(o => o.status === 'completed').length}</span>
            <span>•</span>
            <span>Pending: {orders.filter(o => o.status === 'pending').length}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by order ID, email, or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 text-center">
            <div className="text-neutral-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-neutral-600">
              {orders.length === 0 ? 'No orders found.' : 'No orders match your search criteria.'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold text-neutral-900">Order #{order.orderId}</h3>
                    <p className="text-sm text-neutral-600">
                      {order.customerDetails?.firstName} {order.customerDetails?.lastName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center text-lg font-bold text-neutral-900">
                      <IndianRupee className="h-4 w-4" />
                      {order.finalAmount?.toLocaleString()}
                    </div>
                    <p className="text-xs text-neutral-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewOrder(order)}
                    className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-50"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="flex items-center space-x-4 text-sm text-neutral-600">
                <span>{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}</span>
                <span>•</span>
                <span>{order.customerDetails?.email}</span>
                <span>•</span>
                <span>{order.customerDetails?.phone}</span>
                {order.giftCode && (
                  <>
                    <span>•</span>
                    <span className="text-green-600 font-medium">Code: {order.giftCode.code}</span>
                  </>
                )}
              </div>

              {/* Items Preview */}
              <div className="mt-4 flex space-x-2 overflow-x-auto">
                {order.items?.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex-shrink-0 flex items-center space-x-2 bg-neutral-50 rounded-lg p-2">
                    <div className="relative w-10 h-10 bg-neutral-200 rounded overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image.startsWith('/') ? `http://localhost:5000/proxy/nextjs-images${item.image}` : item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-xs text-neutral-600" style={{display: item.image ? 'none' : 'flex'}}>
                        IMG
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-neutral-900 truncate w-24">
                        {item.name}
                      </p>
                      <p className="text-xs text-neutral-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
                {(order.items?.length || 0) > 3 && (
                  <div className="flex-shrink-0 flex items-center justify-center w-16 h-14 bg-neutral-100 rounded-lg text-xs text-neutral-600">
                    +{(order.items?.length || 0) - 3} more
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-neutral-900">
                    Order Details #{selectedOrder.orderId}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                {/* Status Update */}
                <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Update Order Status
                  </label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.orderId, e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Customer Details */}
                <div className="mb-6">
                  <h3 className="font-semibold text-neutral-900 mb-3">Customer Information</h3>
                  <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedOrder.customerDetails?.firstName} {selectedOrder.customerDetails?.lastName}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.customerDetails?.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedOrder.customerDetails?.phone}</p>
                    <p><span className="font-medium">Address:</span> {selectedOrder.customerDetails?.address}, {selectedOrder.customerDetails?.city}, {selectedOrder.customerDetails?.state} - {selectedOrder.customerDetails?.pincode}</p>
                    {selectedOrder.customerDetails?.notes && (
                      <p><span className="font-medium">Notes:</span> {selectedOrder.customerDetails.notes}</p>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-semibold text-neutral-900 mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-lg">
                        <div className="relative w-16 h-16 bg-neutral-200 rounded overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image.startsWith('/') ? `http://localhost:5000/proxy/nextjs-images${item.image}` : item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-xs text-neutral-600" style={{display: item.image ? 'none' : 'flex'}}>
                            IMG
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-neutral-900">{item.name}</h4>
                          <p className="text-sm text-neutral-600">{item.category}</p>
                          {item.selectedColor && (
                            <div className="flex items-center mt-1">
                              <span className="text-sm text-neutral-600 mr-2">Color: {item.selectedColor.name}</span>
                              {item.selectedColor.value && (
                                <div
                                  className="w-4 h-4 rounded-full border border-neutral-300"
                                  style={{ backgroundColor: item.selectedColor.value }}
                                />
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{item.price?.toLocaleString()}</p>
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
                      <span>₹{selectedOrder.amount?.toLocaleString()}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({selectedOrder.giftCode?.code}):</span>
                        <span>-₹{selectedOrder.discount?.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>₹{selectedOrder.finalAmount?.toLocaleString()}</span>
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

export default Orders