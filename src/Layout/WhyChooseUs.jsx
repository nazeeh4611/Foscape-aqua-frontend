import React from 'react';
import { Fish, Package, Truck, Shield, Star } from 'lucide-react';

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: <Fish className="w-6 h-6" />,
      title: "Expert Knowledge",
      description: "Over 15 years of experience in aquatic life care"
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "Best Prices",
      description: "Competitive pricing without compromising quality"
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Wide Selection",
      description: "Extensive range of products for all your needs"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Customer First",
      description: "Your satisfaction is our top priority"
    }
  ];

  return (
    <div className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
            <Star className="w-4 h-4 text-blue-600" />
            <span className="text-blue-600 font-medium">Why Choose Us</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            The Preferred Choice
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover what makes us the preferred choice for aquatic enthusiasts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {reason.title}
              </h3>
              <p className="text-slate-600">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;