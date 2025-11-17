import React, { useEffect, useState } from 'react';
import { Grid3x3, ChevronRight, Search, ArrowLeft } from 'lucide-react';
import Navbar from '../../Layout/Navbar';
import Footer from '../../Layout/Footer';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { baseurl } from '../../Base/Base';

const SubCategoriesPage = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const fetchSubCategories = async (id) => {
    try {
      const response = await axios.get(`${baseurl}user/subcategory/${id}`);
      if (response.data.success) {
        setSubCategories(response.data.subcategories);
        setFilteredSubCategories(response.data.subcategories);
        if (response.data.subcategories.length > 0) {
          setCategoryName(response.data.subcategories[0]?.category?.name || '');
        }
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchSubCategories(categoryId);
    }
  }, [categoryId]);

  useEffect(() => {
    let filtered = subCategories;
    if (searchQuery) {
      filtered = filtered.filter((sub) =>
        sub.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredSubCategories(filtered);
  }, [searchQuery, subCategories]);

  const getGradientColor = (index) => {
    const gradients = [
      'from-[#144E8C] to-[#78CDD1]',
      'from-[#78C7A2] to-[#99D5C8]',
      'from-[#78CDD1] to-[#CFEAE3]',
      'from-[#144E8C] to-[#78C7A2]',
      'from-[#99D5C8] to-[#78CDD1]',
      'from-[#78C7A2] to-[#CFEAE3]',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <>
      <Navbar />

      <div className="bg-gradient-to-br from-[#CFEAE3] to-[#99D5C8] min-h-screen pt-24">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            {/* Back Button */}
            <button
              onClick={() => navigate('/categories')}
              className="flex items-center gap-2 mb-6 text-[#CFEAE3] hover:text-white transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Categories</span>
            </button>

            {/* Page Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Grid3x3 className="w-8 h-8" />
                  <h1 className="text-3xl sm:text-4xl font-bold">
                    {categoryName ? categoryName : 'Sub Categories'}
                  </h1>
                </div>
                <p className="text-[#CFEAE3] text-base sm:text-lg max-w-2xl">
                  Browse through our extensive collection of specialized subcategories
                </p>
              </div>
            </div>

            {/* Breadcrumb */}
            <div className="mt-5 flex flex-wrap items-center text-sm text-[#CFEAE3] gap-1">
              <span
                onClick={() => navigate('/')}
                className="hover:text-white cursor-pointer"
              >
                Home
              </span>
              <ChevronRight className="w-4 h-4" />
              <span
                onClick={() => navigate('/categories')}
                className="hover:text-white cursor-pointer"
              >
                Categories
              </span>
              <ChevronRight className="w-4 h-4" />
              <span className="font-semibold text-white">
                {categoryName ? categoryName : 'Sub Categories'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 -mt-10 pb-16">
          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-10">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-grow relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search subcategories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#144E8C] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="mt-3 text-sm text-slate-600">
              Showing{' '}
              <span className="font-semibold text-slate-800">
                {filteredSubCategories.length}
              </span>{' '}
              subcategories
            </div>
          </div>

          {/* Subcategory Cards */}
          {filteredSubCategories.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Grid3x3 className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                No subcategories found
              </h3>
              <p className="text-slate-500">Try adjusting your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSubCategories.map((subCategory, index) => {
                const gradient = getGradientColor(index);
                return (
                  <div
                    key={subCategory._id}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`}
                      ></div>
                      <img
                        src={subCategory.image}
                        alt={subCategory.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div
                        className={`absolute top-4 right-4 px-3 py-1 bg-gradient-to-r ${gradient} text-white text-xs font-semibold rounded-full shadow-lg`}
                      >
                        Featured
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-[#144E8C] transition-colors line-clamp-1">
                        {subCategory.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {subCategory.description}
                      </p>

                      <button
                  onClick={() => navigate(`/products/subcategory/${subCategory._id}`)}
                  className="
                    w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-medium transition-all duration-300 

                    /* MOBILE (DEFAULT) — always blue */
                    text-white bg-gradient-to-r from-[#144E8C] to-[#78CDD1]

                    /* DESKTOP Normal */
                    sm:text-slate-700 sm:bg-slate-50

                    /* DESKTOP Hover */
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
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SubCategoriesPage;
