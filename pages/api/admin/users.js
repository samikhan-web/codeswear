import connectDb from "@/middleware/mongoose";
import User from "@/models/User";

async function handler(req, res) {

  if (req.method === "GET") {
    try {

      const users = await User.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        users
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Error fetching users"
      });

    }
  }

}

export default connectDb(handler);