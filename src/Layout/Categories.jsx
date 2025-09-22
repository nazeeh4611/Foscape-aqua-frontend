import React, { useState } from 'react';
import { Fish, Wrench } from 'lucide-react';

const CategoryComponent = () => {
  const [activeCategory, setActiveCategory] = useState('fishes');

  const categories = [
    {
      id: 'fishes',
      title: 'Fishes',
      icon: Fish,
      description: 'Premium aquatic species for your aquarium',
      color: 'from-blue-500 to-cyan-500',
      items: ['Koi Fish', 'Goldfish', 'Tropical Fish', 'Marine Fish']
    },
    {
      id: 'equipments',
      title: 'Equipment',
      icon: Wrench,
      description: 'Professional aquarium equipment & accessories',
      color: 'from-emerald-500 to-teal-500',
      items: ['Filters', 'Pumps', 'Lighting', 'Heaters']
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Our Categories
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Discover our premium selection of aquatic life and professional equipment 
          for creating stunning underwater environments
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <div
              key={category.id}
              className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                activeCategory === category.id ? 'scale-105' : ''
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-75 rounded-2xl blur-lg group-hover:opacity-90 transition-opacity duration-300"
                   style={{background: `linear-gradient(135deg, ${category.color.includes('blue') ? '#3b82f6, #06b6d4' : '#10b981, #14b8a6'})`}}
              ></div>
              
              <div className={`relative bg-white rounded-2xl p-8 shadow-xl border-2 transition-all duration-300 ${
                activeCategory === category.id 
                  ? 'border-blue-200 shadow-2xl' 
                  : 'border-transparent hover:border-blue-100'
              }`}>
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-6 mx-auto`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 text-center mb-3">
                  {category.title}
                </h3>
                
                <p className="text-slate-600 text-center mb-6">
                  {category.description}
                </p>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  {category.items.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                
                <div className={`mt-6 w-full h-1 rounded-full bg-gradient-to-r ${category.color} transform origin-left transition-transform duration-300 ${
                  activeCategory === category.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-center mb-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 mx-2 ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                {category.title}
              </button>
            );
          })}
        </div>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            {categories.find(cat => cat.id === activeCategory)?.title}
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            {categories.find(cat => cat.id === activeCategory)?.description}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.find(cat => cat.id === activeCategory)?.items.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-50 to-white p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${categories.find(cat => cat.id === activeCategory)?.color} mb-3 mx-auto opacity-80`}></div>
                <h4 className="font-semibold text-slate-800">{item}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="text-center mt-12">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer">
          <Fish className="w-5 h-5" />
          Explore All Products
        </div>
      </div>
    </div>
  );
};

export default CategoryComponent;