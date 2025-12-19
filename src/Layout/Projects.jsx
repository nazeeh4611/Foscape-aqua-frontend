import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  MapPin,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  User,
  Clock,
  RefreshCw
} from 'lucide-react';
import { fetchFeaturedPortfolios } from '../services/homeService';
import useApiData from '../hooks/useApiData';
import { CardSkeleton } from '../Components/Common/LoadingSkeleton';

const OurProjects = () => {
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const {
    data,
    loading,
    error,
    fromCache,
    retry
  } = useApiData(fetchFeaturedPortfolios);
  
  const portfolios = Array.isArray(data) ? data : [];
  

  const getCategoryGradient = (category) => {
    const gradients = {
      pond: 'from-blue-500 to-cyan-500',
      landscape: 'from-emerald-500 to-teal-500',
      fountain: 'from-purple-500 to-pink-500',
      pool: 'from-indigo-500 to-blue-500',
      design: 'from-orange-500 to-amber-500'
    };
    return gradients[category] || 'from-slate-500 to-slate-700';
  };

  const openModal = (portfolio, e) => {
    if (e) e.stopPropagation();
    setSelectedPortfolio(portfolio);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedPortfolio(null);
    setCurrentImageIndex(0);
  };

  const openFullscreen = (index) => {
    setFullscreenImage(true);
    setCurrentImageIndex(index);
  };

  const closeFullscreen = () => {
    setFullscreenImage(false);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (selectedPortfolio && currentImageIndex < selectedPortfolio.mediaUrls.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Show loading state
  if (loading && portfolios.length === 0) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium">Featured Works</span>
            </div>
            <div className="h-12 bg-slate-700 rounded w-96 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-slate-700 rounded w-64 mx-auto animate-pulse" />
          </div>
          <CardSkeleton count={3} />
        </div>
      </div>
    );
  }

  // Show error state
  if (error && portfolios.length === 0) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-red-400 mb-3">Failed to Load Projects</h3>
            <p className="text-slate-400 mb-6">{error}</p>
            <button
              onClick={retry}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (portfolios.length === 0) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-slate-800 rounded-xl p-12">
            <Sparkles className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-3">No Featured Projects Yet</h3>
            <p className="text-slate-400">Check back soon for our latest work!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium">Featured Works</span>
              {fromCache && (
                <span className="text-xs text-blue-400">(Cached)</span>
              )}
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our Projects & Works
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Discover our premium aquatic installations and transformative designs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {portfolios.map((portfolio, index) => (
              <div
                key={portfolio._id || index}
                onClick={(e) => openModal(portfolio, e)}
                className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02]"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={portfolio.mediaUrls?.[0] || '/placeholder.jpg'}
                    alt={portfolio.name || 'Project'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                  {portfolio.mediaUrls?.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm font-medium">
                      +{portfolio.mediaUrls.length - 1} more
                    </div>
                  )}

                  <div
                    className={`absolute top-4 left-4 bg-gradient-to-r ${getCategoryGradient(
                      portfolio.category
                    )} px-4 py-1.5 rounded-full`}
                  >
                    <span className="text-white text-sm font-semibold">
                      {portfolio.category
                        ? portfolio.category.charAt(0).toUpperCase() +
                          portfolio.category.slice(1)
                        : 'Project'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
                    {portfolio.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{portfolio.location}</span>
                      </div>
                    )}
                    {portfolio.completionDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(portfolio.completionDate).getFullYear()}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {portfolio.name || 'Untitled Project'}
                  </h3>

                  <p className="text-slate-300 line-clamp-2 mb-4">
                    {portfolio.description || 'No description available'}
                  </p>

                  <div className="space-y-2 mb-4 text-sm">
                    {portfolio.client && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <User className="w-4 h-4" />
                        <span className="font-medium">Client:</span>
                        <span>{portfolio.client}</span>
                      </div>
                    )}
                    {portfolio.duration && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">Duration:</span>
                        <span>{portfolio.duration}</span>
                      </div>
                    )}
                    {portfolio.completionDate && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">Completed:</span>
                        <span>{formatDate(portfolio.completionDate)}</span>
                      </div>
                    )}
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-105">
                    View Details
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/works')}
              className="inline-flex items-center gap-3 px-10 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              View All Projects
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal and Fullscreen code remains the same */}
      {selectedPortfolio && !fullscreenImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          {/* ... rest of modal code ... */}
        </div>
      )}

      {fullscreenImage && selectedPortfolio && (
        <div
          className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
          onClick={closeFullscreen}
        >
          {/* ... rest of fullscreen code ... */}
        </div>
      )}
    </>
  );
};

export default OurProjects;