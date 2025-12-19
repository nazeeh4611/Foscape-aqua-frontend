import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Package } from 'lucide-react';
import { fetchFeaturedProducts } from '../services/homeService'; 
import useApiData from '../hooks/useApiData'; 
import { SliderSkeleton } from '../Components/Common/LoadingSkeleton'; 

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollByAmount = 320;

const scrollLeft = useCallback(() => {
  if (!sliderRef.current) return;
  sliderRef.current.scrollBy({
    left: -scrollByAmount,
    behavior: 'smooth',
  });
}, []);

const scrollRight = useCallback(() => {
  if (!sliderRef.current) return;
  sliderRef.current.scrollBy({
    left: scrollByAmount,
    behavior: 'smooth',
  });
}, []);



  const {
    data,
    loading,
    error,
    fromCache
  } = useApiData(() => fetchFeaturedProducts(12));
  
  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-blue-500',
  ];
  
  const getGradientColor = (index) => {
    return gradients[index % gradients.length];
  };
  
  const products = Array.isArray(data) ? data : [];
  
  if (loading && products.length === 0) {
    return (
      <div className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-full mb-4 shadow-lg">
              <Star className="w-4 h-4" />
              <span className="font-medium">Featured Products</span>
            </div>
            <div className="h-12 bg-slate-200 rounded w-96 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-slate-200 rounded w-64 mx-auto animate-pulse" />
          </div>
          <SliderSkeleton />
        </div>
      </div>
    );
  }

  // Show error state
  if (error && products.length === 0) {
    return (
      <div className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-red-700 mb-3">Failed to load products</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!products.length) return null;



  return (
    <div className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-full mb-4 shadow-lg">
            <Star className="w-4 h-4" />
            <span className="font-medium">Featured Products</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Premium Selection</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Discover our handpicked collection of top-quality aquatic products</p>
        </div>

        <div className="relative">
          {canScrollLeft && (
            <button 
              onClick={scrollLeft} 
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-12 h-12 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-full shadow-xl flex items-center justify-center z-10 hover:scale-110 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {canScrollRight && (
            <button 
              onClick={scrollRight} 
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-12 h-12 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-full shadow-xl flex items-center justify-center z-10 hover:scale-110 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <div 
            ref={sliderRef} 
            className="flex gap-6 overflow-x-auto pb-8"
            style={{ 
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {products.map((product, index) => {
              const gradientColor = getGradientColor(index);
              return (
                <div 
                  key={product._id} 
                  onClick={() => navigate(`/product/${product._id}`)} 
                  className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-10`} />
                    <img 
                      src={product.images?.[0] || "/placeholder.jpg"} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      loading="lazy"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-lg">
                          {product.discount}% OFF
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{product.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-slate-600 font-medium">4.8</span>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm line-clamp-2 mb-4">{product.description}</p>

                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-slate-900">₹{product.price}</span>
                          {product.discount > 0 && (
                            <span className="text-sm text-slate-400 line-through">
                              ₹{(product.price / (1 - product.discount / 100)).toFixed(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Package className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-500">Free shipping</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl font-semibold hover:scale-105 transition-all">
                        View Details
                      </button>
                      <button className="px-4 py-3 bg-gradient-to-br from-slate-100 to-white text-slate-900 rounded-xl font-semibold border border-slate-200 hover:shadow-lg transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute left-0 top-0 bottom-8 w-8 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-8 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;