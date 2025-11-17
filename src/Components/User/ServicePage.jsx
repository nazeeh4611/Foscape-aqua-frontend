
// ==================== ServicesPage.jsx ====================
import React from 'react';
import { Fish, Droplets, Sparkles, Waves, TreePine, Building2, Home, CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from '../../Layout/Navbar';
import Footer from '../../Layout/Footer';

const ServicesPage = () => {
  const services = [
    {
      icon: Fish,
      title: 'Residential Aquarium Solutions',
      description: 'Custom aquariums designed for homes, enhancing beauty and tranquility in your space.',
      features: [
        'Custom design and installation',
        'Freshwater and saltwater setups',
        'Regular maintenance services',
        'Fish health monitoring',
        'Equipment upgrades'
      ],
      gradient: 'from-[#144E8C] to-[#78CDD1]'
    },
    {
      icon: Building2,
      title: 'Commercial Aquarium Services',
      description: 'Professional aquarium installations and maintenance for businesses, creating stunning aquatic environments.',
      features: [
        'Office and lobby installations',
        'Restaurant and hotel aquariums',
        'Commercial maintenance plans',
        'Emergency support services',
        'Custom branding solutions'
      ],
      gradient: 'from-[#78C7A2] to-[#99D5C8]'
    },
    {
      icon: TreePine,
      title: 'Water Garden Design',
      description: 'Beautifully designed water gardens that bring nature\'s serenity to your residential or commercial property.',
      features: [
        'Koi pond installations',
        'Water feature design',
        'Plant selection and care',
        'Natural filtration systems',
        'Seasonal maintenance'
      ],
      gradient: 'from-[#78CDD1] to-[#CFEAE3]'
    },
    {
      icon: Sparkles,
      title: 'Fountain Design & Installation',
      description: 'Creating elegant and functional fountain systems that add beauty and ambiance to any space.',
      features: [
        'Indoor and outdoor fountains',
        'Custom water features',
        'LED lighting integration',
        'Energy-efficient pumps',
        'Maintenance and repairs'
      ],
      gradient: 'from-[#144E8C] to-[#78C7A2]'
    },
    {
      icon: Waves,
      title: 'Swimming Pool Management',
      description: 'Complete pool care services ensuring crystal clear water and optimal performance year-round.',
      features: [
        'Water chemistry balancing',
        'Equipment maintenance',
        'Cleaning and filtration',
        'Pool renovation services',
        'Automated system setup'
      ],
      gradient: 'from-[#99D5C8] to-[#78CDD1]'
    },
    {
      icon: Droplets,
      title: 'Lake Management Services',
      description: 'Comprehensive lake and large water body management for residential and commercial properties.',
      features: [
        'Water quality testing',
        'Algae control solutions',
        'Ecosystem balancing',
        'Aeration systems',
        'Wildlife management'
      ],
      gradient: 'from-[#78C7A2] to-[#CFEAE3]'
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Consultation',
      description: 'We discuss your vision, assess the space, and understand your requirements.'
    },
    {
      step: '02',
      title: 'Design',
      description: 'Our team creates a custom design tailored to your specific needs and preferences.'
    },
    {
      step: '03',
      title: 'Installation',
      description: 'Expert installation with attention to detail and quality craftsmanship.'
    },
    {
      step: '04',
      title: 'Maintenance',
      description: 'Ongoing support and maintenance to ensure lasting beauty and functionality.'
    }
  ];

  return (
    <>
      <Navbar />

      <div className="bg-gradient-to-br from-[#CFEAE3] to-[#99D5C8] min-h-screen pt-24">
        <div className="bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8" />
              <h1 className="text-4xl font-bold">Our Services</h1>
            </div>
            <p className="text-[#CFEAE3] text-lg max-w-2xl">
              Expert solutions for aquariums, water gardens, fountains, pools, and lake management in South India
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-8 pb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Comprehensive Aquatic Care</h2>
              <p className="text-slate-600 max-w-3xl mx-auto">
                From residential aquariums to commercial water features, we provide end-to-end solutions for all your aquatic needs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={index}
                    className="bg-white border-2 border-slate-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className={`bg-gradient-to-br ${service.gradient} p-6`}>
                      <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4">
                        <Icon className="w-8 h-8 text-[#144E8C]" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                    </div>

                    <div className="p-6">
                      <p className="text-slate-600 mb-4 leading-relaxed">
                        {service.description}
                      </p>

                      <div className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-[#78C7A2] flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-600">{feature}</span>
                          </div>
                        ))}
                      </div>

                     
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Process</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((item, index) => (
                <div key={index} className="text-center relative">
                  <div className="mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">{item.step}</span>
                    </div>
                    {index < process.length - 1 && (
                      <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] opacity-20"></div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Why Choose Our Services?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">15+ Years Experience</h3>
                    <p className="text-slate-600 text-sm">Trusted expertise in aquatic care and design</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Quality Materials</h3>
                    <p className="text-slate-600 text-sm">Premium products for lasting results</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Custom Solutions</h3>
                    <p className="text-slate-600 text-sm">Tailored designs for your unique space</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Ongoing Support</h3>
                    <p className="text-slate-600 text-sm">Maintenance and care services included</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-2xl shadow-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-[#CFEAE3] mb-6 leading-relaxed">
                Transform your space with our expert aquatic care services. Contact us today for a free consultation and let us bring your vision to life.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/contact'}
                  className="w-full px-6 py-3 bg-white text-[#144E8C] rounded-xl font-semibold hover:shadow-2xl transition-all duration-300"
                >
                  Request Consultation
                </button>
                <button className="w-full px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-xl font-semibold transition-all duration-300">
                  View Our Projects
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Need a Custom Solution?</h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Every project is unique. If you have specific requirements or a custom project in mind, we'd love to hear from you.
            </p>
            <button
              onClick={() => window.location.href = '/contact'}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Discuss Your Project
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ServicesPage;