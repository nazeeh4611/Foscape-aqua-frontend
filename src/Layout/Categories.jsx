import React, { useEffect, useState } from 'react';
import { Fish, Package } from 'lucide-react';
import axios from 'axios';
import { baseurl } from '../Base/Base';
import {  Link } from "react-router-dom";

const CategoryComponent = () => {
  const [activeCategory, setActiveCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseurl}user/category`);
      console.log(response.data);
      if (response.data.success) {
        setCategories(response.data.categories);
        if (response.data.categories.length > 0) {
          setActiveCategory(response.data.categories[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const getGradientColor = (index) => {
    const gradients = [
      'from-blue-500 to-cyan-500',
      'from-emerald-500 to-teal-500',
      'from-purple-500 to-pink-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-blue-500',
      'from-pink-500 to-rose-500',
      'from-teal-500 to-cyan-500',
      'from-amber-500 to-orange-500'
    ];
    return gradients[index % gradients.length];
  };

  const activeData = categories.find(cat => cat._id === activeCategory);

  return (
    <div className="w-full mx-auto px-4 py-8 bg-gradient-to-br from-[#CFEAE3] to-[#99D5C8] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Our Categories
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Discover our premium selection of aquatic life and professional equipment
          </p>
        </div>

        {/* Compact Category Icons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category, index) => {
            const gradientColor = getGradientColor(index);
            const isActive = activeCategory === category._id;
            
            return (
              <button
                key={category._id}
                onClick={() => setActiveCategory(category._id)}
                className={`group relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 hover:scale-105 w-28 ${
                  isActive 
                    ? 'bg-white shadow-lg' 
                    : 'bg-white/60 hover:bg-white shadow hover:shadow-md'
                }`}
              >
                {/* Icon/Image Container */}
                <div className={`relative w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 ${
                  isActive 
                    ? `bg-gradient-to-br ${gradientColor} shadow-md` 
                    : 'bg-slate-100 group-hover:bg-slate-200'
                }`}>
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className={`w-12 h-12 object-cover rounded-lg transition-all duration-300 ${
                      isActive ? 'brightness-110' : 'brightness-90 group-hover:brightness-100'
                    }`}
                  />
                </div>
                
                {/* Category Name */}
                <span className={`text-xs font-semibold text-center transition-colors duration-300 ${
                  isActive ? 'text-slate-800' : 'text-slate-600 group-hover:text-slate-800'
                }`}>
                  {category.name}
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-gradient-to-r ${gradientColor}`}></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Category Display */}
        {activeData && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Image Section */}
              <div className="flex-shrink-0">
                <div className={`w-48 h-48 rounded-2xl bg-gradient-to-br ${getGradientColor(categories.findIndex(c => c._id === activeCategory))} p-1 shadow-xl`}>
                  <div className="w-full h-full bg-white rounded-xl overflow-hidden">
                    <img 
                      src={activeData.image} 
                      alt={activeData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* Info Section */}
              <div className="flex-grow text-center md:text-left">
                <h2 className="text-3xl font-bold text-slate-800 mb-3">
                  {activeData.name}
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {activeData.description}
                </p>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                  <Package className="w-4 h-4" />
                  View All
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Bottom CTA */}
        <div className="text-center">
        <Link to="/categories">
  <button
    className="inline-flex items-center gap-2 px-8 py-3 
               bg-gradient-to-r from-slate-700 to-slate-900 
               text-white rounded-xl font-semibold 
               hover:shadow-lg transition-all duration-300"
  >
    <Fish className="w-5 h-5" />
    Explore All Products
  </button>
</Link>

        </div>
      </div>
    </div>
  );
};

export default CategoryComponent;