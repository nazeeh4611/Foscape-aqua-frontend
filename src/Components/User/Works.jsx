import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, User, Clock, Maximize2, ArrowLeft, Grid3x3 } from 'lucide-react';
import axios from 'axios';
import { baseurl } from '../../Base/Base';
import Navbar from '../../Layout/Navbar';
import Footer from '../../Layout/Footer';
import { useNavigate } from 'react-router-dom';
const PortfolioPage = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
 const navigate = useNavigate()
  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'pond', name: 'Ponds' },
    { id: 'landscape', name: 'Landscapes' },
    { id: 'fountain', name: 'Fountains' },
    { id: 'pool', name: 'Pools' },
    { id: 'design', name: 'Designs' }
  ];

  useEffect(() => {
    fetchPortfolios();
  }, [selectedCategory]);

  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const url =
        selectedCategory === "all"
          ? `${baseurl}user/portfolios`
          : `${baseurl}user/portfolios?category=${selectedCategory}`;
  
      const response = await axios.get(url);
  
      if (response.data.success) {
        setPortfolios(response.data.portfolios);
      }
    } catch (error) {
      console.error("Error fetching portfolios:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (portfolio) => {
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

  return (
    <>
    <Navbar/>
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
  <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">             {/* Back Button */}
            {/* <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 mb-6 text-[#CFEAE3] hover:text-white transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Home</span>
            </button> */}

            {/* Page Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Grid3x3 className="w-8 h-8" />
                  <h1 className="text-3xl sm:text-4xl font-bold">
                   Our Works & Designs
                  </h1>
                </div>
                <p className="text-[#CFEAE3] text-base sm:text-lg max-w-2xl">
                Explore our collection of stunning aquatic projects and custom designs
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
                className="hover:text-white cursor-pointer"
              >
                Projects
              </span>
           
              <span className="font-semibold text-white">
              </span>
            </div>
          </div>
        </div>
      

      <div className="max-w-7xl mx-auto px-4 -mt-8 pb-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-slate-100 rounded-xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : portfolios.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">No projects found in this category</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolios.map((portfolio) => (
                <div
                  key={portfolio._id}
                  onClick={() => openModal(portfolio)}
                  className="bg-white border-2 border-slate-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={portfolio.mediaUrls[0]}
                      alt={portfolio.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 bg-white bg-opacity-90 rounded-full text-sm font-semibold text-[#144E8C] capitalize">
                      {portfolio.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{portfolio.name}</h3>
                    <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                      {portfolio.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      {portfolio.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{portfolio.location}</span>
                        </div>
                      )}
                      {portfolio.completionDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(portfolio.completionDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedPortfolio && !fullscreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={closeModal}>
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
                  className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
                >
                  <Maximize2 className="w-5 h-5 text-slate-700" />
                </button>
                
                {selectedPortfolio.mediaUrls.length > 1 && (
                  <>
                    {currentImageIndex > 0 && (
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                    )}
                    {currentImageIndex < selectedPortfolio.mediaUrls.length - 1 && (
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
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
                        currentImageIndex === index ? 'ring-4 ring-[#144E8C]' : 'opacity-60 hover:opacity-100'
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
                      <div className="w-10 h-10 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-lg flex items-center justify-center flex-shrink-0">
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
                      <div className="w-10 h-10 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-lg flex items-center justify-center flex-shrink-0">
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
                      <div className="w-10 h-10 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-lg flex items-center justify-center flex-shrink-0">
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
                      <div className="w-10 h-10 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-lg flex items-center justify-center flex-shrink-0">
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

      {fullscreenImage && selectedPortfolio && (
        <div className="fixed inset-0 bg-black z-[60] flex items-center justify-center" onClick={closeFullscreen}>
          <button
            onClick={closeFullscreen}
            className="absolute top-6 right-6 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center z-10 transition-all"
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
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all"
                  >
                    <ChevronLeft className="w-8 h-8 text-white" />
                  </button>
                )}
                {currentImageIndex < selectedPortfolio.mediaUrls.length - 1 && (
                  <button
                    onClick={nextImage}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all"
                  >
                    <ChevronRight className="w-8 h-8 text-white" />
                  </button>
                )}
              </>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {selectedPortfolio.mediaUrls.length}
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default PortfolioPage;