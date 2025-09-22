import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="pt-16 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              World-Class
              <span className="text-blue-600 block">Aquatic Care</span>
              Services
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Specializing in aquariums, pools, and water gardens. Transform your space with stunning aquatic environments.
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-gray-900 mb-2">Aquarium Services</h3>
                <p className="text-sm text-gray-600">Expert installation and maintenance for stunning aquariums</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-gray-900 mb-2">Water Gardens</h3>
                <p className="text-sm text-gray-600">Transform your space with vibrant water features</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Get Started
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors">
                Learn More
              </button>
            </div>
          </div>

          <div className="relative">
            <img 
              src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=569,fit=crop/mnlWbq8nWRC78GJ6/screenshot-2025-08-31-091858-mePgeQzwPwCyJOJw.png"
              alt="Aquarium Setup"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;