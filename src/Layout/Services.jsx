import React from 'react';

const Services = () => {
  const services = [
    {
      title: "Residential Aquarium Solutions",
      description: "Custom aquariums designed for homes, enhancing beauty and tranquility in your space.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=366,fit=crop/mnlWbq8nWRC78GJ6/screenshot-2025-08-31-091858-mePgeQzwPwCyJOJw.png"
    },
    {
      title: "Commercial Aquarium Services", 
      description: "Professional aquarium installations and maintenance for businesses, creating stunning aquatic environments.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=458,fit=crop/mnlWbq8nWRC78GJ6/quality_restoration_20250423102408414-2-ALpeWebQ6bul7zGK.jpg"
    },
    {
      title: "Water Garden Design",
      description: "Beautifully designed water gardens that bring nature's serenity to your residential or commercial property.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=366,fit=crop/mnlWbq8nWRC78GJ6/beautiful-indoor-pond-design-for-our-kannur-client-mr.-sajid.-going-to-implement-it-soon.-wait-for-the-finised-video-A3Q297PGkBSaJwy4.jpg"
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Expert solutions for all your aquatic needs, from residential aquariums to commercial installations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-w-16 aspect-h-12">
                <img 
                  src={service.image}
                  alt={service.title}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
                <button className="mt-4 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Fountain Design</h3>
            <p className="text-gray-600 mb-6">
              Custom fountain installations that create stunning focal points for any space.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              View Gallery
            </button>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Pool Management</h3>
            <p className="text-gray-600 mb-6">
              Complete pool maintenance and management services for residential and commercial properties.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Get Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;