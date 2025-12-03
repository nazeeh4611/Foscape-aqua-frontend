import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Play, Pause } from 'lucide-react';

const OurProjects = ({ portfolios = [] }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});
  const autoPlayRef = useRef(null);

  // Cache visible portfolios
  const visiblePortfolios = useMemo(() => {
    return portfolios.slice(0, 8);
  }, [portfolios]);

  // Memoize active project
  const activeProject = useMemo(() => {
    return visiblePortfolios[activeIndex] || null;
  }, [visiblePortfolios, activeIndex]);

  // Simple image load handler
  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  // Navigation handlers
  const handlePrevious = () => {
    setActiveIndex(prev => (prev === 0 ? visiblePortfolios.length - 1 : prev - 1));
  };

  const handleNext = () => {
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

  // Preload current and next image
  useEffect(() => {
    if (!activeProject?.mediaUrls?.[0]) return;

    // Load current image
    const img = new Image();
    img.src = activeProject.mediaUrls[0];
    img.onload = () => handleImageLoad(activeProject._id);
    
    // Preload next image
    const nextIndex = (activeIndex + 1) % visiblePortfolios.length;
    const nextProject = visiblePortfolios[nextIndex];
    if (nextProject?.mediaUrls?.[0] && !loadedImages[nextProject._id]) {
      const nextImg = new Image();
      nextImg.src = nextProject.mediaUrls[0];
      nextImg.onload = () => handleImageLoad(nextProject._id);
    }
  }, [activeProject, activeIndex, visiblePortfolios]);

  // Don't render if no portfolios
  if (visiblePortfolios.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Projects</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore our successful aquatic installations and projects
          </p>
        </div>

        <div className="relative">
          {/* Main Slider */}
          <div className="relative h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-100 to-blue-100">
            {/* Main Image */}
            {activeProject?.mediaUrls?.[0] && (
              <img
                src={activeProject.mediaUrls[0]}
                alt={activeProject.name}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  loadedImages[activeProject._id] ? 'opacity-100' : 'opacity-0'
                }`}
                loading="eager"
                decoding="async"
              />
            )}

            {/* Loading Skeleton */}
            {!loadedImages[activeProject?._id] && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-blue-200 animate-pulse"></div>
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

            {/* Project Info */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-3xl font-bold mb-2">
                {activeProject?.name || 'Aquatic Project'}
              </h3>
              <p className="text-slate-200 text-lg mb-6 max-w-2xl">
                {activeProject?.description || 'Professional aquatic installation'}
              </p>
              {activeProject?.category && (
                <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  {activeProject.category}
                </span>
              )}
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
          </div>

          {/* Thumbnail Grid */}
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
                  <div className="aspect-square bg-gradient-to-br from-slate-200 to-blue-200">
                    {project.mediaUrls?.[0] && (
                      <img
                        src={project.mediaUrls[0]}
                        alt={project.name}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${
                          loadedImages[project._id] ? 'opacity-100' : 'opacity-0'
                        }`}
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    {!loadedImages[project._id] && (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-blue-200 animate-pulse"></div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white text-sm font-medium truncate">
                      {project.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* View All Button */}
          {visiblePortfolios.length > 4 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setSelectedProject(visiblePortfolios[activeIndex])}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                View All Projects
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-auto bg-white rounded-3xl">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-black hover:bg-white/40 z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-8">
              <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-blue-100 mb-6">
                {selectedProject.mediaUrls?.[0] && (
                  <img
                    src={selectedProject.mediaUrls[0]}
                    alt={selectedProject.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
              
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                {selectedProject.name}
              </h3>
              
              <p className="text-slate-600 text-lg mb-6">
                {selectedProject.description}
              </p>
              
              {selectedProject.category && (
                <div className="flex items-center gap-2">
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-full font-medium">
                    {selectedProject.category}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(OurProjects);