// models/Order.js
import mongoose from "mongoose";

// 🧩 Sub-schema for products within an order
const ProductSubSchema = new mongoose.Schema(
  {
    productId: String,
    name: String,
    qty: Number,
    price: Number,
    size: String,
    variant: String,
    availableQty: Number, // ✅ store available stock at order time
  },
  { _id: false }
);

// 🧩 Main order schema
const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [ProductSubSchema],
    amount: { type: Number, required: true },
    address: String,
    phone: String,
    status: {
      type: String,
      enum: ["Placed", "Pending Payment", "Paid", "Failed"],
      default: "Pending Payment",
    },
    paymentStatus: { type: String, default: "pending" },
    paymentId: { type: String }, // e.g., Stripe payment ID
    stripeSessionId: String,
  },
  { timestamps: true } // ✅ adds createdAt & updatedAt automatically
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
