import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Layout/Navbar'
import Hero from '../../Layout/Hero'
import Footer from '../../Layout/Footer'
import { Fish, Package, Truck, Shield, Clock, CheckCircle, ChevronDown, Star, ArrowRight } from 'lucide-react';
import axios from "axios";
import { baseurl } from '../../Base/Base';
import 'aos/dist/aos.css';
import AOS from 'aos';
import OurProjects from '../../Layout/Projects';

// ========== CACHE UTILITY ==========
const CACHE_KEY = 'aquatic_categories_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedCategories = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

const setCachedCategories = (categories) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: categories,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Cache failed:', error);
  }
};

// ========== OPTIMIZED CATEGORY COMPONENT ==========
const CategoryComponent = () => {
  const [activeCategory, setActiveCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      // Check cache first
      const cached = getCachedCategories();
      if (cached) {
        setCategories(cached);
        if (cached.length > 0) {
          setActiveCategory(cached[0]._id);
        }
        setLoading(false);
        return;
      }

      // Fetch from API
      const response = await axios.get(`${baseurl}user/category`);
  
      if (response.data.success) {
        const fetchedCategories = response.data.categories;
        setCategories(fetchedCategories);
        setCachedCategories(fetchedCategories); // Cache the result
  
        if (fetchedCategories.length > 0) {
          setActiveCategory(fetchedCategories[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const gradients = useMemo(() => [
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-blue-500',
    'from-pink-500 to-rose-500',
    'from-teal-500 to-cyan-500',
    'from-amber-500 to-orange-500'
  ], []);

  const getGradientColor = (index) => gradients[index % gradients.length];

  const handleViewProducts = (categoryId) => {
    navigate(`/${categoryId}/sub-category`);
  };

  const handleExploreAll = () => {
    navigate('/categories');
  };

  const activeData = useMemo(
    () => categories.find(cat => cat._id === activeCategory),
    [categories, activeCategory]
  );

  if (loading) {
    return (
      <div className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-10 bg-slate-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-6 bg-slate-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-36 h-40 bg-slate-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <p className="text-slate-200 mb-6 leading-relaxed text-lg">
                  {activeData.description}
                </p>
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
            onClick={handleExploreAll}
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

// ========== SERVICES COMPONENT (No changes needed) ==========
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
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Expert Knowledge",
      description: "Over 15 years of experience in aquatic life care"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Best Prices",
      description: "Competitive pricing without compromising quality"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Wide Selection",
      description: "Extensive range of products for all your needs"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Customer First",
      description: "Your satisfaction is our top priority"
    }
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
    <div className="w-full py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-slate-600">
            Find answers to common questions about our products and services
          </p>
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

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const animationRef = useRef(null);

  const speed = 1.2;

  const fetchFeaturedProducts = async () => {
    try {
      const res = await axios.get(`${baseurl}user/products/featured`);
      if (res.data.success) setProducts(res.data.products);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || products.length === 0) return;

    const animate = () => {
      if (!isDraggingRef.current) {
        slider.scrollLeft += speed;

        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0;
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [products.length, speed]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const start = (e) => {
      isDraggingRef.current = true;
      slider.style.scrollBehavior = 'auto';
      slider.classList.add("grabbing");
      startXRef.current = e.pageX || e.touches?.[0].pageX;
      scrollLeftRef.current = slider.scrollLeft;
    };

    const end = () => {
      isDraggingRef.current = false;
      slider.classList.remove("grabbing");
    };

    const move = (e) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      const x = e.pageX || e.touches?.[0].pageX;
      const walk = (x - startXRef.current) * 2.5;
      slider.scrollLeft = scrollLeftRef.current - walk;
    };

    slider.addEventListener("mousedown", start, { passive: true });
    slider.addEventListener("touchstart", start, { passive: true });
    slider.addEventListener("mousemove", move, { passive: false });
    slider.addEventListener("touchmove", move, { passive: false });
    slider.addEventListener("mouseup", end, { passive: true });
    slider.addEventListener("mouseleave", end, { passive: true });
    slider.addEventListener("touchend", end, { passive: true });

    return () => {
      slider.removeEventListener("mousedown", start);
      slider.removeEventListener("touchstart", start);
      slider.removeEventListener("mousemove", move);
      slider.removeEventListener("touchmove", move);
      slider.removeEventListener("mouseup", end);
      slider.removeEventListener("mouseleave", end);
      slider.removeEventListener("touchend", end);
    };
  }, []);

  const handleClick = (id) => {
    if (!isDraggingRef.current) {
      navigate(`/product/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-16 flex justify-center">
        <div className="animate-pulse text-center">
          <div className="h-10 bg-slate-300 w-40 mx-auto mb-4 rounded"></div>
          <div className="h-6 bg-slate-200 w-60 mx-auto rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 md:py-14 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-6 md:mb-10 text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">
          Featured Products
        </h2>
        <p className="text-base md:text-lg text-slate-600">
          Check out our premium selection
        </p>
      </div>

      <div
        ref={sliderRef}
        className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none'
        }}
      >
        {[...products, ...products, ...products].map((product, index) => (
          <div
            key={`${product._id}-${index}`}
            className="flex-shrink-0 w-60 sm:w-64 md:w-72 lg:w-80"
            onClick={() => handleClick(product._id)}
          >
            <div className="bg-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl md:rounded-2xl overflow-hidden">
              <div className="relative h-48 sm:h-56 md:h-64 bg-slate-200">
                <img
                  src={product.images?.[0]}
                  className="w-full h-full object-cover"
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />
                {product.discount > 0 && (
                  <span className="absolute top-2 right-2 md:top-3 md:right-3 bg-red-600 text-white px-2 py-1 md:px-3 text-xs md:text-sm rounded-full font-semibold">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
              <div className="p-4 md:p-5">
                <h3 className="text-lg md:text-xl font-bold truncate mb-1">
                  {product.name}
                </h3>
                <p className="text-sm md:text-base text-slate-600 line-clamp-2 mb-3">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl md:text-2xl font-bold text-slate-900">
                      ₹{product.price}
                    </span>
                    {product.discount > 0 && (
                      <span className="ml-2 text-xs md:text-sm line-through text-slate-400">
                        ₹{(product.price / (1 - product.discount / 100)).toFixed(0)}
                      </span>
                    )}
                  </div>
                  <button className="px-4 py-2 md:px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base rounded-lg transition-colors">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { 
          display: none; 
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .grabbing { 
          cursor: grabbing !important; 
        }
        .grabbing * {
          cursor: grabbing !important;
        }
      `}</style>
    </div>
  );
};

export default function HomePage() {
  useEffect(() => {
    AOS.init({ 
      duration: 600, 
      once: true,
      offset: 50,
      disable: 'mobile' // Disable on mobile for better performance
    });
  }, []);

  return (
    <div className="bg-white">
      <Navbar />
      <Hero />

      <section data-aos="fade-up">
        <CategoryComponent />
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50" data-aos="fade-up">
        <Services />
      </section>

      <section className="py-20 bg-white" data-aos="fade-up">
        <WhyChooseUs />
      </section>

      <section className="py-20" data-aos="fade-up">
        <OurProjects />
      </section>

      <section className="py-20 bg-white" data-aos="fade-up">
        <FAQ />
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50" data-aos="fade-up">
        <Testimonials />
      </section>

      <section className="py-20 bg-white" data-aos="fade-up">
        <FeaturedProducts />
      </section>

      <Footer />
    </div>
  );
}