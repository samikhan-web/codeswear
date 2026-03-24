import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Link from "next/link";

const Orders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        router.push("/login");
        return;
      }

      const res = await fetch("/api/orders/myorders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        const fetched = data.orders || data.data || [];
        setOrders(fetched);
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      toast.error("Something went wrong while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const hasUnpaid = orders.some((o) => o.status !== "Paid");

    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }

    if (hasUnpaid) {
      pollRef.current = setInterval(() => {
        fetchOrders();
      }, 3000);
    }

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [orders]);

  if (loading)
    return (
      <div className="p-8 text-center text-pink-600 font-semibold">
        Loading your orders...
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="p-8 text-center text-pink-600 font-semibold">
        <p className="mb-4">You have no orders yet.</p>
        <Link href="/">
          <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
            Start Shopping
          </button>
        </Link>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-pink-600">My Orders</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-pink-200 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200 bg-white"
          >
            <div className="mb-4">
              <p className="font-semibold text-gray-700">
                Order ID: <span className="text-gray-900">{order._id}</span>
              </p>

              <p className="font-semibold flex items-center gap-2 mt-2">
                Status:
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === "Paid"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-orange-100 text-orange-700 border border-orange-300"
                  }`}
                >
                  {order.status}
                </span>
              </p>

              <p className="font-semibold mt-2">Amount: ₹{order.amount}</p>
              <p className="text-gray-500 text-sm mt-1">
                Date:{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : order.date
                  ? order.date
                  : "—"}
              </p>
            </div>

            <Link href={`/orders/${order._id}`}>
              <button className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 font-semibold transition-colors">
                View Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
