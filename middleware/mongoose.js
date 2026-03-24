// middleware/mongoose.js
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("Please set MONGO_URI in .env.local");
}

// global cache to avoid multiple connections in dev
if (!global._mongoose) global._mongoose = { conn: null, promise: null };

async function ensureConnection() {
  if (global._mongoose.conn) return global._mongoose.conn;
  if (!global._mongoose.promise) {
    global._mongoose.promise = mongoose
      .connect(MONGO_URI)
      .then((m) => {
        global._mongoose.conn = m;
        console.log("✅ MongoDB connected");
        return m;
      })
      .catch((err) => {
        global._mongoose.promise = null;
        console.error("❌ MongoDB connection error:", err.message);
        throw err;
      });
  }
  return global._mongoose.promise;
}

/**
 * connectDb behaves two ways:
 * - If you call connectDb(handler) it returns a middleware wrapper (keeps existing API usage).
 * - If you call await connectDb() it just ensures DB connection (for SSR or inside handlers).
 */
function connectDb(handler) {
  // If a function was passed in, return middleware wrapper.
  if (typeof handler === "function") {
    return async function wrappedHandler(req, res) {
      await ensureConnection();
      return handler(req, res);
    };
  }
  // Otherwise used as: await connectDb();
  return ensureConnection();
}

export default connectDb;
