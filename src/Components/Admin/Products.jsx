import React, { useState, useEffect } from 'react';
import { Plus, X, Edit2, Trash2, Search, Filter, Eye, TrendingUp, Package, CheckCircle, AlertCircle, Info, Upload, Image as ImageIcon, DollarSign, Tag, Droplet, Award, Zap, Fish, Calendar } from 'lucide-react';
import Sidebar from './Sidebar';
import { baseurl } from '../../Base/Base';
import axios from 'axios';
const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  const styles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  return (
    <div className={`fixed top-4 right-4 z-[100] ${styles[type]} px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 max-w-sm animate-slide-in`}>
      {icons[type]}
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button onClick={onClose} className="hover:bg-white hover:bg-opacity-20 rounded p-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const ConfirmDialog = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Product?</h3>
          <p className="text-sm text-gray-600 text-center mb-6">
            Delete <span className="font-bold">"{productName}"</span>? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getCategoryType = (categoryName) => {
  if (!categoryName) return 'other';
  const name = categoryName.toLowerCase();
  
  if (name.includes('fish') && !name.includes('feed') && !name.includes('food')) return 'fish';
  if (name.includes('feed') || name.includes('food')) return 'feed';
  if (name.includes('equipment') || name.includes('filter') || name.includes('light') || name.includes('pump') || name.includes('heater')) return 'equipment';
  if (name.includes('service') || name.includes('maintenance')) return 'service';
  
  return 'other';
};

export default function AquariumProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    subCategory: '',
    sku: '',
    stock: '',
    waterType: 'N/A',
    tankSize: '',
    brand: '',
    warranty: '',
    fishSpecies: '',
    fishSize: 'N/A',
    temperament: 'N/A',
    dietType: 'N/A',
    minimumTankSize: '',
    feedType: 'N/A',
    feedSize: 'N/A',
    nutritionInfo: '',
    serviceDuration: '',
    serviceType: 'N/A',
    serviceArea: '',
    featured: false,
    status: 'Active'
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [errors, setErrors] = useState({});
  const [toasts, setToasts] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, productId: null, productName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.category) {
      if (!editingProduct) {
        setFormData(prev => ({ ...prev, subCategory: '' }));
      }
      fetchSubCategoriesByCategory(formData.category);
    } else {
      setSubCategories([]);
    }
  }, [formData.category]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseurl}admin/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Failed to load products', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseurl}admin/categories`);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showToast('Failed to load categories', 'error');
    }
  };

  const fetchSubCategoriesByCategory = async (categoryId) => {
    if (!categoryId) {
      setSubCategories([]);
      return;
    }
    
    try {
      const response = await axios.get(`${baseurl}admin/subcategory/${categoryId}`);
      setSubCategories(response.data.subCategories || []);
    } catch (error) {
      console.error('Error fetching filtered subcategories:', error);
      setSubCategories([]);
    }
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
  
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }
  
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (images.length === 0 && imagePreviews.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
  
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }
  
    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }
  
    const selectedCategory = categories.find(cat => cat._id === formData.category);
    const categoryType = getCategoryType(selectedCategory?.name);
    
    if (categoryType === 'fish' && !formData.fishSpecies.trim()) {
      newErrors.fishSpecies = 'Fish species is required';
    }
    
    if (categoryType === 'equipment' && !formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }
    
    if (categoryType === 'feed' && (!formData.feedType || formData.feedType === 'N/A')) {
      newErrors.feedType = 'Feed type is required';
    }
    
    if (categoryType === 'service' && (!formData.serviceType || formData.serviceType === 'N/A')) {
      newErrors.serviceType = 'Service type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      showToast('Maximum 5 images allowed', 'error');
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        showToast(`${file.name} is too large. Max 5MB`, 'error');
        return;
      }

      if (!file.type.startsWith('image/')) {
        showToast(`${file.name} is not valid`, 'error');
        return;
      }

      validFiles.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === validFiles.length) {
          setImagePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImages(prev => [...prev, ...validFiles]);
    
    if (errors.images) {
      setErrors({ ...errors, images: '' });
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix form errors', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      if (editingProduct) {
        await axios.put(`${baseurl}admin/edit-product/${editingProduct._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        showToast('Product updated successfully!', 'success');
      } else {
        await axios.post(`${baseurl}admin/add-product`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        showToast('Product created successfully!', 'success');
      }
      
      await fetchProducts();
      closeModal();
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save product';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = async (product = null) => {
    if (product) {
      setEditingProduct(product);
      
      // Fetch subcategories FIRST before setting form data
      if (product.category?._id) {
        await fetchSubCategoriesByCategory(product.category._id);
      }
      
      // NOW set the form data after subcategories are loaded
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category?._id || '',
        subCategory: product.subCategory?._id || '',
        sku: product.sku,
        stock: product.stock,
        waterType: product.waterType || 'N/A',
        tankSize: product.tankSize || '',
        brand: product.brand || '',
        warranty: product.warranty || '',
        fishSpecies: product.fishSpecies || '',
        fishSize: product.fishSize || 'N/A',
        temperament: product.temperament || 'N/A',
        dietType: product.dietType || 'N/A',
        minimumTankSize: product.minimumTankSize || '',
        feedType: product.feedType || 'N/A',
        feedSize: product.feedSize || 'N/A',
        nutritionInfo: product.nutritionInfo || '',
        serviceDuration: product.serviceDuration || '',
        serviceType: product.serviceType || 'N/A',
        serviceArea: product.serviceArea || '',
        featured: product.featured,
        status: product.status
      });
      setImagePreviews(product.images || []);
      setImages([]);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        description: '',
        category: '',
        subCategory: '',
        sku: '',
        stock: '',
        waterType: 'Freshwater',
        tankSize: '',
        brand: '',
        warranty: '',
        fishSpecies: '',
        fishSize: 'N/A',
        temperament: 'N/A',
        dietType: 'N/A',
        minimumTankSize: '',
        feedType: 'N/A',
        feedSize: 'N/A',
        nutritionInfo: '',
        serviceDuration: '',
        serviceType: 'N/A',
        serviceArea: '',
        featured: false,
        status: 'Active'
      });
      setImagePreviews([]);
      setImages([]);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      subCategory: '',
      sku: '',
      stock: '',
      waterType: 'Freshwater',
      tankSize: '',
      brand: '',
      warranty: '',
      fishSpecies: '',
      fishSize: 'N/A',
      temperament: 'N/A',
      dietType: 'N/A',
      minimumTankSize: '',
      feedType: 'N/A',
      feedSize: 'N/A',
      nutritionInfo: '',
      serviceDuration: '',
      serviceType: 'N/A',
      serviceArea: '',
      featured: false,
      status: 'Active'
    });
    setImagePreviews([]);
    setImages([]);
    setErrors({});
  };

  const deleteProduct = (id) => {
    const product = products.find(p => p._id === id);
    if (product) {
      setDeleteConfirm({ isOpen: true, productId: id, productName: product.name });
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${baseurl}admin/delete-product/${deleteConfirm.productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Product deleted successfully!', 'success');
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('Failed to delete product', 'error');
    } finally {
      setDeleteConfirm({ isOpen: false, productId: null, productName: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, productId: null, productName: '' });
  };

  const toggleStatus = async (id) => {
    const product = products.find(p => p._id === id);
    const newStatus = product.status === 'Active' ? 'Inactive' : 'Active';

    try {
      await axios.patch(`${baseurl}admin/products/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Status updated!', 'success');
      await fetchProducts();
    } catch (error) {
      console.error('Error toggling status:', error);
      showToast('Failed to update status', 'error');
    }
  };

  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || product.status === filterStatus;
      const matchesCategory = filterCategory === 'All' || product.category?._id === filterCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  const activeProducts = products.filter(p => p.status === 'Active').length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>

      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        productName={deleteConfirm.productName}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Simplified Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Products</h2>
                <p className="text-xs text-gray-500 mt-0.5">{products.length} total items</p>
              </div>
              <button
                onClick={() => openModal()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Add</span>
              </button>
            </div>

            {/* Compact Stats - Mobile Optimized */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-600 font-medium">Total</p>
                <p className="text-lg font-bold text-blue-900">{products.length}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                <p className="text-xs text-green-600 font-medium">Active</p>
                <p className="text-lg font-bold text-green-900">{activeProducts}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                <p className="text-xs text-purple-600 font-medium">Value</p>
                <p className="text-lg font-bold text-purple-900">₹{(totalValue/1000).toFixed(0)}k</p>
              </div>
            </div>

            {/* Simplified Search and Filters */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border ${showFilters ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-300 text-gray-700'}`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white font-medium"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price ↑</option>
                  <option value="price-high">Price ↓</option>
                  <option value="date">Date</option>
                </select>

                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg"
                >
                  {viewMode === 'grid' ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  )}
                </button>
              </div>

              {showFilters && (
                <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => { 
                      setSearchTerm(''); 
                      setFilterStatus('All'); 
                      setFilterCategory('All');
                      setSortBy('name');
                      showToast('Filters reset', 'info');
                    }}
                    className="w-full px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Products Grid/List - Mobile Optimized */}
        <div className="flex-1 overflow-y-auto p-4">
  {viewMode === 'grid' ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredAndSortedProducts.map(product => (
        <div
          key={product._id}
          className="bg-white w-full rounded-lg shadow-sm border border-gray-200"
        >
          <div className="h-28 bg-gray-100 relative">
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/400x300?text=No+Image";
              }}
            />
            {product.featured && (
              <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-yellow-500 text-white rounded text-xs font-bold">
                Featured
              </span>
            )}
          </div>

          <div className="p-3">
            <span className="text-xs text-blue-600 font-medium block truncate">
              {product.category?.name || "Uncategorized"}
            </span>

            <h3 className="text-sm font-bold text-gray-900 truncate">
              {product.name}
            </h3>

            <div className="flex items-center justify-between mt-1">
              <span className="text-base font-bold text-green-600">
                ₹{product.price.toLocaleString()}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                  product.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {product.status}
              </span>
            </div>

            <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
              <Package className="w-3 h-3" />
              <span>Stock: {product.stock}</span>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => toggleStatus(product._id)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
              >
                <Eye className="w-3 h-3" />
                {product.status === "Active" ? "Hide" : "Show"}
              </button>

              <button
                onClick={() => openModal(product)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </button>

              <button
                onClick={() => deleteProduct(product._id)}
                className="px-2 py-1 bg-red-600 text-white rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="space-y-2">
      {filteredAndSortedProducts.map(product => (
        <div
          key={product._id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 flex gap-3"
        >
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-20 h-20 object-cover rounded"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
            }}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex-1 min-w-0">
                <span className="text-xs text-blue-600 font-medium block">
                  {product.category?.name || "Uncategorized"}
                </span>
                <h3 className="text-sm font-bold text-gray-900 truncate">
                  {product.name}
                </h3>
              </div>
              {product.featured && (
                <span className="px-2 py-0.5 bg-yellow-500 text-white rounded text-xs font-bold whitespace-nowrap">
                  Featured
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mb-2">
              <span className="text-base font-bold text-green-600">
                ₹{product.price.toLocaleString()}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  product.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {product.status}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Package className="w-3 h-3" />
                <span>Stock: {product.stock}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleStatus(product._id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-xs font-medium"
              >
                <Eye className="w-3 h-3" />
                {product.status === "Active" ? "Hide" : "Show"}
              </button>

              <button
                onClick={() => openModal(product)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </button>

              <button
                onClick={() => deleteProduct(product._id)}
                className="px-3 py-1.5 bg-red-600 text-white rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

      </main>

      {/* Modal - Mobile Optimized */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'New Product'}
                </h3>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Fields */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter product name"
                  />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => {
                        setFormData({ ...formData, price: parseFloat(e.target.value) || '' });
                        if (errors.price) setErrors({ ...errors, price: '' });
                      }}
                      className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="0.00"
                      step="0.01"
                    />
                    {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => {
                        setFormData({ ...formData, stock: parseInt(e.target.value) || '' });
                        if (errors.stock) setErrors({ ...errors, stock: '' });
                      }}
                      className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="0"
                    />
                    {errors.stock && <p className="text-xs text-red-600 mt-1">{errors.stock}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        setFormData({ ...formData, category: e.target.value, subCategory: '' });
                        if (errors.category) setErrors({ ...errors, category: '' });
                      }}
                      className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select...</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      SubCategory
                    </label>
                    <select
                      value={formData.subCategory}
                      onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      disabled={!formData.category}
                    >
                      <option value="">Select...</option>
                      {subCategories.map(sub => (
                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => {
                      setFormData({ ...formData, sku: e.target.value });
                      if (errors.sku) setErrors({ ...errors, sku: '' });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.sku ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Product SKU"
                  />
                  {errors.sku && <p className="text-xs text-red-600 mt-1">{errors.sku}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (errors.description) setErrors({ ...errors, description: '' });
                    }}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg text-sm resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Product description..."
                  />
                  {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
                </div>

                {/* Category-Specific Fields */}
                {formData.category && (() => {
                  const selectedCategory = categories.find(cat => cat._id === formData.category);
                  const categoryType = getCategoryType(selectedCategory?.name);
                  
                  return (
                    <>
                      {categoryType === 'equipment' && (
                        <div className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="text-sm font-bold text-blue-900">Equipment Details</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Brand <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={formData.brand}
                                onChange={(e) => {
                                  setFormData({ ...formData, brand: e.target.value });
                                  if (errors.brand) setErrors({ ...errors, brand: '' });
                                }}
                                className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Brand name"
                              />
                              {errors.brand && <p className="text-xs text-red-600 mt-1">{errors.brand}</p>}
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Water Type</label>
                              <select
                                value={formData.waterType}
                                onChange={(e) => setFormData({ ...formData, waterType: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              >
                                <option value="N/A">N/A</option>
                                <option value="Freshwater">Freshwater</option>
                                <option value="Saltwater">Saltwater</option>
                                <option value="Both">Both</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Tank Size</label>
                              <input
                                type="text"
                                value={formData.tankSize}
                                onChange={(e) => setFormData({ ...formData, tankSize: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="e.g., 50-100L"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Warranty</label>
                              <input
                                type="text"
                                value={formData.warranty}
                                onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="e.g., 1 Year"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {categoryType === 'fish' && (
                        <div className="space-y-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="text-sm font-bold text-green-900">Fish Details</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Species <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={formData.fishSpecies}
                                onChange={(e) => {
                                  setFormData({ ...formData, fishSpecies: e.target.value });
                                  if (errors.fishSpecies) setErrors({ ...errors, fishSpecies: '' });
                                }}
                                className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.fishSpecies ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="e.g., Betta"
                              />
                              {errors.fishSpecies && <p className="text-xs text-red-600 mt-1">{errors.fishSpecies}</p>}
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Size</label>
                              <select
                                value={formData.fishSize}
                                onChange={(e) => setFormData({ ...formData, fishSize: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              >
                                <option value="N/A">N/A</option>
                                <option value="Small">Small</option>
                                <option value="Medium">Medium</option>
                                <option value="Large">Large</option>
                                <option value="Extra Large">Extra Large</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Temperament</label>
                              <select
                                value={formData.temperament}
                                onChange={(e) => setFormData({ ...formData, temperament: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              >
                                <option value="N/A">N/A</option>
                                <option value="Peaceful">Peaceful</option>
                                <option value="Semi-Aggressive">Semi-Aggressive</option>
                                <option value="Aggressive">Aggressive</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Diet</label>
                              <select
                                value={formData.dietType}
                                onChange={(e) => setFormData({ ...formData, dietType: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              >
                                <option value="N/A">N/A</option>
                                <option value="Herbivore">Herbivore</option>
                                <option value="Carnivore">Carnivore</option>
                                <option value="Omnivore">Omnivore</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Water Type</label>
                              <select
                                value={formData.waterType}
                                onChange={(e) => setFormData({ ...formData, waterType: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              >
                                <option value="Freshwater">Freshwater</option>
                                <option value="Saltwater">Saltwater</option>
                                <option value="Both">Both</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Min Tank Size</label>
                              <input
                                type="text"
                                value={formData.minimumTankSize}
                                onChange={(e) => setFormData({ ...formData, minimumTankSize: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="e.g., 20 gallons"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {categoryType === 'feed' && (
                        <div className="space-y-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <h4 className="text-sm font-bold text-orange-900">Feed Details</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Feed Type <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={formData.feedType}
                                onChange={(e) => {
                                  setFormData({ ...formData, feedType: e.target.value });
                                  if (errors.feedType) setErrors({ ...errors, feedType: '' });
                                }}
                                className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.feedType ? 'border-red-500' : 'border-gray-300'}`}
                              >
                                <option value="N/A">Select...</option>
                                <option value="Pellets">Pellets</option>
                                <option value="Flakes">Flakes</option>
                                <option value="Frozen">Frozen</option>
                                <option value="Live">Live</option>
                                <option value="Freeze-Dried">Freeze-Dried</option>
                              </select>
                              {errors.feedType && <p className="text-xs text-red-600 mt-1">{errors.feedType}</p>}
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Feed Size</label>
                              <select
                                value={formData.feedSize}
                                onChange={(e) => setFormData({ ...formData, feedSize: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              >
                                <option value="N/A">N/A</option>
                                <option value="Small">Small</option>
                                <option value="Medium">Medium</option>
                                <option value="Large">Large</option>
                                <option value="Mixed">Mixed</option>
                              </select>
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Nutrition Info</label>
                              <textarea
                                value={formData.nutritionInfo}
                                onChange={(e) => setFormData({ ...formData, nutritionInfo: e.target.value })}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                                placeholder="Protein %, fat %, etc."
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {categoryType === 'service' && (
                        <div className="space-y-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <h4 className="text-sm font-bold text-purple-900">Service Details</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Service Type <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={formData.serviceType}
                                onChange={(e) => {
                                  setFormData({ ...formData, serviceType: e.target.value });
                                  if (errors.serviceType) setErrors({ ...errors, serviceType: '' });
                                }}
                                className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.serviceType ? 'border-red-500' : 'border-gray-300'}`}
                              >
                                <option value="N/A">Select...</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Setup">Setup</option>
                                <option value="Cleaning">Cleaning</option>
                                <option value="Consultation">Consultation</option>
                                <option value="Emergency">Emergency</option>
                              </select>
                              {errors.serviceType && <p className="text-xs text-red-600 mt-1">{errors.serviceType}</p>}
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Duration</label>
                              <input
                                type="text"
                                value={formData.serviceDuration}
                                onChange={(e) => setFormData({ ...formData, serviceDuration: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="e.g., 2 hours"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Service Area</label>
                              <input
                                type="text"
                                value={formData.serviceArea}
                                onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="e.g., Within 10km"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Images <span className="text-red-500">*</span> (Max 5)
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-4 text-center ${errors.images ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="images-upload"
                      disabled={imagePreviews.length >= 5}
                    />
                    <label htmlFor="images-upload" className={imagePreviews.length >= 5 ? 'opacity-50' : 'cursor-pointer'}>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs font-medium text-gray-700">
                        {imagePreviews.length >= 5 ? 'Max reached' : 'Upload images'} ({imagePreviews.length}/5)
                      </p>
                    </label>
                  </div>
                  {errors.images && <p className="text-xs text-red-600 mt-1">{errors.images}</p>}

                  {imagePreviews.length > 0 && (
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={preview} 
                            alt={`Preview ${index + 1}`}
                            className="w-full h-16 object-cover rounded border border-gray-300"
                          />
                          {index === 0 && (
                            <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1 rounded font-bold">
                              1st
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status and Featured */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Featured</label>
                    <div className="flex items-center h-10">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Mark as featured</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-bold text-base shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-bold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}  
    </div>
  );
}