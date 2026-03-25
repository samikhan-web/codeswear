import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const salesData = [120, 200, 150, 300, 250, 400, 350];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

useEffect(() => {
  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load stats");
      setStats(data.stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  fetchStats();
}, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />

        <main className="p-8 space-y-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Dashboard
          </h1>

          {loading && <p className="text-gray-600 dark:text-gray-300">Loading stats...</p>}
          {error && <p className="text-red-500 font-semibold">Error: {error}</p>}

          {stats && (
            <>
              {/* Quick Action Buttons */}
              <div className="flex gap-4 flex-wrap mb-4">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:scale-105 transition-transform">
                  Add Product
                </button>
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:scale-105 transition-transform">
                  Export CSV
                </button>
                <button className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow hover:scale-105 transition-transform">
                  Generate Report
                </button>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-xl p-5 shadow-md hover:scale-105 transition-transform">
                  <h3 className="text-sm font-medium">Total Orders</h3>
                  <p className="text-2xl font-bold mt-2">{stats.totalOrders}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl p-5 shadow-md hover:scale-105 transition-transform">
                  <h3 className="text-sm font-medium">Total Products</h3>
                  <p className="text-2xl font-bold mt-2">{stats.totalProducts}</p>
                </div>
                <div className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl p-5 shadow-md hover:scale-105 transition-transform">
                  <h3 className="text-sm font-medium">Total Users</h3>
                  <p className="text-2xl font-bold mt-2">{stats.totalUsers}</p>
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {stats.lowStockProducts?.map((p) => (
                  <div
                    key={p.id}
                    className="bg-red-100 text-red-700 p-4 rounded-lg shadow hover:bg-red-200 transition-colors"
                  >
                    <h4 className="font-semibold">{p.name}</h4>
                    <p>Stock: {p.stock}</p>
                  </div>
                ))}
              </div>

              {/* Weekly Sales Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mt-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Weekly Sales
                </h2>
                <div className="flex items-end gap-2 h-40">
                  {salesData.map((val, i) => (
                    <div
                      key={i}
                      className="bg-purple-500 rounded-t-lg"
                      style={{ width: "2rem", height: `${val / 2}px` }}
                      title={`${val} sales`}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-300">
                  {days.map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
              </div>

              {/* Top-Selling Products */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mt-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Top-Selling Products
                </h2>
                <div className="space-y-2">
                  {stats.topSellingProducts?.map((prod) => (
                    <div key={prod.id} className="flex items-center gap-2">
                      <span className="w-24 text-sm text-gray-700 dark:text-gray-300">{prod.name}</span>
                      <div className="bg-blue-500 h-4 rounded" style={{ width: `${prod.sales}%` }}></div>
                      <span className="text-gray-800 dark:text-gray-200 text-sm ml-2">{prod.sales}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md overflow-x-auto mt-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Recent Orders
                </h2>
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Order ID</th>
                      <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Customer</th>
                      <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Total</th>
                      <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Status</th>
                      <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders?.map((order) => (
                      <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{order.id}</td>
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{order.customer}</td>
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-200">${order.total}</td>
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{order.status}</td>
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{new Date(order.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
