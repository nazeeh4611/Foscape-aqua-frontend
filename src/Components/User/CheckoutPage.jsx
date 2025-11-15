import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  CreditCard,
  MapPin,
  ArrowLeft,
  Check,
  ChevronRight,
} from 'lucide-react';
import Navbar from '../../Layout/Navbar';
import Footer from '../../Layout/Footer';
import { useCartWishlist } from '../../Context.js/Cartwishlist';
import { useAuth } from '../../Context.js/Auth';
import { useToast } from '../../Context.js/ToastContext';
import axios from 'axios';
import { baseurl } from '../../Base/Base';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isLogged } = useAuth();
  const { cart, cartLoading } = useCartWishlist();
  const showToast = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [errors, setErrors] = useState({});
  const { fetchCart } = useCartWishlist();


  useEffect(() => {
    if (!isLogged) {
      navigate('/');
    }
  }, [isLogged, navigate]);

  useEffect(() => {
    const checkInitialCart = async () => {
      if (!cartLoading && (!cart || cart.items.length === 0)) {
        showToast.error('Your cart is empty');
        navigate('/cart');
      }
    };
    
    checkInitialCart();
  }, []); 

  const validateAddress = () => {
    const newErrors = {};

    if (!shippingAddress.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!shippingAddress.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(shippingAddress.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!shippingAddress.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address is required';
    }

    if (!shippingAddress.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!shippingAddress.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!shippingAddress.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^[0-9]{6}$/.test(shippingAddress.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleContinueToPayment = () => {
    if (validateAddress()) {
      setStep(2);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    try {
      setLoading(true);

      const res = await loadRazorpayScript();
      if (!res) {
        showToast.error('Failed to load payment gateway');
        setLoading(false);
        return;
      }

      const { data } = await axios.post(
        `${baseurl}user/orders/razorpay/create`,
        { amount: cart.totalAmount },
        { withCredentials: true }
      );

      const options = {
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Your Store Name',
        description: 'Order Payment',
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${baseurl}user/orders/razorpay/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );

            if (verifyRes.data.success) {
              await createOrderInBackend({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
            }
          } catch (error) {
            showToast.error('Payment verification failed');
            setLoading(false);
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#144E8C',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            showToast.error('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      showToast.error('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const createOrderInBackend = async (paymentDetails = null) => {
    try {
      const orderData = {
        shippingAddress,
        paymentMethod,
        paymentDetails,
      };
  
      const { data } = await axios.post(
        `${baseurl}user/orders/create`,
        orderData,
        { withCredentials: true }
      );
  
      if (data.success) {
        await fetchCart();
        showToast.success('Order placed successfully!');
        navigate(`/order-success/${data.order._id}`);
      }
    } catch (error) {
      console.error('Order creation error:', error);
      showToast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'Razorpay') {
      await handleRazorpayPayment();
    } else {
      setLoading(true);
      await createOrderInBackend();
    }
  };

  if (cartLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#CFEAE3] to-[#99D5C8] pt-24">
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-[#144E8C] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Loading...</p>
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
              onClick={() => navigate('/cart')}
              className="flex items-center gap-2 mb-4 text-[#CFEAE3] hover:text-white transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Cart</span>
            </button>

            <div className="flex items-center gap-3 mb-3">
              <ShoppingBag className="w-8 h-8" />
              <h1 className="text-3xl sm:text-4xl font-bold">Checkout</h1>
            </div>

            <div className="flex items-center text-sm text-[#CFEAE3] gap-1">
              <span onClick={() => navigate('/')} className="hover:text-white cursor-pointer">
                Home
              </span>
              <ChevronRight className="w-4 h-4" />
              <span onClick={() => navigate('/cart')} className="hover:text-white cursor-pointer">
                Cart
              </span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-semibold">Checkout</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 -mt-8 pb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step >= 1
                        ? 'bg-[#144E8C] text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {step > 1 ? <Check className="w-5 h-5" /> : '1'}
                  </div>
                  <span
                    className={`font-semibold ${
                      step >= 1 ? 'text-[#144E8C]' : 'text-slate-400'
                    }`}
                  >
                    Shipping
                  </span>
                </div>

                <div className="w-16 h-1 bg-slate-200">
                  <div
                    className={`h-full transition-all ${
                      step >= 2 ? 'bg-[#144E8C] w-full' : 'bg-slate-200 w-0'
                    }`}
                  ></div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step >= 2
                        ? 'bg-[#144E8C] text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    2
                  </div>
                  <span
                    className={`font-semibold ${
                      step >= 2 ? 'text-[#144E8C]' : 'text-slate-400'
                    }`}
                  >
                    Payment
                  </span>
                </div>
              </div>
            </div>

            {step === 1 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="w-5 h-5 text-[#144E8C]" />
                  <h2 className="text-xl font-bold text-slate-800">Shipping Address</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.fullName ? 'border-red-500' : 'border-slate-300'
                      } rounded-xl focus:outline-none focus:border-[#144E8C]`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.phone ? 'border-red-500' : 'border-slate-300'
                      } rounded-xl focus:outline-none focus:border-[#144E8C]`}
                      placeholder="10 digit mobile number"
                      maxLength="10"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={shippingAddress.addressLine1}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.addressLine1 ? 'border-red-500' : 'border-slate-300'
                      } rounded-xl focus:outline-none focus:border-[#144E8C]`}
                      placeholder="House No., Building Name"
                    />
                    {errors.addressLine1 && (
                      <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={shippingAddress.addressLine2}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#144E8C]"
                      placeholder="Road name, Area, Colony"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.city ? 'border-red-500' : 'border-slate-300'
                      } rounded-xl focus:outline-none focus:border-[#144E8C]`}
                      placeholder="Enter city"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.state ? 'border-red-500' : 'border-slate-300'
                      } rounded-xl focus:outline-none focus:border-[#144E8C]`}
                      placeholder="Enter state"
                    />
                    {errors.state && (
                      <p className="text-red-500text-xs mt-1">{errors.state}</p>
                      )}
                    </div>
  
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={shippingAddress.pincode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border ${
                          errors.pincode ? 'border-red-500' : 'border-slate-300'
                        } rounded-xl focus:outline-none focus:border-[#144E8C]`}
                        placeholder="6 digit pincode"
                        maxLength="6"
                      />
                      {errors.pincode && (
                        <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
                      )}
                    </div>
  
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={shippingAddress.country}
                        disabled
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-600"
                      />
                    </div>
                  </div>
  
                  <button
                    onClick={handleContinueToPayment}
                    className="mt-6 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}
  
              {step === 2 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="w-5 h-5 text-[#144E8C]" />
                    <h2 className="text-xl font-bold text-slate-800">Payment Method</h2>
                  </div>
  
                  <div className="space-y-4 mb-6">
                    <div
                      onClick={() => setPaymentMethod('COD')}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === 'COD'
                          ? 'border-[#144E8C] bg-blue-50'
                          : 'border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              paymentMethod === 'COD'
                                ? 'border-[#144E8C]'
                                : 'border-slate-300'
                            }`}
                          >
                            {paymentMethod === 'COD' && (
                              <div className="w-3 h-3 rounded-full bg-[#144E8C]"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">Cash on Delivery</p>
                            <p className="text-sm text-slate-600">Pay when you receive</p>
                          </div>
                        </div>
                      </div>
                    </div>
  
                    <div
                      onClick={() => setPaymentMethod('Razorpay')}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === 'Razorpay'
                          ? 'border-[#144E8C] bg-blue-50'
                          : 'border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              paymentMethod === 'Razorpay'
                                ? 'border-[#144E8C]'
                                : 'border-slate-300'
                            }`}
                          >
                            {paymentMethod === 'Razorpay' && (
                              <div className="w-3 h-3 rounded-full bg-[#144E8C]"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              Online Payment (Razorpay)
                            </p>
                            <p className="text-sm text-slate-600">
                              Credit/Debit Card, UPI, Net Banking
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <div className="bg-slate-50 p-4 rounded-xl mb-6">
                    <h3 className="font-semibold text-slate-800 mb-3">Shipping Address</h3>
                    <p className="text-sm text-slate-700">
                      {shippingAddress.fullName}
                    </p>
                    <p className="text-sm text-slate-700">{shippingAddress.phone}</p>
                    <p className="text-sm text-slate-700">
                      {shippingAddress.addressLine1}
                      {shippingAddress.addressLine2 && `, ${shippingAddress.addressLine2}`}
                    </p>
                    <p className="text-sm text-slate-700">
                      {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                    </p>
                    <p className="text-sm text-slate-700">{shippingAddress.country}</p>
                    <button
                      onClick={() => setStep(1)}
                      className="text-sm text-[#144E8C] font-medium mt-2 hover:underline"
                    >
                      Change Address
                    </button>
                  </div>
  
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              )}
            </div>
  
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Order Summary</h2>
  
              <div className="space-y-3 mb-4">
                {cart?.items.map((item) => (
                  <div key={item.product._id} className="flex gap-3 pb-3 border-b border-slate-200">
                    <img
                      src={item.product.images?.[0] || '/placeholder.jpg'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-slate-800 line-clamp-2">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#144E8C]">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
  
              <div className="space-y-2 border-t border-slate-200 pt-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({cart?.totalItems} items)</span>
                  <span className="font-semibold">₹{cart?.totalAmount}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="text-lg font-bold text-slate-800">Total</span>
                  <span className="text-2xl font-bold text-[#144E8C]">
                    ₹{cart?.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  };