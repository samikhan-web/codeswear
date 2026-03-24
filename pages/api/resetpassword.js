// pages/api/resetpassword.js
import connectDb from "@/middleware/mongoose";
import User from "@/models/User";
import Forgot from "@/models/Forgot";
import crypto from "crypto";
import bcrypt from "bcryptjs";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { token, password } = req.body || {};

  if (!token || !password) {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }

  // Hash the incoming token (to compare with DB)
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  // Find token record
  const tokenRecord = await Forgot.findOne({ token: tokenHash });
  if (!tokenRecord) {
    return res.status(400).json({ success: false, message: "Invalid or expired token" });
  }

  // Check expiration
  if (tokenRecord.expire < new Date()) {
    return res.status(400).json({ success: false, message: "Reset link has expired" });
  }

  // Find user by email
  const user = await User.findOne({ email: tokenRecord.email });
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update password
  user.password = hashedPassword;
  await user.save();

  // Delete the token after successful reset (one-time use)
  await Forgot.deleteOne({ _id: tokenRecord._id });

  return res.status(200).json({ success: true, message: "Password reset successful. You can now log in." });
}

export default connectDb(handler);
