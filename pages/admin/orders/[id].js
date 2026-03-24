import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";

export default function OrderDetails() {
  const router = useRouter();
  const { id } = router.query;

 
  const [order, setOrder] = useState(null);

useEffect(() => {

 if (!id) return;

 const fetchOrder = async () => {

   const res = await fetch(`/api/admin/order?id=${id}`);
   const data = await res.json();

   setOrder(data.order);

 };

 fetchOrder();

}, [id]);

  const handleStatusChange = (e) => {
    setOrder({ ...order, status: e.target.value });
  };

  const handleSave = () => {
    alert(`✅ Order status updated to ${order.status}`);
  };

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading order details...
      </div>
    );
  }

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

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 bg-gray-50 min-h-screen">
        <AdminNavbar />

        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Order Details — <span className="text-pink-600">{order.id}</span>
            </h1>
            <button
              onClick={() => router.push("/admin/orders")}
              className="text-pink-600 hover:underline"
            >
              ← Back to Orders
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div className="bg-white shadow-md rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-800">
                Customer Information
              </h2>
              <p>
                <span className="font-medium">Name:</span> {order.customer}
              </p>
              <p>
                <span className="font-medium">Email:</span> {order.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {order.phone}
              </p>
              <p>
                <span className="font-medium">Address:</span> {order.address}
              </p>
              <p>
                <span className="font-medium">Date:</span> {order.date}
              </p>
            </div>

            {/* Order Summary */}
            <div className="bg-white shadow-md rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-800">
                Order Summary
              </h2>
              <p>
                <span className="font-medium">Order Total:</span> PKR{" "}
                {order.total}
              </p>
              <p className="mt-3">
                <span className="font-medium">Current Status:</span>{" "}
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </p>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Update Status
                </label>
                <select
                  value={order.status}
                  onChange={handleStatusChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option>Pending</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
                <button
                  onClick={handleSave}
                  className="mt-3 bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-500 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white shadow-md rounded-xl p-6 mt-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Ordered Items
            </h2>
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-pink-100 text-left text-gray-700">
                  <th className="py-3 px-4 font-semibold border-b">Product</th>
                  <th className="py-3 px-4 font-semibold border-b">Qty</th>
                  <th className="py-3 px-4 font-semibold border-b">
                    Price (PKR)
                  </th>
                  <th className="py-3 px-4 font-semibold border-b">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4">{item.qty}</td>
                    <td className="py-3 px-4">{item.price}</td>
                    <td className="py-3 px-4">{item.price * item.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-4">
              <p className="text-lg font-semibold text-gray-800">
                Total: PKR {order.total}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
