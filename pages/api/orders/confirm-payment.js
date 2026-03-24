// pages/api/orders/confirm-payment.js
import Stripe from "stripe";
import connectDb from "@/middleware/mongoose";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
  if (req.method !== "POST")
    return res.status(405).json({ success: false, message: "Method not allowed" });

  const { session_id } = req.body;
  if (!session_id) return res.status(400).json({ success: false, message: "session_id required" });

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded?.id || decoded?.userId || decoded?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Invalid token payload" });

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({ success: false, message: "Payment not completed" });
    }

    // Find order by metadata.orderId OR stripeSessionId
    let order = null;
    if (session.metadata?.orderId) {
      order = await Order.findById(session.metadata.orderId);
    }
    if (!order) {
      order = await Order.findOne({ stripeSessionId: session.id });
    }
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    // Only update if not already paid (idempotency)
    if (order.paymentStatus !== "paid") {
      order.status = "Paid";
      order.paymentStatus = "paid";
      order.paymentId = session.payment_intent || "";
      await order.save();
    }

    return res.json({ success: true, order });
  } catch (err) {
    console.error("confirm-payment error:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

export default connectDb(handler);
