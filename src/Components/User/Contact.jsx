// ==================== ContactPage.jsx ====================
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import Navbar from '../../Layout/Navbar';
import Footer from '../../Layout/Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'info@thefoscape.com',
      link: 'mailto:info@thefoscape.com'
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+91-854 748 3891',
      link: 'tel:+918547483891'
    },
    {
      icon: MapPin,
      title: 'Location',
      content: 'South India',
      link: null
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: 'Mon - Sat: 9:00 AM - 6:00 PM',
      link: null
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <Navbar />

      <div className="bg-gradient-to-br from-[#CFEAE3] to-[#99D5C8] min-h-screen pt-24">
        <div className="bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-8 h-8" />
              <h1 className="text-4xl font-bold">Contact Us</h1>
            </div>
            <p className="text-[#CFEAE3] text-lg max-w-2xl">
              Get in touch with us for aquatic care consultation and services
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-8 pb-12">
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{info.title}</h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      className="text-slate-600 hover:text-[#144E8C] transition-colors"
                    >
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-slate-600">{info.content}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#144E8C] focus:outline-none transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#144E8C] focus:outline-none transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#144E8C] focus:outline-none transition-colors"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#144E8C] focus:outline-none transition-colors"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#144E8C] focus:outline-none transition-colors resize-none"
                    placeholder="Tell us more about your project..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Why Choose Foscape?</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Expert Consultation</h3>
                      <p className="text-slate-600 text-sm">Get professional advice from experienced aquatic specialists</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Custom Solutions</h3>
                      <p className="text-slate-600 text-sm">Tailored designs that match your vision and requirements</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Quality Assurance</h3>
                      <p className="text-slate-600 text-sm">100% satisfaction guaranteed with premium materials</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Ongoing Support</h3>
                      <p className="text-slate-600 text-sm">Maintenance and support services for lasting results</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-2xl shadow-xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Request a Consultation</h3>
                <p className="text-[#CFEAE3] mb-6">
                  Schedule a free consultation with our aquatic care experts to discuss your project requirements.
                </p>
                <button className="w-full px-6 py-3 bg-white text-[#144E8C] rounded-xl font-semibold hover:shadow-2xl transition-all duration-300">
                  Book Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactPage;
