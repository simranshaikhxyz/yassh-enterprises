import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // ⚡ Fetch both endpoints concurrently for better performance
      const [dashboardRes, ordersRes] = await Promise.all([
        API.get("/dashboard"),
        API.get("/orders"),
      ]);

      setStats(dashboardRes.data);
      setRecentOrders(ordersRes.data?.slice(0, 5) || []);
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      alert(error.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <h1 className="text-lg font-medium text-slate-600 animate-pulse">
          Loading Dashboard...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased font-sans">
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Welcome back, Administrator. Here's your store's overview.
            </p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Products */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Total Products</span>
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mt-4 tracking-tight">
              {stats?.totalProducts || 0}
            </h2>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Total Orders</span>
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mt-4 tracking-tight">
              {stats?.totalOrders || 0}
            </h2>
          </div>

          {/* Customers */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Customers</span>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mt-4 tracking-tight">
              {stats?.totalCustomers || 0}
            </h2>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Revenue</span>
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mt-4 tracking-tight">
              ₹{(stats?.totalRevenue || 0).toLocaleString("en-IN")}
            </h2>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 tracking-tight">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <Link
              to="/admin/add-product"
              className="group bg-white hover:bg-slate-50/50 border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 shadow-sm"
            >
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-800 text-sm">Add Product</h3>
                <p className="text-xs text-slate-400 mt-0.5">List a new item</p>
              </div>
            </Link>

            <Link
              to="/admin/products"
              className="group bg-white hover:bg-slate-50/50 border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 shadow-sm"
            >
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-800 text-sm">Manage Products</h3>
                <p className="text-xs text-slate-400 mt-0.5">Update product details</p>
              </div>
            </Link>

            <Link
              to="/admin/orders"
              className="group bg-white hover:bg-slate-50/50 border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 shadow-sm"
            >
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-800 text-sm">Manage Orders</h3>
                <p className="text-xs text-slate-400 mt-0.5">Track and process sales</p>
              </div>
            </Link>

            <Link
              to="/admin/reports"
              className="group bg-white hover:bg-slate-50/50 border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 shadow-sm"
            >
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-800 text-sm">Reports</h3>
                <p className="text-xs text-slate-400 mt-0.5">Analyze performance</p>
              </div>
            </Link>

          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-3 gap-8 mt-12">
          
          {/* Recent Orders - Spans 2 Columns */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                  Recent Orders
                </h2>
                <Link
                  to="/admin/orders"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
                >
                  View All
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-medium">
                      <th className="pb-3 font-semibold">Customer</th>
                      <th className="pb-3 font-semibold">Product</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center py-12 text-slate-400 text-sm"
                        >
                          No orders found.
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order) => (
                        <tr
                          key={order._id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="py-4 font-medium text-slate-700">
                            {order.customerName || order.user?.name || "Guest Customer"}
                          </td>
                          <td className="py-4 text-slate-500">
                            {order.product?.productName || "Product Deleted"}
                          </td>
                          <td className="py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                order.orderStatus === "Completed"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : order.orderStatus === "Processing"
                                  ? "bg-blue-50 text-blue-700"
                                  : order.orderStatus === "Cancelled"
                                  ? "bg-rose-50 text-rose-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {order.orderStatus || "Pending"}
                            </span>
                          </td>
                          <td className="py-4 text-right font-semibold text-slate-900">
                            ₹{(order.totalPrice || 0).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Side Sidebar (Business Summary & Activities) */}
          <div className="space-y-6">
            
            {/* Business Summary */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 tracking-tight">
                Business Summary
              </h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Total Products</span>
                  <span className="font-semibold text-slate-800">
                    {stats?.totalProducts || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Total Orders</span>
                  <span className="font-semibold text-slate-800">
                    {stats?.totalOrders || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Customers</span>
                  <span className="font-semibold text-slate-800">
                    {stats?.totalCustomers || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1.5">
                  <span className="text-slate-500">Revenue</span>
                  <span className="font-bold text-emerald-600">
                    ₹{(stats?.totalRevenue || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 tracking-tight">
                Recent Activity
              </h2>
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  <span>Products in Store: <strong>{stats?.totalProducts || 0}</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Orders Received: <strong>{stats?.totalOrders || 0}</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span>Registered Customers: <strong>{stats?.totalCustomers || 0}</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                  <span>Total Revenue: <strong>₹{(stats?.totalRevenue || 0).toLocaleString("en-IN")}</strong></span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;