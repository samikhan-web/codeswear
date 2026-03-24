import connectDb from "@/middleware/mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

async function handler(req, res) {
  try {
    await connectDb(); // ensure DB connection

    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalProducts,
      },
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export default connectDb(handler);
