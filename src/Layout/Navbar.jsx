import React, { useState, useEffect } from "react";
import AuthModal from "../Components/Reuse/AuthModal.jsx";
import OtpModal from "../Components/Reuse/OtpModal.jsx";
import logo from "../assets/logo.png";
import axios from "axios";
import { baseurl } from "../Base/Base.js";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ClientId } from "../Base/Base.js";
import { useAuth } from "../Context.js/Auth.jsx";
import { useCartWishlist } from '../Context.js/Cartwishlist';
import {
  Menu,
  X,
  ShoppingCart,
  Heart,
  User,
  LogOut,
  Package,
  ChevronDown,
  Trash2,
  Plus,
  Minus,
  Eye,
} from "lucide-react";
import { useToast } from "../Context.js/ToastContext.jsx";

const Navbar = () => {
  const { user, isLogged, checkAuthStatus, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [updating, setUpdating] = useState({});
  const  showToast = useToast();

  
  const navigate = useNavigate();
  const location = useLocation();

const getHeadingColor = () => {
  const path = location.pathname;
  
  if (path === '/' || path === '/home') {
    return 'text-teal-600';
  } else if (path === '/service' || path.startsWith('/service')) {
    return 'text-teal-600';
  } else if (path === '/categories' || path.startsWith('/categories')) {
    return 'text-teal-600';
  } else if (path === '/about' || path.startsWith('/about')) {
    return 'text-teal-600';
  } else if (path === '/contact' || path.startsWith('/contact')) {
    return 'text-teal-600';
  }
  
  return 'text-teal-600';
};
  const {
    cart,
    wishlist,
    cartCount,
    wishlistCount,
    removeFromCart,
    updateCartItem,
    removeFromWishlist,
    addToCart,
  } = useCartWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isCartOpen || isWishlistOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen, isWishlistOpen]);

  const handleRegisterSuccess = (email) => {
    setRegisteredEmail(email);
    setShowOtpModal(true);
  };

  const handleLoginSuccess = async () => {
    await checkAuthStatus();
    setShowAuthModal(false);
  };
  const handleLogout = async () => {
    try {
      await axios.post(`${baseurl}user/logout`);
      
      showToast.success("Logged out successfully!");
      
      logout();
      setShowProfileDropdown(false);
      setIsMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      showToast.error("Logout failed. Please try again.");
    }
  };
  const handleLogoClick = () => {
    navigate("/");
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  const handleOtpModalClose = () => {
    setShowOtpModal(false);
    setRegisteredEmail("");
  };

  const handleOtpVerifySuccess = async () => {
    await checkAuthStatus();
  };

  const handleQuantityChange = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    setUpdating((prev) => ({ ...prev, [productId]: true }));
    await updateCartItem(productId, newQuantity);
    setUpdating((prev) => ({ ...prev, [productId]: false }));
  };

  const handleRemoveFromCart = async (productId) => {
    setUpdating((prev) => ({ ...prev, [productId]: true }));
    await removeFromCart(productId);
    setUpdating((prev) => ({ ...prev, [productId]: false }));
  };

  const handleRemoveFromWishlist = async (productId) => {
    await removeFromWishlist(productId);
  };

  const handleMoveToCart = async (productId) => {
    const result = await addToCart(productId, 1);
    if (result.success) {
      await removeFromWishlist(productId);
    }
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    navigate("/cart");
  };

  const handleViewWishlist = () => {
    setIsWishlistOpen(false);
    navigate("/wishlist");
  };

  return (
    <GoogleOAuthProvider clientId={ClientId}>
<header
  className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled ? "bg-white shadow-md" : "bg-white"
  }`}
>
  <div className="max-w-7xl mx-auto px-5 sm:px-8">
    <div className="flex justify-between items-center h-20">
      
      <div className="flex items-center cursor-pointer select-none" onClick={handleLogoClick}>
        <img
          src={logo}
          alt="Logo"
          className="w-auto h-16 object-contain transition-all duration-300"
        />
      </div>

      <nav className="hidden md:flex items-center space-x-8">
        {[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/categories" },
          { name: "Gallery", path: "/gallery" },
          { name: "Service", path: "/service" },
          { name: "About", path: "/about" },
          { name: "Contact", path: "/contact" },
        ].map((item) => {
          const active =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname === item.path ||
                location.pathname.startsWith(item.path + "/")

          return (
            <Link key={item.name} to={item.path} className="relative group py-2">
              <span
                className={`text-[16px] font-medium tracking-wide transition ${
                  active
                    ? "text-teal-600"
                    : "text-gray-800 group-hover:text-teal-600"
                }`}
              >
                {item.name}
              </span>

              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-300 ${
                  active ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center space-x-4">

        {isLogged && (
          <>
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 rounded-xl hover:bg-teal-50 transition"
            >
              <Heart className="w-6 h-6 text-teal-600" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl hover:bg-teal-50 transition"
            >
              <ShoppingCart className="w-6 h-6 text-teal-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </>
        )}

        <div className="hidden md:block">
          {!isLogged ? (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 text-white text-sm font-semibold shadow-md hover:scale-105 transition"
            >
              Sign In
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 text-white text-sm shadow-md hover:scale-105 transition"
              >
                <div className="w-7 h-7 rounded-full bg-white text-teal-600 text-xs font-bold flex items-center justify-center">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                {user?.name}
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-teal-100 rounded-xl shadow-xl py-3">
                  <div className="px-4 pb-3 border-b border-teal-100">
                    <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                    <p className="text-xs text-teal-600">{user?.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setShowProfileDropdown(false)}
                    className="block px-4 py-2 text-sm hover:bg-teal-50 hover:text-teal-600 transition rounded-lg"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 hover:text-red-600 transition rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? (
            <X className="w-7 h-7 text-teal-600" />
          ) : (
            <Menu className="w-7 h-7 text-teal-600" />
          )}
        </button>
      </div>
    </div>

    <div
      className={`md:hidden transition-all duration-300 ${
        isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      } overflow-hidden`}
    >
  <nav className="px-4 py-4 space-y-4 bg-white border-t border-gray-100">
  {["Home", "Shop", "Gallery", "Service", "About", "Contact"].map((item) => (
    <Link
      key={item}
      to={
        item === "Home"
          ? "/"
          : item === "Shop"
          ? "/categories"   // 👈 Redirect Shop → /categories
          : `/${item.toLowerCase()}`
      }
      onClick={handleMenuItemClick}
      className="block text-lg font-medium text-gray-700 hover:text-teal-600 transition"
    >
      {item}
    </Link>
  ))}

  {!isLogged ? (
    <button
      onClick={() => {
        setShowAuthModal(true);
        handleMenuItemClick();
      }}
      className="w-full py-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 text-white text-lg font-semibold shadow-md hover:scale-105 transition"
    >
      Sign In
    </button>
  ) : (
    <div className="space-y-3">
      <div className="px-4 py-3 bg-teal-50 border border-teal-100 rounded-lg">
        <p className="text-sm font-semibold">{user?.name}</p>
        <p className="text-xs text-teal-600">{user?.email}</p>
      </div>

      <Link
        to="/profile"
        onClick={handleMenuItemClick}
        className="block text-lg font-medium hover:text-teal-600 transition"
      >
        Profile
      </Link>

      <button
        onClick={() => {
          handleLogout();
          handleMenuItemClick();
        }}
        className="w-full text-left text-lg hover:text-red-600 transition"
      >
        Logout
      </button>
    </div>
  )}
</nav>

    </div>
  </div>
</header>








      {/* Cart Sidebar */}
      {(isCartOpen || isWishlistOpen) && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => {
            setIsCartOpen(false);
            setIsWishlistOpen(false);
          }}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-400 text-white p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-6 h-6" />
                <h2 className="text-xl font-bold">Shopping Cart</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-teal-100">{cartCount} items</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {!cart || cart.items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-10 h-10 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium">Your cart is empty</p>
                <p className="text-sm text-slate-400 mt-1">
                  Add products to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.product._id}
                    className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-all"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.product.images?.[0] || "/placeholder.jpg"}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg cursor-pointer"
                        onClick={() => {
                          setIsCartOpen(false);
                          navigate(`/product/${item.product._id}`);
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-semibold text-sm text-slate-800 line-clamp-2 cursor-pointer hover:text-teal-600"
                          onClick={() => {
                            setIsCartOpen(false);
                            navigate(`/product/${item.product._id}`);
                          }}
                        >
                          {item.product.name}
                        </h3>
                        <p className="text-sm font-bold text-teal-600 mt-1">
                          ₹{item.price}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.product._id,
                                  item.quantity,
                                  -1
                                )
                              }
                              disabled={
                                updating[item.product._id] || item.quantity <= 1
                              }
                              className="w-6 h-6 rounded bg-white hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.product._id,
                                  item.quantity,
                                  1
                                )
                              }
                              disabled={
                                updating[item.product._id] ||
                                item.quantity >= item.product.stock
                              }
                              className="w-6 h-6 rounded bg-white hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveFromCart(item.product._id)}
                            disabled={updating[item.product._id]}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart && cart.items.length > 0 && (
            <div className="border-t border-slate-200 p-4 bg-white">
              <div className="flex justify-between mb-4">
                <span className="font-semibold text-slate-700">Total:</span>
                <span className="text-2xl font-bold text-teal-600">
                  ₹{cart.totalAmount}
                </span>
              </div>
              <button
                onClick={handleViewCart}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-400 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                View Cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Wishlist Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isWishlistOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-400 text-white p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6" />
                <h2 className="text-xl font-bold">Wishlist</h2>
              </div>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-teal-100">{wishlistCount} items</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {!wishlist || wishlist.products.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium">
                  Your wishlist is empty
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Save your favorite products
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlist.products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-all"
                  >
                    <div className="flex gap-3">
                      <img
                        src={product.images?.[0] || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg cursor-pointer"
                        onClick={() => {
                          setIsWishlistOpen(false);
                          navigate(`/product/${product._id}`);
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-semibold text-sm text-slate-800 line-clamp-2 cursor-pointer hover:text-teal-600"
                          onClick={() => {
                            setIsWishlistOpen(false);
                            navigate(`/product/${product._id}`);
                          }}
                        >
                          {product.name}
                        </h3>
                        <p className="text-sm font-bold text-teal-600 mt-1">
                          ₹{product.price}
                        </p>
                        {product.stock === 0 ? (
                          <p className="text-xs text-red-500 font-medium mt-1">
                            Out of Stock
                          </p>
                        ) : product.stock < 10 ? (
                          <p className="text-xs text-orange-500 font-medium mt-1">
                            Only {product.stock} left
                          </p>
                        ) : (
                          <p className="text-xs text-green-600 font-medium mt-1">
                            In Stock
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleMoveToCart(product._id)}
                            disabled={product.stock === 0}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-400 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            Add to Cart
                          </button>
                          <button
                            onClick={() => handleRemoveFromWishlist(product._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {wishlist && wishlist.products.length > 0 && (
            <div className="border-t border-slate-200 p-4 bg-white">
              <button
                onClick={handleViewWishlist}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-400 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                View All Wishlist
              </button>
            </div>
          )}
        </div>
      </div>

      <AuthModal
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onRegisterSuccess={handleRegisterSuccess}
        onLoginSuccess={handleLoginSuccess}
      />

       <OtpModal
        show={showOtpModal}
        onClose={handleOtpModalClose}
        email={registeredEmail}
        onVerifySuccess={handleOtpVerifySuccess}
      />
    </GoogleOAuthProvider>
  );
};

export default Navbar;