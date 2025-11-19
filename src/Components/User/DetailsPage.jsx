import React, { useEffect, useState } from 'react';
import {
  Package,
  ChevronRight,
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  Info,
  Box,
  Droplets,
  Fish,
  Wrench,
  Calendar,
  MapPin,
  Shield,
  Truck,
  CheckCircle,
  AlertCircle,
  ZoomIn,
  X,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../Layout/Navbar';
import Footer from '../../Layout/Footer';
import { baseurl } from '../../Base/Base';
import { useAuth } from '../../Context.js/Auth';
import { useCartWishlist } from '../../Context.js/Cartwishlist';
import { useToast } from '../../Context.js/ToastContext';

const ProductDetailsPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, wishlist } = useCartWishlist();
  const showToast = useToast();
  useEffect(() => {
    fetchProductDetails();
    fetchRelatedProducts();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseurl}user/product/${id}`);
      if (response.data.success) {
        setProduct(response.data.product);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await axios.get(`${baseurl}user/products/related/${id}?limit=4`);
      if (response.data.success) {
        setRelatedProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleCategoryClick = () => {
    if (product.category && product.category._id) {
      navigate(`/${product.category._id}/sub-category?page=1`);
    }
  };

  const handleSubCategoryClick = () => {
    if (product.subCategory && product.subCategory._id) {
      navigate(`/products/subcategory/${product.subCategory._id}?page=1`);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      const result = await addToCart(product._id, quantity);
      
      // Check if result exists and has success property
      if (result && result.success) {
        showToast.success('Product added to cart successfully!');
      } else {
        // If result exists but success is false, or if result is undefined
        const errorMessage = result?.message || 'Failed to add product to cart';
        showToast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast.error('Failed to add product to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };
  
  const handleAddToWishlist = async () => {
    setAddingToWishlist(true);
    try {
      const result = await addToWishlist(product._id);
      
      // Check if result exists and has success property
      if (result && result.success) {
        showToast.success('Product added to wishlist successfully!');
      } else {
        // If result exists but success is false, or if result is undefined
        const errorMessage = result?.message || 'Failed to add product to wishlist';
        showToast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      showToast.error('Failed to add product to wishlist. Please try again.');
    } finally {
      setAddingToWishlist(false);
    }
  };

  const isInWishlist = () => {
    if (!wishlist || !wishlist.products) return false;
    return wishlist.products.some(p => p._id === product._id);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#CFEAE3] to-[#99D5C8] pt-24">
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-[#144E8C] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Loading product details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#CFEAE3] to-[#99D5C8] pt-24">
          <div className="text-center bg-white rounded-2xl shadow-xl p-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h2>
            <p className="text-slate-600 mb-6">The product you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Browse Products
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
  <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">             <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 mb-4 text-[#CFEAE3] hover:text-white transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>

            <div className="flex items-center text-sm text-[#CFEAE3] gap-1">
              <span onClick={() => navigate('/')} className="hover:text-white cursor-pointer">Home</span>
              <ChevronRight className="w-4 h-4" />
              <span onClick={() => navigate('/categories')} className="hover:text-white cursor-pointer">Categories</span>
              {product.category && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <span 
                    onClick={handleCategoryClick}
                    className="hover:text-white cursor-pointer"
                  >
                    {product.category.name}
                  </span>
                </>
              )}
              {product.subCategory && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <span 
                    onClick={handleSubCategoryClick}
                    className="text-white font-semibold hover:text-[#CFEAE3] cursor-pointer"
                  >
                    {product.subCategory.name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 -mt-8 pb-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              <div className="space-y-4">
                <div className="relative bg-slate-50 rounded-2xl overflow-hidden aspect-square">
                  <img
                    src={product.images?.[selectedImage] || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setIsZoomed(true)}
                    className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:bg-slate-100 transition-all"
                  >
                    <ZoomIn className="w-5 h-5 text-slate-700" />
                  </button>
                  {product.stock === 0 && (
                    <div className="absolute top-4 left-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-full shadow-lg">
                      Out of Stock
                    </div>
                  )}
                  {product.stock > 0 && product.stock < 10 && (
                    <div className="absolute top-4 left-4 px-4 py-2 bg-orange-500 text-white font-semibold rounded-full shadow-lg">
                      Only {product.stock} Left
                    </div>
                  )}
                  {product.featured && (
                    <div className="absolute bottom-4 right-4 px-4 py-2 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white font-semibold rounded-full shadow-lg">
                      Featured
                    </div>
                  )}
                </div>

                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? 'border-[#144E8C] shadow-md'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  {product.category && (
                    <div className="inline-block px-3 py-1 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white text-sm font-semibold rounded-full mb-3">
                      {product.category.name}
                    </div>
                  )}
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">{product.name}</h1>
                  <p className="text-slate-600 leading-relaxed">{product.description}</p>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-[#144E8C]">₹{product.price}</span>
                  <span className="text-sm text-slate-500">SKU: {product.sku}</span>
                </div>

                {product.stock > 0 && (
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-semibold text-slate-700">Quantity:</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-slate-500">({product.stock} available)</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || addingToCart}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <button 
                    onClick={handleAddToWishlist}
                    disabled={addingToWishlist || isInWishlist()}
                    className={`px-6 py-4 rounded-xl transition-all ${
                      isInWishlist() 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist() ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-4">
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                    <Truck className="w-5 h-5 text-[#144E8C]" />
                    <span className="text-xs font-medium text-slate-700">Free Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                    <Shield className="w-5 h-5 text-[#144E8C]" />
                    <span className="text-xs font-medium text-slate-700">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-[#144E8C]" />
                    <span className="text-xs font-medium text-slate-700">Quality Check</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Info className="w-6 h-6 text-[#144E8C]" />
                Product Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.brand && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <Box className="w-5 h-5 text-[#144E8C] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Brand</h3>
                      <p className="text-slate-600">{product.brand}</p>
                    </div>
                  </div>
                )}

                {product.waterType && product.waterType !== 'N/A' && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <Droplets className="w-5 h-5 text-[#144E8C] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Water Type</h3>
                      <p className="text-slate-600">{product.waterType}</p>
                    </div>
                  </div>
                )}

                {product.tankSize && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <Box className="w-5 h-5 text-[#144E8C] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Tank Size</h3>
                      <p className="text-slate-600">{product.tankSize}</p>
                    </div>
                  </div>
                )}

                {product.warranty && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <Shield className="w-5 h-5 text-[#144E8C] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Warranty</h3>
                      <p className="text-slate-600">{product.warranty}</p>
                    </div>
                  </div>
                )}

                {product.fishSpecies && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <Fish className="w-5 h-5 text-[#144E8C] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Species</h3>
                      <p className="text-slate-600">{product.fishSpecies}</p>
                    </div>
                  </div>
                )}

                {product.fishSize && product.fishSize !== 'N/A' && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <Fish className="w-5 h-5 text-[#144E8C] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Fish Size</h3>
                      <p className="text-slate-600">{product.fishSize}</p>
                    </div>
                  </div>
                )}

                {product.temperament && product.temperament !== 'N/A' && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <Info className="w-5 h-5 text-[#144E8C] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Temperament</h3>
                      <p className="text-slate-600">{product.temperament}</p>
                    </div>
                  </div>
                )}

                {product.dietType && product.dietType !== 'N/A' && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <Package className="w-5 h-5 text-[#144E8C] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Diet Type</h3>
                      <p className="text-slate-600">{product.dietType}</p>
                    </div>
                  </div>
                )}

                {product.minimumTankSize && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <Box className="w-5 h-5 text-[#144E8C] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Minimum Tank Size</h3>
                      <p className="text-slate-600">{product.minimumTankSize}</p>
                    </div>
                  </div>
                )}

                {product.feedType && product.feedType !== 'N/A' && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <Package className="w-5 h-5 text-[#144E8C] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Feed Type</h3>
                      <p className="text-slate-600">{product.feedType}</p>
                    </div>
                  </div>
                )}

                {product.feedSize && product.feedSize !== 'N/A' && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <Box className="w-5 h-5 text-[#144E8C] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Feed Size</h3>
                      <p className="text-slate-600">{product.feedSize}</p>
                    </div>
                  </div>
                )}

                {product.nutritionInfo && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl md:col-span-2">
                    <Info className="w-5 h-5 text-[#144E8C] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Nutrition Information</h3>
                      <p className="text-slate-600">{product.nutritionInfo}</p>
                    </div>
                  </div>
                )}

                {product.serviceType && product.serviceType !== 'N/A' && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <Wrench className="w-5 h-5 text-[#144E8C] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Service Type</h3>
                      <p className="text-slate-600">{product.serviceType}</p>
                    </div>
                  </div>
                )}

                {product.serviceDuration && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-[#144E8C] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Duration</h3>
                      <p className="text-slate-600">{product.serviceDuration}</p>
                    </div>
                  </div>
                )}

                {product.serviceArea && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-[#144E8C] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Service Area</h3>
                      <p className="text-slate-600">{product.serviceArea}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <div
                    key={relatedProduct._id}
                    onClick={() => navigate(`/product/${relatedProduct._id}`)}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                  >
                    <div className="relative h-48 overflow-hidden bg-slate-50">
                      <img
                        src={relatedProduct.images?.[0] || '/placeholder.jpg'}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-800 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-[#144E8C]">₹{relatedProduct.price}</span>
                        <span className="text-xs text-slate-500">Stock: {relatedProduct.stock}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4" onClick={() => setIsZoomed(false)}>
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 p-3 bg-white rounded-full hover:bg-slate-100 transition-all"
          >
            <X className="w-6 h-6 text-slate-700" />
          </button>
          <img
            src={product.images?.[selectedImage] || '/placeholder.jpg'}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      <Footer />
    </>
  );
};

export default ProductDetailsPage;