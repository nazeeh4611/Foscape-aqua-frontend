import React from 'react';
import { Award, Users, Target, Sparkles, TrendingUp, Heart } from 'lucide-react';
import Navbar from '../../Layout/Navbar';
import Footer from '../../Layout/Footer';

const AboutPage = () => {
  const stats = [
    { icon: Users, value: '150+', label: 'Happy Clients' },
    { icon: Award, value: '15', label: 'Years Experience' },
    { icon: Target, value: '200+', label: 'Projects Completed' },
    { icon: Sparkles, value: '100%', label: 'Quality Assurance' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Passion for Nature',
      description: 'We bring nature into your living spaces through the art of aquascaping and landscape design.'
    },
    {
      icon: Target,
      title: 'Excellence & Precision',
      description: 'Every project is executed with meticulous attention to detail and uncompromising quality standards.'
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'We combine traditional techniques with modern technology to create unique aquatic environments.'
    },
    {
      icon: Users,
      title: 'Customer Satisfaction',
      description: 'Your vision and satisfaction are at the heart of everything we do, ensuring exceptional results.'
    }
  ];

  return (
    <>
      <Navbar />

      <div className="bg-gradient-to-br from-[#CFEAE3] to-[#99D5C8] min-h-screen pt-24">
        <div className="bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">About Foscape</h1>
            <p className="text-[#CFEAE3] text-lg max-w-3xl">
              World-Class Aquatic Care Services - Specializing in aquariums, pools, and water gardens across South India
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-8 pb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-6">Our Story</h2>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  Foscape specializes in world-class aquatic care, offering tailored services for residential and commercial aquariums, water gardens, fountains, swimming pools, spas, and lake management across South India.
                </p>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  Our journey from enthusiastic hobbyists to professional aquascapers has been shaped by our passion for transforming spaces into tranquil natural sanctuaries. With expertise in designing and creating breathtaking aquascapes, koi ponds, Zen gardens, and paludariums, we focus on blending water, greenery, and harmony.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  At Foscape aquatics living, our mission is to craft bespoke aquatic and landscape designs that seamlessly integrate nature into everyday life.
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] opacity-10 rounded-2xl"></div>
                <img
                  src="/logo.png"
                  alt="Aquarium"
                  className="rounded-2xl shadow-lg relative z-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-800 mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">The Visionary</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] opacity-10 rounded-2xl"></div>
                <img
                  src='/shibin.avif'
                  alt="Founder"
                  className="rounded-2xl shadow-lg relative z-10"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Mr. Shibin Mundekat</h3>
                <p className="text-[#144E8C] font-semibold mb-6">Founder & CEO of Foscape Aqua</p>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Foscape aquatics living is my Ikigai, where my passion for nature and creativity comes to life through the art of aquascaping and landscape design.
                </p>
                <p className="text-slate-600 leading-relaxed mb-4">
                  My journey from an enthusiastic hobbyist to a professional aquascaper has been shaped by this purpose, guiding me in transforming spaces into tranquil natural sanctuaries.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  With expertise in designing and creating breathtaking aquascapes, koi ponds, Zen gardens, and paludariums, I focus on blending water, greenery, and harmony.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Values</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="flex gap-4 p-6 rounded-xl bg-gradient-to-br from-slate-50 to-white hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-xl flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">{value.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-2xl shadow-xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
            <p className="text-[#CFEAE3] text-lg mb-8 max-w-2xl mx-auto">
              Let us help you create the aquatic environment of your dreams with our expert design and maintenance services.
            </p>
            <button
              onClick={() => window.location.href = '/contact'}
              className="px-8 py-3 bg-white text-[#144E8C] rounded-xl font-semibold hover:shadow-2xl transition-all duration-300"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AboutPage;