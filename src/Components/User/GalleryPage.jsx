// src/components/Gallery/Gallery.jsx
import React, { useState, useEffect } from 'react';
import { Image as ImgIcon, Video as VidIcon, Instagram as IgIcon, MapPin, Calendar, Youtube } from 'lucide-react';
import axios from 'axios';
import { baseurl } from '../../Base/Base';
import Navbar from '../../Layout/Navbar';
import Footer from '../../Layout/Footer';

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
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const res = await axios.get(`${baseurl}user/gallery`);
      setGalleries(res.data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const getYouTubeThumbnail = (url) => {
    const id = getYouTubeIdFromUrl(url);
    if (!id) return '';
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  };

  const filtered = filter === 'all' ? galleries : galleries.filter((g) => g.mediaType === filter);

  const renderMedia = (item) => {
    if (item.mediaType === 'image') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {item.mediaUrls.map((u, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <img src={u} alt={item.heading} className="w-full h-72 object-cover rounded-xl" />
            </div>
          ))}
        </div>
      );
    }

    if (item.mediaType === 'youtube') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {item.mediaUrls.map((u, i) => {
            const isShort = u.includes('shorts/');
            const thumb = item.thumbnailUrl || getYouTubeThumbnail(u);
            return (
              <a
                key={i}
                href={u}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] bg-white w-full"
              >
                <div className="relative w-full" style={{ paddingTop: isShort ? '177.78%' : '56.25%' }}>
                  <img 
                    src={thumb} 
                    alt={item.heading} 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isShort ? <ShortsPlayButton /> : <YouTubePlayButton />}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-50">
                      {isShort ? <ShortsIcon size={20} /> : <YouTubeIcon size={20} />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        {isShort ? 'YouTube Shorts' : 'YouTube Video'}
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      );
    }

    if (item.mediaType === 'instagram') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {item.mediaUrls.map((u, i) => (
            <a 
              key={i} 
              href={u} 
              target="_blank" 
              rel="noreferrer" 
              className="group block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] bg-white w-full"
            >
              <div className="relative w-full" style={{ paddingTop: '125%' }}>
                <img 
                  src={item.thumbnailUrl || item.thumbnail || ''} 
                  alt={item.heading} 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-transparent to-transparent group-hover:from-purple-900/60 transition-all duration-300" />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500">
                    <IgIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">Instagram Post</div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <>
        <Navbar />
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
      <Navbar />
      
      <div className="bg-gradient-to-br from-[#CFEAE3] to-[#99D5C8] pt-24 pb-12 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-xl flex items-center justify-center">
                <ImgIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Our Works & Stories</h1>
                <p className="text-slate-600 text-sm mt-1">Explore our creative projects and aquatic masterpieces</p>
              </div>
            </div>
            
            <div className="flex gap-3 flex-wrap mb-8">
              <button 
                onClick={() => setFilter('all')} 
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  filter === 'all' 
                    ? 'bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white shadow-lg' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Projects
              </button>
              <button 
                onClick={() => setFilter('image')} 
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
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
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
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
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  filter === 'instagram' 
                    ? 'bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white shadow-lg' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <IgIcon className="w-4 h-4" />
                Instagram
              </button>
            </div>

            <div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {filtered.map((item) => (
      <div
        key={item._id}
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
      >
        <div className="w-full">
          {item.mediaType === 'image' && (
            <img
              src={item.mediaUrls[0]}
              alt={item.heading}
              className="w-full h-56 object-cover"
            />
          )}

          {item.mediaType === 'youtube' && (
            <a href={item.mediaUrls[0]} target="_blank" rel="noreferrer" className="relative w-full block">
              <img
                src={item.thumbnailUrl || getYouTubeThumbnail(item.mediaUrls[0])}
                alt={item.heading}
                className="w-full h-56 object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                {item.mediaUrls[0].includes('shorts/') ? <ShortsPlayButton /> : <YouTubePlayButton />}
              </div>
            </a>
          )}

          {item.mediaType === 'instagram' && (
            <a href={item.mediaUrls[0]} target="_blank" rel="noreferrer" className="relative w-full block">
              <img
                src={item.thumbnailUrl || item.thumbnail || ''}
                alt={item.heading}
                className="w-full h-56 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40" />
            </a>
          )}
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-slate-800">{item.heading}</h3>
          <p className="text-slate-600 line-clamp-2 mt-1">{item.description}</p>

          <div className="flex items-center gap-2 text-sm text-slate-500 mt-3">
            <Calendar className="w-4 h-4" />
            {new Date(item.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>

          <div className="flex items-center gap-2 pt-2 mt-auto">
            {item.mediaType === 'image' && (
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ImgIcon className="w-4 h-4 text-blue-600" />
                Photos
              </div>
            )}

            {item.mediaType === 'youtube' && (
              <div className="flex items-center gap-2 text-sm font-semibold">
                {item.mediaUrls[0].includes('shorts/') ? (
                  <ShortsIcon size={18} />
                ) : (
                  <YouTubeIcon size={18} />
                )}
                {item.mediaUrls[0].includes('shorts/') ? 'Shorts' : 'YouTube Video'}
              </div>
            )}

            {item.mediaType === 'instagram' && (
              <div className="flex items-center gap-2 text-sm font-semibold">
                <IgIcon className="w-4 h-4 text-pink-600" />
                Instagram
              </div>
            )}
          </div>

          <button
            onClick={() => setSelected(item)}
            className="mt-4 w-full py-2 rounded-xl bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white font-medium hover:shadow-lg transition-all"
          >
            View
          </button>
        </div>
      </div>
    ))}
  </div>

  {selected && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl animate-fadeIn">
        <h2 className="text-2xl font-bold text-slate-800">{selected.heading}</h2>

        <p className="text-slate-600 mt-3">{selected.description}</p>

        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <Calendar className="w-4 h-4" />
          {new Date(selected.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>

        {selected.location && (
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4 text-blue-500" />
            {selected.location}
          </div>
        )}

        <button
          onClick={() => setSelected(null)}
          className="mt-6 w-full py-2 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-900 transition"
        >
          Close
        </button>
      </div>
    </div>
  )}
</div>


          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Gallery;
