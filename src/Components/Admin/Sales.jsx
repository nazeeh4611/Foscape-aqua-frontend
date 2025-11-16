import React, { useState, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet, TrendingUp, DollarSign, ShoppingCart, Users, Calendar, Filter, BarChart3, PieChart, Package } from 'lucide-react';
import { baseurl } from '../../Base/Base';
import axios from 'axios';

const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
  <div className={`bg-white rounded-lg p-4 border-l-4 ${color} shadow-sm`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-full ${color.replace('border', 'bg').replace('500', '100')}`}>
        <Icon className={`w-6 h-6 ${color.replace('border', 'text')}`} />
      </div>
    </div>
  </div>
);

const Toast = ({ message, type, onClose }) => (
  <div className={`fixed top-4 right-4 z-[100] ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'} text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 max-w-sm animate-slide-in`}>
    <span className="flex-1 text-sm font-medium">{message}</span>
    <button onClick={onClose} className="hover:bg-white hover:bg-opacity-20 rounded p-1">×</button>
  </div>
);

export default function SalesReport() {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'All',
    paymentStatus: 'All',
    groupBy: 'daily'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const token = localStorage.getItem('Atoken');

  useEffect(() => {
    fetchReport();
  }, []);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status !== 'All') params.append('status', filters.status);
      if (filters.paymentStatus !== 'All') params.append('paymentStatus', filters.paymentStatus);
      params.append('groupBy', filters.groupBy);

      const response = await axios.get(`${baseurl}admin/sales-report?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReportData(response.data.report);
    } catch (error) {
      console.error('Error fetching report:', error);
      showToast('Failed to load sales report', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      setIsDownloading(true);
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status !== 'All') params.append('status', filters.status);
      if (filters.paymentStatus !== 'All') params.append('paymentStatus', filters.paymentStatus);

      const response = await axios.get(`${baseurl}admin/sales-report/download-pdf?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sales-report-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast('PDF downloaded successfully', 'success');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      showToast('Failed to download PDF', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadExcel = async () => {
    try {
      setIsDownloading(true);
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status !== 'All') params.append('status', filters.status);
      if (filters.paymentStatus !== 'All') params.append('paymentStatus', filters.paymentStatus);

      const response = await axios.get(`${baseurl}admin/sales-report/download-excel?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sales-report-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast('Excel downloaded successfully', 'success');
    } catch (error) {
      console.error('Error downloading Excel:', error);
      showToast('Failed to download Excel', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const applyFilters = () => {
    fetchReport();
    showToast('Filters applied', 'success');
  };

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      status: 'All',
      paymentStatus: 'All',
      groupBy: 'daily'
    });
    showToast('Filters reset', 'info');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm font-medium">Loading sales report...</p>
        </div>
      </div>
    );
  }

  if (!reportData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>

      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />
      ))}

      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Sales Report</h2>
              <p className="text-xs text-gray-500 mt-0.5">Comprehensive sales analytics and insights</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border ${showFilters ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-300 text-gray-700'}`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={downloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={downloadExcel}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </button>
          </div>

          {showFilters && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Order Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  value={filters.paymentStatus}
                  onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                >
                  <option value="All">All Payment Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Group By</label>
                <select
                  value={filters.groupBy}
                  onChange={(e) => setFilters({ ...filters, groupBy: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                >
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={applyFilters}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Apply Filters
                </button>
                <button
                  onClick={resetFilters}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={ShoppingCart}
            title="Total Orders"
            value={reportData.summary.totalOrders}
            color="border-blue-500"
          />
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={`₹${reportData.summary.totalRevenue.toFixed(2)}`}
            color="border-green-500"
          />
          <StatCard
            icon={TrendingUp}
            title="Paid Revenue"
            value={`₹${reportData.summary.totalPaidRevenue.toFixed(2)}`}
            color="border-purple-500"
          />
          <StatCard
            icon={BarChart3}
            title="Avg Order Value"
            value={`₹${reportData.summary.averageOrderValue.toFixed(2)}`}
            color="border-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Orders by Status
            </h3>
            <div className="space-y-2">
              {Object.entries(reportData.ordersByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{status}</span>
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Payment Methods
            </h3>
            <div className="space-y-2">
              {Object.entries(reportData.paymentMethodStats).map(([method, count]) => (
                <div key={method} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{method}</span>
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Top 10 Products
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Quantity</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Revenue</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.topProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 text-gray-900">{product.name}</td>
                    <td className="px-3 py-2 text-right text-gray-900">{product.quantity}</td>
                    <td className="px-3 py-2 text-right text-gray-900">₹{product.revenue.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right text-gray-900">{product.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Top 10 Customers
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Customer</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Email</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Orders</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.topCustomers.map((customer, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 text-gray-900">{customer.name}</td>
                    <td className="px-3 py-2 text-gray-600">{customer.email}</td>
                    <td className="px-3 py-2 text-right text-gray-900">{customer.orders}</td>
                    <td className="px-3 py-2 text-right text-gray-900">₹{customer.totalSpent.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {reportData.salesOverTime.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Sales Over Time ({filters.groupBy === 'daily' ? 'Daily' : 'Monthly'})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Orders</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportData.salesOverTime.map((item, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 text-gray-900">{item.date}</td>
                      <td className="px-3 py-2 text-right text-gray-900">{item.orders}</td>
                      <td className="px-3 py-2 text-right text-gray-900">₹{item.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">All Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Order #</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Customer</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Items</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Amount</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.orders.map((order, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 text-gray-900 font-mono text-xs">{order.orderNumber}</td>
                    <td className="px-3 py-2 text-gray-900">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-3 py-2 text-gray-900">{order.customer}</td>
                    <td className="px-3 py-2 text-right text-gray-900">{order.items}</td>
                    <td className="px-3 py-2 text-right text-gray-900">₹{order.amount.toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                        order.paymentStatus === 'Failed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}