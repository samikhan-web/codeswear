import React from "react";
import { FaCode, FaRocket, FaUsers } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-4">

      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <h1 className="text-4xl font-bold text-center text-pink-600 mb-6">
          About CodesWear
        </h1>

        <p className="text-center text-gray-600 mb-10 text-lg">
          Wear your passion. Express your code.
        </p>

        {/* Main Card */}
        <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-gray-200">

          <p className="text-gray-700 text-lg mb-4">
            Welcome to <span className="font-semibold text-pink-500">CodesWear</span> —
            your one-stop destination for developer-themed apparel.
          </p>

          <p className="text-gray-600 mb-4">
            We believe coding is not just a skill, it's an identity. That’s why we design
            premium T-Shirts, Hoodies, Mugs, and Stickers.
          </p>

          <p className="text-gray-600 mb-6">
            Whether you're a beginner or a pro developer, CodesWear helps you wear your passion with pride.
          </p>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-6">

            <div className="bg-pink-50 p-5 rounded-xl text-center shadow-sm">
              <FaCode className="text-pink-500 text-3xl mx-auto mb-3" />
              <h3 className="font-semibold text-lg">Developer First</h3>
              <p className="text-gray-600 text-sm">Made for coders & creators</p>
            </div>

            <div className="bg-purple-50 p-5 rounded-xl text-center shadow-sm">
              <FaRocket className="text-purple-500 text-3xl mx-auto mb-3" />
              <h3 className="font-semibold text-lg">Premium Quality</h3>
              <p className="text-gray-600 text-sm">Top-notch materials</p>
            </div>

            <div className="bg-blue-50 p-5 rounded-xl text-center shadow-sm">
              <FaUsers className="text-blue-500 text-3xl mx-auto mb-3" />
              <h3 className="font-semibold text-lg">Community</h3>
              <p className="text-gray-600 text-sm">Built for developers</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default About;