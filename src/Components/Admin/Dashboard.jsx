import React, { useState, useEffect } from 'react';
import { Package, Users, ShoppingCart, IndianRupee, TrendingUp, TrendingDown, Eye, Calendar, Filter, Download, FileText, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { baseurl } from '../../Base/Base';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, bgColor, iconColor }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="text-xs font-semibold">{trendValue}</span>
        </div>
      )}
    </div>
    <h3 className="text-sm text-gray-600 font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const OrderStatusCard = ({ status, count, color }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-3">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-600 font-medium mb-1">{status}</p>
        <p className="text-xl font-bold text-gray-900">{count}</p>
      </div>
      <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center`}>
        <ShoppingCart className="w-5 h-5 text-white" />
      </div>
    </div>
  </div>
);

const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: <Eye className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <FileText className="w-5 h-5" />
  };

  const styles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  return (
    <div className={`fixed top-4 right-4 z-[100] ${styles[type]} px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 max-w-sm animate-slide-in`}>
      {icons[type]}
      <span className="flex-1 text-sm font-medium">{message}</span>
    </div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeProducts: 0,
    newUsers: 0,
    pendingOrders: 0,
    paidRevenue: 0
  });
  
  const [orderStats, setOrderStats] = useState({
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [dateRange, setDateRange] = useState('all');

  const token = localStorage.getItem('Atoken');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        axios.get(`${baseurl}admin/products`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${baseurl}admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${baseurl}admin/orders/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const products = productsRes.data.products || [];
      const users = usersRes.data.users || [];
      const orderStatsData = ordersRes.data.stats || {};

      const activeProducts = products.filter(p => p.status === 'Active').length;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const newUsers = users.filter(u => new Date(u.createdAt) > thirtyDaysAgo).length;

      setStats({
        totalProducts: products.length,
        totalUsers: users.length,
        totalOrders: orderStatsData.totalOrders || 0,
        totalRevenue: orderStatsData.totalRevenue || 0,
        activeProducts: activeProducts,
        newUsers: newUsers,
        pendingOrders: orderStatsData.ordersByStatus?.pending || 0,
        paidRevenue: orderStatsData.totalRevenue || 0
      });

      setOrderStats({
        pending: orderStatsData.ordersByStatus?.pending || 0,
        confirmed: orderStatsData.ordersByStatus?.confirmed || 0,
        processing: orderStatsData.ordersByStatus?.processing || 0,
        shipped: orderStatsData.ordersByStatus?.shipped || 0,
        delivered: orderStatsData.ordersByStatus?.delivered || 0,
        cancelled: orderStatsData.ordersByStatus?.cancelled || 0
      });

      setRecentOrders(orderStatsData.recentOrders || []);

      const productSales = {};
      (orderStatsData.recentOrders || []).forEach(order => {
        order.items?.forEach(item => {
          const productId = item.product?._id || item.product;
          if (!productSales[productId]) {
            productSales[productId] = {
              name: item.name || item.product?.name || 'Unknown Product',
              quantity: 0,
              revenue: 0
            };
          }
          productSales[productId].quantity += item.quantity;
          productSales[productId].revenue += item.price * item.quantity;
        });
      });

      const topProds = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setTopProducts(topProds);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = async (format) => {
    try {
      showToast(`Downloading ${format.toUpperCase()} report...`, 'info');
      
      const response = await axios.get(`${baseurl}admin/reports/sales/download`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { format },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sales-report-${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      showToast('Report downloaded successfully', 'success');
    } catch (error) {
      console.error('Error downloading report:', error);
      showToast('Failed to download report', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-xs text-gray-500 mt-0.5">Welcome back, Admin</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => downloadReport('pdf')}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                PDF
              </button>
              <button
                onClick={() => downloadReport('excel')}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Excel
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setDateRange('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                dateRange === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setDateRange('today')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                dateRange === 'today'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateRange('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                dateRange === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                dateRange === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              This Month
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              title="Total Revenue"
              value={`₹${stats.totalRevenue.toLocaleString()}`}
              icon={IndianRupee}
              trend="up"
              trendValue="+12.5%"
              bgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={ShoppingCart}
              trend="up"
              trendValue="+8.2%"
              bgColor="bg-green-100"
              iconColor="text-green-600"
            />
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={Users}
              trend="up"
              trendValue="+15.3%"
              bgColor="bg-purple-100"
              iconColor="text-purple-600"
            />
            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              icon={Package}
              trend="down"
              trendValue="-2.1%"
              bgColor="bg-orange-100"
              iconColor="text-orange-600"
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              title="Active Products"
              value={stats.activeProducts}
              icon={Eye}
              bgColor="bg-teal-100"
              iconColor="text-teal-600"
            />
            <StatCard
              title="New Users"
              value={stats.newUsers}
              icon={Users}
              bgColor="bg-indigo-100"
              iconColor="text-indigo-600"
            />
            <StatCard
              title="Pending Orders"
              value={stats.pendingOrders}
              icon={ShoppingCart}
              bgColor="bg-yellow-100"
              iconColor="text-yellow-600"
            />
            <StatCard
              title="Paid Revenue"
              value={`₹${stats.paidRevenue.toLocaleString()}`}
              icon={IndianRupee}
              bgColor="bg-green-100"
              iconColor="text-green-600"
            />
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Order Status Overview</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <OrderStatusCard status="Pending" count={orderStats.pending} color="bg-yellow-500" />
              <OrderStatusCard status="Confirmed" count={orderStats.confirmed} color="bg-blue-500" />
              <OrderStatusCard status="Processing" count={orderStats.processing} color="bg-indigo-500" />
              <OrderStatusCard status="Shipped" count={orderStats.shipped} color="bg-purple-500" />
              <OrderStatusCard status="Delivered" count={orderStats.delivered} color="bg-green-500" />
              <OrderStatusCard status="Cancelled" count={orderStats.cancelled} color="bg-red-500" />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900">Recent Orders</h3>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-2">
                {recentOrders.slice(0, 5).map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">{order.user?.name || 'Unknown User'}</p>
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-xs font-bold text-gray-900">₹{order.totalAmount}</p>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
                {recentOrders.length === 0 && (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No orders yet</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900">Top Products</h3>
                <Package className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-2">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.quantity} sold</p>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-green-600 ml-2">₹{product.revenue.toFixed(2)}</p>
                  </div>
                ))}
                {topProducts.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No sales data</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}