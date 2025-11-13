import axios from "axios";
import React, { useState } from "react";
import { baseurl } from "../../Base/Base";
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { X, ArrowRight, Mail, Lock, User, Phone, KeyRound } from 'lucide-react';

const AuthModal = ({ show, onClose, onRegisterSuccess, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!show) return null;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setRegEmail("");
    setPhone("");
    setRegPassword("");
    setConfirmPassword("");
    setForgotEmail("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (regPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${baseurl}user/register`, {
        username,
        email: regEmail,
        phone,
        password: regPassword,
      });
      toast.success("Account created! Check your email.");
      resetForm();
      onClose();
      onRegisterSuccess(regEmail);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${baseurl}user/login`, { email, password }, {
        withCredentials: true
      });
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      
      if (res.data.user) {
        localStorage.setItem("userData", JSON.stringify(res.data.user));
      }
      
      toast.success("Welcome back!");
      resetForm();
      
      // Call onLoginSuccess to update navbar and context
      if (onLoginSuccess) {
        await onLoginSuccess();
      }
      
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${baseurl}User/google-auth`,
        { credential: credentialResponse.credential },
        { withCredentials: true }
      );
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      
      if (res.data.user) {
        localStorage.setItem("userData", JSON.stringify(res.data.user));
      }
      
      toast.success("Success!");
      resetForm();
      
      // Call onLoginSuccess to update navbar and context
      if (onLoginSuccess) {
        await onLoginSuccess();
      }
      
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your email");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${baseurl}user/forgot-password`, { email: forgotEmail });
      toast.success("Reset link sent!");
      setShowForgotPassword(false);
      setForgotEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    resetForm();
    setIsLogin(true);
    setShowForgotPassword(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(20, 78, 140, 0.15)', backdropFilter: 'blur(8px)' }}>
      <div className="relative w-full max-w-md">
        
        {!showForgotPassword ? (
          <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ background: 'linear-gradient(135deg, #144E8C 0%, #78C7A2 100%)' }}>
            
            <button 
              onClick={handleModalClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all hover:rotate-90"
              style={{ background: 'rgba(255, 255, 255, 0.2)' }}
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <div className="p-8">
              <div className="flex gap-1 mb-8 p-1.5 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.15)' }}>
                <button
                  onClick={() => setIsLogin(true)}
                  className="flex-1 py-2.5 text-sm font-bold rounded-xl transition-all"
                  style={isLogin ? 
                    { background: 'rgba(255, 255, 255, 0.25)', color: '#fff', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' } : 
                    { color: 'rgba(255, 255, 255, 0.7)', background: 'transparent' }
                  }
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className="flex-1 py-2.5 text-sm font-bold rounded-xl transition-all"
                  style={!isLogin ? 
                    { background: 'rgba(255, 255, 255, 0.25)', color: '#fff', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' } : 
                    { color: 'rgba(255, 255, 255, 0.7)', background: 'transparent' }
                  }
                >
                  Register
                </button>
              </div>

              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-white opacity-70" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 transition-all"
                      style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff', focusRingColor: 'rgba(255, 255, 255, 0.3)' }}
                      placeholder="Email"
                      placeholderClassName="text-white/50"
                      required
                    />
                    <style>{`input::placeholder { color: rgba(255, 255, 255, 0.6); }`}</style>
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-4 h-4 text-white opacity-70" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 transition-all"
                      style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff' }}
                      placeholder="Password"
                      required
                    />
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs font-medium hover:underline"
                    style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    Forgot password?
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 text-white rounded-xl font-bold text-sm transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)' }}
                  >
                    {isSubmitting ? 'Please wait...' : 'Continue'}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px" style={{ background: 'rgba(255, 255, 255, 0.2)' }}></div>
                    <span className="text-xs font-medium text-white opacity-70">or</span>
                    <div className="flex-1 h-px" style={{ background: 'rgba(255, 255, 255, 0.2)' }}></div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-1">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => toast.error("Google auth failed")}
                      theme="light"
                      size="large"
                      width="100%"
                      text="signin_with"
                    />
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 w-4 h-4 text-white opacity-70" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2"
                        style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff' }}
                        placeholder="Name"
                        required
                      />
                    </div>
                    
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 w-4 h-4 text-white opacity-70" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2"
                        style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff' }}
                        placeholder="Phone"
                      />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-white opacity-70" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2"
                      style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff' }}
                      placeholder="Email"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-4 h-4 text-white opacity-70" />
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2"
                        style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff' }}
                        placeholder="Password"
                        required
                      />
                    </div>
                    
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-4 h-4 text-white opacity-70" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2"
                        style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff' }}
                        placeholder="Confirm"
                        required
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 text-white rounded-xl font-bold text-sm transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)' }}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px" style={{ background: 'rgba(255, 255, 255, 0.2)' }}></div>
                    <span className="text-xs font-medium text-white opacity-70">or</span>
                    <div className="flex-1 h-px" style={{ background: 'rgba(255, 255, 255, 0.2)' }}></div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-1">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => toast.error("Google auth failed")}
                      theme="light"
                      size="large"
                      width="100%"
                      text="signup_with"
                    />
                  </div>
                </form>
              )}

              <p className="text-center text-xs mt-6 text-white opacity-60">
                Protected by reCAPTCHA
              </p>
            </div>
          </div>
        ) : (
          <div className="relative rounded-3xl overflow-hidden shadow-2xl p-8" style={{ background: 'linear-gradient(135deg, #144E8C 0%, #78C7A2 100%)' }}>
            <button 
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all hover:rotate-90"
              style={{ background: 'rgba(255, 255, 255, 0.2)' }}
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ background: 'rgba(255, 255, 255, 0.15)' }}>
                <KeyRound className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Reset Password</h3>
              <p className="text-sm mt-2 text-white opacity-80">
                Enter your email for reset link
              </p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-white opacity-70" />
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2"
                  style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff' }}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 text-white rounded-xl font-bold text-sm transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)' }}
              >
                {isSubmitting ? 'Sending...' : 'Send Link'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full py-2.5 text-sm font-medium transition-all rounded-xl text-white opacity-80 hover:opacity-100"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              >
                Back to Login
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;