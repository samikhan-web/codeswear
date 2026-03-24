import React, { useState } from "react";
import Image from "next/image";
import { MdEmail } from "react-icons/md";
import { toast } from "react-toastify";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      toast[data.success ? "success" : "error"](data.message);
      if (data.success) setEmail("");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* ✅ Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/Navlogo.png"
            alt="CodesWear Logo"
            width={50}
            height={50}
            className="object-contain"
          />
        </div>

        {/* ✅ Heading */}
        <h2 className="text-2xl font-bold text-center text-pink-600 mb-2">
          Forgot your password?
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Enter your email address and we’ll send you a link to reset your password.
        </p>

        {/* ✅ Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-pink-400">
              <MdEmail className="text-gray-400 mr-2 text-lg" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-pink-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* ✅ Back to Login */}
        <div className="mt-5 text-center text-sm text-gray-600">
          <p>
            Remembered your password?{" "}
            <a href="/login" className="text-pink-600 hover:underline">
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
