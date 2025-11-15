import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Heart,
  Package,
  ChevronRight,
} from 'lucide-react';
import Navbar from '../../Layout/Navbar';
import Footer from '../../Layout/Footer';
import { useCartWishlist } from '../../Context.js/Cartwishlist';
import { useAuth } from '../../Context.js/Auth';
import { useToast } from '../../Context.js/ToastContext';

function ConfirmModal({ open, onClose, onConfirm, message }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-5 w-80 shadow-lg">
        <p className="text-center text-gray-800 mb-4">{message}</p>

        <div className="flex justify-center gap-3">
          <button
            className="px-4 py-1.5 bg-gray-200 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-1.5 bg-red-500 text-white rounded-md"
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export const CartPage = () => {
  const navigate = useNavigate();
  const { isLogged } = useAuth();
  const {
    cart,
    cartLoading,
    updateCartItem,
    removeFromCart,
    clearCart,
    addToWishlist,
  } = useCartWishlist();
  const [updating, setUpdating] = useState({});
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    message: '',
    action: null
  });
  const showToast = useToast();

  useEffect(() => {
    if (!isLogged) {
      navigate('/');
    }
  }, [isLogged, navigate]);

  const handleQuantityChange = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    setUpdating(prev => ({ ...prev, [productId]: true }));
    try {
      await updateCartItem(productId, newQuantity);
      showToast.success(`Quantity updated to ${newQuantity}`);
    } catch (error) {
      showToast.error('Failed to update quantity');
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemove = async (productId) => {
    setUpdating(prev => ({ ...prev, [productId]: true }));
    try {
      await removeFromCart(productId);
      showToast.success('Item removed from cart');
    } catch (error) {
      showToast.error('Failed to remove item');
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleOpenModal = (message, action) => {
    setConfirmModal({ open: true, message, action });
  };

  const handleCloseModal = () => {
    setConfirmModal({ open: false, message: '', action: null });
  };

  const handleConfirm = async () => {
    if (confirmModal.action) {
      await confirmModal.action();
    }
    handleCloseModal();
  };

  const handleClearCart = () => {
    handleOpenModal("Are you sure you want to clear your cart?", async () => {
      try {
        await clearCart();
        showToast.success("Cart cleared successfully");
      } catch {
        showToast.error("Failed to clear cart");
      }
    });
  };

  const handleMoveToWishlist = async (productId) => {
    const result = await addToWishlist(productId);
    if (result.success) {
      await removeFromCart(productId);
      showToast.success('Item moved to wishlist');
    } else {
      showToast.error(result.message || 'Failed to move to wishlist');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#CFEAE3] to-[#99D5C8] pt-24">
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-[#144E8C] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Loading cart...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

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
              <ShoppingCart className="w-8 h-8" />
              <h1 className="text-3xl sm:text-4xl font-bold">Shopping Cart</h1>
            </div>

            <div className="flex items-center text-sm text-[#CFEAE3] gap-1">
              <span onClick={() => navigate('/')} className="hover:text-white cursor-pointer">
                Home
              </span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-semibold">Cart</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 -mt-8 pb-16">
          {isEmpty ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Your Cart is Empty</h2>
              <p className="text-slate-600 mb-6">
                Add some products to get started with your shopping
              </p>
              <button
                onClick={() => navigate('/categories')}
                className="px-6 py-3 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800">
                      Cart Items ({cart.totalItems})
                    </h2>
                    <button
                      onClick={handleClearCart}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div
                        key={item.product._id}
                        className="flex gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
                      >
                        <img
                          src={item.product.images?.[0] || '/placeholder.jpg'}
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded-lg cursor-pointer"
                          onClick={() => navigate(`/product/${item.product._id}`)}
                        />

                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-bold text-slate-800 mb-1 hover:text-[#144E8C] cursor-pointer line-clamp-2"
                            onClick={() => navigate(`/product/${item.product._id}`)}
                          >
                            {item.product.name}
                          </h3>
                          {item.product.category && (
                            <p className="text-xs text-slate-500 mb-2">
                              {item.product.category.name}
                            </p>
                          )}
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-[#144E8C]">
                              ₹{item.price}
                            </span>
                            {item.product.stock < 10 && (
                              <span className="text-xs text-orange-500 font-medium">
                                Only {item.product.stock} left
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.product._id, item.quantity, -1)
                              }
                              disabled={updating[item.product._id] || item.quantity <= 1}
                              className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all flex items-center justify-center"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.product._id, item.quantity, 1)
                              }
                              disabled={
                                updating[item.product._id] ||
                                item.quantity >= item.product.stock
                              }
                              className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all flex items-center justify-center"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-semibold text-slate-700 mb-2">
                              ₹{item.price * item.quantity}
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleMoveToWishlist(item.product._id)}
                                disabled={updating[item.product._id]}
                                className="p-2 text-slate-600 hover:text-[#144E8C] transition-all"
                                title="Move to Wishlist"
                              >
                                <Heart className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRemove(item.product._id)}
                                disabled={updating[item.product._id]}
                                className="p-2 text-red-600 hover:text-red-700 transition-all"
                                title="Remove"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal ({cart.totalItems} items)</span>
                      <span className="font-semibold">₹{cart.totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Delivery</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <div className="border-t border-slate-200 pt-3 flex justify-between">
                      <span className="text-lg font-bold text-slate-800">Total</span>
                      <span className="text-2xl font-bold text-[#144E8C]">
                        ₹{cart.totalAmount}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    className="w-full px-6 py-4 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-semibold hover:shadow-lg transition-all mb-3"
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={() => navigate('/categories')}
                    className="w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all"
                  >
                    Continue Shopping
                  </button>

                  <div className="mt-6 p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-100">
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-[#144E8C] mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-800 text-sm mb-1">
                          Free Delivery
                        </h3>
                        <p className="text-xs text-slate-600">
                          Enjoy free delivery on all orders
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      
      <ConfirmModal
        open={confirmModal.open}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        message={confirmModal.message}
      />
    </>
  );
};

export const WishlistPage = () => {
  const navigate = useNavigate();
  const { isLogged } = useAuth();
  const {
    wishlist,
    wishlistLoading,
    removeFromWishlist,
    clearWishlist,
    addToCart,
  } = useCartWishlist();
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    message: '',
    action: null
  });
  const showToast = useToast();

  useEffect(() => {
    if (!isLogged) {
      navigate('/');
    }
  }, [isLogged, navigate]);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      showToast.success('Item removed from wishlist');
    } catch (error) {
      showToast.error('Failed to remove item from wishlist');
    }
  };

  const handleOpenModal = (message, action) => {
    setConfirmModal({ open: true, message, action });
  };

  const handleCloseModal = () => {
    setConfirmModal({ open: false, message: '', action: null });
  };

  const handleConfirm = async () => {
    if (confirmModal.action) {
      await confirmModal.action();
    }
    handleCloseModal();
  };

  const handleClearWishlist = () => {
    handleOpenModal("Are you sure you want to clear your wishlist?", async () => {
      try {
        await clearWishlist();
        showToast.success("Wishlist cleared successfully");
      } catch {
        showToast.error("Failed to clear wishlist");
      }
    });
  };

  const handleAddToCart = async (productId) => {
    try {
      const result = await addToCart(productId, 1);
      if (result.success) {
        await removeFromWishlist(productId);
        showToast.success('Item added to cart');
      } else {
        showToast.error(result.message || 'Failed to add to cart');
      }
    } catch (error) {
      showToast.error('Failed to add to cart');
    }
  };

  if (wishlistLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#CFEAE3] to-[#99D5C8] pt-24">
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-[#144E8C] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Loading wishlist...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const isEmpty = !wishlist || wishlist.products.length === 0;

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
              <Heart className="w-8 h-8" />
              <h1 className="text-3xl sm:text-4xl font-bold">My Wishlist</h1>
            </div>

            <div className="flex items-center text-sm text-[#CFEAE3] gap-1">
              <span onClick={() => navigate('/')} className="hover:text-white cursor-pointer">
                Home
              </span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-semibold">Wishlist</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 -mt-8 pb-16">
          {isEmpty ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">
                Your Wishlist is Empty
              </h2>
              <p className="text-slate-600 mb-6">
                Save your favorite products to your wishlist
              </p>
              <button
                onClick={() => navigate('/categories')}
                className="px-6 py-3 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Explore Products
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  {wishlist.products.length} {wishlist.products.length === 1 ? 'Item' : 'Items'}
                </h2>
                <button
                  onClick={handleClearWishlist}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.products.map((product) => (
                  <div
                    key={product._id}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100"
                  >
                    <div className="relative h-56 overflow-hidden bg-slate-50">
                      <img
                        src={product.images?.[0] || '/placeholder.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                        onClick={() => navigate(`/product/${product._id}`)}
                      />
                      <button
                        onClick={() => handleRemove(product._id)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                      {product.stock === 0 && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-lg">
                          Out of Stock
                        </div>
                      )}
                      {product.stock > 0 && product.stock < 10 && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full shadow-lg">
                          Only {product.stock} Left
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3
                        className="text-sm font-bold text-slate-800 mb-2 group-hover:text-[#144E8C] transition-colors line-clamp-2 cursor-pointer"
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        {product.name}
                      </h3>
                      {product.category && (
                        <p className="text-xs text-slate-500 mb-3">
                          {product.category.name}
                        </p>
                      )}

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-[#144E8C]">
                          ₹{product.price}
                        </span>
                        <span className="text-xs text-slate-500">
                          Stock: {product.stock}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product._id)}
                        disabled={product.stock === 0}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span className="text-sm">Add to Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />

      <ConfirmModal
        open={confirmModal.open}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        message={confirmModal.message}
      />
    </>
  );
};