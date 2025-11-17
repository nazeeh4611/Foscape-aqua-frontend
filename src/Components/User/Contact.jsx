import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Calendar } from 'lucide-react';
import Navbar from '../../Layout/Navbar';
import Footer from '../../Layout/Footer';
import { baseurl } from '../../Base/Base';
import axios from 'axios';
import { useToast } from '../../Context.js/ToastContext';


const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);
  const showToast = useToast();


  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${baseurl}user/getuser`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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
      icon: Phone,
      title: 'Alternate Phone',
      content: '+91-95446 53891',
      link: 'tel:+919544653891'
    },
    {
      icon: MapPin,
      title: 'Address',
      content: ' FOSCAPE, 4/46B, juma masjid, PV BUILDING, V HAMZA ROAD, near NADUVILANGADI, NADUVILANGADI, Tirur, Kerala 676107',
      link: 'https://www.google.com/maps?rlz=1C5CHFA_enIN1069IN1070&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRg8MgYIAhBFGDwyBggDEEUYPNIBBzI3NWowajeoAgCwAgA&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KV-co5cesac7MTYuayNgHIm1&daddr=FOSCAPE,+4/46B,+juma+masjid,+PV+BUILDING,+V+HAMZA+ROAD,+near+NADUVILANGADI,+NADUVILANGADI,+Tirur,+Kerala+676107'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${baseurl}user/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast.success('Thank you for your message! We will get back to you soon.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      showToast.error('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(userData,"is here")

  const handleBookConsultation = () => {
    const phoneNumber = '918547483891';
    const userName = userData.user?.name || userData.user.name || 'Not provided';
    const userEmail = userData.user?.email || userData.user.email || 'Not provided';
    const userPhone = userData.user?.phone || userData.user.phone || 'Not provided';
    
    const message = `Hello Foscape Team,\n\nI would like to request a consultation for aquatic care services.\n\nMy Details:\nName: ${userName}\nEmail: ${userEmail}\nPhone: ${userPhone}\n\nPlease contact me to schedule an appointment.`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
                  className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => info.link && window.open(info.link, info.link.startsWith('http') ? '_blank' : '_self')}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{info.title}</h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      className="text-slate-600 hover:text-[#144E8C] transition-colors block"
                      target={info.link.startsWith('http') ? '_blank' : '_self'}
                      rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
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

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Our Location</h2>
                <p className="text-slate-600">Visit us at our office in Tirur, Kerala</p>
              </div>
              <div className="h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.842286279744!2d75.9213873!3d10.9082563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7af99cf22a54d%3A0x1f51090b1b88c0a4!2sFOSCAPE!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Foscape Location"
                  className="rounded-b-2xl"
                ></iframe>
              </div>
              <div className="p-6 bg-slate-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-slate-800">FOSCAPE</h3>
                    <p className="text-slate-600 text-sm">
                      4/46B, Juma Masjid, PV Building,<br />
                      V Hamza Road, Near Naduvilangadi,<br />
                      Tirur, Kerala 676107
                    </p>
                  </div>
                  <a
                    href="https://www.google.com/maps/dir//FOSCAPE,+4%2F46B,+juma+masjid,+PV+BUILDING,+V+HAMZA+ROAD,+near+NADUVILANGADI,+NADUVILANGADI,+Tirur,+Kerala+676107"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-sm"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>

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
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
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
              <button 
                onClick={handleBookConsultation}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#144E8C] rounded-xl font-semibold hover:shadow-2xl transition-all duration-300"
              >
                <Calendar className="w-5 h-5" />
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactPage;