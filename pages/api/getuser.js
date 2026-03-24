// pages/api/getuser.js
import connectDb from "@/middleware/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // ✅ Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }

    // ✅ Fetch user by ID
    const user = await User.findById(decoded.id).select("-password -__v");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      state: user.state || "",
      pincode: user.pincode || "",
    });
  } catch (error) {
    console.error("getuser error:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

export default connectDb(handler);
