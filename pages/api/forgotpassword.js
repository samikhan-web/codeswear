// pages/api/forgotpassword.js
import connectDb from "@/middleware/mongoose";
import User from "@/models/User";
import Forgot from "@/models/Forgot";
import crypto from "crypto";
import { sendEmail } from "@/lib/sendEmail";
import forgotPasswordTemplate from "@/lib/emailTemplates/forgotPassword";

async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false, message: "Method not allowed" });

  const { email } = req.body || {};
  if (!email) return res.status(400).json({ success: false, message: "Email required" });

  const normalizedEmail = String(email).trim().toLowerCase();

  // Find user — but don't reveal existence in response (prevent enumeration)
  const user = await User.findOne({ email: normalizedEmail });

  // If no user: respond with generic success (don't create token or send mail)
  if (!user) {
    return res.status(200).json({ success: true, message: "If an account with that email exists, a reset link was sent." });
  }

  // Generate raw token (send via email) and a hashed version to store.
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  // Expire in 15 minutes
  const expire = new Date(Date.now() + 15 * 60 * 1000);

  // Upsert hashed token for that email
  await Forgot.findOneAndUpdate(
    { email: normalizedEmail },
    { token: tokenHash, expire },
    { upsert: true, new: true }
  );

  // Reset link that includes raw token
  const resetLink = `${process.env.NEXT_PUBLIC_HOST}/resetpassword/${rawToken}`;

  // Email content
  const html = forgotPasswordTemplate({ resetUrl: resetLink, name: user.name });

  // Send with Resend helper
  try {
    await sendEmail({
      to: normalizedEmail,
      subject: "Reset your CodesWear password",
      html,
    });
  } catch (err) {
    // log but still return generic success to avoid revealing internals
    console.error("Failed to send reset email:", err);
  }

  // Generic response (prevents account enumeration)
  return res.status(200).json({ success: true, message: "If an account with that email exists, a reset link was sent." });
}

export default connectDb(handler);
