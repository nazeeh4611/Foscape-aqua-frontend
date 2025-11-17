
import React from 'react';
import { Shield, FileText, RefreshCw, Truck, Sparkles } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

export const PolicyLayout = ({ 
  title, 
  description, 
  icon: Icon, 
  children,
  lastUpdated = "November 17, 2025" 
}) => {
  return (
    <>
      <Navbar />
      
      <div className="bg-gradient-to-br from-[#CFEAE3] to-[#99D5C8] min-h-screen pt-24">
        <div className="bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-8 h-8" />
              <h1 className="text-4xl font-bold">{title}</h1>
            </div>
            <p className="text-[#CFEAE3] text-lg max-w-2xl">
              {description}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-8 pb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-xl flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
            </div>
            <p className="text-sm text-slate-500 mb-8">Last Updated: {lastUpdated}</p>
            
            {children}
          </div>

          <div className="mt-8 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-2xl shadow-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
            <p className="text-[#CFEAE3] mb-6 max-w-2xl mx-auto">
              If you have any questions about our policies or need clarification on any terms, our team is here to help.
            </p>
            <button 
              onClick={() => window.location.href = '/contact'}
              className="px-8 py-3 bg-white text-[#144E8C] rounded-xl font-semibold hover:shadow-2xl transition-all duration-300"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

// Section Component
export const PolicySection = ({ title, children, className = "" }) => (
  <section className={`mb-8 ${className}`}>
    <h2 className="text-xl font-bold text-slate-800 mb-4">{title}</h2>
    {children}
  </section>
);

// Contact Information Component
export const ContactInfo = () => (
  <div className="mt-3 p-4 bg-slate-50 rounded-lg">
    <p><strong>Foscape Aquatics Living</strong></p>
    <p>Email: info@thefoscape.com</p>
    <p>Phone: +91-854 748 3891</p>
    <p>Alternate Phone: +91-95446 53891</p>
    <p>Address: Naduvilangadi,Tirur,Malappuram,Kerala</p>
  </div>
);