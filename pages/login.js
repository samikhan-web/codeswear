import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MdEmail, MdLock } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // ✅ Fixed toast message handling
        toast.success(data.message || "Login successful!", {
          position: "top-center",
          autoClose: 1500,
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setEmail("");
        setPassword("");

        // Redirect after a short delay so toast shows properly
        setTimeout(() => {
          router.push("/");
        }, 1600);
      } else {
        // ✅ Handles both validation & invalid credential errors
        toast.error(data.message || data.error || "Invalid credentials", {
          position: "top-center",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.", {
        position: "top-center",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-50 via-pink-100 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <Image
            src="/Navlogo.png"
            alt="CodesWear Logo"
            width={60}
            height={60}
            className="object-contain"
          />
        </div>

        <h2 className="text-3xl font-extrabold text-center text-pink-600 mb-6">
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-pink-400 transition">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-pink-400 transition">
              <MdLock className="text-gray-400 mr-2 text-lg" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 text-pink-500"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-pink-600 hover:underline">
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-pink-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Don’t have an account?{" "}
            <Link href="/signup" className="text-pink-600 font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
