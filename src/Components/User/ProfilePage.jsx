import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Heart,
  ShoppingCart,
  Edit2,
  Save,
  X,
  ChevronRight,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import Navbar from '../../Layout/Navbar';
import Footer from '../../Layout/Footer';
import { useAuth } from '../../Context.js/Auth';
import { useToast } from '../../Context.js/ToastContext';
import axios from 'axios';
import { baseurl } from '../../Base/Base';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { isLogged, user, setUser } = useAuth();
  const showToast = useToast();

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
    },
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistItems: 0,
    cartItems: 0,
  });

  useEffect(() => {
    if (!isLogged) {
      navigate('/');
    }
  }, [isLogged, navigate]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          pincode: user.address?.pincode || '',
          country: user.address?.country || 'India',
        },
      });
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ordersRes, wishlistRes, cartRes] = await Promise.all([
        axios.get(`${baseurl}user/orders`, {
          withCredentials: true,
        }),
        axios.get(`${baseurl}user/wishlist`, {
          withCredentials: true,
        }),
        axios.get(`${baseurl}user/cart`, {
          withCredentials: true,
        }),
      ]);

      setStats({
        totalOrders: ordersRes.data.orders?.length || 0,
        wishlistItems: wishlistRes.data.wishlist?.products?.length || 0,
        cartItems: cartRes.data.cart?.totalItems || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${baseurl}user/profile/update`,
        profileData,
        { withCredentials: true }
      );

      if (data.success) {
        setUser(data.user);
        showToast.success('Profile updated successfully');
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(
        `${baseurl}user/profile/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { withCredentials: true }
      );

      if (data.success) {
        showToast.success('Password changed successfully');
        setPasswordModal(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      showToast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          pincode: user.address?.pincode || '',
          country: user.address?.country || 'India',
        },
      });
    }
    setEditMode(false);
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-[#CFEAE3] to-[#99D5C8] min-h-screen pt-24">
        <div className="bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white py-12">
        <div
    className="absolute inset-0 opacity-10"
    style={{
      backgroundImage: 'url(/patterns/foscape-pattern.svg)',
      backgroundSize: '1000px 1000px',
      backgroundPosition: 'left center',
      backgroundRepeat: 'repeat-y',
      maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 40%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 40%, transparent 100%)'
    }}
  />
  <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">             <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 mb-4 text-[#CFEAE3] hover:text-white transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>

            <div className="flex items-center gap-3 mb-3">
              <User className="w-8 h-8" />
              <h1 className="text-3xl sm:text-4xl font-bold">My Profile</h1>
            </div>

            <div className="flex items-center text-sm text-[#CFEAE3] gap-1">
              <span onClick={() => navigate('/')} className="hover:text-white cursor-pointer">
                Home
              </span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-semibold">Profile</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 -mt-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#144E8C] to-[#78CDD1] rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
                  <p className="text-sm text-slate-600">{user?.email}</p>
                </div>

                <div className="space-y-3">

{/* My Profile */}
<button
  onClick={() => navigate('/profile')}
  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all 
    ${location.pathname === '/profile' 
      ? 'bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white hover:shadow-lg' 
      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}
  `}
>
  <div className="flex items-center gap-3">
    <User className="w-5 h-5" />
    <span className="font-medium">My Profile</span>
  </div>
  <ChevronRight className="w-5 h-5" />
</button>


{/* My Orders */}
<button
  onClick={() => navigate('/orders')}
  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all 
    ${location.pathname === '/orders' 
      ? 'bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white hover:shadow-lg' 
      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}
  `}
>
  <div className="flex items-center gap-3">
    <Package className="w-5 h-5" />
    <span className="font-medium">My Orders</span>
  </div>
  <ChevronRight className="w-5 h-5" />
</button>

{/* My Wishlist */}
<button
  onClick={() => navigate('/wishlist')}
  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all 
    ${location.pathname === '/wishlist' 
      ? 'bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white hover:shadow-lg' 
      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}
  `}
>
  <div className="flex items-center gap-3">
    <Heart className="w-5 h-5" />
    <span className="font-medium">My Wishlist</span>
  </div>
  <ChevronRight className="w-5 h-5" />
</button>

{/* My Cart */}
<button
  onClick={() => navigate('/cart')}
  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all 
    ${location.pathname === '/cart' 
      ? 'bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white hover:shadow-lg' 
      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}
  `}
>
  <div className="flex items-center gap-3">
    <ShoppingCart className="w-5 h-5" />
    <span className="font-medium">My Cart</span>
  </div>
  <ChevronRight className="w-5 h-5" />
</button>

{/* Change Password */}
<button
  onClick={() => setPasswordModal(true)}
  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all 
    ${location.pathname === '/change-password' 
      ? 'bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white hover:shadow-lg' 
      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}
  `}
>
  <div className="flex items-center gap-3">
    <Lock className="w-5 h-5" />
    <span className="font-medium">Change Password</span>
  </div>
  <ChevronRight className="w-5 h-5" />
</button>

</div>

              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Account Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-[#144E8C]" />
                      <span className="text-sm font-medium text-slate-700">Total Orders</span>
                    </div>
                    <span className="text-lg font-bold text-[#144E8C]">{stats.totalOrders}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-slate-700">Wishlist Items</span>
                    </div>
                    <span className="text-lg font-bold text-red-600">{stats.wishlistItems}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-slate-700">Cart Items</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">{stats.cartItems}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Personal Information</h2>
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateProfile}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#144E8C] disabled:bg-slate-50 disabled:text-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        disabled
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#144E8C] disabled:bg-slate-50 disabled:text-slate-600"
                        maxLength="10"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-4 mt-2">
                      <MapPin className="w-5 h-5 text-[#144E8C]" />
                      <h3 className="text-lg font-bold text-slate-800">Address Information</h3>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={profileData.address.street}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#144E8C] disabled:bg-slate-50 disabled:text-slate-600"
                      placeholder="House No., Building Name, Street"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={profileData.address.city}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#144E8C] disabled:bg-slate-50 disabled:text-slate-600"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                    <input
                      type="text"
                      name="address.state"
                      value={profileData.address.state}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#144E8C] disabled:bg-slate-50 disabled:text-slate-600"
                      placeholder="Enter state"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="address.pincode"
                      value={profileData.address.pincode}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#144E8C] disabled:bg-slate-50 disabled:text-slate-600"
                      placeholder="6 digit pincode"
                      maxLength="6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="address.country"
                      value={profileData.address.country}
                      disabled
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {passwordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Change Password</h3>
              <button
                onClick={() => {
                  setPasswordModal(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#144E8C]"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#144E8C]"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#144E8C]"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setPasswordModal(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                }}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#144E8C] to-[#78CDD1] text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};