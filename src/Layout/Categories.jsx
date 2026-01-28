import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fish, ChevronRight, ChevronDown } from 'lucide-react';
import { fetchCategories } from '../services/homeService';
import useApiData from '../hooks/useApiData';
import { CategorySkeleton } from '../Components/Common/LoadingSkeleton';

const CategoryComponent = () => {
  const [activeCategory, setActiveCategory] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const navigate = useNavigate();

  const {
    data,
    loading,
    error,
    fromCache
  } = useApiData(fetchCategories);
  
  const categories = Array.isArray(data) ? data : [];

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]._id);
    }
    
    if (loading === false) {
      setIsInitialLoad(false);
    }
  }, [categories, activeCategory, loading]);

  const gradients = useMemo(() => [
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-blue-500',
    'from-pink-500 to-rose-500',
  ], []);

  const getGradientColor = (index) => gradients[index % gradients.length];

  const handleViewProducts = (categoryId) => {
    navigate(`/${categoryId}/sub-category`);
  };
  
  const activeData = useMemo(() => {
    if (!Array.isArray(categories)) return null;
    return categories.find(cat => cat._id === activeCategory);
  }, [categories, activeCategory]);

  if (isInitialLoad && loading) {
    return <CategorySkeleton />;
  }

  if (error && categories.length === 0) {
    return (
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-red-700 mb-3">Failed to load categories</h3>
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

  if (categories.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
            <Fish className="w-4 h-4 text-blue-600" />
            <span className="text-blue-600 font-medium">Our Categories</span>
            {fromCache && (
              <span className="text-xs text-blue-400">(Cached)</span>
            )}
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
            Our Categories
          </h2>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore our premium selection of aquatic life and professional equipment
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => {
            const gradientColor = getGradientColor(index);
            const isActive = activeCategory === category._id;
            return (
              <button
                key={category._id}
                onClick={() => setActiveCategory(category._id)}
                className={`group flex flex-col items-center gap-3 p-6 w-36 rounded-2xl transition-all 
                ${isActive
                  ? "bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl border-2 border-blue-200"
                  : "bg-slate-50 hover:bg-white shadow-md hover:shadow-lg"
                }`}
              >
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? `bg-gradient-to-br ${gradientColor} shadow-lg` 
                    : 'bg-white'
                }`}>
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-10 h-10 object-contain"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                  ) : (
                    <Fish className="w-10 h-10 text-blue-600" />
                  )}
                </div>

                <span className="text-slate-900 font-semibold">{category.name}</span>

                {isActive && (
                  <div className={`w-12 h-1.5 rounded-full bg-gradient-to-r ${gradientColor}`}></div>
                )}
              </button>
            );
          })}
        </div>

        {activeData && (
          <div className="w-full mx-auto bg-gradient-to-r from-[#144E8C] to-[#78CDD1] rounded-3xl p-6 md:p-12 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
              <div className={`w-40 h-40 md:w-48 md:h-48 rounded-2xl p-1.5 shadow-2xl ${
                getGradientColor(categories.findIndex(c => c._id === activeCategory))
              }`}>
                <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                  <img
                    src={activeData.image}
                    alt={activeData.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                </div>
              </div>

              <div className="flex-1 text-white">
                <h3 className="text-4xl font-bold mb-3">{activeData.name}</h3>
                <p className="text-lg mb-6">
                  {activeData.description || "Explore our quality products in this category"}
                </p>

                <button
                  onClick={() => handleViewProducts(activeData._id)}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
                >
                  View Products
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/categories')}
            className="inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition"
          >
            Explore All Categories
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryComponent;