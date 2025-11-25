import React, { useEffect, useState, useMemo } from 'react';
import { Grid3x3, ChevronRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Layout/Navbar';
import Footer from '../../Layout/Footer';
import { baseurl } from '../../Base/Base';
import AOS from 'aos';
import { ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  const steps = [
    { number: "01", title: "Browse & Select", description: "Explore our wide range of products and choose what you need" },
    { number: "02", title: "Add to Cart", description: "Add your selected items to cart and proceed to checkout" },
    { number: "03", title: "Secure Payment", description: "Complete your purchase with our secure payment options" },
    { number: "04", title: "Fast Delivery", description: "Receive your order safely with our specialized shipping" }
  ];

  return (
    <div className="w-full py-16 bg-gradient-to-br from-[#144E8C] to-[#78CDD1]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-down">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Simple steps to get your aquatic products delivered
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative" data-aos="fade-up" data-aos-delay={index * 150}>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg shadow-black/10 transition-all duration-300 hover:bg-white/30 hover:shadow-xl hover:-translate-y-2">
                <div className="text-6xl font-bold text-white/30 mb-4">{step.number}</div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-200">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 transition-all duration-300">
                  <ArrowRight className="w-6 h-6 text-white/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Loading skeleton component
const CategorySkeleton = () => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
    <div className="h-48 bg-slate-200"></div>
    <div className="p-5 space-y-3">
      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
      <div className="h-4 bg-slate-200 rounded w-full"></div>
      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
      <div className="h-10 bg-slate-200 rounded-xl mt-4"></div>
    </div>
  </div>
);

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseurl}user/category`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Memoize filtered categories to avoid recalculation on every render
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const getGradientColor = (index) => {
    const gradients = [
      'from-[#144E8C] to-[#78CDD1]',
      'from-[#78C7A2] to-[#99D5C8]',
      'from-[#78CDD1] to-[#CFEAE3]',
      'from-[#144E8C] to-[#78C7A2]',
      'from-[#99D5C8] to-[#78CDD1]',
      'from-[#78C7A2] to-[#CFEAE3]'
    ];
    return gradients[index % gradients.length];
  };

  const handleCategoryClick = (id) => {
    navigate(`/${id}/sub-category`);
  };

  return (
    <>
      <Navbar />

      <div className="bg-gradient-to-br from-[#CFEAE3] to-[#99D5C8] min-h-screen pt-24">
        
      <div className="bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white py-14 md:py-20">
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
  <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10"> 
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Grid3x3 className="w-8 h-8" />
                  <h1 className="text-3xl sm:text-4xl font-bold">Categories</h1>
                </div>
                <p className="text-[#CFEAE3] text-base sm:text-lg max-w-2xl">
                  Browse through our extensive collection of specialized categories
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center text-sm text-[#CFEAE3] gap-1">
              <span onClick={() => navigate('/')} className="hover:text-white cursor-pointer">Home</span>
              <ChevronRight className="w-4 h-4" />
              <span className="hover:text-white cursor-pointer">Categories</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-8 pb-12">
          
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#144E8C] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-600">
              {loading ? (
                <span>Loading categories...</span>
              ) : (
                <>
                  Showing <span className="font-semibold text-slate-800">{filteredCategories.length}</span> categories
                </>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <CategorySkeleton key={index} />
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Grid3x3 className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No categories found</h3>
              <p className="text-slate-500">Try adjusting your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories.map((category, index) => {
                const gradient = getGradientColor(index);
                return (
                  <div
                    key={category._id}
                    onClick={() => handleCategoryClick(category._id)}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                  >
                    <div className="relative h-48 flex items-center justify-center bg-slate-50">
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                      <img
                        src={category.image}
                        alt={category.name}
                        loading="lazy"
                        className="max-h-40 w-auto object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className={`absolute top-4 right-4 px-3 py-1 bg-gradient-to-r ${gradient} text-white text-xs font-semibold rounded-full shadow-lg`}>
                        Featured
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-[#144E8C] transition-colors line-clamp-1">
                        {category.name}
                      </h3>

                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{category.description}</p>

                      <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-medium transition-all duration-300 text-white bg-gradient-to-r from-[#144E8C] to-[#78CDD1] sm:text-slate-700 sm:bg-slate-50 sm:group-hover:bg-gradient-to-r sm:group-hover:from-[#144E8C] sm:group-hover:to-[#78CDD1] sm:group-hover:text-white">
                        <span className="text-sm">View Products</span>
                        <ChevronRight className="w-4 h-4 sm:group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-md border border-slate-200 py-8 mt-12">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-slate-600 mb-4">Can't find what you're looking for?</p>
              <button className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                Contact Support
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-20">
            <HowItWorks />
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default CategoriesPage;