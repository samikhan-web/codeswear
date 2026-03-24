// models/Forgot.js
import mongoose from "mongoose";

const ForgotSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    token: { type: String, required: true }, // hashed token (sha256)
    expire: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

// TTL index: MongoDB will automatically remove documents once `expire` is reached.
ForgotSchema.index({ expire: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Forgot || mongoose.model("Forgot", ForgotSchema);
