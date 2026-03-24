import React, { useState } from "react";
import Image from "next/image";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      const errMsg = "Passwords do not match!";
      setMessage(errMsg);
      toast.error(errMsg, { position: "top-center" });
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const successMsg = data.success || "Signup successful!";
        toast.success(successMsg, { position: "top-center", autoClose: 1500 });
        setMessage(successMsg);

        if (data.token) {
          try {
            localStorage.setItem("token", data.token);
            if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
          } catch (err) {
            console.warn("Could not save token to localStorage:", err);
          }
        }

        setTimeout(() => {
          router.push("/");
        }, 1500);

        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        const err = data.error || "Signup failed";
        setMessage(err);
        toast.error(err, { position: "top-center" });
      }
    } catch (err) {
      console.error(err);
      const errMsg = "Something went wrong. Please try again.";
      setMessage(errMsg);
      toast.error(errMsg, { position: "top-center" });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-4">
          <Image
            src="/Navlogo.png"
            alt="CodesWear Logo"
            width={50}
            height={50}
            className="object-contain"
          />
        </div>

        <h2 className="text-3xl font-extrabold text-center text-pink-600 mb-6">
          Create an Account
        </h2>

        {message && (
          <p
            className={`text-center mb-4 ${
              message.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-pink-400">
              <MdPerson className="text-gray-400 mr-2 text-lg" />
              <input
                type="text"
                name="name"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-pink-400">
              <MdEmail className="text-gray-400 mr-2 text-lg" />
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-pink-400">
              <MdLock className="text-gray-400 mr-2 text-lg" />
              <input
                type="password"
                name="password"
                required
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-pink-400">
              <MdLock className="text-gray-400 mr-2 text-lg" />
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="********"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-pink-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-gray-600">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-pink-600 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
