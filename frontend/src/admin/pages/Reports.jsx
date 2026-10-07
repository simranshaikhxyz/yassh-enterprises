import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";

function Reports() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/dashboard");

      setStats({
        totalProducts: data?.totalProducts || 0,
        totalOrders: data?.totalOrders || 0,
        totalCustomers: data?.totalCustomers || 0,
        totalRevenue: data?.totalRevenue || 0,
        pendingOrders: data?.pendingOrders || 0,
        processingOrders: data?.processingOrders || 0,
        completedOrders: data?.completedOrders || 0,
        cancelledOrders: data?.cancelledOrders || 0,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard reports:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Helper function for dynamic order status bar percentages
  const getPercentage = (count) => {
    if (!stats.totalOrders || stats.totalOrders === 0) return 0;
    return Math.min(Math.round((count / stats.totalOrders) * 100), 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased font-sans py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Reports & Analytics
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time business indicators, customer trends, and overall revenue overview.
          </p>
        </div>

        {/* Top Metric Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card: Total Products */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Products
              </h2>
              <p className="text-3xl font-extrabold text-slate-900 mt-2 tabular-nums">
                {stats.totalProducts}
              </p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>

          {/* Card: Total Orders */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Orders
              </h2>
              <p className="text-3xl font-extrabold text-slate-900 mt-2 tabular-nums">
                {stats.totalOrders}
              </p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>

          {/* Card: Total Customers */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Customers
              </h2>
              <p className="text-3xl font-extrabold text-slate-900 mt-2 tabular-nums">
                {stats.totalCustomers}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>

          {/* Card: Total Revenue */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Revenue
              </h2>
              <p className="text-3xl font-extrabold text-slate-900 mt-2 tabular-nums">
                ₹{stats.totalRevenue.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Section: Order Status Metrics */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">
              Order Dispatch Tracker
            </h2>

            <div className="space-y-5">
              {/* Pending */}
              <div>
                <div className="flex justify-between items-center text-sm font-medium mb-1.5">
                  <span className="text-slate-600 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    Pending Validation
                  </span>
                  <span className="text-slate-900 font-semibold tabular-nums">
                    {stats.pendingOrders}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full transition-all duration-500"
                    style={{ width: `${getPercentage(stats.pendingOrders)}%` }}
                  ></div>
                </div>
              </div>

              {/* Processing */}
              <div>
                <div className="flex justify-between items-center text-sm font-medium mb-1.5">
                  <span className="text-slate-600 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    In Production / Processing
                  </span>
                  <span className="text-slate-900 font-semibold tabular-nums">
                    {stats.processingOrders}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-500"
                    style={{ width: `${getPercentage(stats.processingOrders)}%` }}
                  ></div>
                </div>
              </div>

              {/* Completed */}
              <div>
                <div className="flex justify-between items-center text-sm font-medium mb-1.5">
                  <span className="text-slate-600 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    Dispatched & Completed
                  </span>
                  <span className="text-slate-900 font-semibold tabular-nums">
                    {stats.completedOrders}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${getPercentage(stats.completedOrders)}%` }}
                  ></div>
                </div>
              </div>

              {/* Cancelled */}
              <div>
                <div className="flex justify-between items-center text-sm font-medium mb-1.5">
                  <span className="text-slate-600 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    Cancelled Transactions
                  </span>
                  <span className="text-slate-900 font-semibold tabular-nums">
                    {stats.cancelledOrders}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full transition-all duration-500"
                    style={{ width: `${getPercentage(stats.cancelledOrders)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Business Summary Metrics */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-6">
                Business Log Summary
              </h2>

              <ul className="divide-y divide-slate-100 text-sm">
                <li className="py-3 flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-2">
                    <span>📦</span> Active SKU Products
                  </span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {stats.totalProducts}
                  </span>
                </li>

                <li className="py-3 flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-2">
                    <span>🛒</span> Total Lifetime Orders
                  </span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {stats.totalOrders}
                  </span>
                </li>

                <li className="py-3 flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-2">
                    <span>👥</span> User Profiles / Customers
                  </span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {stats.totalCustomers}
                  </span>
                </li>

                <li className="py-3 flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-2">
                    <span>💰</span> Cumulative Gross Revenue
                  </span>
                  <span className="font-bold text-indigo-600 tabular-nums">
                    ₹{stats.totalRevenue.toLocaleString("en-IN")}
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-6 flex justify-end">
              <button
                type="button"
                onClick={fetchReports}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
                </svg>
                Sync Metrics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;