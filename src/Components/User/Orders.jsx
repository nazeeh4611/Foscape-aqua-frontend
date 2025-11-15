import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  ChevronRight,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  AlertCircle,
} from 'lucide-react';
import Navbar from '../../Layout/Navbar';
import Footer from '../../Layout/Footer';
import { useAuth } from '../../Context.js/Auth';
import { useToast } from '../../Context.js/ToastContext';
import axios from 'axios';
import { baseurl } from '../../Base/Base';

const getStatusIcon = (status) => {
  switch (status) {
    case 'Pending':
      return <Clock className="w-5 h-5 text-yellow-600" />;
    case 'Confirmed':
      return <CheckCircle className="w-5 h-5 text-blue-600" />;
    case 'Processing':
      return <Package className="w-5 h-5 text-purple-600" />;
    case 'Shipped':
      return <Truck className="w-5 h-5 text-indigo-600" />;
    case 'Delivered':
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case 'Cancelled':
      return <XCircle className="w-5 h-5 text-red-600" />;
    default:
      return <AlertCircle className="w-5 h-5 text-slate-600" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'Confirmed':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Processing':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'Shipped':
      return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    case 'Delivered':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'Cancelled':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

export const OrdersPage = () => {
  const navigate = useNavigate();
  const { isLogged } = useAuth();
  const showToast = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState({ open: false, orderId: null });
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isLogged) {
      navigate('/');
    }
  }, [isLogged, navigate]);

  useEffect(() => {
    if (isLogged) {
      fetchOrders();
    }
  }, [isLogged]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${baseurl}user/orders`,
        { withCredentials: true }
      );
      
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.response?.status !== 401) {
        showToast.error('Failed to load orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      const { data } = await axios.put(
        `${baseurl}user/orders/${cancelModal.orderId}/cancel`,
        { reason: cancelReason },
        { withCredentials: true }
      );

      if (data.success) {
        showToast.success('Order cancelled successfully');
        await fetchOrders();
        setCancelModal({ open: false, orderId: null });
        setCancelReason('');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      showToast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#CFEAE3] to-[#99D5C8] pt-24">
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-[#144E8C] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Loading orders...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-[#CFEAE3] to-[#99D5C8] min-h-screen pt-24">
        <div className="bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white py-12">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 mb-4 text-[#CFEAE3] hover:text-white transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>

            <div className="flex items-center gap-3 mb-3">
              <Package className="w-8 h-8" />
              <h1 className="text-3xl sm:text-4xl font-bold">My Orders</h1>
            </div>

            <div className="flex items-center text-sm text-[#CFEAE3] gap-1">
              <span onClick={() => navigate('/')} className="hover:text-white cursor-pointer">
                Home
              </span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-semibold">Orders</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 -mt-8 pb-16">
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">No Orders Yet</h2>
              <p className="text-slate-600 mb-6">You haven't placed any orders yet</p>
              <button
                onClick={() => navigate('/categories')}
                className="px-6 py-3 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 border-b border-slate-200">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Order Number</p>
                          <p className="font-bold text-[#144E8C]">{order.orderNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Order Date</p>
                          <p className="font-semibold text-slate-800">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {getStatusIcon(order.orderStatus)}
                          <span className="text-sm font-semibold">{order.orderStatus}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-3 mb-4">
                      {order.items && order.items.length > 0 && order.items.map((item) => (
                        <div
                          key={item._id}
                          className="flex gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
                        >
                          <img
                            src={item.image || '/placeholder.jpg'}
                            alt={item.name || 'Product'}
                            className="w-20 h-20 object-cover rounded-lg cursor-pointer"
                            onClick={() => item.product && navigate(`/product/${item.product}`)}
                          />
                          <div className="flex-1 min-w-0">
                            <h3
                              className="font-semibold text-slate-800 mb-1 hover:text-[#144E8C] cursor-pointer line-clamp-2"
                              onClick={() => item.product && navigate(`/product/${item.product}`)}
                            >
                              {item.name || 'Product'}
                            </h3>
                            <p className="text-sm text-slate-600">Quantity: {item.quantity}</p>
                            <p className="text-sm font-bold text-[#144E8C]">₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-[#144E8C]">₹{order.totalAmount}</p>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => navigate(`/order-details/${order._id}`)}
                          className="px-4 py-2 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-medium hover:shadow-lg transition-all text-sm"
                        >
                          View Details
                        </button>
                        {['Pending', 'Confirmed'].includes(order.orderStatus) && (
                          <button
                            onClick={() => setCancelModal({ open: true, orderId: order._id })}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-xl font-medium hover:bg-red-200 transition-all text-sm"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />

      {cancelModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Cancel Order</h3>
            <p className="text-slate-600 mb-4">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>

            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation (optional)"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#144E8C] mb-4 resize-none"
              rows="3"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setCancelModal({ open: false, orderId: null });
                  setCancelReason('');
                }}
                disabled={cancelling}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all disabled:opacity-50"
              >
                No, Keep It
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};