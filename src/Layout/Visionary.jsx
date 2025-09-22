import React from 'react';

const Visionary = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">THE VISIONARY</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-600 leading-relaxed">
              Foscape aquatics living is my Ikigai, where my passion for nature and creativity comes to life through the art of aquascaping and landscape design. My journey from an enthusiastic hobbyist to a professional aquascaper has been shaped by this purpose, guiding me in transforming spaces into tranquil natural sanctuaries.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              With expertise in designing and creating breathtaking aquascapes, koi ponds, Zen gardens, and paludariums, I focus on blending water, greenery, and harmony. At Foscape aquatics living, our mission is to craft bespoke aquatic and landscape designs that seamlessly integrate nature into everyday life.
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
                <p className="text-gray-600 font-medium">Happy clients</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">15</div>
                <p className="text-gray-600 font-medium">Years of experience</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                MR. SHIBIN MUNDEKAT
              </h3>
              <p className="text-blue-600 font-semibold">FOUNDER & CEO OF FOSCAPE AQUA</p>
            </div>
          </div>

          <div className="relative">
            <img 
              src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=583,fit=crop/mnlWbq8nWRC78GJ6/beautiful-indoor-pond-design-for-our-kannur-client-mr.-sajid.-going-to-implement-it-soon.-wait-for-the-finised-video-2-mePxQJ1wo4uyzrPl.jpg"
              alt="Beautiful Indoor Pond Design"
              className="w-full h-auto rounded-2xl shadow-lg"
            />
            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Expert Design</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Visionary;