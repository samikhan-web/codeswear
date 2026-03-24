import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { IoCartOutline } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { FaShoppingBag, FaBars } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";

const NAVBAR_HEIGHT_PX = 48; // used to keep cart below navbar

const Navbar = ({ cart, addToCart, removeFromCart, clearCart, subTotal, user, logout }) => {
  const ref = useRef();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // ✅ Client-only mount state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ✅ Safe cart reference
  const safeCart = cart || {};
  const cartCount = Object.keys(safeCart).length; // ✅ cart count for cleaner usage

  // ✅ Toggle cart manually
  const toggleCart = () => {
    if (!ref.current) return;
    if (ref.current.classList.contains("translate-x-full")) {
      ref.current.classList.remove("translate-x-full");
      ref.current.classList.add("translate-x-0");
      setCartOpen(true);
    } else {
      ref.current.classList.remove("translate-x-0");
      ref.current.classList.add("translate-x-full");
      setCartOpen(false);
    }
  };

  // ✅ Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Auto open/close cart based on route and cart
  useEffect(() => {
    if (!ref.current) return;

    const exempted = ["/checkout", "/order", "/orders", "/myaccount"];

    if (exempted.includes(router.pathname)) {
      // Close cart on checkout/order/myaccount
      ref.current.classList.remove("translate-x-0");
      ref.current.classList.add("translate-x-full");
      setCartOpen(false);
    } else if (cartCount !== 0) {
      // Auto-open if cart has items
      ref.current.classList.remove("translate-x-full");
      ref.current.classList.add("translate-x-0");
      setCartOpen(true);
    }
  }, [router.pathname, cartCount]);

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full h-12 z-50 flex items-center px-4 transition-all duration-300 
          ${scrolled 
           ? "bg-pink-500/80 backdrop-blur-xl shadow-lg border-b border-white/20" 
           : "bg-gradient-to-r from-pink-500 via-pink-500 to-purple-500 shadow-md"}`}
        role="navigation"
        aria-label="Main"
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/Logo3.png"
              alt="CodesWear"
              width={36}
              height={36}
              className="object-contain"
            />
          </Link>

          {/* Center: Menu */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold">
  
       <Link href="/tshirts" className="relative group text-white/90 hover:text-white transition">
         T-Shirts
         <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
       </Link>

       <Link href="/hoodies" className="relative group text-white/90 hover:text-white transition">
        Hoodies
        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
       </Link>

       <Link href="/mugs" className="relative group text-white/90 hover:text-white transition">
         Mugs
         <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
       </Link>

       <Link href="/stickers" className="relative group text-white/90 hover:text-white transition">
         Stickers
         <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
       </Link>
         <Link href="/about" className="relative group text-white/90 hover:text-white transition">
          About
          <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
        </Link>

        <Link href="/contact" className="relative group text-white/90 hover:text-white transition">
          Contact
          <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
        </Link>

    </div>

          {/* Right: Account + Cart + Hamburger */}
          {mounted && (
            <div className="flex items-center space-x-3 relative">
              {/* User login */}
              {!user?.value && (
                <Link href="/login" aria-label="Login">
                  <MdAccountCircle className="text-2xl text-white hover:text-pink-200 transition-colors cursor-pointer" />
                </Link>
              )}
              {user?.value && (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-1 text-white hover:text-pink-200"
                  >
                    <MdAccountCircle className="text-2xl" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50">
                      <Link
                        href="/myaccount"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Account
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Orders
                      </Link>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-pink-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Cart Icon */}
              <button
                onClick={toggleCart}
                aria-label="Open cart"
                className="relative p-1 text-white hover:text-pink-200 transition-colors"
              >
                <IoCartOutline className="text-2xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-pink-600 shadow-md ring-2 ring-pink-400 rounded-full text-xs px-2 font-semibold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Hamburger */}
              <button
                className="md:hidden p-1 text-2xl text-white hover:text-pink-200"
                aria-label="Open menu"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <FaBars />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute left-0 top-12 w-full bg-pink-600 z-50 md:hidden shadow-md">
            <div className="container mx-auto flex flex-col py-2 px-4 space-y-2">
              <Link href="/tshirts" className="text-white hover:text-pink-200">T-Shirts</Link>
              <Link href="/hoodies" className="text-white hover:text-pink-200">Hoodies</Link>
              <Link href="/mugs" className="text-white hover:text-pink-200">Mugs</Link>
              <Link href="/stickers" className="text-white hover:text-pink-200">Stickers</Link>
              <Link href="/about" className="text-white hover:text-pink-200">About</Link>
              <Link href="/contact" className="text-white hover:text-pink-200">Contact</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer below navbar */}
      <div style={{ height: `${NAVBAR_HEIGHT_PX}px` }} />

      {/* Overlay for mobile */}
      {mounted && cartOpen && (
        <div
          onClick={toggleCart}
          className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"
        ></div>
      )}

      {/* SideCart */}
      {mounted && (
        <div
          ref={ref}
          className="w-[85%] sm:w-80 fixed right-0 transform translate-x-full transition-transform duration-300 bg-white/90 backdrop-blur-lg border-l border-gray-200 shadow-xl z-40"
          style={{
            top: `${NAVBAR_HEIGHT_PX}px`,
            height: `calc(100vh - ${NAVBAR_HEIGHT_PX}px)`,
          }}
        >
          {/* All existing cart content unchanged */}
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-pink-700">Shopping Cart</h2>
              <button onClick={toggleCart} aria-label="Close cart">
                <IoMdCloseCircle className="text-2xl text-pink-400" />
              </button>
            </div>

            <div className="overflow-y-auto pr-2" style={{ height: "calc(100% - 150px)" }}>
              <ol className="list-decimal space-y-4">
                {cartCount === 0 && (
                  <div className="text-center text-pink-400 font-medium py-6">
                    Your cart is empty
                  </div>
                )}
                {Object.keys(safeCart).map((k) => (
                  <li key={k}>
                    <div className="flex justify-between items-center">
                      <div className="w-2/3 text-sm font-medium">
                        {safeCart[k].name}{" "}
                        <span className="text-xs text-gray-500">
                          ({safeCart[k].size}/{safeCart[k].variant})
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AiFillMinusCircle
                          onClick={() =>
                            removeFromCart(k, 1, safeCart[k].price, safeCart[k].name, safeCart[k].size, safeCart[k].variant)
                          }
                          className="cursor-pointer text-pink-400"
                        />
                        <span className="px-2">{safeCart[k].qty}</span>
                        <AiFillPlusCircle
                          onClick={() =>
                            addToCart(k, 1, safeCart[k].price, safeCart[k].name, safeCart[k].size, safeCart[k].variant)
                          }
                          className="cursor-pointer text-pink-400"
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-4 border-t border-pink-300 pt-4">
              <div className="flex justify-between font-semibold text-gray-800 mb-3">
                <span>Subtotal:</span>
                <span>₹{subTotal}</span>
              </div>

              <div className="flex space-x-3">
                <Link href={cartCount === 0 ? "#" : "/checkout"} className="flex-1">
                  <button
                    disabled={cartCount === 0}
                    className={`w-full flex items-center justify-center text-white px-3 py-2 rounded-md shadow-md ${
                      cartCount === 0 ? "bg-pink-300 cursor-not-allowed" : "bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition"
                    }`}
                  >
                    <FaShoppingBag className="mr-2" /> Checkout
                  </button>
                </Link>

                <button
                  onClick={clearCart}
                  disabled={cartCount === 0}
                  className={`flex-1 px-3 py-2 rounded-md shadow-md text-white ${
                    cartCount === 0 ? "bg-pink-300 cursor-not-allowed" : "bg-pink-400 hover:bg-pink-500"
                  }`}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
