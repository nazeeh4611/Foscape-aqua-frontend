import React, { useEffect, useState } from 'react';
import { Grid3x3, ChevronRight, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Layout/Navbar';
import Footer from '../../Layout/Footer';
import { baseurl } from '../../Base/Base';

const CategoriesPage = () => {
  const [Categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${baseurl}user/category`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
        setFilteredCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = Categories;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(sub => sub.categoryId === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(sub =>
        sub.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
  }, [searchQuery, selectedCategory, Categories]);

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
        <div className="bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <Grid3x3 className="w-8 h-8" />
              <h1 className="text-4xl font-bold">Categories</h1>
            </div>
            <p className="text-[#CFEAE3] text-lg max-w-2xl">
              Browse through our extensive collection of specialized categories
            </p>
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
              Showing <span className="font-semibold text-slate-800">{filteredCategories.length}</span> categories
            </div>
          </div>

          {filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Grid3x3 className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No categories found</h3>
              <p className="text-slate-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories.map((Category, index) => {
                const gradient = getGradientColor(index);
                return (
                  <div
                    key={Category._id}
                    onClick={() => handleCategoryClick(Category._id)}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                  >
                    <div className="relative h-48 flex items-center justify-center bg-slate-50">
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                      <img
                        src={Category.image}
                        alt={Category.name}
                        className="max-h-40 w-auto object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className={`absolute top-4 right-4 px-3 py-1 bg-gradient-to-r ${gradient} text-white text-xs font-semibold rounded-full shadow-lg`}>
                        Featured
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-[#144E8C] transition-colors line-clamp-1">
                        {Category.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {Category.description}
                      </p>

                      <button
                  className="
                    w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-medium transition-all duration-300 
                    text-white bg-gradient-to-r from-[#144E8C] to-[#78CDD1]   /* mobile default BLUE */
                    sm:text-slate-700 sm:bg-slate-50                          /* normal on desktop */
                    sm:group-hover:bg-gradient-to-r sm:group-hover:from-[#144E8C] sm:group-hover:to-[#78CDD1] 
                    sm:group-hover:text-white
                  "
                >
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
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CategoriesPage;
