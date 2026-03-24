// pages/api/orders/myorders.js
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

    // return only safe fields; sanitize product objects
    const ordersDocs = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    const orders = ordersDocs.map((od) => ({
      _id: od._id.toString(),
      amount: od.amount,
      status: od.status,
      createdAt: od.createdAt ? od.createdAt.toISOString() : null,
      // include a small preview of products
      products: (od.products || []).map((p) => ({
        name: p.name,
        quantity: p.quantity,
        price: p.price,
        size: p.size || null,
        variant: p.variant || null,
      })),
    }));

    return res.status(200).json({ success: true, orders, data: orders });
  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default connectDb(handler);
