import connectDb from "@/middleware/mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    // ---- Step 1: Verify JWT token ----
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id || !decoded?.email) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }

    const userId = decoded.id;
    const userEmailFromToken = decoded.email;

    // ---- Step 2: Extract data from body ----
    const { products, amount, address, phone, email, pincode } = req.body; // ✅ include pincode
    if (!products || products.length === 0) {
      return res.status(400).json({ success: false, message: "Missing order data." });
    }

    // --- New validations for phone & pincode ---
    if (!phone || phone.length !== 11) {
      return res.status(400).json({ success: false, message: "Phone number must be exactly 11 digits." });
    }

    // ✅ Pakistani pincodes are numeric 5 digits
    if (!pincode || !/^\d{5}$/.test(pincode)) { 
      return res.status(400).json({ success: false, message: "Pincode must be exactly 5 digits." });
    }

    // ✅ ---- Step 2.5: Prevent placing order with a different Gmail ----
    if (email && email.toLowerCase() !== userEmailFromToken.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: "Email mismatch! You are logged in as a different user. Please use your registered email.",
      });
    }

    let verifiedTotal = 0;
    const verifiedProducts = [];

    // ---- Step 3: Validate stock ----
    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `❌ Product not found: ${item.name || item.productId}`,
        });
      }

      const qty = Number(item.quantity ?? item.qty ?? 1);

      if (qty > product.availableQty) {
        return res.status(400).json({
          success: false,
          message: `❌ Only ${product.availableQty} units available for "${product.title}". Please reduce quantity.`,
        });
      }

      verifiedTotal += product.price * qty;

      const remainingStock = product.availableQty - qty;

      verifiedProducts.push({
        productId: product._id.toString(),
        name: product.title,
        qty,
        price: product.price,
        size: item.size || "",
        variant: item.variant || "",
        availableQty: remainingStock, // ✅ store remaining stock in order record
      });
    }

    // ---- Step 4: Verify total ----
    if (Number(verifiedTotal.toFixed(2)) !== Number(amount.toFixed(2))) {
      return res.status(400).json({
        success: false,
        message: "Cart total mismatch — possible tampering detected.",
      });
    }

    // ---- Step 5: Create order ----
    const order = new Order({
      userId,
      products: verifiedProducts,
      amount: verifiedTotal,
      address,
      phone,
      status: "Pending Payment",
      paymentStatus: "pending",
      date: new Date(),
    });

    await order.save();

    // ---- Step 6: Reduce stock in Product collection ----
    for (const item of verifiedProducts) {
      const productId = new mongoose.Types.ObjectId(item.productId);
      await Product.updateOne(
        { _id: productId },
        { $inc: { availableQty: -item.qty } }
      );
    }

    return res.status(200).json({
      success: true,
      message: "✅ Order created successfully. Stock updated.",
      order,
    });
  } catch (err) {
    console.error("❌ createorder error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

export default connectDb(handler);
