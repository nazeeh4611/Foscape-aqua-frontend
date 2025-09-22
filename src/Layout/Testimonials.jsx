import React from 'react';

const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">What Our Clients Say</h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              
              <blockquote className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-8">
                "Foscape transformed our aquarium! Exceptional service and expertise in aquatic care. Highly recommend their services!"
              </blockquote>
              
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <p className="font-bold text-gray-900 text-lg">Rishan Shanu</p>
                  <p className="text-gray-600">Satisfied Customer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
            <p className="text-gray-600 font-medium">Client Satisfaction</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
            <p className="text-gray-600 font-medium">Support Available</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">Premium</div>
            <p className="text-gray-600 font-medium">Quality Materials</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;