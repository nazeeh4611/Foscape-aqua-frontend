import React, { useState, useEffect } from 'react';
import { Image as ImgIcon, Video as VidIcon, Instagram as IgIcon, MapPin, Calendar, Youtube, ChevronRight, Search, Filter, Grid3x3, X, Maximize2, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { baseurl } from '../../Base/Base';
import Navbar from '../../Layout/Navbar';
import Footer from '../../Layout/Footer';
import { Link, useNavigate } from 'react-router-dom';

const YouTubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M23 7a3 3 0 0 0-2.1-2.12C19.6 4.5 12 4.5 12 4.5s-7.6 0-8.9.38A3 3 0 0 0 .999 7v10a3 3 0 0 0 2.1 2.12C4.4 19.5 12 19.5 12 19.5s7.6 0 8.9-.38A3 3 0 0 0 23 17V7z" fill="#FF0000"/>
    <path d="M10 8.5v7l6-3.5-6-3.5z" fill="#fff"/>
  </svg>
);

const ShortsIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="4" y="2" width="16" height="20" rx="3" fill="#FF0000"/>
    <path d="M9 7v10l6-5-6-5z" fill="#fff"/>
  </svg>
);

const YouTubePlayButton = () => (
  <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 0, 0, 0.9)' }}>
    <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  </div>
);

const ShortsPlayButton = () => (
  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 0, 0, 0.9)' }}>
    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  </div>
);

const getYouTubeIdFromUrl = (url) => {
  try {
    if (!url) return '';
    if (url.includes('shorts/')) return url.split('shorts/')[1].split('?')[0];
    if (url.includes('watch?v=')) return url.split('watch?v=')[1].split('&')[0];
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split('?')[0];
    if (url.includes('/embed/')) return url.split('/embed/')[1].split('?')[0];
    return '';
  } catch {
    return '';
  }
};

const Gallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [filteredGalleries, setFilteredGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGalleries();
  }, []);

  useEffect(() => {
    let filtered = galleries;

    if (filter !== 'all') {
      filtered = filtered.filter(g => g.mediaType === filter);
    }

    if (searchQuery) {
      filtered = filtered.filter(g =>
        g.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredGalleries(filtered);
  }, [searchQuery, filter, galleries]);

  const fetchGalleries = async () => {
    try {
      const res = await axios.get(`${baseurl}user/gallery`);
      setGalleries(res.data);
      setFilteredGalleries(res.data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const openModal = (item) => {
    setSelected(item);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelected(null);
    setCurrentImageIndex(0);
    setFullscreenImage(false);
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
    if (selected && currentImageIndex < selected.mediaUrls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const getYouTubeThumbnail = (url) => {
    const id = getYouTubeIdFromUrl(url);
    if (!id) return '';
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  };

  const getGradientColor = (index) => {
    const gradients = [
      'from-[#144E8C] to-[#78CDD1]',
      'from-[#78C7A2] to-[#99D5C8]',
      'from-[#78CDD1] to-[#CFEAE3]',
      'from-[#144E8C] to-[#78C7A2]',
      'from-[#99D5C8] to-[#78CDD1]',
      'from-[#78C7A2] to-[#CFEAE3]'
    ];
    return gradients[index % gradients.length];
  };

  const getMediaIcon = (mediaType, isShort = false) => {
    if (mediaType === 'image') return <ImgIcon className="w-5 h-5" />;
    if (mediaType === 'youtube') return isShort ? <ShortsIcon size={20} /> : <Youtube className="w-5 h-5" />;
    if (mediaType === 'instagram') return <IgIcon className="w-5 h-5" />;
    return null;
  };

  if (loading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#CFEAE3] to-[#99D5C8] pt-24">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#144E8C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#144E8C] font-semibold">Loading gallery...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>

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
          <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <ImgIcon className="w-8 h-8" />
                  <h1 className="text-3xl sm:text-4xl font-bold">Our Gallery</h1>
                </div>
                <p className="text-[#CFEAE3] text-base sm:text-lg max-w-2xl">
                  Explore our creative projects, aquatic masterpieces, and behind-the-scenes stories
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center text-sm text-[#CFEAE3] gap-1">
              <span onClick={() => navigate('/')} className="hover:text-white cursor-pointer">
                Home
              </span>
              <ChevronRight className="w-4 h-4" />
              <span className="hover:text-white cursor-pointer">Gallery</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-8 pb-12">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search gallery items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#144E8C] focus:outline-none transition-colors"
                />
              </div>

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                    filter === 'all'
                      ? 'bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('image')}
                  className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    filter === 'image'
                      ? 'bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <ImgIcon className="w-4 h-4" />
                  Photos
                </button>
                <button
                  onClick={() => setFilter('youtube')}
                  className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    filter === 'youtube'
                      ? 'bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Youtube className="w-4 h-4" />
                  YouTube
                </button>
                <button
                  onClick={() => setFilter('instagram')}
                  className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    filter === 'instagram'
                      ? 'bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <IgIcon className="w-4 h-4" />
                  Instagram
                </button>
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-800">{filteredGalleries.length}</span> gallery items
            </div>
          </div>

          {filteredGalleries.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImgIcon className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No gallery items found</h3>
              <p className="text-slate-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGalleries.map((item, index) => {
                const gradient = getGradientColor(index);
                const isYouTubeShort = item.mediaType === 'youtube' && item.mediaUrls[0]?.includes('shorts/');

                return (
                  <div
                    key={item._id}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
                  >
                    <div className="relative h-48 flex items-center justify-center bg-slate-50 overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>

                      {item.mediaType === 'image' && (
                        <img
                          src={item.mediaUrls[0]}
                          alt={item.heading}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}

                      {item.mediaType === 'youtube' && (
                        <a
                          href={item.mediaUrls[0]}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full h-full flex items-center justify-center relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <img
                            src={item.thumbnailUrl || getYouTubeThumbnail(item.mediaUrls[0])}
                            alt={item.heading}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            {isYouTubeShort ? <ShortsPlayButton /> : <YouTubePlayButton />}
                          </div>
                        </a>
                      )}

                      {item.mediaType === 'instagram' && (
                        <a
                          href={item.mediaUrls[0]}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full h-full flex items-center justify-center relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <img
                            src={item.thumbnailUrl || item.thumbnail || ''}
                            alt={item.heading}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500">
                              <IgIcon className="w-8 h-8 text-white" />
                            </div>
                          </div>
                        </a>
                      )}

                      <div className={`absolute top-4 right-4 px-3 py-1 bg-gradient-to-r ${gradient} text-white text-xs font-semibold rounded-full shadow-lg`}>
                        {item.mediaType === 'image' ? 'Photos' : item.mediaType === 'youtube' ? (isYouTubeShort ? 'Shorts' : 'YouTube') : 'Instagram'}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-[#144E8C] transition-colors line-clamp-1">
                        {item.heading}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>

                      {item.location && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                          <MapPin className="w-3 h-3 text-blue-500" />
                          {item.location}
                        </div>
                      )}

                      <button
                        onClick={() => openModal(item)}
                        className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 group-hover:bg-gradient-to-r group-hover:from-[#144E8C] group-hover:to-[#78CDD1] text-slate-700 group-hover:text-white rounded-xl font-medium transition-all duration-300"
                      >
                        <span className="text-sm">View Details</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Enhanced Modal */}
          {selected && !fullscreenImage && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={closeModal}>
              <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scaleIn" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white p-6 flex items-center justify-between z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      {getMediaIcon(selected.mediaType, selected.mediaUrls[0]?.includes('shorts/'))}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selected.heading}</h2>
                      <p className="text-sm text-white/80 mt-1">
                        {selected.mediaType === 'image' ? 'Photo Gallery' : selected.mediaType === 'youtube' ? (selected.mediaUrls[0]?.includes('shorts/') ? 'YouTube Short' : 'YouTube Video') : 'Instagram Post'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-88px)]">
                  <div className="p-6">
                    {/* Description */}
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 mb-6">
                      <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-[#144E8C] to-[#78CDD1] rounded-full"></div>
                        About
                      </h3>
                      <p className="text-slate-700 leading-relaxed">{selected.description}</p>
                    </div>

                    {/* Main Image with Navigation - For Images */}
                    {selected.mediaType === 'image' && (
                      <>
                        <div className="relative mb-6 bg-slate-50 rounded-2xl overflow-hidden">
                          <img
                            src={selected.mediaUrls[currentImageIndex]}
                            alt={selected.heading}
                            className="w-full h-96 object-contain cursor-pointer"
                            onClick={() => openFullscreen(currentImageIndex)}
                          />
                          
                          {/* Fullscreen Button */}
                          <button
                            onClick={() => openFullscreen(currentImageIndex)}
                            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                          >
                            <Maximize2 className="w-5 h-5 text-slate-700" />
                          </button>
                          
                          {/* Navigation Arrows */}
                          {selected.mediaUrls.length > 1 && (
                            <>
                              {currentImageIndex > 0 && (
                                <button
                                  onClick={prevImage}
                                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                                >
                                  <ChevronLeft className="w-6 h-6 text-slate-700" />
                                </button>
                              )}
                              {currentImageIndex < selected.mediaUrls.length - 1 && (
                                <button
                                  onClick={nextImage}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                                >
                                  <ChevronRight className="w-6 h-6 text-slate-700" />
                                </button>
                              )}
                              
                              {/* Image Counter */}
                              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 backdrop-blur-sm text-white text-sm rounded-full">
                                {currentImageIndex + 1} / {selected.mediaUrls.length}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {selected.mediaUrls.length > 1 && (
                          <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                            {selected.mediaUrls.map((url, index) => (
                              <img
                                key={index}
                                src={url}
                                alt={`${selected.heading} ${index + 1}`}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-24 h-24 object-cover rounded-xl cursor-pointer flex-shrink-0 transition-all ${
                                  currentImageIndex === index 
                                    ? 'ring-4 ring-[#144E8C] scale-105' 
                                    : 'opacity-60 hover:opacity-100 hover:scale-105'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    {/* Media Grid - For YouTube and Instagram */}
                    {selected.mediaType !== 'image' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {selected.mediaType === 'youtube' && selected.mediaUrls.map((url, index) => {
                          const isShort = url.includes('shorts/');
                          return (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="block rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-slate-50"
                            >
                              <div className="relative" style={{ paddingTop: isShort ? '177.78%' : '56.25%' }}>
                                <img
                                  src={selected.thumbnailUrl || getYouTubeThumbnail(url)}
                                  alt={selected.heading}
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors">
                                  {isShort ? <ShortsPlayButton /> : <YouTubePlayButton />}
                                </div>
                              </div>
                            </a>
                          );
                        })}

                        {selected.mediaType === 'instagram' && selected.mediaUrls.map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="block rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-slate-50"
                          >
                            <div className="relative" style={{ paddingTop: '125%' }}>
                              <img
                                src={selected.thumbnailUrl || selected.thumbnail || ''}
                                alt={selected.heading}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 flex items-center justify-center hover:from-black/50 transition-colors">
                                <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500">
                                  <IgIcon className="w-10 h-10 text-white" />
                                </div>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 bg-white border-2 border-slate-100 rounded-xl p-4 hover:border-[#144E8C] transition-colors">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium mb-1">Published</p>
                          <p className="font-bold text-slate-800 text-lg">
                            {new Date(selected.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      {selected.location && (
                        <div className="flex items-start gap-3 bg-white border-2 border-slate-100 rounded-xl p-4 hover:border-[#144E8C] transition-colors">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <MapPin className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-500 font-medium mb-1">Location</p>
                            <p className="font-bold text-slate-800 text-lg">{selected.location}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fullscreen Image Viewer */}
          {fullscreenImage && selected && selected.mediaType === 'image' && (
            <div className="fixed inset-0 bg-black z-[60] flex items-center justify-center animate-fadeIn" onClick={closeFullscreen}>
              <button
                onClick={closeFullscreen}
                className="absolute top-6 right-6 w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center z-10 transition-all"
              >
                <X className="w-7 h-7 text-white" />
              </button>

              <div className="relative w-full h-full flex items-center justify-center p-8">
                <img
                  src={selected.mediaUrls[currentImageIndex]}
                  alt={selected.heading}
                  className="max-w-full max-h-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />

                {selected.mediaUrls.length > 1 && (
                  <>
                    {currentImageIndex > 0 && (
                      <button
                        onClick={prevImage}
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
                      >
                        <ChevronLeft className="w-8 h-8 text-white" />
                      </button>
                    )}
                    {currentImageIndex < selected.mediaUrls.length - 1 && (
                      <button
                        onClick={nextImage}
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
                      >
                        <ChevronRight className="w-8 h-8 text-white" />
                      </button>
                    )}
                  </>
                )}

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/70 backdrop-blur-sm text-white text-base rounded-full font-medium">
                  {currentImageIndex + 1} / {selected.mediaUrls.length}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-md border border-slate-200 py-8 mt-12">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-slate-600 mb-4">Want to see more of our work?</p>
              <Link to="/contact">
                <button className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                  Contact Us
                  <ChevronRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Gallery;