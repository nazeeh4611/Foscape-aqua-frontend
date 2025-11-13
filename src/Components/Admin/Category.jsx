import React, { useState, useEffect } from 'react';
import { Plus, X, Edit2, Trash2, Search, Filter, Eye, Package, CheckCircle, AlertCircle, Info, Upload, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { baseurl } from '../../Base/Base';

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

const ConfirmDialog = ({ isOpen, onClose, onConfirm, categoryName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Category?</h3>
          <p className="text-sm text-gray-600 text-center mb-6">
            Delete <span className="font-bold">"{categoryName}"</span>? This cannot be undone.
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

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', image: '', status: 'Active', description: '' });
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [errors, setErrors] = useState({});
  const [toasts, setToasts] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, categoryId: null, categoryName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const token = localStorage.getItem('authToken');

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseurl}admin/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showToast('Failed to load categories', 'error');
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
      newErrors.name = 'Category name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!imageFile && !formData.image) {
      newErrors.image = 'Category image is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
      }

      if (!file.type.startsWith('image/')) {
        showToast('Please upload a valid image file', 'error');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      if (errors.image) {
        setErrors({ ...errors, image: '' });
      }
    }
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
      formDataToSend.append('name', formData.name);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('description', formData.description);

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingCategory) {
        await axios.put(`${baseurl}admin/edit-category/${editingCategory._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        showToast('Category updated successfully!', 'success');
      } else {
        await axios.post(`${baseurl}admin/add-category`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        showToast('Category created successfully!', 'success');
      }

      await fetchCategories();
      closeModal();
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save category';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        image: category.image,
        status: category.status,
        description: category.description || ''
      });
      setImagePreview(category.image);
      setImageFile(null);
    } else {
      setEditingCategory(null);
      setFormData({ name: '', image: '', status: 'Active', description: '' });
      setImagePreview('');
      setImageFile(null);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', image: '', status: 'Active', description: '' });
    setImagePreview('');
    setImageFile(null);
    setErrors({});
  };

  const deleteCategory = (id) => {
    const category = categories.find(cat => cat._id === id);
    if (category) {
      setDeleteConfirm({ isOpen: true, categoryId: id, categoryName: category.name });
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${baseurl}admin/delete-category/${deleteConfirm.categoryId}`);
      showToast('Category deleted successfully!', 'success');
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      showToast('Failed to delete category', 'error');
    } finally {
      setDeleteConfirm({ isOpen: false, categoryId: null, categoryName: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, categoryId: null, categoryName: '' });
  };

  const toggleStatus = async (id) => {
    const category = categories.find(cat => cat._id === id);
    const newStatus = category.status === 'Active' ? 'Inactive' : 'Active';

    try {
      await axios.patch(`${baseurl}admin/categories/${id}/status`, { status: newStatus });
      showToast('Status updated!', 'success');
      await fetchCategories();
    } catch (error) {
      console.error('Error toggling status:', error);
      showToast('Failed to update status', 'error');
    }
  };

  const filteredAndSortedCategories = categories
    .filter(cat => {
      const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || cat.status === filterStatus;
      return matchesSearch && matchesStatus;
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

  const activeCategories = categories.filter(cat => cat.status === 'Active').length;

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
        categoryName={deleteConfirm.categoryName}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Categories</h2>
                <p className="text-xs text-gray-500 mt-0.5">{categories.length} total items</p>
              </div>
              <button
                onClick={() => openModal()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Add</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-600 font-medium">Total</p>
                <p className="text-lg font-bold text-blue-900">{categories.length}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                <p className="text-xs text-green-600 font-medium">Active</p>
                <p className="text-lg font-bold text-green-900">{activeCategories}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
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

                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('All');
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

        <div className="overflow-y-auto p-4">
  {viewMode === "grid" ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredAndSortedCategories.map((category) => (
        <div
          key={category._id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-3"
        >
          {/* Image */}
          <div className="h-28 bg-gray-100 rounded overflow-hidden mb-2">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/400x300?text=No+Image";
              }}
            />
          </div>

          {/* Category Name */}
          <h3 className="text-sm font-bold text-gray-900 truncate mb-1">
            {category.name}
          </h3>

          {/* Status Chip */}
          <span
            className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
              category.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {category.status}
          </span>

          {/* Description */}
          {category.description && (
            <p className="text-xs text-gray-600 mt-1 mb-2 line-clamp-2">
              {category.description}
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-1.5 mt-2">
            <button
              onClick={() => toggleStatus(category._id)}
              className="flex-1 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
            >
              {category.status === "Active" ? "Hide" : "Show"}
            </button>

            <button
              onClick={() => openModal(category)}
              className="flex-1 py-1 bg-blue-600 text-white rounded text-xs font-medium"
            >
              Edit
            </button>

            <button
              onClick={() => deleteCategory(category._id)}
              className="p-1 bg-red-600 text-white rounded"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    /* LIST VIEW */
    <div className="space-y-2">
      {filteredAndSortedCategories.map((category) => (
        <div
          key={category._id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-3"
        >
          <div className="flex gap-3">
            <img
              src={category.image}
              alt={category.name}
              className="w-16 h-16 rounded object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/64?text=N/A";
              }}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 truncate">
                    {category.name}
                  </h3>

                  {category.description && (
                    <p className="text-xs text-gray-500 truncate">
                      {category.description}
                    </p>
                  )}
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap ${
                    category.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {category.status}
                </span>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => toggleStatus(category._id)}
                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={() => openModal(category)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteCategory(category._id)}
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

  {/* No Results */}
  {filteredAndSortedCategories.length === 0 && (
    <div className="text-center py-12 bg-white rounded-lg">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="w-8 h-8 text-gray-400" />
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2">
        No categories found
      </h3>

      <p className="text-sm text-gray-600 mb-4">Try adjusting your filters</p>

      <button
        onClick={() => {
          setSearchTerm("");
          setFilterStatus("All");
          setSortBy("name");
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
      >
        Clear Filters
      </button>
    </div>
  )}
</div>

      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingCategory ? 'Edit Category' : 'New Category'}
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
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter category name"
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
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg text-sm resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Category description..."
                  />
                  {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Image <span className="text-red-500">*</span>
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-4 text-center ${errors.image ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs font-medium text-gray-700">Upload category image</p>
                    </label>
                  </div>
                  {errors.image && <p className="text-xs text-red-600 mt-1">{errors.image}</p>}

                  {imagePreview && (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded border border-gray-300"
                      />
                    </div>
                  )}
                </div>

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
                    {isSubmitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
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