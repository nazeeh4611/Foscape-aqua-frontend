import React, { useEffect, useState } from 'react';
import { Lock, Eye, EyeOff, Save, KeyRound, CheckCircle, AlertCircle, X, User } from 'lucide-react';
import axios from 'axios';
import { baseurl } from '../../Base/Base';
import { Phone } from "lucide-react";

const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />
  };

  const styles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white'
  };

  return (
    <div className={`fixed top-4 right-4 z-[100] ${styles[type]} px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 max-w-sm animate-slide-in`}>
      {icons[type]}
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button onClick={onClose} className="hover:bg-white hover:bg-opacity-20 rounded p-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function AdminSettings() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [adminData, setAdminData] = useState(null); // 👈 Admin details
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [errors, setErrors] = useState({});
  const [toasts, setToasts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem('Atoken');

  // ========================== TOAST ==========================
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // ========================== GET ADMIN DETAILS ==========================
  const fetchAdminDetails = async () => {
    try {
      const response = await axios.get(`${baseurl}admin/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response,"may here")

      if (response.data) {
        setAdminData(response.data.admin);
      }
    } catch (error) {
      console.error("Failed to fetch admin details", error);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
  }, []);

  const updatePhoneNumber = async () => {
    try {
      const response = await axios.put(
        `${baseurl}admin/update-phone`,
        { phone: adminData.phone },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      showToast("Phone number updated successfully!", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update phone", "error");
    }
  };
  
  // ========================== FORM VALIDATION ==========================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ========================== HANDLE SUBMIT ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix form errors', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.put(`${baseurl}admin/change-password`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      showToast('Password updated successfully!', 'success');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setErrors({});
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update password';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>

      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Settings</h2>
              <p className="text-xs text-gray-500">Manage your account settings</p>
            </div>
          </div>
        </header>

        <div className="overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto">

          {/* ================= ADMIN DETAILS CARD ================= */}
          {adminData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Admin Details</h3>
                  <p className="text-sm text-gray-600">Your account information</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm">
                  <span className="font-semibold text-gray-700">Name:</span>{" "}
                  <span className="text-gray-900">{adminData.name}</span>
                </p>

                <p className="text-sm">
                  <span className="font-semibold text-gray-700">Email:</span>{" "}
                  <span className="text-gray-900">{adminData.email}</span>
                </p>

                <p className="text-sm">
                  <span className="font-semibold text-gray-700">Phone:</span>{" "}
                  <span className="text-gray-900">{adminData.phone || "Not added"}</span>
                </p>

                <p className="text-sm">
                  <span className="font-semibold text-gray-700">Role:</span>{" "}
                  <span className="text-gray-900 capitalize">{adminData.role}</span>
                </p>
              </div>
            </div>
          )}
          {/* ================= UPDATE PHONE NUMBER ================= */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Update Phone Number</h3>
                        <p className="text-sm text-gray-600">Change your contact number</p>
                      </div>
                    </div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      maxLength={10}
                      value={adminData?.phone || ""}
                      onChange={(e) =>
                        setAdminData((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Enter phone number"
                    />

                    <button
                      onClick={updatePhoneNumber}
                      className="mt-5 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md"
                    >
                      Update Phone
                    </button>
                  </div>



            {/* ================= CHANGE PASSWORD ================= */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
                  <p className="text-sm text-gray-600">Update your account password</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={formData.currentPassword}
                      onChange={(e) => {
                        setFormData({ ...formData, currentPassword: e.target.value });
                        if (errors.currentPassword) setErrors({ ...errors, currentPassword: '' });
                      }}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg text-sm ${errors.currentPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPasswords.current ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-xs text-red-600 mt-1">{errors.currentPassword}</p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={formData.newPassword}
                      onChange={(e) => {
                        setFormData({ ...formData, newPassword: e.target.value });
                        if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                      }}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg text-sm ${errors.newPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPasswords.new ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-xs text-red-600 mt-1">{errors.newPassword}</p>
                  )}

                  <p className="text-xs text-gray-500 mt-1.5">
                    Password must be at least 8 characters with uppercase, lowercase, and number
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({ ...formData, confirmPassword: e.target.value });
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                      }}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg text-sm ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPasswords.confirm ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-bold text-base shadow-lg disabled:opacity-50"
                  >
         

                    <Save className="w-5 h-5" />
                    {isSubmitting ? 'Updating Password...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>

            {/* Security Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">Security Tips</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Use a strong, unique password</li>
                    <li>• Don’t share your password with anyone</li>
                    <li>• Change your password regularly</li>
                    <li>• Use a mix of letters, numbers, and symbols</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
