import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Layout/Navbar';
import Hero from '../../Layout/Hero';
import Footer from '../../Layout/Footer';
import { Fish, Package, Truck, Shield, Clock, CheckCircle, ChevronDown, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from "axios";
import { baseurl } from '../../Base/Base';
import OurProjects from '../../Layout/Projects';

const CategorySkeleton = () => (
  <div className="w-full py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <div className="h-10 bg-slate-200 rounded w-1/3 mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 bg-slate-200 rounded w-1/2 mx-auto mb-8 animate-pulse"></div>
      </div>
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-36 h-40 bg-slate-200 rounded-2xl animate-pulse"></div>
        ))}
      </div>
    </div>
  </div>
);

const ProductSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
        <div className="h-48 bg-slate-200"></div>
        <div className="p-5 space-y-3">
          <div className="h-6 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="h-10 bg-slate-200 rounded-xl mt-4"></div>
        </div>
      </div>
    ))}
  </div>
);

const CategoryComponent = ({ categories = [], loading = false }) => {
  const [activeCategory, setActiveCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]._id);
    }
  }, [categories, activeCategory]);

  const gradients = useMemo(() => [
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-blue-500',
    'from-pink-500 to-rose-500',
  ], []);

  const getGradientColor = (index) => gradients[index % gradients.length];

  const handleViewProducts = (categoryId) => {
    navigate(`/${categoryId}/sub-category`);
  };

  const activeData = useMemo(() => {
    return categories.find(cat => cat._id === activeCategory);
  }, [categories, activeCategory]);

  if (loading) return <CategorySkeleton />;
  if (categories.length === 0) return null;

  return (
    <div className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
            <Fish className="w-4 h-4 text-blue-600" />
            <span className="text-blue-600 font-medium">Our Categories</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
            Our Categories
          </h2>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore our premium selection of aquatic life and professional equipment
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => {
            const gradientColor = getGradientColor(index);
            const isActive = activeCategory === category._id;
            return (
              <button
                key={category._id}
                onClick={() => setActiveCategory(category._id)}
                className={`group flex flex-col items-center gap-3 p-6 w-36 rounded-2xl transition-all 
                ${isActive
                  ? "bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl border-2 border-blue-200"
                  : "bg-slate-50 hover:bg-white shadow-md hover:shadow-lg"
                }`}
              >
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? `bg-gradient-to-br ${gradientColor} shadow-lg` 
                    : 'bg-white'
                }`}>
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="w-10 h-10 object-contain" />
                  ) : (
                    <Fish className="w-10 h-10 text-blue-600" />
                  )}
                </div>

                <span className="text-slate-900 font-semibold">{category.name}</span>

                {isActive && (
                  <div className={`w-12 h-1.5 rounded-full bg-gradient-to-r ${gradientColor}`}></div>
                )}
              </button>
            );
          })}
        </div>

        {activeData && (
          <div className="w-full mx-auto bg-gradient-to-r from-[#144E8C] to-[#78CDD1] rounded-3xl p-6 md:p-12 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
              <div className={`w-40 h-40 md:w-48 md:h-48 rounded-2xl p-1.5 shadow-2xl ${
                getGradientColor(categories.findIndex(c => c._id === activeCategory))
              }`}>
                <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                  <img
                    src={activeData.image}
                    alt={activeData.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="flex-1 text-white">
                <h3 className="text-4xl font-bold mb-3">{activeData.name}</h3>
                <p className="text-lg mb-6">
                  {activeData.description || "Explore our quality products in this category"}
                </p>

                <button
                  onClick={() => handleViewProducts(activeData._id)}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
                >
                  View Products
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/categories')}
            className="inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition"
          >
            Explore All Categories
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const FeaturedProducts = ({ products = [], loading = false }) => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollLeft = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.scrollBy({ left: -344, behavior: 'smooth' });
  }, []);

  const scrollRight = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.scrollBy({ left: 344, behavior: 'smooth' });
  }, []);

  const handleScroll = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider || !products.length) return;
    const index = Math.round(slider.scrollLeft / 344);
    setCurrentIndex(Math.min(index, products.length - 1));
  }, [products.length]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.addEventListener('scroll', handleScroll, { passive: true });
    return () => slider.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (loading) {
    return (
      <div className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-8 bg-slate-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-10 bg-slate-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-slate-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-slate-200 rounded mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded mb-4"></div>
                  <div className="h-8 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!products.length) return null;

  const gradients = [
    "from-blue-600 to-cyan-600",
    "from-emerald-600 to-teal-600",
    "from-purple-600 to-pink-600",
    "from-orange-600 to-red-600",
    "from-indigo-600 to-blue-600",
    "from-rose-600 to-pink-600"
  ];

  const getGradientColor = (index) => gradients[index % gradients.length];

  return (
    <div className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-full mb-4 shadow-lg">
            <Star className="w-4 h-4" />
            <span className="font-medium">Featured Products</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Premium Selection</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Discover our handpicked collection of top-quality aquatic products</p>
        </div>

        <div className="relative">
          <button 
            onClick={scrollLeft} 
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-12 h-12 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-full shadow-xl flex items-center justify-center z-10 hover:scale-110 transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button 
            onClick={scrollRight} 
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-12 h-12 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-full shadow-xl flex items-center justify-center z-10 hover:scale-110 transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div 
            ref={sliderRef} 
            className="flex gap-6 overflow-x-auto pb-8 no-scrollbar snap-x snap-mandatory"
            style={{ scrollBehavior: 'smooth' }}
          >
            {products.map((product, index) => {
              const gradientColor = getGradientColor(index);
              return (
                <div 
                  key={product._id} 
                  onClick={() => navigate(`/product/${product._id}`)} 
                  className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group snap-start"
                >
                  <div className="relative h-48 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-10`} />
                    <img 
                      src={product.images?.[0] || "/placeholder.jpg"} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      loading="lazy"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-lg">
                          {product.discount}% OFF
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{product.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-slate-600 font-medium">4.8</span>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm line-clamp-2 mb-4">{product.description}</p>

                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-slate-900">₹{product.price}</span>
                          {product.discount > 0 && (
                            <span className="text-sm text-slate-400 line-through">
                              ₹{(product.price / (1 - product.discount / 100)).toFixed(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Package className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-500">Free shipping</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl font-semibold hover:scale-105 transition-all">
                        View Details
                      </button>
                      <button className="px-4 py-3 bg-gradient-to-br from-slate-100 to-white text-slate-900 rounded-xl font-semibold border border-slate-200 hover:shadow-lg transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center items-center gap-6 mt-8">
          <div className="flex gap-2">
            {products.slice(0, Math.min(6, products.length)).map((_, index) => (
              <button 
                key={index} 
                className={`w-3 h-3 rounded-full transition-all ${
                  currentIndex === index 
                    ? "bg-gradient-to-r from-blue-900 to-indigo-900 w-8" 
                    : "bg-slate-300 hover:bg-slate-400"
                }`} 
              />
            ))}
          </div>
          <div className="text-sm font-medium bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
            {currentIndex + 1} / {products.length}
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar { 
          -ms-overflow-style: none; 
          scrollbar-width: none; 
        }
        .no-scrollbar::-webkit-scrollbar { 
          display: none; 
        }
      `}</style>
    </div>
  );
};

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

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    {
      question: "What is your shipping policy?",
      answer: "We offer fast and secure shipping with temperature-controlled packaging to ensure your aquatic life arrives healthy and safe."
    },
    {
      question: "Do you offer a health guarantee?",
      answer: "Yes, all our products come with a comprehensive health guarantee. If there are any issues, please contact us within 24 hours of delivery."
    },
    {
      question: "How do I care for my new fish?",
      answer: "We provide detailed care instructions with every purchase. Our support team is also available 24/7 to answer any questions."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and secure online payment methods through Razorpay."
    },
    {
      question: "Can I return or exchange products?",
      answer: "Returns and exchanges are accepted within 7 days of delivery for equipment. Live aquatic life follows our health guarantee policy."
    }
  ];

  return (
    <div className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
            <span className="text-blue-600 font-medium">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find answers to common questions about our products and services
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-slate-100 last:border-b-0">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-100 transition-colors duration-300"
              >
                <span className="text-lg font-semibold text-slate-900">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-slate-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "John Smith",
      role: "Aquarium Enthusiast",
      content: "Excellent quality products and outstanding customer service. My fish are thriving!",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      role: "Pet Store Owner",
      content: "Reliable supplier with consistent quality. Highly recommend for both personal and business needs.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "First-time Buyer",
      content: "Great experience from start to finish. The team helped me set up my first aquarium perfectly.",
      rating: 5
    }
  ];

  return (
    <div className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
            <Star className="w-4 h-4 text-blue-600" />
            <span className="text-blue-600 font-medium">Testimonials</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Read what our satisfied customers have to say about their experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-slate-700 italic mb-6">"{testimonial.content}"</p>
              <div>
                <p className="font-bold text-slate-900">{testimonial.name}</p>
                <p className="text-slate-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [homeData, setHomeData] = useState({ 
    categories: [], 
    featuredProducts: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await axios.get(`${baseurl}user/batch-data?include=categories,featured`, {
          timeout: 8000
        });
        
        if (response.data && response.data.success) {
          setHomeData({
            categories: response.data.categories || [],
            featuredProducts: response.data.featuredProducts || []
          });
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="pt-24">
          <div className="h-96 bg-slate-200 animate-pulse"></div>
          <div className="max-w-7xl mx-auto px-4 py-12">
            <CategorySkeleton />
            <div className="my-12">
              <div className="h-10 bg-slate-200 rounded w-64 mx-auto mb-8 animate-pulse"></div>
              <ProductSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Unable to load data</h2>
            <p className="text-slate-600 mb-6">Please check your connection and try again.</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      
      <CategoryComponent 
        categories={homeData.categories} 
        loading={false}
      />
      
      <Services />
      
      <OurProjects />
      
      <WhyChooseUs />
      
      <Testimonials />
      
      <FAQ />
      
      <FeaturedProducts 
        products={homeData.featuredProducts} 
        loading={false}
      />
      
      <Footer />
    </div>
  );
}