import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Exceptional Aquatic Care Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Foscape specializes in world-class aquatic care, offering tailored services for residential and commercial aquariums, water gardens, fountains, swimming pools, spas, and lake management across South India.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="text-5xl font-bold text-blue-600 mb-2">150+</div>
            <p className="text-gray-600 font-medium">Happy Clients</p>
          </div>
          <div className="text-center p-6">
            <div className="text-5xl font-bold text-blue-600 mb-2">15</div>
            <p className="text-gray-600 font-medium">Years of Experience</p>
          </div>
          <div className="text-center p-6">
            <div className="text-blue-600 text-lg font-semibold mb-2">Trusted by Experts</div>
            <p className="text-gray-600 font-medium">Quality Assurance</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Aquatic Care Services
              </h3>
              <p className="text-gray-600 mb-6">
                Expert solutions for aquariums, water gardens, fountains, pools, and lake management in South India.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Residential and commercial aquarium solutions</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Custom water garden design and installation</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Professional fountain design and maintenance</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Pool management and spa services</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <img 
                src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1440,h=1577,fit=crop/mnlWbq8nWRC78GJ6/quality_restoration_20250423102408414-2-ALpeWebQ6bul7zGK.jpg"
                alt="Quality Restoration"
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;