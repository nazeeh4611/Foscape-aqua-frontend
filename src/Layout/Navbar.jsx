import React, { useState } from "react";
import AuthModal from "../Components/Reuse/AuthModal.jsx";
import OtpModal from "../Components/Reuse/OtpModal.jsx";
import logo from "../assets/logo.png";
import axios from "axios";
import { baseurl } from "../Base/Base.js";
import { useNavigate, Link } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ClientId } from "../Base/Base.js";
import { useAuth } from "../Context.js/Auth.jsx";

const Navbar = () => {
  const { user, isLogged, checkAuthStatus, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  const handleRegisterSuccess = (email) => {
    setRegisteredEmail(email);
    setShowOtpModal(true);
  };

  const handleLoginSuccess = async () => {
    await checkAuthStatus();
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${baseurl}User/logout`, {}, { withCredentials: true });
      logout(); 
      setShowProfileDropdown(false);
    } catch {}
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  const handleOtpModalClose = () => {
    setShowOtpModal(false);
    setRegisteredEmail("");
  };

  return (
    <GoogleOAuthProvider clientId={ClientId}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
              <div className="flex items-center space-x-3">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-28 md:h-36 lg:h-32 w-auto object-contain hover:scale-105 transition-transform duration-200"
                />
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="relative group py-2">
                <span className="font-medium text-gray-700 group-hover:text-teal-600 transition-colors duration-300">
                  Home
                </span>
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/property" className="relative group py-2">
                <span className="font-medium text-gray-700 group-hover:text-teal-600 transition-colors duration-300">
                  Properties
                </span>
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/about" className="relative group py-2">
                <span className="font-medium text-gray-700 group-hover:text-teal-600 transition-colors duration-300">
                  About
                </span>
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/contact" className="relative group py-2">
                <span className="font-medium text-gray-700 group-hover:text-teal-600 transition-colors duration-300">
                  Contact
                </span>
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                {!isLogged ? (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-600 hover:to-cyan-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <span>Sign In</span>
                  </button>
                ) : (
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-600 hover:to-cyan-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold text-teal-600">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden lg:block">{user?.name}</span>
                    </button>

                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-teal-100">
                        <div className="px-4 py-2 border-b border-teal-100">
                          <p className="text-sm font-semibold text-gray-700">
                            {user?.name}
                          </p>
                          <p className="text-xs text-teal-600">
                            {user?.email}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-teal-600 transition-colors"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:text-teal-600 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {isLogged && (
                <div className="md:hidden relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="inline-flex items-center justify-center p-2 rounded-full font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-600 hover:to-cyan-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold text-teal-600">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-teal-100">
                      <div className="px-4 py-2 border-b border-teal-100">
                        <p className="text-sm font-semibold text-gray-700">
                          {user?.name}
                        </p>
                        <p className="text-xs text-teal-600">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-teal-600 transition-colors"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:text-teal-600 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <span
                  className={`block w-6 h-0.5 bg-teal-600 transition-all duration-300 ${
                    isMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-teal-600 transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-teal-600 transition-all duration-300 ${
                    isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          <div
            className={`md:hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}
          >
            <nav className="px-4 py-4 space-y-4">
              <Link
                to="/"
                className="block py-2 text-lg font-medium text-gray-700 hover:text-teal-600 transition-colors duration-300"
                onClick={handleMenuItemClick}
              >
                Home
              </Link>
              <Link
                to="/property"
                className="block py-2 text-lg font-medium text-gray-700 hover:text-teal-600 transition-colors duration-300"
                onClick={handleMenuItemClick}
              >
                Properties
              </Link>
              <Link
                to="/about"
                className="block py-2 text-lg font-medium text-gray-700 hover:text-teal-600 transition-colors duration-300"
                onClick={handleMenuItemClick}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block py-2 text-lg font-medium text-gray-700 hover:text-teal-600 transition-colors duration-300"
                onClick={handleMenuItemClick}
              >
                Contact
              </Link>

              <div className="pt-4 border-t border-teal-100">
                {!isLogged ? (
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      handleMenuItemClick();
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-600 hover:to-cyan-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <span>Sign In</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="px-4 py-3 bg-white rounded-lg border border-teal-100">
                      <p className="text-sm font-semibold text-gray-700">
                        {user?.name}
                      </p>
                      <p className="text-xs text-teal-600">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="block py-2 text-lg font-medium text-gray-700 hover:text-teal-600 transition-colors duration-300"
                      onClick={handleMenuItemClick}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        handleMenuItemClick();
                      }}
                      className="block w-full text-left py-2 text-lg font-medium text-gray-700 hover:text-teal-600 transition-colors duration-300"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <AuthModal
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onRegisterSuccess={handleRegisterSuccess}
        onLoginSuccess={handleLoginSuccess}
      />

      <OtpModal
        show={showOtpModal}
        onClose={handleOtpModalClose}
        email={registeredEmail}
      />
    </GoogleOAuthProvider>
  );
};

export default Navbar;