import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Package, ChevronRight } from 'lucide-react';
import Navbar from '../../Layout/Navbar';
import Footer from '../../Layout/Footer';
import { useAuth } from '../../Context.js/Auth';
import axios from 'axios';
import { baseurl } from '../../Base/Base';

export const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { isLogged } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLogged) {
      navigate('/');
    }
  }, [isLogged, navigate]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
            `${baseurl}user/orders/${orderId}`,
          { withCredentials: true }
        );
        setOrder(data.order);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#CFEAE3] to-[#99D5C8] pt-24">
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-[#144E8C] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Loading order details...</p>
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
        <div
    className="absolute inset-0 opacity-10"
    style={{
      backgroundImage: 'url(/patterns/foscape-pattern.svg)',
      backgroundSize: '1000px 1000px',
      backgroundPosition: 'left center',
      backgroundRepeat: 'repeat-y',
      maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 40%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 40%, transparent 100%)'
    }}
  />
  <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">             <div className="flex items-center text-sm text-[#CFEAE3] gap-1 mb-4">
              <span onClick={() => navigate('/')} className="hover:text-white cursor-pointer">
                Home
              </span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-semibold">Order Success</span>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 md:px-8 -mt-8 pb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-slate-800 mb-2">Order Placed Successfully!</h1>
            <p className="text-slate-600 mb-6">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>

            {order && (
              <div className="bg-slate-50 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Order Number</p>
                    <p className="font-bold text-[#144E8C]">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Order Date</p>
                    <p className="font-semibold text-slate-800">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Payment Method</p>
                    <p className="font-semibold text-slate-800">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Amount</p>
                    <p className="font-bold text-[#144E8C] text-xl">₹{order.totalAmount}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/orders')}
                className="px-6 py-3 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Package className="w-5 h-5" />
                View Orders
              </button>
              <button
                onClick={() => navigate('/categories')}
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};