import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Package, Truck, CheckCircle, XCircle, Clock, AlertCircle, Calendar, User, MapPin, Phone, Mail, CreditCard, DollarSign, Hash } from 'lucide-react';
import { baseurl } from '../../Base/Base';
import axios from 'axios';

const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />
  };

  const styles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  return (
    <div className={`fixed top-4 right-4 z-[100] ${styles[type]} px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 max-w-sm animate-slide-in`}>
      {icons[type]}
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button onClick={onClose} className="hover:bg-white hover:bg-opacity-20 rounded p-1">
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Confirmed: 'bg-blue-100 text-blue-700',
    Processing: 'bg-purple-100 text-purple-700',
    Shipped: 'bg-indigo-100 text-indigo-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700'
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

const PaymentStatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Paid: 'bg-green-100 text-green-700',
    Failed: 'bg-red-100 text-red-700'
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

const UpdateStatusModal = ({ isOpen, onClose, order, onUpdate, onUpdatePayment }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.orderStatus);
      setSelectedPaymentStatus(order.paymentStatus);
      setNote('');
    }
  }, [order]);

  const statuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const paymentStatuses = ['Pending', 'Paid', 'Failed'];

  const handleSubmit = async () => {
    if (!selectedStatus || !selectedPaymentStatus) return;
    setIsSubmitting(true);
    
    try {
      // Update order status if changed
      if (selectedStatus !== order.orderStatus) {
        await onUpdate(order._id, selectedStatus, note);
      }
      
      // Update payment status if changed
      if (selectedPaymentStatus !== order.paymentStatus) {
        await onUpdatePayment(order._id, selectedPaymentStatus);
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Update Order & Payment Status</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Number</label>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{order.orderNumber}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            {selectedStatus !== order.orderStatus && (
              <p className="text-xs text-blue-600 mt-1">Status will be updated</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
            <select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            >
              {paymentStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            {selectedPaymentStatus !== order.paymentStatus && (
              <p className="text-xs text-green-600 mt-1">Payment status will be updated</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Note (Optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about the status change..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewOrderModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Order Details</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="text-sm font-bold text-gray-700 mb-3">Order Information</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 font-medium">Order Number</p>
                <p className="text-sm text-gray-900 font-mono">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Order Date</p>
                <p className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Order Status</p>
                <div className="mt-1"><StatusBadge status={order.orderStatus} /></div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Payment Status</p>
                <div className="mt-1"><PaymentStatusBadge status={order.paymentStatus} /></div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="text-sm font-bold text-gray-700 mb-3">Customer Information</h5>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Customer</p>
                  <p className="text-sm text-gray-900">{order.user?.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email</p>
                  <p className="text-sm text-gray-900">{order.user?.email || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="text-sm font-bold text-gray-700 mb-3">Shipping Address</h5>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Name</p>
                  <p className="text-sm text-gray-900">{order.shippingAddress.fullName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Phone</p>
                  <p className="text-sm text-gray-900">{order.shippingAddress.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Address</p>
                  <p className="text-sm text-gray-900">
                    {order.shippingAddress.addressLine1}
                    {order.shippingAddress.addressLine2 && <>, {order.shippingAddress.addressLine2}</>}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    <br />
                    {order.shippingAddress.country}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="text-sm font-bold text-gray-700 mb-3">Order Items</h5>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-3 bg-white p-3 rounded-lg">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">₹{item.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="text-sm font-bold text-gray-700 mb-3">Payment Information</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Payment Method</span>
                <span className="text-sm font-medium text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Payment Status</span>
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
              {order.paymentDetails?.razorpayPaymentId && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Payment ID</span>
                  <span className="text-sm font-mono text-gray-900">{order.paymentDetails.razorpayPaymentId}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-300">
                <span className="text-base font-bold text-gray-900">Total Amount</span>
                <span className="text-base font-bold text-blue-600">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="text-sm font-bold text-gray-700 mb-3">Status History</h5>
              <div className="space-y-3">
                {order.statusHistory.map((history, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={history.status} />
                        <span className="text-xs text-gray-500">
                          {new Date(history.timestamp).toLocaleString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {history.note && (
                        <p className="text-xs text-gray-600 mt-1">{history.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPayment, setFilterPayment] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewOrder, setViewOrder] = useState(null);
  const [updateStatusModal, setUpdateStatusModal] = useState({ isOpen: false, order: null });
  const [toastCounter, setToastCounter] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, []);

  const token = localStorage.getItem('Atoken');

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseurl}admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showToast('Failed to load orders. Please check your connection.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message, type = 'info') => {
    setToastCounter(prev => prev + 1);
    const id = Date.now() + toastCounter;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const updateOrderStatus = async (orderId, status, note) => {
    try {
      await axios.put(`${baseurl}admin/orders/${orderId}/status`, 
        { status, note },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      showToast('Order status updated successfully!', 'success');
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast('Failed to update order status', 'error');
      throw error;
    }
  };

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      await axios.put(`${baseurl}admin/orders/${orderId}/payment-status`, 
        { paymentStatus },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      showToast('Payment status updated successfully!', 'success');
      await fetchOrders();
    } catch (error) {
      console.error('Error updating payment status:', error);
      showToast('Failed to update payment status', 'error');
      throw error;
    }
  };

  const filteredAndSortedOrders = orders
    .filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || order.orderStatus === filterStatus;
      const matchesPayment = filterPayment === 'All' || order.paymentStatus === filterPayment;
      return matchesSearch && matchesStatus && matchesPayment;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'amount':
          return b.totalAmount - a.totalAmount;
        case 'orderNumber':
          return a.orderNumber.localeCompare(b.orderNumber);
        default:
          return 0;
      }
    });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === 'Pending').length,
    delivered: orders.filter(o => o.orderStatus === 'Delivered').length,
    cancelled: orders.filter(o => o.orderStatus === 'Cancelled').length
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>

      <div className="fixed top-4 right-4 z-[100] space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      <ViewOrderModal
        isOpen={viewOrder !== null}
        onClose={() => setViewOrder(null)}
        order={viewOrder}
      />

      <UpdateStatusModal
        isOpen={updateStatusModal.isOpen}
        onClose={() => setUpdateStatusModal({ isOpen: false, order: null })}
        order={updateStatusModal.order}
        onUpdate={updateOrderStatus}
        onUpdatePayment={updatePaymentStatus}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Orders</h2>
                <p className="text-xs text-gray-500 mt-0.5">{orders.length} total orders</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-600 font-medium">Total</p>
                <p className="text-lg font-bold text-blue-900">{stats.total}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                <p className="text-xs text-yellow-600 font-medium">Pending</p>
                <p className="text-lg font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                <p className="text-xs text-green-600 font-medium">Delivered</p>
                <p className="text-lg font-bold text-green-900">{stats.delivered}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                <p className="text-xs text-red-600 font-medium">Cancelled</p>
                <p className="text-lg font-bold text-red-900">{stats.cancelled}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order number, customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border ${showFilters ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-300 text-gray-700'}`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white font-medium"
                >
                  <option value="date">Latest First</option>
                  <option value="amount">Amount</option>
                  <option value="orderNumber">Order Number</option>
                </select>
              </div>

              {showFilters && (
                <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <select
                    value={filterPayment}
                    onChange={(e) => setFilterPayment(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="All">All Payment Status</option>
                    <option value="Pending">Payment Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                  </select>

                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('All');
                      setFilterPayment('All');
                      setSortBy('date');
                      showToast('Filters reset', 'info');
                    }}
                    className="w-full px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="overflow-y-auto p-4">
          <div className="space-y-3">
            {filteredAndSortedOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Hash className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-bold text-gray-900 font-mono">{order.orderNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">₹{order.totalAmount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{order.items.length} item(s)</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{order.user?.name || 'Unknown'}</span>
                </div>

                <div className="flex gap-2 mb-3">
                  <StatusBadge status={order.orderStatus} />
                  <PaymentStatusBadge status={order.paymentStatus} />
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-700">
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setViewOrder(order)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1 hover:bg-blue-700"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button
                    onClick={() => setUpdateStatusModal({ isOpen: true, order })}
                    className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1 hover:bg-purple-700"
                  >
                    <Package className="w-4 h-4" />
                    Update Status
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredAndSortedOrders.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No orders found</h3>
              <p className="text-sm text-gray-600 mb-4">Try adjusting your filters</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('All');
                  setFilterPayment('All');
                  setSortBy('date');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}