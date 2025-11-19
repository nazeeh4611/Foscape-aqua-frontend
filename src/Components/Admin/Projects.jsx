import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X, Edit2, Trash2, Search, Filter, Eye, Image as ImageIcon, CheckCircle, AlertCircle, Info, Upload, Briefcase, User, Calendar, Tag, Link as LinkIcon, Award, MapPin } from 'lucide-react';
import { baseurl } from '../../Base/Base';

// API service - FIXED to send FormData properly
const portfolioAPI = {
  getAll: async () => {
    try {
      const response = await axios.get(`${baseurl}admin/portfolio`);
      return response.data.data || response.data; // Handle both response formats
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      throw error;
    }
  },

  get: async (id) => {
    try {
      const response = await axios.get(`${baseurl}admin/portfolio/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching portfolio item:', error);
      throw error;
    }
  },

  // FIXED: Create with proper FormData
  create: async (formData) => {
    try {
      const response = await axios.post(`${baseurl}admin/portfolio`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating portfolio item:', error);
      throw error;
    }
  },

  // FIXED: Update with proper FormData
  update: async (id, formData) => {
    try {
      const response = await axios.put(`${baseurl}admin/portfolio/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await axios.delete(`${baseurl}admin/portfolio/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      throw error;
    }
  },

  toggleStatus: async (id) => {
    try {
      const response = await axios.put(`${baseurl}admin/portfolio/${id}/toggle-status`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error toggling status:', error);
      throw error;
    }
  },

  toggleFeatured: async (id) => {
    try {
      const response = await axios.put(`${baseurl}admin/portfolio/${id}/toggle-featured`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error toggling featured:', error);
      throw error;
    }
  }
};

// Configure axios
axios.defaults.baseURL = baseurl;

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Atoken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

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

const ConfirmDialog = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Project?</h3>
          <p className="text-sm text-gray-600 text-center mb-6">
            Delete <span className="font-bold">"{itemName}"</span>? This cannot be undone.
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

export default function PortfolioAdmin() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    category: 'pond',
    client: '',
    duration: '',
    features: '',
    location: '',
    completionDate: '',
    status: 'Active',
    featured: false
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // Track existing images when editing
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [errors, setErrors] = useState({});
  const [toasts, setToasts] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, itemId: null, itemName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    setIsLoading(true);
    try {
      const items = await portfolioAPI.getAll();
      setPortfolioItems(Array.isArray(items) ? items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : []);
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      showToast('Failed to load projects', 'error');
      setPortfolioItems([]);
    } finally {
      setIsLoading(false);
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
      newErrors.name = 'Project name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    // Check if we have either new images or existing images
    if (imageFiles.length === 0 && existingImages.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalFiles = imageFiles.length + existingImages.length + files.length;

    if (totalFiles > 10) {
      showToast('Maximum 10 images allowed', 'error');
      return;
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Each image must be less than 5MB', 'error');
        return;
      }

      if (!file.type.startsWith('image/')) {
        showToast('Please upload valid image files', 'error');
        return;
      }
    }

    setImageFiles(prev => [...prev, ...files]);

    // Create preview URLs for new files
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    if (errors.images) {
      setErrors({ ...errors, images: '' });
    }
  };

  const removeNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== (index + existingImages.length)));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // FIXED: Proper FormData submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix form errors', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData object
      const submitData = new FormData();
      
      // Append text fields
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('client', formData.client || '');
      submitData.append('duration', formData.duration || '');
      submitData.append('features', formData.features || '');
      submitData.append('location', formData.location || '');
      submitData.append('completionDate', formData.completionDate || '');
      submitData.append('status', formData.status);
      submitData.append('featured', formData.featured);

      // Append new image files
      imageFiles.forEach((file) => {
        submitData.append('images', file);
      });

      // For updates, send existing images to keep
      if (editingItem && existingImages.length > 0) {
        submitData.append('existingImages', JSON.stringify(existingImages));
      }

      if (editingItem) {
        const updatedItem = await portfolioAPI.update(editingItem._id, submitData);
        
        setPortfolioItems(prev => prev.map(item => 
          item._id === editingItem._id ? updatedItem : item
        ));
        showToast('Project updated successfully!', 'success');
      } else {
        const newItem = await portfolioAPI.create(submitData);
        
        setPortfolioItems(prev => [newItem, ...prev]);
        showToast('Project added successfully!', 'success');
      }

      closeModal();
    } catch (error) {
      console.error('Error saving portfolio item:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save project. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        category: item.category,
        client: item.client || '',
        duration: item.duration || '',
        features: item.features || '',
        location: item.location || '',
        completionDate: item.completionDate || '',
        status: item.status,
        featured: item.featured || false
      });
      
      // Store existing image URLs
      if (item.mediaUrls && item.mediaUrls.length > 0) {
        setExistingImages(item.mediaUrls);
        setImagePreviews(item.mediaUrls);
      }
      setImageFiles([]);
    } else {
      setEditingItem(null);
      setFormData({ 
        name: '', 
        description: '', 
        category: 'pond',
        client: '',
        duration: '',
        features: '',
        location: '',
        completionDate: '',
        status: 'Active',
        featured: false
      });
      setExistingImages([]);
      setImagePreviews([]);
      setImageFiles([]);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ 
      name: '', 
      description: '', 
      category: 'pond',
      client: '',
      duration: '',
      features: '',
      location: '',
      completionDate: '',
      status: 'Active',
      featured: false
    });
    setExistingImages([]);
    setImagePreviews([]);
    setImageFiles([]);
    setErrors({});
  };

  const deleteItem = (id) => {
    const item = portfolioItems.find(p => p._id === id);
    if (item) {
      setDeleteConfirm({ isOpen: true, itemId: id, itemName: item.name });
    }
  };

  const confirmDelete = async () => {
    try {
      await portfolioAPI.delete(deleteConfirm.itemId);
      setPortfolioItems(prev => prev.filter(item => item._id !== deleteConfirm.itemId));
      showToast('Project deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting item:', error);
      showToast('Failed to delete project', 'error');
    }
    setDeleteConfirm({ isOpen: false, itemId: null, itemName: '' });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, itemId: null, itemName: '' });
  };

  const toggleStatus = async (id) => {
    try {
      const updatedItem = await portfolioAPI.toggleStatus(id);
      setPortfolioItems(prev => prev.map(item => 
        item._id === id ? updatedItem : item
      ));
      showToast('Status updated!', 'success');
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update status', 'error');
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'pond': return <Award className="w-3 h-3 text-blue-600" />;
      case 'landscape': return <Briefcase className="w-3 h-3 text-green-600" />;
      case 'fountain': return <svg className="w-3 h-3 text-cyan-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" /></svg>;
      case 'pool': return <svg className="w-3 h-3 text-teal-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" /></svg>;
      case 'designs': return <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" /></svg>;
      default: return <Award className="w-3 h-3 text-blue-600" />;
    }
  };

  const getCategoryLabel = (category) => {
    switch(category) {
      case 'pond': return 'Pond';
      case 'landscape': return 'Landscape';
      case 'fountain': return 'Fountain';
      case 'pool': return 'Pool';
      case 'design': return 'Design/Idea';
      default: return 'Pond';
    }
  };

  const filteredAndSortedItems = portfolioItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
      const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  const activeItems = portfolioItems.filter(item => item.status === 'Active').length;

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
        itemName={deleteConfirm.itemName}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Works & Designs</h2>
                <p className="text-xs text-gray-500 mt-0.5">{portfolioItems.length} total projects</p>
              </div>
              <button
                onClick={() => openModal()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Add Project</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-600 font-medium">Total Projects</p>
                <p className="text-lg font-bold text-blue-900">{portfolioItems.length}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                <p className="text-xs text-green-600 font-medium">Active</p>
                <p className="text-lg font-bold text-green-900">{activeItems}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
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
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                </select>

                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg"
                >
                  {viewMode === 'grid' ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
                    <option value="pond">Ponds</option>
                    <option value="landscape">Landscapes</option>
                    <option value="fountain">Fountains</option>
                    <option value="pool">Pools</option>
                    <option value="design">Designs & Ideas</option>
                  </select>

                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('All');
                      setFilterCategory('All');
                      setSortBy('date');
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

        <div className="overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading projects...</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-3"
                >
                  <div className="h-28 bg-gray-100 rounded overflow-hidden mb-2 relative">
                    <img
                      src={item.mediaUrls?.[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                    {item.mediaUrls && item.mediaUrls.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        +{item.mediaUrls.length - 1}
                      </div>
                    )}
                    {item.featured && (
                      <span className="absolute top-2 left-2 inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-bold">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 mb-1">
                    {getCategoryIcon(item.category)}
                    <span className="text-xs font-medium">
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 truncate mb-1">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.status}
                    </span>
                    {item.location && (
                      <span className="text-xs text-gray-600 truncate">{item.location}</span>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="flex gap-1.5 mt-2">
                    <button
                      onClick={() => toggleStatus(item._id)}
                      className="flex-1 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                    >
                      {item.status === "Active" ? "Hide" : "Show"}
                    </button>

                    <button
                      onClick={() => openModal(item)}
                      className="flex-1 py-1 bg-blue-600 text-white rounded text-xs font-medium"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteItem(item._id)}
                      className="p-1 bg-red-600 text-white rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAndSortedItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-3"
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0 relative">
                      <img
                        src={item.mediaUrls?.[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/64?text=N/A";
                        }}
                      />
                      {item.mediaUrls && item.mediaUrls.length > 1 && (
                        <div className="absolute top-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                          +{item.mediaUrls.length - 1}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-1">
                            {getCategoryIcon(item.category)}
                            <span className="text-xs font-medium">
                              {getCategoryLabel(item.category)}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-gray-900 truncate">
                            {item.name}
                          </h3>

                          {item.description && (
                            <p className="text-xs text-gray-500 truncate">
                              {item.description}
                            </p>
                          )}

                          {item.location && (
                            <p className="text-xs text-gray-600 mt-1">{item.location}</p>
                          )}
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap ${
                            item.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => toggleStatus(item._id)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openModal(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => deleteItem(item._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredAndSortedItems.length === 0 && !isLoading && (
            <div className="text-center py-12 bg-white rounded-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {portfolioItems.length === 0 ? 'No projects yet' : 'No items found'}
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                {portfolioItems.length === 0 ? 'Start by adding your first project' : 'Try adjusting your filters'}
              </p>

              {portfolioItems.length === 0 ? (
                <button
                  onClick={() => openModal()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                >
                  Add Your First Project
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("All");
                    setFilterCategory("All");
                    setSortBy("date");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingItem ? 'Edit Project' : 'New Project'}
                </h3>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, category: 'pond' })}
                      className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 ${
                        formData.category === 'pond'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      <Award className="w-5 h-5" />
                      <span className="text-xs font-medium">Pond</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, category: 'landscape' })}
                      className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 ${
                        formData.category === 'landscape'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      <Briefcase className="w-5 h-5" />
                      <span className="text-xs font-medium">Landscape</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, category: 'fountain' })}
                      className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 ${
                        formData.category === 'fountain'
                          ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
                      </svg>
                      <span className="text-xs font-medium">Fountain</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, category: 'pool' })}
                      className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 ${
                        formData.category === 'pool'
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium">Pool</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, category: 'design' })}
                      className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 ${
                        formData.category === 'design'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                      </svg>
                      <span className="text-xs font-medium">Model/Idea</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter project name"
                  />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
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
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg text-sm resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Describe your project in detail..."
                  />
                  {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Images <span className="text-red-500">*</span> <span className="text-gray-500 text-xs">(Max 10)</span>
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-4 text-center ${errors.images ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={(imageFiles.length + existingImages.length) >= 10}
                    />
                    <label htmlFor="image-upload" className={`cursor-pointer ${(imageFiles.length + existingImages.length) >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs font-medium text-gray-700">
                        {(imageFiles.length + existingImages.length) >= 10 ? 'Maximum images uploaded' : 'Upload images'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {imageFiles.length + existingImages.length}/10 images
                      </p>
                    </label>
                  </div>
                  {errors.images && <p className="text-xs text-red-600 mt-1">{errors.images}</p>}

                  {imagePreviews.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (index < existingImages.length) {
                                removeExistingImage(index);
                              } else {
                                removeNewImage(index - existingImages.length);
                              }
                            }}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {index < existingImages.length && (
                            <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
                              Existing
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Client/Company
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.client}
                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Client name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Duration
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="e.g., 3 months"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Features
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      rows={2}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                      placeholder="Key features of the project..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="City, State"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Completion Date
                    </label>
                    <input
                      type="date"
                      value={formData.completionDate}
                      onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="Active">Active (Show in portfolio)</option>
                    <option value="Inactive">Inactive (Hide from portfolio)</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-gray-700">Featured Project</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Only 3 projects can be featured. Adding a 4th will remove the oldest featured project.
                  </p>
                </div>

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
                    {isSubmitting ? 'Saving...' : editingItem ? 'Update Project' : 'Create Project'}
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