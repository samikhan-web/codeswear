// pages/api/orders/[id].js
import connectDb from "@/middleware/mongoose";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  if (req.method !== "GET")
    return res.status(405).json({ success: false, message: "Method not allowed" });

  try {
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ success: false, message: "Unauthorized" });

    const token = authorization.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const userId = decoded?.id || decoded?.userId || decoded?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Invalid token payload" });

    const { id } = req.query;
    const orderDoc = await Order.findById(id).lean();

    if (!orderDoc) return res.status(404).json({ success: false, message: "Order not found" });

    if (orderDoc.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const order = {
      _id: orderDoc._id.toString(),
      products: (orderDoc.products || []).map((p) => ({
        name: p.name,
        quantity: p.quantity,
        price: p.price,
        size: p.size || null,
        variant: p.variant || null,
        productId: p.productId ? p.productId.toString() : null,
      })),
      amount: orderDoc.amount,
      address: orderDoc.address,
      phone: orderDoc.phone,
      status: orderDoc.status,
      paymentStatus: orderDoc.paymentStatus || null,
      stripeSessionId: orderDoc.stripeSessionId || null,
      createdAt: orderDoc.createdAt ? orderDoc.createdAt.toISOString() : null,
      updatedAt: orderDoc.updatedAt ? orderDoc.updatedAt.toISOString() : null,
    };

    return res.status(200).json({ success: true, order, data: order });
  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default connectDb(handler);
