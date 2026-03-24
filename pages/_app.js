
import "@/styles/globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import LoadingBar from "react-top-loading-bar";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  // ✅ Global States
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [user, setUser] = useState({ value: null });
  const [key, setKey] = useState();
  const [progress, setProgress] = useState(0);
  const [cartLoaded, setCartLoaded] = useState(false); 
  const router = useRouter();

  // ✅ Protect routes that require authentication
  useEffect(() => {
    const protectedRoutes = ["/checkout", "/orders", "/orders/[id]"];
    if (protectedRoutes.includes(router.pathname)) {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
      }
    }
  }, [router.pathname]);

  // ✅ Loading Bar for page transitions
  useEffect(() => {
    const handleStart = () => setProgress(30);
    const handleStop = () => setProgress(100);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  // ✅ Load cart & user safely on first render
  useEffect(() => {
    try {
      // 🆕 Added safety: Ensure localStorage access is available
      if (typeof window !== "undefined") {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          setCart(parsedCart);

          // 🧮 Calculate subtotal
          let subt = 0;
          for (let key in parsedCart) {
            subt += parsedCart[key].price * parsedCart[key].qty;
          }
          setSubTotal(subt);
        }

        // 🧩 Load user token if available
        const token = localStorage.getItem("token");
        if (token) {
          setUser({ value: token });
          setKey(Math.random());
        }
      }
    } catch (error) {
      console.error("Cart load error:", error);
      localStorage.removeItem("cart");
    }

    setCartLoaded(true); // ✅ Mark cart as loaded
  }, []);

  // ✅ Re-check user session on every route change
  useEffect(() => {
    const handleRouteChange = () => {
      const token = localStorage.getItem("token");
      setUser({ value: token || null });
      setKey(Math.random());
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  // ✅ Save cart automatically whenever it changes (after load)
  useEffect(() => {
    if (cartLoaded) {
      // 🆕 Prevents accidental overwrite on first render
      localStorage.setItem("cart", JSON.stringify(cart));

      let subt = 0;
      for (let key in cart) {
        subt += cart[key].price * cart[key].qty;
      }
      setSubTotal(subt);
    }
  }, [cart, cartLoaded]);

  // 🛒 CART FUNCTIONS ----------------------------

  // ✅ Add item to cart
  const addToCart = (itemCode, qty, price, name, size, variant, productId) => {
    let newCart = { ...cart };
    if (itemCode in newCart) {
      newCart[itemCode].qty = newCart[itemCode].qty + qty;
      newCart[itemCode].size = size;
      newCart[itemCode].variant = variant;
    } else {
      newCart[itemCode] = { qty, price, name, size, variant, productId };
    }
    setCart(newCart);
  };

  // ✅ Buy Now (replaces cart and goes to checkout)
  const buyNow = (itemCode, qty, price, name, size, variant, productId) => {
    let newCart = {};
    newCart[itemCode] = { qty, price, name, size, variant, productId };
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart)); // 🆕 Ensure persistence for buyNow as well
    router.push("/checkout");
  };

  // ✅ Clear cart completely
  const clearCart = () => {
    setCart({});
    setSubTotal(0);
    localStorage.removeItem("cart");
  };

  // ✅ Remove item or decrease quantity
  const removeFromCart = (itemCode, qty) => {
    let newCart = JSON.parse(JSON.stringify(cart));
    if (itemCode in newCart) {
      newCart[itemCode].qty = newCart[itemCode].qty - qty;
    }
    if (newCart[itemCode]?.qty <= 0) {
      delete newCart[itemCode];
    }
    setCart(newCart);
  };

  // ✅ Logout functionality
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser({ value: null });
    setKey(Math.random());
    router.push("/login");
    toast.success("Logged out successfully!", {
      position: "top-center",
      autoClose: 1500,
    });
  };

  // ✅ Render UI after cart is loaded to avoid flicker
  return (
    <>
      {/* 🧭 Top Loading Bar */}
      <LoadingBar
        color="#f11946"
        progress={progress}
        height={4}
        onLoaderFinished={() => setProgress(0)}
      />

      {/* 🧩 Navbar (receives cart, user, etc.) */}
      <Navbar
        user={user}
        key={key}
        logout={logout}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
      />

      {/* 🆕 Wait until cart is loaded before showing checkout pages */}
      {cartLoaded && (
        <Component
          cart={cart}
          addToCart={addToCart}
          buyNow={buyNow}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          subTotal={subTotal}
          {...pageProps}
        />
      )}

      {/* 🧱 Footer */}
      <Footer />

      {/* 🔔 Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
