import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { baseurl } from '../Base/Base';

const CartWishlistContext = createContext();

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error('useCartWishlist must be used within CartWishlistProvider');
  }
  return context;
};


export const CartWishlistProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [wishlist, setWishlist] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Add this missing function
  const isInWishlist = (productId) => {
    if (!wishlist || !wishlist.products) return false;
    return wishlist.products.some(item => item._id === productId);
  };

  // Add this function to check if product is in cart
  const isInCart = (productId) => {
    if (!cart || !cart.items) return false;
    return cart.items.some(item => item.product?._id === productId);
  };

  const fetchCart = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setCart(null);
        setCartCount(0);
        return;
      }

      const response = await axios.get(`${baseurl}user/cart`, getAuthHeaders());
      if (response.data.success) {
        setCart(response.data.cart);
        setCartCount(response.data.cart.items?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.response?.status === 401) {
        setCart(null);
        setCartCount(0);
      }
    }
  };

  const fetchWishlist = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setWishlist(null);
        setWishlistCount(0);
        return;
      }

      const response = await axios.get(`${baseurl}user/wishlist`, getAuthHeaders());
      if (response.data.success) {
        setWishlist(response.data.wishlist);
        setWishlistCount(response.data.wishlist.products?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      if (error.response?.status === 401) {
        setWishlist(null);
        setWishlistCount(0);
      }
    }
  };


  const addToCart = async (productId, quantity) => {
  try {
    const response = await axios.post(
      `${baseurl}user/cart/add`,
      { productId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data.success) {
      // Directly update state instead of refetching
      setCart(response.data.cart);
      return { success: true };
    }
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to add to cart' 
    };
  }
};

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(
        `${baseurl}user/cart/remove/${productId}`,
        getAuthHeaders()
      );
      
      if (response.data.success) {
        await fetchCart();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const response = await axios.put(
        `${baseurl}user/cart/update`,
        { productId, quantity },
        getAuthHeaders()
      );
      
      if (response.data.success) {
        await fetchCart();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Error updating cart:', error);
      return { success: false };
    }
  };

  const clearCart = async () => {
    try {
      const response = await axios.delete(
        `${baseurl}user/cart/clear`,
        getAuthHeaders()
      );
      
      if (response.data.success) {
        await fetchCart();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false };
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const response = await axios.post(
        `${baseurl}user/wishlist/add`,
        { productId },
        getAuthHeaders()
      );
      
      if (response.data.success) {
        await fetchWishlist();
        return { success: true, message: 'Product added to wishlist' };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add to wishlist' 
      };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await axios.delete(
        `${baseurl}user/wishlist/remove/${productId}`,
        getAuthHeaders()
      );
      
      if (response.data.success) {
        await fetchWishlist();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false };
    }
  };

  const moveToCart = async (productId) => {
    try {
      const addResult = await addToCart(productId, 1);
      if (addResult.success) {
        await removeFromWishlist(productId);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Error moving to cart:', error);
      return { success: false };
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      const token = getAuthToken();
      if (token) {
        await Promise.all([fetchCart(), fetchWishlist()]);
      }
      setLoading(false);
    };

    initializeData();
  }, []);

  const value = {
    cart,
    wishlist,
    cartCount,
    wishlistCount,
    loading,
    fetchCart,
    fetchWishlist,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    isInWishlist, // Add this
    isInCart, // Add this too for consistency
  };

  return (
    <CartWishlistContext.Provider value={value}>
      {children}
    </CartWishlistContext.Provider>
  );
};