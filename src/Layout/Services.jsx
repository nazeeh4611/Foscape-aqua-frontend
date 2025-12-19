import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, Shield, Clock, CheckCircle } from 'lucide-react';

const Services = () => {
  const navigate = useNavigate();
  const services = [
    {
      icon: <Package className="w-8 h-8" />,
      title: "Premium Quality",
      description: "Hand-selected aquatic life and equipment from trusted sources",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Fast Delivery",
      description: "Safe and secure shipping with temperature-controlled packaging",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Health Guarantee",
      description: "All products come with our comprehensive health guarantee",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Expert assistance available around the clock for all your needs",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span className="text-blue-600 font-medium">Our Services</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Comprehensive Solutions
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            For all your aquatic needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => navigate('/service')}
              className="group bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {service.title}
              </h3>
              <p className="text-slate-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;