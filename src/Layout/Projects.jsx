import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Sparkles, X, ChevronLeft, ChevronRight, Maximize2, User, Clock, Play, Pause } from 'lucide-react';
import axios from 'axios';
import AOS from 'aos';
import { baseurl } from '../Base/Base';

const CACHE_KEY = 'portfolios_featured';
const CACHE_DURATION = 15 * 60 * 1000; 

const getPersistentCache = (key) => {
  try {
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
    sessionStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Cache failed:', error);
  }
};

const OurProjects = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Slider states
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [sliderImagesLoaded, setSliderImagesLoaded] = useState([]);
  const autoPlayRef = useRef(null);
  const navigate = useNavigate();

  // Cache visible portfolios for slider
  const visiblePortfolios = useMemo(() => {
    return portfolios.slice(0, 8);
  }, [portfolios]);

  // Memoize active project for slider
  const activeProject = useMemo(() => {
    return visiblePortfolios[activeIndex] || null;
  }, [visiblePortfolios, activeIndex]);

  // Fetch portfolios
  const fetchPortfolios = useCallback(async () => {
    try {
      setLoading(true);
      const cached = getPersistentCache(CACHE_KEY);
      if (cached) {
        setPortfolios(cached);
        setLoading(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await axios.get(`${baseurl}user/portfolios/featured`);
      console.log(response,"is here");

      clearTimeout(timeoutId);

      if (response.data.success) {
        const fetchedPortfolios = response.data.portfolios;
        setPortfolios(fetchedPortfolios);
        setPersistentCache(CACHE_KEY, fetchedPortfolios);
        
        // Preload first few images for slider
        preloadSliderImages(fetchedPortfolios.slice(0, 4));
      }
    } catch (error) {
      if (error.name === 'CanceledError') {
        console.error('Request timeout');
      } else {
        console.error('Error fetching portfolios:', error);
      }
      const cached = getPersistentCache(CACHE_KEY);
      if (cached) {
        setPortfolios(cached);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Simple image preloading function
  const preloadSliderImages = (projects) => {
    const loadedIds = [];
    projects.forEach(project => {
      if (project?.mediaUrls?.[0]) {
        const img = new Image();
        img.src = project.mediaUrls[0];
        img.onload = () => {
          loadedIds.push(project._id);
          setSliderImagesLoaded(prev => [...prev, project._id]);
        };
        img.onerror = () => {
          console.warn(`Failed to load image for project: ${project._id}`);
        };
      }
    });
  };

  // Load current slider image
  useEffect(() => {
    if (activeProject?.mediaUrls?.[0]) {
      setIsImageLoading(true);
      const img = new Image();
      img.src = activeProject.mediaUrls[0];
      img.onload = () => {
        setIsImageLoading(false);
        // Mark this image as loaded
        if (!sliderImagesLoaded.includes(activeProject._id)) {
          setSliderImagesLoaded(prev => [...prev, activeProject._id]);
        }
      };
      img.onerror = () => {
        setIsImageLoading(false);
        console.warn(`Failed to load image for project: ${activeProject._id}`);
      };
    }
  }, [activeProject]);

  // Slider navigation
  const handlePrevious = () => {
    setIsImageLoading(true);
    setActiveIndex(prev => (prev === 0 ? visiblePortfolios.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsImageLoading(true);
    setActiveIndex(prev => (prev === visiblePortfolios.length - 1 ? 0 : prev + 1));
  };

  // Auto-play toggle
  const handleAutoPlayToggle = () => {
    setAutoPlay(prev => !prev);
  };

  // Auto-play effect
  useEffect(() => {
    if (autoPlay && visiblePortfolios.length > 1) {
      autoPlayRef.current = setInterval(() => {
        handleNext();
      }, 4000);
    } else if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, visiblePortfolios.length]);

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
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="w-full py-16 bg-gradient-to-br from-slate-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block animate-pulse">
              <div className="h-8 w-48 bg-white/20 rounded-full mb-4 mx-auto"></div>
              <div className="h-12 w-96 bg-white/10 rounded mx-auto mb-2"></div>
              <div className="h-6 w-80 bg-white/5 rounded mx-auto"></div>
            </div>
          </div>
          
          {/* Slider skeleton */}
          <div className="relative mb-16">
            <div className="relative h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800/50 to-blue-800/50 border border-white/10 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-blue-900"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[3/2] bg-slate-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (portfolios.length === 0) {
    return null;
  }

  return (
    <>
      <div className="w-full py-16 bg-gradient-to-br from-slate-900 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMS4xLjktMiAyLTJzMiAuOSAyIDItLjkgMi0yIDItMi0uOS0yLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12" data-aos="fade-down">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-white">Featured Works</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Projects & Works
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Discover our premium aquatic installations and transformative designs
            </p>
          </div>

          {/* Slider Section */}
          {visiblePortfolios.length > 0 && (
            <div className="relative mb-16" data-aos="fade-up">
              <div className="relative h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800/50 to-blue-800/50 border border-white/10">
                {/* Main Image */}
                {activeProject?.mediaUrls?.[0] && (
                  <>
                    <img
                      src={activeProject.mediaUrls[0]}
                      alt={activeProject.name}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                        !isImageLoading ? 'opacity-100' : 'opacity-0'
                      }`}
                      loading="eager"
                    />
                    {isImageLoading && (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-blue-900 animate-pulse"></div>
                    )}
                  </>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Project Info */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getCategoryGradient(activeProject?.category)} shadow-lg backdrop-blur-sm`}>
                      {activeProject?.category?.charAt(0).toUpperCase() + activeProject?.category?.slice(1)}
                    </div>
                    {activeProject?.completionDate && (
                      <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{new Date(activeProject.completionDate).getFullYear()}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-3xl font-bold mb-2">
                    {activeProject?.name || 'Aquatic Project'}
                  </h3>
                  <p className="text-slate-200 text-lg mb-6 max-w-2xl">
                    {activeProject?.description || 'Professional aquatic installation'}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    {activeProject?.location && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="w-4 h-4" />
                        <span>{activeProject.location}</span>
                      </div>
                    )}
                    {activeProject?.client && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <User className="w-4 h-4" />
                        <span>{activeProject.client}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Auto-play Toggle */}
                <div className="absolute top-6 right-6 flex gap-2">
                  <button
                    onClick={handleAutoPlayToggle}
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                    aria-label={autoPlay ? 'Pause auto-play' : 'Play auto-play'}
                  >
                    {autoPlay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                  aria-label="Previous project"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                  aria-label="Next project"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Dots Indicator */}
                {visiblePortfolios.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {visiblePortfolios.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === activeIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                        }`}
                        aria-label={`Go to project ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail Grid */}
              {visiblePortfolios.length > 1 && (
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {visiblePortfolios.map((project, index) => {
                    const isActive = index === activeIndex;
                    return (
                      <button
                        key={project._id || index}
                        onClick={() => setActiveIndex(index)}
                        className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                          isActive ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-105'
                        }`}
                      >
                        <div className="aspect-square bg-gradient-to-br from-slate-800 to-blue-900">
                          {project.mediaUrls?.[0] && (
                            <img
                              src={project.mediaUrls[0]}
                              alt={project.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <span className="text-white text-sm font-medium truncate">
                            {project.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Grid Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {portfolios.slice(0, 3).map((portfolio, index) => (
              <div
                key={portfolio._id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                onClick={(e) => openModal(portfolio, e)}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <img
                    src={portfolio.mediaUrls[0]}
                    alt={portfolio.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryGradient(portfolio.category)} shadow-lg`}>
                    {portfolio.category?.charAt(0).toUpperCase() + portfolio.category?.slice(1)}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex flex-wrap items-center gap-3 text-white text-sm">
                      {portfolio.location && (
                        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                          <MapPin className="w-4 h-4" />
                          <span>{portfolio.location}</span>
                        </div>
                      )}
                      {portfolio.completionDate && (
                        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(portfolio.completionDate).getFullYear()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {portfolio.name}
                  </h3>

                  <p className="text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {portfolio.description}
                  </p>

                  {portfolio.client && (
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mb-2">
                      <span className="text-sm text-slate-500">Client</span>
                      <span className="text-sm font-semibold text-slate-900">{portfolio.client}</span>
                    </div>
                  )}

                  {portfolio.duration && (
                    <div className="flex items-center justify-between py-2 border-t border-slate-100">
                      <span className="text-sm text-slate-500">Duration</span>
                      <span className="text-sm font-semibold text-slate-900">{portfolio.duration}</span>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-end text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all duration-300">
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center" data-aos="fade-up" data-aos-delay="300">
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

      {/* Modal and Fullscreen components remain the same as before */}
      {selectedPortfolio && !fullscreenImage && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-slate-800">{selectedPortfolio.name}</h2>
              <button
                onClick={closeModal}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="relative mb-6">
                <img
                  src={selectedPortfolio.mediaUrls[currentImageIndex]}
                  alt={selectedPortfolio.name}
                  className="w-full h-96 object-contain bg-slate-50 rounded-xl cursor-pointer"
                  onClick={() => openFullscreen(currentImageIndex)}
                />
                <button
                  onClick={() => openFullscreen(currentImageIndex)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all"
                >
                  <Maximize2 className="w-5 h-5 text-slate-700" />
                </button>
                
                {selectedPortfolio.mediaUrls.length > 1 && (
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

              {selectedPortfolio.mediaUrls.length > 1 && (
                <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                  {selectedPortfolio.mediaUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`${selectedPortfolio.name} ${index + 1}`}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-24 h-24 object-cover rounded-lg cursor-pointer flex-shrink-0 ${
                        currentImageIndex === index ? 'ring-4 ring-blue-600' : 'opacity-60 hover:opacity-100'
                      } transition-all`}
                    />
                  ))}
                </div>
              )}

              <div className="space-y-4">
                <p className="text-slate-700 leading-relaxed">{selectedPortfolio.description}</p>

                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  {selectedPortfolio.client && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Client</p>
                        <p className="font-semibold text-slate-800">{selectedPortfolio.client}</p>
                      </div>
                    </div>
                  )}

                  {selectedPortfolio.location && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Location</p>
                        <p className="font-semibold text-slate-800">{selectedPortfolio.location}</p>
                      </div>
                    </div>
                  )}

                  {selectedPortfolio.duration && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Duration</p>
                        <p className="font-semibold text-slate-800">{selectedPortfolio.duration}</p>
                      </div>
                    </div>
                  )}

                  {selectedPortfolio.completionDate && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Completed</p>
                        <p className="font-semibold text-slate-800">{formatDate(selectedPortfolio.completionDate)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {selectedPortfolio.features && (
                  <div className="pt-4">
                    <h3 className="font-semibold text-slate-800 mb-2">Features</h3>
                    <p className="text-slate-600">{selectedPortfolio.features}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image */}
      {fullscreenImage && selectedPortfolio && (
        <div className="fixed inset-0 bg-black z-[60] flex items-center justify-center" onClick={closeFullscreen}>
          <button
            onClick={closeFullscreen}
            className="absolute top-6 right-6 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center z-10 transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={selectedPortfolio.mediaUrls[currentImageIndex]}
              alt={selectedPortfolio.name}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {selectedPortfolio.mediaUrls.length > 1 && (
              <>
                {currentImageIndex > 0 && (
                  <button
                    onClick={prevImage}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                  >
                    <ChevronLeft className="w-8 h-8 text-white" />
                  </button>
                )}
                {currentImageIndex < selectedPortfolio.mediaUrls.length - 1 && (
                  <button
                    onClick={nextImage}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                  >
                    <ChevronRight className="w-8 h-8 text-white" />
                  </button>
                )}
              </>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {selectedPortfolio.mediaUrls.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OurProjects;