// pages/api/updateuser.js
import connectDb from "@/middleware/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { token, name, phone, address, city, state, pincode } = req.body;

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

    // ✅ Update user
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { name, phone, address, city, state, pincode },
      { new: true, runValidators: true }
    ).select("-password -__v");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone || "",
      address: updatedUser.address || "",
      city: updatedUser.city || "",
      state: updatedUser.state || "",
      pincode: updatedUser.pincode || "",
    });
  } catch (error) {
    console.error("updateuser error:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

export default connectDb(handler);
