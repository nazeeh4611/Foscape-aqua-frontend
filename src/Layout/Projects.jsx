import React, { useEffect, useState, useCallback } from 'react';
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
  Clock
} from 'lucide-react';
import axios from 'axios';
import AOS from 'aos';
import { baseurl } from '../Base/Base';

const CACHE_KEY = 'portfolios_featured';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

const getPersistentCache = (key) => {
  try {
    if (typeof window === 'undefined') return null;
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

const setPersistentCache = (key, data) => {
  try {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (error) {
    console.warn('Cache failed:', error);
  }
};

const OurProjects = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const fetchPortfolios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1️⃣ Try cache first – show something immediately if available
      const cached = getPersistentCache(CACHE_KEY);
      if (cached && Array.isArray(cached) && cached.length > 0) {
        console.log('Using cached portfolios:', cached.length);
        setPortfolios(cached);
        setLoading(false);
      }

      console.log('Fetching portfolios from API:', `${baseurl}user/portfolios/featured`);

      // 2️⃣ Simple fetch (NO manual 15s abort timeout – this was breaking on mobile / cold starts)
      const controller = new AbortController();

      const response = await axios.get(`${baseurl}user/portfolios/featured`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response:', response.data);

      if (response.data && response.data.success) {
        const fetchedPortfolios = response.data.portfolios || [];
        console.log('Fetched portfolios count:', fetchedPortfolios.length);

        setPortfolios(fetchedPortfolios);

        if (fetchedPortfolios.length > 0) {
          setPersistentCache(CACHE_KEY, fetchedPortfolios);
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error);

      // Try to use cached data as fallback
      const cached = getPersistentCache(CACHE_KEY);
      if (cached && Array.isArray(cached) && cached.length > 0) {
        console.log('Using cached data as fallback');
        setPortfolios(cached);
      } else {
        setError(error.message || 'Failed to load projects');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
    fetchPortfolios();
  }, [fetchPortfolios]);

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

  // Loading state
  if (loading && (!portfolios || portfolios.length === 0)) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-8 bg-slate-700 rounded w-48 mx-auto mb-4 animate-pulse" />
            <div className="h-12 bg-slate-700 rounded w-96 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-slate-700 rounded w-64 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-64 bg-slate-700" />
                <div className="p-6">
                  <div className="h-6 bg-slate-700 rounded mb-3" />
                  <div className="h-4 bg-slate-700 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry
  if (error && (!portfolios || portfolios.length === 0)) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-red-400 mb-3">Failed to Load Projects</h3>
            <p className="text-slate-400 mb-6">{error}</p>
            <button
              onClick={fetchPortfolios}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!portfolios || portfolios.length === 0) {
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
          {/* Header */}
          <div className="text-center mb-16" >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium">Featured Works</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our Projects & Works
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Discover our premium aquatic installations and transformative designs
            </p>
          </div>

          {/* Grid Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {portfolios.map((portfolio, index) => (
              <div
                key={portfolio._id || index}
                onClick={(e) => openModal(portfolio, e)}
                className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02]"
              >
                {/* Image Container */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={portfolio.mediaUrls?.[0] || '/placeholder.jpg'}
                    alt={portfolio.name || 'Project'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                  {/* Multiple images indicator */}
                  {portfolio.mediaUrls?.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm font-medium">
                      +{portfolio.mediaUrls.length - 1} more
                    </div>
                  )}

                  {/* Category Badge */}
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

                {/* Content */}
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

                  {/* Project Meta */}
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

          {/* View All Button */}
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

      {/* Project Detail Modal */}
      {selectedPortfolio && !fullscreenImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-white">{selectedPortfolio.name}</h2>
              <button
                onClick={closeModal}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Main Image with Navigation */}
            <div className="relative">
              <img
                src={selectedPortfolio.mediaUrls?.[currentImageIndex]}
                alt={`${selectedPortfolio.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-[400px] object-cover"
                onClick={() => openFullscreen(currentImageIndex)}
              />
              <button
                onClick={() => openFullscreen(currentImageIndex)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all"
              >
                <Maximize2 className="w-5 h-5" />
              </button>

              {selectedPortfolio.mediaUrls?.length > 1 && (
                <>
                  {currentImageIndex > 0 && (
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  )}
                  {currentImageIndex < selectedPortfolio.mediaUrls.length - 1 && (
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* All Images Thumbnail Strip */}
            {selectedPortfolio.mediaUrls?.length > 1 && (
              <div className="p-6 border-b border-slate-700">
                <h3 className="text-sm font-semibold text-slate-400 mb-3">
                  All Images ({selectedPortfolio.mediaUrls.length})
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {selectedPortfolio.mediaUrls.map((url, index) => (
                    <div key={index} className="flex-shrink-0">
                      <img
                        src={url}
                        alt={`Thumbnail ${index + 1}`}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-32 h-24 object-cover rounded-lg cursor-pointer transition-all ${
                          currentImageIndex === index
                            ? 'ring-4 ring-blue-600 scale-105'
                            : 'opacity-60 hover:opacity-100 hover:scale-105'
                        }`}
                      />
                      <p className="text-xs text-slate-400 text-center mt-1">{index + 1}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Details */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Project Description</h3>
                <p className="text-slate-300">{selectedPortfolio.description}</p>
              </div>

              {/* Project Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedPortfolio.client && (
                  <div className="bg-slate-800 p-4 rounded-xl">
                    <p className="text-sm text-slate-400 mb-1">Client</p>
                    <p className="text-white font-semibold">{selectedPortfolio.client}</p>
                  </div>
                )}
                {selectedPortfolio.location && (
                  <div className="bg-slate-800 p-4 rounded-xl">
                    <p className="text-sm text-slate-400 mb-1">Location</p>
                    <p className="text-white font-semibold">{selectedPortfolio.location}</p>
                  </div>
                )}
                {selectedPortfolio.duration && (
                  <div className="bg-slate-800 p-4 rounded-xl">
                    <p className="text-sm text-slate-400 mb-1">Duration</p>
                    <p className="text-white font-semibold">{selectedPortfolio.duration}</p>
                  </div>
                )}
                {selectedPortfolio.completionDate && (
                  <div className="bg-slate-800 p-4 rounded-xl">
                    <p className="text-sm text-slate-400 mb-1">Completed</p>
                    <p className="text-white font-semibold">
                      {formatDate(selectedPortfolio.completionDate)}
                    </p>
                  </div>
                )}
                {selectedPortfolio.category && (
                  <div className="bg-slate-800 p-4 rounded-xl">
                    <p className="text-sm text-slate-400 mb-1">Category</p>
                    <p className="text-white font-semibold">
                      {selectedPortfolio.category.charAt(0).toUpperCase() +
                        selectedPortfolio.category.slice(1)}
                    </p>
                  </div>
                )}
              </div>

              {selectedPortfolio.features && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Key Features</h3>
                  <p className="text-slate-300">{selectedPortfolio.features}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image View */}
      {fullscreenImage && selectedPortfolio && (
        <div
          className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
          onClick={closeFullscreen}
        >
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <img
            src={selectedPortfolio.mediaUrls?.[currentImageIndex]}
            alt={selectedPortfolio.name}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {selectedPortfolio.mediaUrls?.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
              )}
              {currentImageIndex < selectedPortfolio.mediaUrls.length - 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              )}
            </>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-white text-sm font-medium">
              {currentImageIndex + 1} / {selectedPortfolio.mediaUrls?.length}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default OurProjects;
