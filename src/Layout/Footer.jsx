import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Brand + Social */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Foscape</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Premier aquatic care services specializing in aquariums, pools, and water gardens.
              Transform your space with world-class aquatic solutions across South India.
            </p>

            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Facebook size={20} />
              </a>

              <a
                href="https://www.instagram.com/foscape_stories/"
                target="_blank"
                className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Instagram size={20} />
              </a>

              <a
                href="https://www.youtube.com/@foscape_stories"
                target="_blank"
                className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white">About</Link></li>
              <li><Link to="/service" className="text-gray-300 hover:text-white">Services</Link></li>
              <li><Link to="/gallery" className="text-gray-300 hover:text-white">Gallery</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Phone size={18} className="text-blue-400 mt-1" />
                <span className="text-gray-300">+91 9876543210</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={18} className="text-blue-400 mt-1" />
                <span className="text-gray-300">info@foscape.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-blue-400 mt-1" />
                <span className="text-gray-300">South India</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">

            <p className="text-gray-400 text-sm">
              © 2024 Foscape. All rights reserved.
            </p>

            {/* Policy Links */}
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </Link>

              <Link to="/terms-conditions" className="text-gray-400 hover:text-white text-sm">
                Terms & Conditions
              </Link>

              <Link to="/refund-policy" className="text-gray-400 hover:text-white text-sm">
                Refund Policy
              </Link>

              <Link to="/shipping-policy" className="text-gray-400 hover:text-white text-sm">
                Shipping Policy
              </Link>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
