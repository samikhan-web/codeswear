import { loadStripe } from "@stripe/stripe-js";
import connectDb from "@/middleware/mongoose";
import Order from "@/models/Order";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function OrderDetails({ initialOrder }) {
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(false);
  const pollRef = useRef(null);

  // ✅ Stripe payment redirect
  const handlePayment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ orderId: order._id }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to create checkout session");
        setLoading(false);
        return;
      }

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      );
      if (!stripe) {
        toast.error("Stripe failed to load.");
        setLoading(false);
        return;
      }

      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (err) {
      console.error("Payment error", err);
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Polling payment status
  useEffect(() => {
    if (!order || order.status === "Paid") return;
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const data = await res.json();
        const serverOrder = data.order || data.data || null;

        if (serverOrder && serverOrder.status !== order.status) {
          setOrder(serverOrder);
        }

        if (serverOrder && serverOrder.status === "Paid") {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      } catch (err) {
        console.error("Polling order status failed", err);
      }
    }, 2000);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [order && order._id, order && order.status]);

  if (!order) {
    return (
      <div className="p-6 mt-12 mb-12 max-w-3xl mx-auto bg-pink-50 rounded-lg shadow-md text-center">
        <h1 className="text-xl font-semibold text-pink-600">Order not found</h1>
        <Link
          href="/orders"
          className="text-pink-600 hover:underline mt-4 inline-block"
        >
          ← Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 mt-12 mb-12 max-w-3xl mx-auto bg-pink-50 rounded-lg shadow-md">
      {/* ✅ Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-pink-600">Order Details</h1>
        <Link href="/orders">
          <button className="px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700 font-medium transition">
            ← Back to Orders
          </button>
        </Link>
      </div>

      {/* ✅ Order Info Card */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <div className="grid sm:grid-cols-2 gap-4 text-gray-800">
          <div>
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.status === "Paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {order.status}
              </span>
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : order.date || "—"}
            </p>
          </div>

          <div>
            <p>
              <strong>Payment Method:</strong> Stripe
            </p>
            <p>
              <strong>Transaction ID:</strong> {order.paymentId || "N/A"}
            </p>
            <p>
              <strong>Amount:</strong> ₹{order.amount}
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Items Section */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">Items</h2>
        {order.products && order.products.length > 0 ? (
          <ul className="space-y-3">
            {order.products.map((p, idx) => {
              const qty =
                p.qty ||
                p.quantity ||
                p.Qty ||
                p?.product?.qty ||
                p?.product?.quantity ||
                1;

              return (
                <li
                  key={idx}
                  className="flex justify-between items-center border-b pb-2 last:border-0"
                >
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-500">
                      {p.size ? `Size: ${p.size} • ` : ""}
                      {p.variant ? `Variant: ${p.variant} • ` : ""}
                      Qty: {qty}
                    </div>
                  </div>
                  <div className="font-semibold">₹{p.price * qty}</div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500">No items found.</p>
        )}
      </div>

      {/* ✅ Payment / Success Message */}
      <div className="mt-4">
        {order.status !== "Paid" ? (
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-lg shadow flex justify-center items-center transition duration-200"
          >
            {loading ? "Redirecting..." : `Pay Now (₹${order.amount})`}
          </button>
        ) : (
          <div className="text-green-600 font-semibold text-center text-lg">
            ✅ Payment Completed
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ Server-side fetch
export async function getServerSideProps(context) {
  const { id } = context.query;
  await connectDb();

  const orderDoc = await Order.findById(id).lean();
  if (!orderDoc) return { props: { initialOrder: null } };

  return {
    props: {
      initialOrder: {
        ...orderDoc,
        _id: orderDoc._id.toString(),
        createdAt: orderDoc.createdAt
          ? orderDoc.createdAt.toISOString()
          : null,
        updatedAt: orderDoc.updatedAt
          ? orderDoc.updatedAt.toISOString()
          : null,
        date: orderDoc.date ? orderDoc.date.toString() : null,
      },
    },
  };
}
