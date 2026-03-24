import connectDb from "@/middleware/mongoose";
import Order from "@/models/Order";

async function handler(req, res) {

  if (req.method === "GET") {
    try {

      const orders = await Order.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        orders
      });

    } catch (error) {
      res.status(500).json({
        success:false,
        message:"Error fetching orders"
      });
    }
  }

}

export default connectDb(handler);