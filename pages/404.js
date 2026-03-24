// pages/404.js
import Link from "next/link";
import Navbar from "../components/Navbar";
import Image from "next/image";
import { FaHome } from "react-icons/fa";

export default function Custom404({ cart, addToCart, removeFromCart, clearCart, subTotal, user, logout }) {
  return (
    <>
      {/* Navbar always on top */}
      <Navbar
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
        user={user}
        logout={logout}
      />

      {/* Main 404 content */}
      <div className="min-h-[calc(100vh-48px)] flex flex-col items-center justify-center bg-pink-500 text-white text-center px-4 py-12 gap-6">
        {/* Image on top */}
        <Image
          src="/images/Empty shopping cart.png"
          alt="404 Not Found"
          width={300}
          height={300}
          style={{ width: "auto", height: "auto" }}
          priority
        />

        {/* Heading and text */}
        <h1 className="text-[6rem] font-bold mt-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mt-2 mb-2">Oops! Page Not Found</h2>
        <p className="max-w-md text-pink-100 mb-4">
          The page or product you’re looking for doesn’t exist or has been removed. Don’t worry — you can return to our homepage and continue shopping!
        </p>

        {/* Back to Home button */}
        <Link href="/">
          <button className="flex items-center gap-2 bg-white text-pink-500 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-pink-50 transition-colors">
            <FaHome size={18} />
            Back to Home
          </button>
        </Link>
      </div>

      {/* ❌ DO NOT RENDER FOOTER HERE if already in _app.js */}
      {/* <Footer /> */}
    </>
  );
}
