import React, { useEffect, useState } from 'react';
import {
  Package,
  ChevronRight,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Eye,
  Heart,
} from 'lucide-react';

import Navbar from '../../Layout/Navbar';
import Footer from '../../Layout/Footer';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { baseurl } from '../../Base/Base';
import { useCartWishlist } from '../../Context.js/Cartwishlist';
import { useAuth } from '../../Context.js/Auth';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [subCategoryName, setSubCategoryName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const { subCategoryId, categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const productsPerPage = 12;
  const { isLogged } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useCartWishlist();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pageParam = searchParams.get('page');
    if (pageParam) {
      setCurrentPage(parseInt(pageParam, 10));
    }
  }, [location.search]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseurl}user/categories-with-subcategories`);
  
      if (response.data.success) {
        const allCategories = response.data.categories;
        setCategories(allCategories);
  
        if (subCategoryId) {
          const categoryToExpand = allCategories.find(cat =>
            cat.subcategories?.some(sub => sub._id === subCategoryId)
          );
  
          if (categoryToExpand) {
            setExpandedCategories({ [categoryToExpand._id]: true });
            setCategoryName(categoryToExpand.name);
  
            const subCat = categoryToExpand.subcategories.find(
              sub => sub._id === subCategoryId
            );
  
            if (subCat) {
              setSubCategoryName(subCat.name);
            }
          }
        } 
        else if (categoryId) {
          const category = allCategories.find(cat => cat._id === categoryId);
          if (category) {
            setCategoryName(category.name);
            setExpandedCategories({ [categoryId]: true });
          }
        } 
        else {
          setExpandedCategories({});
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async (page = 1, subCatId = '', search = '') => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: productsPerPage,
      };

      const apiCategoryId = subCatId || categoryId;

      if (apiCategoryId) {
        params.subCategoryId = apiCategoryId;
      }

      if (search) {
        params.search = search;
      }

      const response = await axios.get(`${baseurl}user/products/${apiCategoryId || ''}`, { params });
      
      if (response.data.success) {
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
        setTotalProducts(response.data.totalProducts);
        setCurrentPage(response.data.currentPage);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pageParam = searchParams.get('page');
    const page = pageParam ? parseInt(pageParam, 10) : 1;

    if (subCategoryId) {
      fetchProducts(page, subCategoryId, searchQuery);
      if (!subCategoryName && categories.length > 0) {
        const categoryWithSub = categories.find(cat =>
          cat.subcategories?.some(sub => sub._id === subCategoryId)
        );
        if (categoryWithSub) {
          const subCat = categoryWithSub.subcategories.find(
            sub => sub._id === subCategoryId
          );
          if (subCat) {
            setSubCategoryName(subCat.name);
            setCategoryName(categoryWithSub.name);
          }
        }
      }
    } else if (categoryId) {
      fetchProducts(page, '', searchQuery);
      if (!categoryName && categories.length > 0) {
        const category = categories.find(cat => cat._id === categoryId);
        if (category) {
          setCategoryName(category.name);
        }
      }
    } else {
      setSubCategoryName('');
      setCategoryName('');
      fetchProducts(page, '', searchQuery);
    }
  }, [subCategoryId, categoryId, categories, location.search]);
  
  useEffect(() => {
    if (searchQuery === '') {
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('page', '1');
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
      fetchProducts(1, subCategoryId || '', searchQuery);
    }, 500);
  
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleCategoryClick = (category) => {
    const isCurrentlyExpanded = expandedCategories[category._id];
    setExpandedCategories({ [category._id]: !isCurrentlyExpanded });
  };

  const handleSubCategoryClick = (subCatId, subCatName, catName, catId) => {
    setSubCategoryName(subCatName);
    setCategoryName(catName);
    setExpandedCategories({ [catId]: true });
    setSearchQuery('');
    navigate(`/products/subcategory/${subCatId}?page=1`);
  };

  const handleBreadcrumbCategoryClick = () => {
    if (categoryName && categories.length > 0) {
      const category = categories.find(cat => cat.name === categoryName);
      if (category) {
        setSubCategoryName('');
        setSearchQuery('');
        navigate(`/${category._id}/sub-category?page=1`);
      }
    }
  };

  const handlePageChange = (page) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', page.toString());
    navigate(`${location.pathname}?${searchParams.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (productId, e) => {
    // Don't navigate if clicking on the wishlist button
    if (e.target.closest('.wishlist-button')) {
      return;
    }
    
    if (e.ctrlKey || e.metaKey || e.button === 1) {
      window.open(`/product/${productId}`, '_blank');
      return;
    }
    
    navigate(`/product/${productId}`);
  };

  const handleWishlistToggle = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLogged) {
      navigate('/');
      return;
    }

    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

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

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            currentPage === i
              ? 'bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
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
  <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">             <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 mb-6 text-[#CFEAE3] hover:text-white transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Package className="w-8 h-8" />
                  <h1 className="text-3xl sm:text-4xl font-bold">
                    {subCategoryName || categoryName || 'All Products'}
                  </h1>
                </div>
                <p className="text-[#CFEAE3] text-base sm:text-lg max-w-2xl">
                  Discover our premium collection of quality products
                </p>
              </div>
            </div>

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
              {categoryName && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <span 
                    onClick={handleBreadcrumbCategoryClick}
                    className="text-white hover:text-[#CFEAE3] cursor-pointer"
                  >
                    {categoryName}
                  </span>
                </>
              )}
              {subCategoryName && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <span className="font-semibold text-white">{subCategoryName}</span>
                </>
              )}
              {!subCategoryName && !categoryName && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <span className="font-semibold text-white">All Products</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 -mt-10 pb-16">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Categories
                </h2>

                <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category._id} className="border-b border-slate-100 last:border-0">
                      <button
                        onClick={() => handleCategoryClick(category)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-left hover:bg-slate-50"
                      >
                        <span className="font-semibold text-slate-800">
                          {category.name}
                        </span>
                        {expandedCategories[category._id] ? (
                          <ChevronUp className="w-4 h-4 flex-shrink-0 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 flex-shrink-0 text-slate-500" />
                        )}
                      </button>

                      {expandedCategories[category._id] && (
                        <div className="ml-4 space-y-1 pb-2">
                          {category.subcategories?.map((subCat) => (
                            <div
                              key={subCat._id}
                              onClick={() => handleSubCategoryClick(subCat._id, subCat.name, category.name, category._id)}
                              className={`px-4 py-2 rounded-lg cursor-pointer transition-all text-sm ${
                                subCategoryId === subCat._id
                                  ? 'bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white shadow-md font-medium'
                                  : 'hover:bg-slate-50 text-slate-600'
                              }`}
                            >
                              {subCat.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-grow relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#144E8C] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="mt-3 text-sm text-slate-600">
                  Showing{' '}
                  <span className="font-semibold text-slate-800">
                    {products.length}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-slate-800">
                    {totalProducts}
                  </span>{' '}
                  products
                </div>
              </div>

              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin w-16 h-16 border-4 border-[#144E8C] border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-md">
                  <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">
                    No products found
                  </h3>
                  <p className="text-slate-500">Try adjusting your search or filters</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product, index) => {
                      const gradient = getGradientColor(index);
                      const inWishlist = isInWishlist(product._id);
                      return (
                        <div
                          key={product._id}
                          onClick={(e) => handleProductClick(product._id, e)}
                          className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                        >
                          <div className="relative h-64 overflow-hidden bg-slate-50">
                            <div
                              className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`}
                            ></div>
                            <img
                              src={product.images?.[0] || '/placeholder.jpg'}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {product.stock === 0 && (
                              <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-lg">
                                Out of Stock
                              </div>
                            )}
                            {product.stock > 0 && product.stock < 10 && (
                              <div className="absolute top-4 left-4 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full shadow-lg">
                                Low Stock
                              </div>
                            )}
                            {product.featured && (
                              <div className={`absolute top-4 right-4 px-3 py-1 bg-gradient-to-r ${gradient} text-white text-xs font-semibold rounded-full shadow-lg`}>
                                Featured
                              </div>
                            )}
                          </div>

                          <div className="p-5">
                            <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-[#144E8C] transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                              {product.description}
                            </p>

                            <div className="mb-3 space-y-1">
                              {product.brand && (
                                <p className="text-xs text-slate-500">
                                  <span className="font-medium">Brand:</span> {product.brand}
                                </p>
                              )}
                              {product.fishSpecies && (
                                <p className="text-xs text-slate-500">
                                  <span className="font-medium">Species:</span> {product.fishSpecies}
                                </p>
                              )}
                              {product.waterType && product.waterType !== 'N/A' && (
                                <p className="text-xs text-slate-500">
                                  <span className="font-medium">Water:</span> {product.waterType}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <span className="text-2xl font-bold text-[#144E8C]">
                                  ₹{product.price}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500">
                                Stock: {product.stock}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-medium group-hover:shadow-lg transition-all duration-300">
                                <Eye className="w-4 h-4" />
                                <span className="text-sm">View Details</span>
                              </div>
                              <button
                                onClick={(e) => handleWishlistToggle(product._id, e)}
                                className={`wishlist-button px-4 py-2.5 rounded-xl transition-all duration-300 ${
                                  inWishlist
                                    ? 'bg-red-50 hover:bg-red-100'
                                    : 'bg-slate-100 hover:bg-slate-200'
                                }`}
                              >
                                <Heart
                                  className={`w-4 h-4 ${
                                    inWishlist ? 'text-red-500 fill-red-500' : 'text-slate-600'
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl shadow-md p-6">
                      <div className="text-sm text-slate-600">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 justify-center">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 rounded-lg font-medium transition-all bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200"
                        >
                          Previous
                        </button>
                        {renderPagination()}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 rounded-lg font-medium transition-all bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductsPage;