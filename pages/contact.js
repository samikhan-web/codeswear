import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaEnvelope, FaUser } from "react-icons/fa";

const Contact = () => {

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Message Sent ✅");
        setForm({ name: "", email: "", message: "" });
      } else {
        toast.error("Something went wrong ❌");
      }

    } catch (error) {
      toast.error("Server error ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-4">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold text-center text-pink-600 mb-6">
          Contact Us
        </h1>

        <p className="text-center text-gray-600 mb-10">
          We'd love to hear from you 💬
        </p>

        <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-gray-200">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div className="relative">
              <FaUser className="absolute top-4 left-3 text-gray-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute top-4 left-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                required
              />
            </div>

            {/* Message */}
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows="5"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
              required
            ></textarea>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg hover:scale-105 transition"
            >
              Send Message
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};

export default Contact;