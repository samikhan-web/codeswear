import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ✅ Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/admin/orders");
        const data = await res.json();

        if (data.success) {
          setOrders(data.orders);
        } else {
          toast.error("Failed to fetch orders");
        }
      } catch (error) {
        toast.error("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ✅ Status Color
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ✅ Search Filter
  const filteredOrders = orders.filter((order) =>
    order.customer?.toLowerCase().includes(search.toLowerCase()) ||
    order._id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <AdminNavbar />

        <div className="p-8">
          {/* Header */}
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Manage Orders
          </h1>

          {/* 🔍 Search */}
          <input
            type="text"
            placeholder="Search by customer or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 px-4 py-2 border rounded-lg w-full max-w-sm focus:ring-2 focus:ring-pink-400"
          />

          {/* 📊 Table */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden">

            {loading ? (
              <div className="p-6 text-gray-500">Loading orders...</div>
            ) : (
              <table className="min-w-full text-sm">
                
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  <tr>
                    <th className="py-3 px-4 text-left">Order ID</th>
                    <th className="py-3 px-4 text-left">Customer</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Total (PKR)</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          {order._id}
                        </td>

                        <td className="py-3 px-4 font-medium text-gray-800 dark:text-white">
                          {order.customer}
                        </td>

                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>

                        <td className="py-3 px-4 font-semibold">
                          {order.total}
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <Link href={`/admin/orders/${order._id}`}>
                            <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-md hover:scale-105 transition">
                              View
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}