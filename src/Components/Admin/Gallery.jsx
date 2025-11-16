import React, { useState, useEffect } from 'react';
import { Plus, X, Edit2, Trash2, Search, Filter, Eye, Image as ImageIcon, CheckCircle, AlertCircle, Info, Upload, Instagram, Youtube, MapPin } from 'lucide-react';
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

const ConfirmDialog = ({ isOpen, onClose, onConfirm, itemHeading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Gallery Item?</h3>
          <p className="text-sm text-gray-600 text-center mb-6">
            Delete <span className="font-bold">"{itemHeading}"</span>? This cannot be undone.
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

export default function AdminGalleryPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ 
    heading: '', 
    description: '', 
    mediaType: 'image', 
    mediaUrl: '', 
    location: '', 
    status: 'Active' 
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterMediaType, setFilterMediaType] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [errors, setErrors] = useState({});
  const [toasts, setToasts] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, itemId: null, itemHeading: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const token = localStorage.getItem('authToken');

  const fetchGallery = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseurl}admin/gallery`);
      setGalleryItems(response.data.gallery);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      showToast('Failed to load gallery items', 'error');
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

    if (!formData.heading.trim()) {
      newErrors.heading = 'Heading is required';
    } else if (formData.heading.trim().length < 3) {
      newErrors.heading = 'Heading must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.mediaType === 'image' && imageFiles.length === 0 && (!editingItem || !editingItem.mediaUrls || editingItem.mediaUrls.length === 0)) {
      newErrors.mediaUrl = 'At least one image is required';
    }

    if (formData.mediaType === 'instagram') {
      if (!formData.mediaUrl.trim()) {
        newErrors.mediaUrl = 'Instagram post link is required';
      }
      if (!thumbnailFile && (!editingItem || !editingItem.thumbnailUrl)) {
        newErrors.thumbnail = 'Thumbnail image is required';
      }
    }

    if (formData.mediaType === 'youtube') {
      if (!formData.mediaUrl.trim()) {
        newErrors.mediaUrl = 'YouTube video link is required';
      }
      if (!thumbnailFile && (!editingItem || !editingItem.thumbnailUrl)) {
        newErrors.thumbnail = 'Thumbnail image is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalFiles = imageFiles.length + files.length;

    if (totalFiles > 3) {
      showToast('Maximum 3 images allowed', 'error');
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

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    if (errors.mediaUrl) {
      setErrors({ ...errors, mediaUrl: '' });
    }
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Thumbnail must be less than 5MB', 'error');
      return;
    }

    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file', 'error');
      return;
    }

    setThumbnailFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result);
    };
    reader.readAsDataURL(file);

    if (errors.thumbnail) {
      setErrors({ ...errors, thumbnail: '' });
    }
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
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
      formDataToSend.append('heading', formData.heading);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('mediaType', formData.mediaType);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('location', formData.location);

      if (formData.mediaType === 'image' && imageFiles.length > 0) {
        imageFiles.forEach(file => {
          formDataToSend.append('images', file);
        });
      } else if (formData.mediaType === 'instagram' || formData.mediaType === 'youtube') {
        formDataToSend.append('mediaUrl', formData.mediaUrl);
        if (thumbnailFile) {
          formDataToSend.append('thumbnail', thumbnailFile);
        }
      }

      if (editingItem) {
        await axios.put(`${baseurl}admin/edit-gallery/${editingItem._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        showToast('Gallery item updated successfully!', 'success');
      } else {
        await axios.post(`${baseurl}admin/add-gallery`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        showToast('Gallery item created successfully!', 'success');
      }

      await fetchGallery();
      closeModal();
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save gallery item';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        heading: item.heading,
        description: item.description,
        mediaType: item.mediaType,
        mediaUrl: item.mediaUrls?.[0] || '',
        location: item.location || '',
        status: item.status
      });
      if (item.mediaType === 'image' && item.mediaUrls) {
        setImagePreviews(item.mediaUrls);
      }
      if (item.thumbnailUrl) {
        setThumbnailPreview(item.thumbnailUrl);
      }
      setImageFiles([]);
      setThumbnailFile(null);
    } else {
      setEditingItem(null);
      setFormData({ heading: '', description: '', mediaType: 'image', mediaUrl: '', location: '', status: 'Active' });
      setImagePreviews([]);
      setImageFiles([]);
      setThumbnailPreview(null);
      setThumbnailFile(null);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ heading: '', description: '', mediaType: 'image', mediaUrl: '', location: '', status: 'Active' });
    setImagePreviews([]);
    setImageFiles([]);
    setThumbnailPreview(null);
    setThumbnailFile(null);
    setErrors({});
  };

  const deleteGalleryItem = (id) => {
    const item = galleryItems.find(g => g._id === id);
    if (item) {
      setDeleteConfirm({ isOpen: true, itemId: id, itemHeading: item.heading });
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${baseurl}admin/delete-gallery/${deleteConfirm.itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Gallery item deleted successfully!', 'success');
      await fetchGallery();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      showToast('Failed to delete gallery item', 'error');
    } finally {
      setDeleteConfirm({ isOpen: false, itemId: null, itemHeading: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, itemId: null, itemHeading: '' });
  };

  const toggleStatus = async (id) => {
    const item = galleryItems.find(g => g._id === id);
    const newStatus = item.status === 'Active' ? 'Inactive' : 'Active';

    try {
      await axios.put(`${baseurl}admin/gallery/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Status updated!', 'success');
      await fetchGallery();
    } catch (error) {
      console.error('Error toggling status:', error);
      showToast('Failed to update status', 'error');
    }
  };

  const getMediaIcon = (mediaType) => {
    switch(mediaType) {
      case 'instagram': return <Instagram className="w-3 h-3 text-pink-600" />;
      case 'youtube': return <Youtube className="w-3 h-3 text-red-600" />;
      default: return <ImageIcon className="w-3 h-3 text-blue-600" />;
    }
  };

  const getMediaTypeLabel = (mediaType) => {
    switch(mediaType) {
      case 'instagram': return 'Instagram';
      case 'youtube': return 'YouTube';
      default: return 'Image';
    }
  };

  const filteredAndSortedGallery = galleryItems
    .filter(item => {
      const matchesSearch = item.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
      const matchesMediaType = filterMediaType === 'All' || item.mediaType === filterMediaType;
      return matchesSearch && matchesStatus && matchesMediaType;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'heading':
          return a.heading.localeCompare(b.heading);
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  const activeItems = galleryItems.filter(item => item.status === 'Active').length;

  const getThumbnailUrl = (item) => {
    if (item.mediaType === 'image') {
      return item.mediaUrls?.[0];
    }
    return item.thumbnailUrl || item.mediaUrls?.[0];
  };

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
        itemHeading={deleteConfirm.itemHeading}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Gallery</h2>
                <p className="text-xs text-gray-500 mt-0.5">{galleryItems.length} total items</p>
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
                <p className="text-lg font-bold text-blue-900">{galleryItems.length}</p>
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
                  placeholder="Search gallery..."
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
                  <option value="heading">Heading</option>
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
                    value={filterMediaType}
                    onChange={(e) => setFilterMediaType(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="All">All Media Types</option>
                    <option value="image">Image</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                  </select>

                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('All');
                      setFilterMediaType('All');
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
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedGallery.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-3"
                >
                  <div className="h-28 bg-gray-100 rounded overflow-hidden mb-2 relative">
                    <img
                      src={getThumbnailUrl(item)}
                      alt={item.heading}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                    {item.mediaType === 'image' && item.mediaUrls && item.mediaUrls.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        +{item.mediaUrls.length - 1}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 mb-1">
                    {getMediaIcon(item.mediaType)}
                    <span className="text-xs font-medium">
                      {getMediaTypeLabel(item.mediaType)}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 truncate mb-1">
                    {item.heading}
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
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{item.location}</span>
                      </div>
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
                      onClick={() => deleteGalleryItem(item._id)}
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
              {filteredAndSortedGallery.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-3"
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0 relative">
                      <img
                        src={getThumbnailUrl(item)}
                        alt={item.heading}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/64?text=N/A";
                        }}
                      />
                      {item.mediaType === 'image' && item.mediaUrls && item.mediaUrls.length > 1 && (
                        <div className="absolute top-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                          +{item.mediaUrls.length - 1}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-1">
                            {getMediaIcon(item.mediaType)}
                            <span className="text-xs font-medium">
                              {getMediaTypeLabel(item.mediaType)}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-gray-900 truncate">
                            {item.heading}
                          </h3>

                          {item.description && (
                            <p className="text-xs text-gray-500 truncate">
                              {item.description}
                            </p>
                          )}

                          {item.location && (
                            <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{item.location}</span>
                            </div>
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
                          onClick={() => deleteGalleryItem(item._id)}
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

          {filteredAndSortedGallery.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No gallery items found
              </h3>

              <p className="text-sm text-gray-600 mb-4">Try adjusting your filters</p>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("All");
                  setFilterMediaType("All");
                  setSortBy("date");
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
                  {editingItem ? 'Edit Gallery Item' : 'New Gallery Item'}
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
                    Media Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, mediaType: 'image', mediaUrl: '' });
                        setImagePreviews(editingItem?.mediaType === 'image' && editingItem?.mediaUrls ? editingItem.mediaUrls : []);
                        setImageFiles([]);
                        setThumbnailPreview(null);
                        setThumbnailFile(null);
                      }}
                      className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 ${
                        formData.mediaType === 'image'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-xs font-medium">Image</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, mediaType: 'instagram', mediaUrl: editingItem?.mediaType === 'instagram' ? editingItem.mediaUrls[0] : '' });
                        setImagePreviews([]);
                        setImageFiles([]);
                        setThumbnailPreview(editingItem?.mediaType === 'instagram' && editingItem?.thumbnailUrl ? editingItem.thumbnailUrl : null);
                        setThumbnailFile(null);
                      }}
                      className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 ${
                        formData.mediaType === 'instagram'
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      <Instagram className="w-5 h-5" />
                      <span className="text-xs font-medium">Instagram</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, mediaType: 'youtube', mediaUrl: editingItem?.mediaType === 'youtube' ? editingItem.mediaUrls[0] : '' });
                        setImagePreviews([]);
                        setImageFiles([]);
                        setThumbnailPreview(editingItem?.mediaType === 'youtube' && editingItem?.thumbnailUrl ? editingItem.thumbnailUrl : null);
                        setThumbnailFile(null);
                      }}
                      className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 ${
                        formData.mediaType === 'youtube'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      <Youtube className="w-5 h-5" />
                      <span className="text-xs font-medium">YouTube</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Heading <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.heading}
                    onChange={(e) => {
                      setFormData({ ...formData, heading: e.target.value });
                      if (errors.heading) setErrors({ ...errors, heading: '' });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.heading ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter heading"
                  />
                  {errors.heading && <p className="text-xs text-red-600 mt-1">{errors.heading}</p>}
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
                    placeholder="Enter description..."
                  />
                  {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
                </div>

                {formData.mediaType === 'image' ? (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Images <span className="text-red-500">*</span> <span className="text-gray-500 text-xs">(Max 3)</span>
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-4 text-center ${errors.mediaUrl ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={imageFiles.length >= 3}
                      />
                      <label htmlFor="image-upload" className={`cursor-pointer ${imageFiles.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs font-medium text-gray-700">
                          {imageFiles.length >= 3 ? 'Maximum images uploaded' : 'Upload images'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {imageFiles.length}/3 images
                        </p>
                      </label>
                    </div>
                    {errors.mediaUrl && <p className="text-xs text-red-600 mt-1">{errors.mediaUrl}</p>}

                    {imagePreviews.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded border border-gray-300"
                            />
                            {index < imageFiles.length && (
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        {formData.mediaType === 'instagram' ? 'Instagram Post Link' : 'YouTube Video Link'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        value={formData.mediaUrl}
                        onChange={(e) => {
                          setFormData({ ...formData, mediaUrl: e.target.value });
                          if (errors.mediaUrl) setErrors({ ...errors, mediaUrl: '' });
                        }}
                        className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.mediaUrl ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder={formData.mediaType === 'instagram' ? 'https://instagram.com/p/...' : 'https://youtube.com/watch?v=...'}
                      />
                      {errors.mediaUrl && <p className="text-xs text-red-600 mt-1">{errors.mediaUrl}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Thumbnail Image <span className="text-red-500">*</span>
                      </label>
                      <div className={`border-2 border-dashed rounded-lg p-4 text-center ${errors.thumbnail ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                          className="hidden"
                          id="thumbnail-upload"
                        />
                        <label htmlFor="thumbnail-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs font-medium text-gray-700">
                            Upload thumbnail
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Max 5MB
                          </p>
                        </label>
                      </div>
                      {errors.thumbnail && <p className="text-xs text-red-600 mt-1">{errors.thumbnail}</p>}

                      {thumbnailPreview && (
                        <div className="mt-3 relative inline-block">
                          <img
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            className="w-32 h-32 object-cover rounded border border-gray-300"
                          />
                          {thumbnailFile && (
                            <button
                              type="button"
                              onClick={removeThumbnail}
                              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Location <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Enter location"
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
                    {isSubmitting ? 'Saving...' : editingItem ? 'Update Item' : 'Create Item'}
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