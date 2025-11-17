import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Package,
  ChevronRight,
  ArrowLeft,
  MapPin,
  CreditCard,
  Calendar,
  Clock,
  Download,
} from 'lucide-react';
import Navbar from '../../Layout/Navbar';
import Footer from '../../Layout/Footer';
import { useAuth } from '../../Context.js/Auth';
import axios from 'axios';
import { baseurl } from '../../Base/Base';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const OrderDetailsPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { isLogged } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef();

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

  const downloadInvoice = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: invoiceRef.current.scrollWidth,
        windowHeight: invoiceRef.current.scrollHeight,
        foreignObjectRendering: false,
        imageTimeout: 15000,
        removeContainer: true,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      if (isSafari) {
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice-${order.orderNumber}.pdf`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
      } else {
        pdf.save(`invoice-${order.orderNumber}.pdf`);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate invoice. Please try again or use a different browser.');
    }
  };

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

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#CFEAE3]to-[#99D5C8] pt-24">
          <div className="text-center">
            <p className="text-slate-600 mb-4">Order not found</p>
            <button
              onClick={() => navigate('/orders')}
              className="px-6 py-3 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Back to Orders
            </button>
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
              onClick={() => navigate('/orders')}
              className="flex items-center gap-2 mb-4 text-[#CFEAE3] hover:text-white transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Orders</span>
            </button>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 mb-3">
                <Package className="w-8 h-8" />
                <h1 className="text-3xl sm:text-4xl font-bold">Order Details</h1>
              </div>
              
              {order.orderStatus === 'Delivered' && (
                <button
                  onClick={downloadInvoice}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-[#144E8C] rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <Download className="w-5 h-5" />
                  Download Invoice
                </button>
              )}
            </div>

            <div className="flex items-center text-sm text-[#CFEAE3] gap-1">
              <span onClick={() => navigate('/')} className="hover:text-white cursor-pointer">
                Home
              </span>
              <ChevronRight className="w-4 h-4" />
              <span onClick={() => navigate('/orders')} className="hover:text-white cursor-pointer">
                Orders
              </span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-semibold">Order Details</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 -mt-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-1">
                      Order #{order.orderNumber}
                    </h2>
                    <p className="text-sm text-slate-600">
                      Placed on{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 mb-1">Status</p>
                    <p className="text-lg font-bold text-[#144E8C]">{order.orderStatus}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
                    >
                      <img
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg cursor-pointer"
                        onClick={() => navigate(`/product/${item.product}`)}
                      />
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-bold text-slate-800 mb-2 hover:text-[#144E8C] cursor-pointer line-clamp-2"
                          onClick={() => navigate(`/product/${item.product}`)}
                        >
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-4">
                          <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                          <p className="text-lg font-bold text-[#144E8C]">₹{item.price}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600 mb-1">Subtotal</p>
                        <p className="text-xl font-bold text-[#144E8C]">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-[#144E8C]" />
                  <h2 className="text-xl font-bold text-slate-800">Shipping Address</h2>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="font-semibold text-slate-800">
                    {order.shippingAddress.fullName}
                  </p>
                  <p className="text-sm text-slate-700">{order.shippingAddress.phone}</p>
                  <p className="text-sm text-slate-700 mt-2">
                    {order.shippingAddress.addressLine1}
                  </p>
                  {order.shippingAddress.addressLine2 && (
                    <p className="text-sm text-slate-700">
                      {order.shippingAddress.addressLine2}
                    </p>
                  )}
                  <p className="text-sm text-slate-700">
                    {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                    {order.shippingAddress.pincode}
                  </p>
                  <p className="text-sm text-slate-700">{order.shippingAddress.country}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-[#144E8C]" />
                  <h2 className="text-xl font-bold text-slate-800">Order Timeline</h2>
                </div>
                <div className="space-y-4">
                  {order.statusHistory.map((history, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-[#144E8C] rounded-full"></div>
                        {index < order.statusHistory.length - 1 && (
                          <div className="w-0.5 h-12 bg-slate-300"></div>
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="font-semibold text-slate-800">{history.status}</p>
                        <p className="text-sm text-slate-600">
                          {new Date(history.timestamp).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {history.note && (
                          <p className="text-sm text-slate-500 mt-1">{history.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Payment Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <CreditCard className="w-5 h-5 text-[#144E8C]" />
                    <div>
                      <p className="text-sm text-slate-600">Payment Method</p>
                      <p className="font-semibold text-slate-800">{order.paymentMethod}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-[#144E8C]" />
                    <div>
                      <p className="text-sm text-slate-600">Payment Status</p>
                      <p
                        className={`font-semibold ${
                          order.paymentStatus === 'Paid'
                            ? 'text-green-600'
                            : order.paymentStatus === 'Failed'
                            ? 'text-red-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {order.paymentStatus}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-200 pt-4">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{order.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between">
                    <span className="text-lg font-bold text-slate-800">Total</span>
                    <span className="text-2xl font-bold text-[#144E8C]">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>

                {order.paymentMethod === 'Razorpay' && order.paymentDetails && (
                  <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-600 mb-1">Transaction ID</p>
                    <p className="text-sm font-mono text-slate-800 break-all">
                      {order.paymentDetails.razorpayPaymentId}
                    </p>
                  </div>
                )}

                {order.orderStatus === 'Cancelled' && order.cancelReason && (
                  <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-sm font-semibold text-red-700 mb-1">
                      Cancellation Reason
                    </p>
                    <p className="text-sm text-red-600">{order.cancelReason}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {order.orderStatus === 'Delivered' && (
          <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
            <div ref={invoiceRef} className="bg-white p-8 max-w-4xl" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, Arial, sans-serif', color: '#000000', WebkitFontSmoothing: 'antialiased' }}>
              <div className="flex justify-between items-center mb-8 border-b-2 border-gray-300 pb-6">
                <div>
                  <img 
                    src="https://www.thefoscape.com/assets/logo-DkyHVLbt.png" 
                    alt="Foscape Logo" 
                    crossOrigin="anonymous"
                    className="h-16"
                    style={{ height: '64px' }}
                  />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#000000', margin: 0 }}>INVOICE</h1>
                  <p style={{ color: '#666666', margin: '4px 0 0 0' }}>Order #{order.orderNumber}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#000000', marginBottom: '8px' }}>Bill To:</h3>
                  <p style={{ fontWeight: '500', margin: '4px 0' }}>{order.shippingAddress.fullName}</p>
                  <p style={{ color: '#666666', margin: '4px 0' }}>{order.shippingAddress.phone}</p>
                  <p style={{ color: '#666666', margin: '4px 0' }}>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p style={{ color: '#666666', margin: '4px 0' }}>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p style={{ color: '#666666', margin: '4px 0' }}>
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                  <p style={{ color: '#666666', margin: '4px 0' }}>{order.shippingAddress.country}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#000000', marginBottom: '8px' }}>Invoice Details</h3>
                  <p style={{ color: '#666666', margin: '4px 0' }}>
                    <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </p>
                  <p style={{ color: '#666666', margin: '4px 0' }}>
                    <strong>Invoice Date:</strong> {new Date().toLocaleDateString('en-IN')}
                  </p>
                  <p style={{ color: '#666666', margin: '4px 0' }}>
                    <strong>Status:</strong> {order.orderStatus}
                  </p>
                  {order.paymentDetails?.razorpayPaymentId && (
                    <p style={{ color: '#666666', margin: '4px 0' }}>
                      <strong>Transaction ID:</strong> {order.paymentDetails.razorpayPaymentId}
                    </p>
                  )}
                </div>
              </div>

              <table style={{ width: '100%', marginBottom: '32px', borderCollapse: 'collapse', border: '1px solid #cccccc' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ border: '1px solid #cccccc', padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Item</th>
                    <th style={{ border: '1px solid #cccccc', padding: '12px 16px', textAlign: 'center', fontWeight: '600' }}>Quantity</th>
                    <th style={{ border: '1px solid #cccccc', padding: '12px 16px', textAlign: 'right', fontWeight: '600' }}>Price</th>
                    <th style={{ border: '1px solid #cccccc', padding: '12px 16px', textAlign: 'right', fontWeight: '600' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid #cccccc', padding: '12px 16px' }}>{item.name}</td>
                      <td style={{ border: '1px solid #cccccc', padding: '12px 16px', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ border: '1px solid #cccccc', padding: '12px 16px', textAlign: 'right' }}>₹{item.price}</td>
                      <td style={{ border: '1px solid #cccccc', padding: '12px 16px', textAlign: 'right' }}>₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '256px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e5e5' }}>
                    <span style={{ fontWeight: '500' }}>Subtotal:</span>
                    <span style={{ fontWeight: '500' }}>₹{order.totalAmount}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e5e5' }}>
                    <span style={{ fontWeight: '500' }}>Delivery:</span>
                    <span style={{ fontWeight: '500', color: '#16a34a' }}>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e5e5' }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total:</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #cccccc', textAlign: 'center', color: '#666666' }}>
                <p style={{ fontWeight: '600', margin: '4px 0' }}>FOSCAPE</p>
                <p style={{ margin: '4px 0' }}>4/46B, Juma Masjid, PV Building, V Hamza Road, Near Naduvilangadi, Tirur, Kerala 676107</p>
                <p style={{ margin: '4px 0' }}>Phone: +91-854 748 3891 | Email: info@thefoscape.com</p>
                <p style={{ marginTop: '16px', fontSize: '14px' }}>Thank you for your business!</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};