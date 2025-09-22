import React from 'react';

const Gallery = () => {
  const galleryImages = [
    {
      src: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=538,fit=crop/mnlWbq8nWRC78GJ6/outdoor-pond-design-done-for-our-premium-client.-dOqapDry28uN25Q0.jpg",
      alt: "Outdoor Pond Design - Premium Client"
    },
    {
      src: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=538,fit=crop/mnlWbq8nWRC78GJ6/beautiful-indoor-koi-fish-pond-design-proposed-for-our-tirur-client.-2-Y4LD9voJNkFkxzND.jpg",
      alt: "Indoor Koi Fish Pond Design"
    },
    {
      src: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=583,fit=crop/mnlWbq8nWRC78GJ6/beautiful-indoor-pond-design-for-our-kannur-client-mr.-sajid.-going-to-implement-it-soon.-wait-for-the-finised-video-2-mePxQJ1wo4uyzrPl.jpg",
      alt: "Beautiful Indoor Pond Design"
    },
    {
      src: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1440,h=1577,fit=crop/mnlWbq8nWRC78GJ6/quality_restoration_20250423102408414-2-ALpeWebQ6bul7zGK.jpg",
      alt: "Quality Restoration Project"
    },
    {
      src: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=457,fit=crop/mnlWbq8nWRC78GJ6/469029445_18035708309364843_5626666576497912423_n-YBg7wbLrLQHaljjZ.jpg",
      alt: "Aquatic Installation"
    },
    {
      src: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=569,fit=crop/mnlWbq8nWRC78GJ6/screenshot-2025-08-31-091858-mePgeQzwPwCyJOJw.png",
      alt: "Aquarium Setup"
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Gallery</h2>
          <p className="text-lg text-gray-600">
            Explore our stunning aquatic creations for homes and businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryImages.map((image, index) => (
            <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src={image.src}
                alt={image.alt}
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-semibold">{image.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            View More Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;