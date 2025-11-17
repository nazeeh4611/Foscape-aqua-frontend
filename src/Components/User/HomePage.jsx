import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Layout/Navbar'
import Hero from '../../Layout/Hero'
import Footer from '../../Layout/Footer'
import { Fish, Package, Truck, Shield, Clock, CheckCircle, ChevronDown, Star, ArrowRight } from 'lucide-react';
import axios from "axios";
import { baseurl } from '../../Base/Base';
import 'aos/dist/aos.css';
import AOS from 'aos';

const CategoryComponent = () => {
  const [activeCategory, setActiveCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseurl}user/category`);
  
      if (response.data.success) {
        setCategories(response.data.categories);
  
        if (response.data.categories.length > 0) {
          setActiveCategory(response.data.categories[0]._id);
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

  const getGradientColor = (index) => {
    const gradients = [
      'from-blue-500 to-cyan-500',
      'from-emerald-500 to-teal-500',
      'from-purple-500 to-pink-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-blue-500',
      'from-pink-500 to-rose-500',
      'from-teal-500 to-cyan-500',
      'from-amber-500 to-orange-500'
    ];
    return gradients[index % gradients.length];
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/${categoryId}/sub-category`);
  };

  const handleViewProducts = (categoryId) => {
    navigate(`/${categoryId}/sub-category`);
  };

  const handleExploreAll = () => {
    navigate('/categories');
  };

  const activeData = categories.find(cat => cat._id === activeCategory);

  if (loading) {
    return (
      <div className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-10 bg-slate-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-6 bg-slate-200 rounded w-1/2 mx-auto"></div>
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


const HowItWorks = () => {
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  const steps = [
    { number: "01", title: "Browse & Select", description: "Explore our wide range of products and choose what you need" },
    { number: "02", title: "Add to Cart", description: "Add your selected items to cart and proceed to checkout" },
    { number: "03", title: "Secure Payment", description: "Complete your purchase with our secure payment options" },
    { number: "04", title: "Fast Delivery", description: "Receive your order safely with our specialized shipping" }
  ];

  return (
    <div className="w-full py-16 bg-gradient-to-br from-[#144E8C] to-[#78CDD1]">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center mb-12" data-aos="fade-down">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Simple steps to get your aquatic products delivered
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative"
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              <div
                className="
                  bg-white/20 backdrop-blur-md 
                  rounded-2xl p-6 
                  border border-white/20 
                  shadow-lg shadow-black/10
                  transition-all duration-300
                  hover:bg-white/30 
                  hover:shadow-xl 
                  hover:-translate-y-2
                "
              >
                <div className="text-6xl font-bold text-white/30 mb-4">
                  {step.number}
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>

                <p className="text-slate-200">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div
                  className="
                    hidden lg:block absolute top-1/2 -right-3 
                    transform -translate-y-1/2
                    transition-all duration-300
                    group-hover:translate-x-2
                  "
                >
                  <ArrowRight className="w-6 h-6 text-white/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

 ;

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

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(`${baseurl}user/products/featured`);
  
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching featured products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-10 bg-slate-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-6 bg-slate-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Featured Products</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Check out our handpicked selection of premium products
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="flex gap-6 animate-scroll">
          {[...products, ...products].map((product, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 w-80"
              onClick={() => handleProductClick(product._id)}
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer">
                <div className="relative h-64 bg-gradient-to-br from-slate-100 to-blue-100">
                  <img 
                    src={product.images?.[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{product.name}</h3>
                  <p className="text-slate-600 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-slate-900">₹{product.price}</span>
                      {product.discount > 0 && (
                        <span className="ml-2 text-sm text-slate-500 line-through">
                          ₹{(product.price / (1 - product.discount / 100)).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar/>
      <Hero/>
      <CategoryComponent />
      <Services />
      <WhyChooseUs />
      <HowItWorks />
      <FAQ />
      <Testimonials />
      <FeaturedProducts />
      <Footer/>
    </div>
  );
}