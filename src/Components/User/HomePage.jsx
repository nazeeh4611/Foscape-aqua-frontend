import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Layout/Navbar';
import Hero from '../../Layout/Hero';
import Footer from '../../Layout/Footer';
import { Fish, Package, Truck, Shield, Clock, CheckCircle, ChevronDown, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from "axios";
import { baseurl } from '../../Base/Base';
import 'aos/dist/aos.css';
import AOS from 'aos';
import OurProjects from '../../Layout/Projects';

const CACHE_DURATION = 30 * 60 * 1000;

const getCachedData = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

const setCachedData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Cache failed:', error);
  }
};

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

const CategoryComponent = ({ categories = [] }) => {
  const [activeCategory, setActiveCategory] = useState('');
  const [categoryDetails, setCategoryDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]._id);
    }
  }, [categories, activeCategory]);

  useEffect(() => {
    if (!activeCategory) return;
    
    const loadCategoryDetails = async () => {
      if (categoryDetails[activeCategory]?.description) return;
      
      const cached = getCachedData(`category_detail_${activeCategory}`);
      if (cached) {
        setCategoryDetails(prev => ({ ...prev, [activeCategory]: cached }));
        return;
      }

      setLoadingDetails(true);
      try {
        const response = await axios.get(`${baseurl}user/category/${activeCategory}`, {
          timeout: 1500
        });
        if (response.data.success) {
          const details = response.data.data;
          setCategoryDetails(prev => ({ ...prev, [activeCategory]: details }));
          setCachedData(`category_detail_${activeCategory}`, details);
        }
      } catch (error) {
        console.error('Error loading category details:', error);
      } finally {
        setLoadingDetails(false);
      }
    };

    loadCategoryDetails();
  }, [activeCategory, categoryDetails]);

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
    const category = categories.find(cat => cat._id === activeCategory);
    const details = categoryDetails[activeCategory];
    return category ? { ...category, ...details } : null;
  }, [categories, activeCategory, categoryDetails]);

  if (categories.length === 0) return null;

  return (
    <div className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Categories</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore our premium selection of aquatic life and professional equipment
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {categories.map((category, index) => {
            const gradientColor = getGradientColor(index);
            const isActive = activeCategory === category._id;
            
            return (
              <button
                key={category._id}
                onClick={() => setActiveCategory(category._id)}
                className={`group relative flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-300 hover:scale-105 w-36 ${
                  isActive 
                    ? 'bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl border-2 border-blue-200' 
                    : 'bg-slate-50 hover:bg-white shadow-md hover:shadow-lg'
                }`}
              >
                <div className={`relative w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 ${
                  isActive 
                    ? `bg-gradient-to-br ${gradientColor} shadow-lg` 
                    : 'bg-white'
                }`}>
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-14 h-14 object-cover rounded-lg"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                <span className={`text-sm font-semibold text-center transition-colors duration-300 ${
                  isActive ? 'text-slate-900' : 'text-slate-700'
                }`}>
                  {category.name}
                </span>

                {isActive && (
                  <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-gradient-to-r ${gradientColor}`}></div>
                )}
              </button>
            );
          })}
        </div>

        {activeData && (
          <div className="bg-gradient-to-r from-[#144E8C] to-[#78CDD1] rounded-3xl shadow-2xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className={`w-56 h-56 rounded-2xl bg-gradient-to-br ${getGradientColor(categories.findIndex(c => c._id === activeCategory))} p-1.5 shadow-2xl`}>
                  <div className="w-full h-full bg-white rounded-xl overflow-hidden">
                    <img 
                      src={activeData.image} 
                      alt={activeData.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-4xl font-bold text-white mb-4">
                  {activeData.name}
                </h3>
                {loadingDetails ? (
                  <div className="h-6 bg-white/20 rounded w-3/4 mb-6 animate-pulse"></div>
                ) : (
                  <p className="text-slate-200 mb-6 leading-relaxed text-lg">
                    {activeData.description || 'Explore our quality products in this category'}
                  </p>
                )}
                <button 
                  onClick={() => handleViewProducts(activeData._id)}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <Package className="w-5 h-5" />
                  View Products
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center">
          <button 
            onClick={() => navigate('/categories')}
            className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-br from-slate-900 to-blue-900 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Fish className="w-5 h-5" />
            Explore All Categories
          </button>
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: <Fish className="w-8 h-8" />,
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
    <div className="w-full py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Services</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive solutions for all your aquatic needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              onClick={() => navigate('/service')}
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WhyChooseUs = () => {
  const reasons = [
    { icon: <CheckCircle className="w-6 h-6" />, title: "Expert Knowledge", description: "Over 15 years of experience in aquatic life care" },
    { icon: <CheckCircle className="w-6 h-6" />, title: "Best Prices", description: "Competitive pricing without compromising quality" },
    { icon: <CheckCircle className="w-6 h-6" />, title: "Wide Selection", description: "Extensive range of products for all your needs" },
    { icon: <CheckCircle className="w-6 h-6" />, title: "Customer First", description: "Your satisfaction is our top priority" }
  ];

  return (
    <div className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose Us</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover what makes us the preferred choice for aquatic enthusiasts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reasons.map((reason, index) => (
            <div key={index} className="flex gap-4 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl hover:shadow-lg transition-all duration-300">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                {reason.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{reason.title}</h3>
                <p className="text-slate-600">{reason.description}</p>
              </div>
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
    { question: "What is your shipping policy?", answer: "We offer fast and secure shipping with temperature-controlled packaging to ensure your aquatic life arrives healthy and safe." },
    { question: "Do you offer a health guarantee?", answer: "Yes, all our products come with a comprehensive health guarantee. If there are any issues, please contact us within 24 hours of delivery." },
    { question: "How do I care for my new fish?", answer: "We provide detailed care instructions with every purchase. Our support team is also available 24/7 to answer any questions." },
    { question: "What payment methods do you accept?", answer: "We accept all major credit cards, debit cards, and secure online payment methods through Razorpay." },
    { question: "Can I return or exchange products?", answer: "Returns and exchanges are accepted within 7 days of delivery for equipment. Live aquatic life follows our health guarantee policy." }
  ];

  return (
    <div className="w-full py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-slate-600">Find answers to common questions about our products and services</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-slate-50 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-100 transition-colors duration-300"
              >
                <span className="text-lg font-semibold text-slate-900">{faq.question}</span>
                <ChevronDown className={`w-6 h-6 text-slate-600 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
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
    { name: "John Smith", role: "Aquarium Enthusiast", content: "Excellent quality products and outstanding customer service. My fish are thriving!", rating: 5 },
    { name: "Sarah Johnson", role: "Pet Store Owner", content: "Reliable supplier with consistent quality. Highly recommend for both personal and business needs.", rating: 5 },
    { name: "Mike Chen", role: "First-time Buyer", content: "Great experience from start to finish. The team helped me set up my first aquarium perfectly.", rating: 5 }
  ];

  return (
    <div className="w-full py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">What Our Clients Say</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Read what our satisfied customers have to say about their experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">"{testimonial.content}"</p>
              <div>
                <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                <p className="text-sm text-slate-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FeaturedProducts = ({ products = [] }) => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, scrollLeft: 0 });
  const autoSlideIntervalRef = useRef(null);
  const isHoveringRef = useRef(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const AUTO_SLIDE_SPEED = 2.5;
  const AUTO_SLIDE_DELAY = 4000;

  const startAutoSlide = useCallback(() => {
    if (autoSlideIntervalRef.current) {
      cancelAnimationFrame(autoSlideIntervalRef.current);
    }

    const slide = () => {
      const slider = sliderRef.current;
      if (!slider || isDraggingRef.current || isHoveringRef.current) {
        autoSlideIntervalRef.current = requestAnimationFrame(slide);
        return;
      }

      slider.scrollLeft += AUTO_SLIDE_SPEED;

      if (slider.scrollLeft >= slider.scrollWidth / 2) {
        slider.scrollLeft = 0;
      }

      updateArrowVisibility();
      autoSlideIntervalRef.current = requestAnimationFrame(slide);
    };

    autoSlideIntervalRef.current = requestAnimationFrame(slide);
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
  }, []);

  const updateArrowVisibility = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const isAtStart = slider.scrollLeft <= 10;
    const isAtEnd = slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 10;

    setShowLeftArrow(!isAtStart);
    setShowRightArrow(!isAtEnd && slider.scrollWidth > slider.clientWidth);
  }, []);

  const handleDragStart = useCallback((e) => {
    const slider = sliderRef.current;
    if (!slider) return;

    isDraggingRef.current = true;
    const x = e.pageX || e.touches[0].pageX;
    startPosRef.current = { x, scrollLeft: slider.scrollLeft };
    
    slider.style.scrollBehavior = 'auto';
    slider.classList.add('grabbing');
  }, []);

  const handleDragMove = useCallback((e) => {
    if (!isDraggingRef.current) return;

    const slider = sliderRef.current;
    if (!slider) return;

    e.preventDefault();
    const x = e.pageX || e.touches[0].pageX;
    const walk = (x - startPosRef.current.x);
    slider.scrollLeft = startPosRef.current.scrollLeft - walk;

    updateArrowVisibility();
  }, [updateArrowVisibility]);

  const handleDragEnd = useCallback(() => {
    isDraggingRef.current = false;
    const slider = sliderRef.current;
    if (!slider) return;

    slider.style.scrollBehavior = 'smooth';
    slider.classList.remove('grabbing');
    
    setTimeout(startAutoSlide, AUTO_SLIDE_DELAY);
  }, [startAutoSlide]);

  const scrollLeft = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const cardWidth = 320;
    slider.scrollLeft -= cardWidth;
    updateArrowVisibility();
    
    setTimeout(startAutoSlide, AUTO_SLIDE_DELAY);
  }, [startAutoSlide, updateArrowVisibility]);

  const scrollRight = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const cardWidth = 320;
    slider.scrollLeft += cardWidth;
    updateArrowVisibility();
    
    setTimeout(startAutoSlide, AUTO_SLIDE_DELAY);
  }, [startAutoSlide, updateArrowVisibility]);

  useEffect(() => {
    const slider = sliderRef.current;
    const container = containerRef.current;
    if (!slider || !container) return;

    slider.addEventListener('mousedown', handleDragStart);
    slider.addEventListener('mouseenter', handleMouseEnter);
    slider.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);

    slider.addEventListener('touchstart', handleDragStart, { passive: false });
    slider.addEventListener('touchmove', handleDragMove, { passive: false });
    slider.addEventListener('touchend', handleDragEnd);
    slider.addEventListener('touchcancel', handleDragEnd);

    slider.addEventListener('scroll', updateArrowVisibility);

    updateArrowVisibility();

    return () => {
      slider.removeEventListener('mousedown', handleDragStart);
      slider.removeEventListener('mouseenter', handleMouseEnter);
      slider.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseleave', handleMouseLeave);
      
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);

      slider.removeEventListener('touchstart', handleDragStart);
      slider.removeEventListener('touchmove', handleDragMove);
      slider.removeEventListener('touchend', handleDragEnd);
      slider.removeEventListener('touchcancel', handleDragEnd);

      slider.removeEventListener('scroll', updateArrowVisibility);

      if (autoSlideIntervalRef.current) {
        cancelAnimationFrame(autoSlideIntervalRef.current);
      }
    };
  }, [handleDragStart, handleDragMove, handleDragEnd, handleMouseEnter, handleMouseLeave, updateArrowVisibility]);

  useEffect(() => {
    if (products.length > 0) {
      const timer = setTimeout(startAutoSlide, 1000);
      return () => {
        clearTimeout(timer);
        if (autoSlideIntervalRef.current) {
          cancelAnimationFrame(autoSlideIntervalRef.current);
        }
      };
    }
  }, [products.length, startAutoSlide]);

  const handleClick = useCallback((id) => {
    if (!isDraggingRef.current) {
      navigate(`/product/${id}`);
    }
  }, [navigate]);

  if (products.length === 0) return null;

  const duplicatedProducts = [...products, ...products, ...products];

  return (
    <div className="w-full py-14 bg-white overflow-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center relative">
        <h2 className="text-4xl font-bold text-slate-900 mb-2">Featured Products</h2>
        <p className="text-lg text-slate-600">Check out our premium selection</p>

        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white border border-slate-200 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
        )}

        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white border border-slate-200 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-slate-700" />
          </button>
        )}
      </div>

      <div className="relative">
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto no-scrollbar select-none cursor-grab active:cursor-grabbing"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            padding: '0 1rem'
          }}
        >
          {duplicatedProducts.map((product, index) => (
            <div
              key={`${product._id}-${index}`}
              className="flex-shrink-0 w-80"
              onClick={() => handleClick(product._id)}
            >
              <div className="bg-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-2xl overflow-hidden">
                <div className="relative h-64 bg-slate-100 overflow-hidden">
                  <img
                    src={product.images?.[0]}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                  />
                  {product.discount > 0 && (
                    <span className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 text-sm rounded-full font-semibold shadow-lg">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold truncate mb-2 text-slate-900">{product.name}</h3>
                  <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-slate-900">₹{product.price}</span>
                      {product.discount > 0 && (
                        <span className="ml-2 text-sm line-through text-slate-400">
                          ₹{(product.price / (1 - product.discount / 100)).toFixed(0)}
                        </span>
                      )}
                    </div>
                    <button className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-5"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-5"></div>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {products.slice(0, Math.min(5, products.length)).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const slider = sliderRef.current;
              if (slider) {
                const cardWidth = 320;
                const gap = 24;
                slider.scrollLeft = index * (cardWidth + gap);
                updateArrowVisibility();
                setTimeout(startAutoSlide, AUTO_SLIDE_DELAY);
              }
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === 0 ? 'bg-blue-600 w-6' : 'bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
          height: 0;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          scroll-behavior: smooth;
        }
        .grabbing {
          cursor: grabbing !important;
          user-select: none;
        }
        .grabbing * {
          cursor: grabbing !important;
        }
      `}</style>
    </div>
  );
};

export default function HomePage() {
  const [homeData, setHomeData] = useState({
    categories: [],
    featuredProducts: []
  });
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [showPortfolioSkeleton, setShowPortfolioSkeleton] = useState(true);

  useEffect(() => {
    const fetchEssentialData = async () => {
      const cached = getCachedData('aquatic_home_essential');
      
      if (cached) {
        setHomeData(cached);
        setInitialLoadComplete(true);
        
        setTimeout(async () => {
          try {
            const { data } = await axios.get(`${baseurl}user/home-data`, {
              timeout: 2000
            });
            if (data.success) {
              setHomeData(data.data);
              setCachedData('aquatic_home_essential', data.data);
            }
          } catch (err) {
          }
        }, 0);
        
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${baseurl}user/home-data`, {
          timeout: 1500
        });
        
        if (response.data.success) {
          setHomeData(response.data.data);
          setCachedData('aquatic_home_essential', response.data.data);
          setInitialLoadComplete(true);
        }
      } catch (error) {
        setHomeData({ categories: [], featuredProducts: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchEssentialData();

    if (performance.mark) {
      performance.mark('homepage_start');
    }
  }, []);

  useEffect(() => {
    if (!initialLoadComplete) return;
  
    const fetchPortfolios = async () => {
      const cached = getCachedData('aquatic_portfolios');
      
      // INSTANT LOAD: Show skeleton immediately
      setShowPortfolioSkeleton(false);
      
      if (cached) {
        setPortfolios(cached);
        return;
      }
  
      try {
        const response = await axios.get(`${baseurl}user/featured-portfolios`, {
          timeout: 1000, // Reduced timeout
          headers: {
            'X-Priority': 'low'
          }
        });
        
        if (response.data.success) {
          setPortfolios(response.data.portfolios || []);
          setCachedData('aquatic_portfolios', response.data.portfolios);
        }
      } catch (error) {
        setPortfolios([]);
      }
    };
  
    fetchPortfolios();
  }, [initialLoadComplete]);

  useEffect(() => {
    AOS.init({ 
      duration: 600, 
      once: true, 
      offset: 50, 
      disable: 'mobile' 
    });
  }, []);

  useEffect(() => {
    if (homeData.categories[0]?.image) {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = homeData.categories[0].image;
      document.head.appendChild(preloadLink);
      
      return () => {
        if (preloadLink.parentNode) {
          preloadLink.parentNode.removeChild(preloadLink);
        }
      };
    }
  }, [homeData.categories]);
  useEffect(() => {
    if (portfolios.length > 0) {
      const preloadImages = () => {
        portfolios.slice(0, 2).forEach(portfolio => {
          if (portfolio.mediaUrls?.[0]) {
            const img = new Image();
            img.src = portfolio.mediaUrls[0];
            img.loading = 'eager';
          }
        });
      };
      
      const timer = setTimeout(preloadImages, 1000);
      return () => clearTimeout(timer);
    }
  }, [portfolios]);

  return (
    <div className="bg-white">
      <Navbar />
      <Hero />

      <section data-aos="fade-up">
        {loading && homeData.categories.length === 0 ? (
          <CategorySkeleton />
        ) : (
          <CategoryComponent categories={homeData.categories} />
        )}
      </section>

      <section data-aos="fade-up">
        <Services />
      </section>

      <section data-aos="fade-up">
        <WhyChooseUs />
      </section>

      {showPortfolioSkeleton ? (
  <div className="w-full py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <div className="h-10 bg-slate-200 rounded w-1/3 mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 bg-slate-200 rounded w-1/2 mx-auto mb-8 animate-pulse"></div>
      </div>
      <div className="h-[400px] bg-slate-200 rounded-3xl animate-pulse"></div>
    </div>
  </div>
) : portfolios.length > 0 ? (
  <section data-aos="fade-up">
    <OurProjects portfolios={portfolios} />
  </section>
) : null}

      <section data-aos="fade-up">
        <FAQ />
      </section>

      <section data-aos="fade-up">
        <Testimonials />
      </section>

      <section data-aos="fade-up">
        <FeaturedProducts products={homeData.featuredProducts} />
      </section>

      <Footer />
    </div>
  );
}