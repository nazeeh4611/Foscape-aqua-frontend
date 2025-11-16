import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      title: "Residential Aquarium Solutions",
      description: "Custom aquariums designed for homes, enhancing beauty and tranquility in your space.",
      image: "/residential.png",
      gradient: "from-[#144E8C] to-[#78CDD1]"
    },
    {
      title: "Commercial Aquarium Services",
      description: "Professional aquarium installations and maintenance for businesses, creating stunning aquatic environments.",
      image: "/pond.png",
      gradient: "from-[#78C7A2] to-[#99D5C8]"
    },
    {
      title: "Water Garden Design",
      description: "Beautifully designed water gardens that bring nature's serenity to your residential or commercial property.",
      image: "/garden.png",
      gradient: "from-[#78CDD1] to-[#CFEAE3]"
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-[#CFEAE3] to-[#99D5C8]">
      <div className="max-w-7xl mx-auto px-4">

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Our Services</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Expert solutions for all your aquatic needs, from residential aquariums to commercial installations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border-2 border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className={`h-48 bg-gradient-to-br ${service.gradient} relative`}>
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-40 object-cover rounded-xl shadow-md"
                />
              </div>

              <div className="p-6 pt-20">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-4">{service.description}</p>

                <Link to="/contact">
            <button className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 group-hover:bg-gradient-to-r group-hover:from-[#144E8C] group-hover:to-[#78CDD1] text-slate-700 group-hover:text-white rounded-xl font-medium transition-all duration-300">
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Fountain Design</h3>
            <p className="text-slate-600 mb-6">
              Custom fountain installations that create stunning focal points for any space.
            </p>
            <Link to="/gallery">

            <button className="px-6 py-3 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              View Gallery
            </button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Pool Management</h3>
            <p className="text-slate-600 mb-6">
              Complete pool maintenance and management services for residential and commercial properties.
            </p>
            <Link to="/contact">
            <button className="px-6 py-3 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              Get Quote
            </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
