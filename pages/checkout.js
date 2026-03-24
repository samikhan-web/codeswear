import { useState, useEffect } from "react";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { FaShoppingBag } from "react-icons/fa";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout = ({ cart, addToCart, removeFromCart, subTotal, clearCart }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    pincode: "",
    address: "",
    city: "",
    state: "",
  });

  const [localCart, setLocalCart] = useState(cart || {});
  const [localSubTotal, setLocalSubTotal] = useState(subTotal || 0);

  const [pincodes, setPincodes] = useState({});
  const [loading, setLoading] = useState(false);
  const [serviceable, setServiceable] = useState(null);
  const router = useRouter();

  // ✅ Auto-fill user details from My Account API
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const stored = localStorage.getItem("user");
        const tokenFromLS = localStorage.getItem("token"); // 🛠️ ADDED: fallback token from localStorage

        // If neither user nor token exist, do nothing
        if (!stored && !tokenFromLS) return;

        // 🛠️ ADDED: support both ways user info may be stored:
        // - older flow: localStorage has separate "token" and "user" (user without token)
        // - some flows: "user" object might contain token property
        let tokenToUse = "";
        let parsed = null;
        if (stored) {
          try {
            parsed = JSON.parse(stored);
          } catch (e) {
            parsed = null;
          }
          tokenToUse = (parsed && parsed.token) || tokenFromLS || "";
        } else {
          tokenToUse = tokenFromLS || "";
        }
        if (!tokenToUse) return;

        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenToUse }),
        });

        const data = await res.json();
        if (data.success) {
          setForm((prev) => ({
            ...prev,
            name: data.name || prev.name,
            email: data.email || prev.email,
            phone: data.phone || prev.phone,
            address: data.address || prev.address,
            city: data.city || prev.city,
            state: data.state || prev.state,
            pincode: data.pincode || prev.pincode,
          }));
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    fetchUserDetails();
  }, []);

  // Real-time sync with MyAccount updates
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const updated = JSON.parse(localStorage.getItem("user"));
        if (updated) {
          setForm((prev) => ({
            ...prev,
            name: updated.name || prev.name,
            phone: updated.phone || prev.phone,
            address: updated.address || prev.address,
            city: updated.city || prev.city,
            state: updated.state || prev.state,
            pincode: updated.pincode || prev.pincode,
          }));
        }
      } catch (err) {
        console.error("Error syncing user from localStorage:", err);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Persist cart locally
  useEffect(() => {
    try {
      if ((!cart || Object.keys(cart).length === 0) && localStorage.getItem("cart")) {
        const storedCart = JSON.parse(localStorage.getItem("cart"));
        setLocalCart(storedCart);
        const total = Object.keys(storedCart).reduce(
          (acc, key) => acc + storedCart[key].price * storedCart[key].qty,
          0
        );
        setLocalSubTotal(total);
      } else {
        setLocalCart(cart);
        setLocalSubTotal(subTotal);
      }
    } catch (err) {
      console.error("Error loading cart from localStorage:", err);
    }
  }, [cart, subTotal]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(localCart));
  }, [localCart]);

  // Fetch serviceable pincodes
  useEffect(() => {
    const fetchPincodes = async () => {
      try {
        const res = await fetch("/api/pincode");
        const data = await res.json();
        setPincodes(data);
      } catch (err) {
        console.error("Error fetching pincodes:", err);
      }
    };
    fetchPincodes();
  }, []);

  // 🛠️ ADDED: Auto-check pref-filled pincode once pincodes are loaded (NO toast)
  // This enables the Place Order button for users whose pincode is already stored in their profile.
  useEffect(() => {
    try {
      const pin = (form.pincode || "").trim();
      if (!pin || Object.keys(pincodes).length === 0) return;

      if (/^\d{5}$/.test(pin) && pincodes[pin]) {
        // Do not show toast here (silent auto-check) — user shouldn't have to re-type to enable button
        setForm((prev) => ({
          ...prev,
          city: pincodes[pin].city || prev.city,
          state: pincodes[pin].state || prev.state,
        }));
        setServiceable(true);
      } else if (/^\d{5}$/.test(pin)) {
        setForm((prev) => ({ ...prev, city: "", state: "" }));
        setServiceable(false);
      } else {
        setServiceable(null);
      }
    } catch (err) {
      console.error("Auto-check pincode error:", err);
    }
    // We intentionally depend on form.pincode and pincodes
  }, [form.pincode, pincodes]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "pincode") {
      const pin = value.trim(); // ✅ trim whitespace
      setForm({ ...form, pincode: pin });

      // ✅ Pakistani pincodes are numeric 5 digits
      if (/^\d{5}$/.test(pin) && pincodes[pin]) {
        setForm((prev) => ({
          ...prev,
          city: pincodes[pin].city,
          state: pincodes[pin].state,
        }));
        if (serviceable !== true) {
          toast.success("Your pincode is serviceable!");
        }
        setServiceable(true);
      } else if (/^\d{5}$/.test(pin)) {
        toast.error("Sorry! Pincode is not serviceable.");
        setForm((prev) => ({ ...prev, city: "", state: "" }));
        setServiceable(false);
      } else {
        setServiceable(null);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCheckout = async () => {
    // 🛠️ ADDED: Prevent double-clicks / double submissions
    if (loading) return;

    // 🛠️ CHANGED: sanitize phone by removing non-digits before validating
    const cleanedPhone = (form.phone || "").replace(/\D/g, "");

    if (cleanedPhone.length !== 11) {
      toast.error("Phone number must be exactly 11 digits.");
      return;
    }

    if (form.pincode.length !== 5) {
      toast.error("Pincode must be exactly 5 digits.");
      return;
    }

    if (!form.name || !form.address || !form.pincode) {
      toast.warn("Please fill in your name, address, and pincode.");
      return;
    }

    if (!Object.keys(localCart).length) {
      toast.error("🛒 Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      const products = Object.keys(localCart).map((k) => {
        const item = localCart[k];
        return {
          productId: item.productId || null,
          name: item.name,
          quantity: item.qty || 1,
          size: item.size || "",
          variant: item.variant || "",
          price: item.price,
        };
      });

      // 🛠️ CHANGED: use cleanedPhone for API
      const orderData = {
        products,
        amount: localSubTotal,
        address: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
        name: form.name,
        email: form.email, // keep existing behavior; backend will validate against token
        phone: cleanedPhone, // ✅ send sanitized phone to API
        pincode: form.pincode, // ✅ send pincode to API
        paymentMethod: "Cash on Delivery",
      };

      // 🛠️ ADDED: safer token handling (try user.token then fallback to local token)
      let token = "";
      const storedUserStr = localStorage.getItem("user");
      const tokenFromLS = localStorage.getItem("token");
      let parsedUser = null;
      if (storedUserStr) {
        try {
          parsedUser = JSON.parse(storedUserStr);
        } catch (e) {
          parsedUser = null;
        }
      }
      token = (parsedUser && parsedUser.token) || tokenFromLS || "";

      const res = await fetch("/api/createorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "", // ✅ added safer token usage
        },
        body: JSON.stringify(orderData),
      });

      const response = await res.json();

      if (response.success) {
        toast.success("Order placed successfully!", {
          position: "top-center",
          autoClose: 4000,
        });
        clearCart();
        localStorage.removeItem("cart");
        setForm((prev) => ({ ...prev, address: "", phone: "" }));
        setTimeout(() => {
          router.push(`/orders/${response.order?._id}`);
        }, 1500);
        return;
      }

      const message = (response.message || response.error || "").toString();

      if (message.toLowerCase().includes("only") || message.toLowerCase().includes("available")) {
        toast.error(message, { position: "top-center", autoClose: 4000 });
        setLoading(false);
        return;
      }

      if (message.toLowerCase().includes("tamper") || message.toLowerCase().includes("mismatch")) {
        toast.error(
          "Security check failed: possible cart tampering detected. Please refresh cart and try again.",
          { position: "top-center", autoClose: 4000 }
        );
        setLoading(false);
        return;
      }

      if (message.toLowerCase().includes("email mismatch")) {
        toast.error(message, { position: "top-center", autoClose: 4000 });
        setLoading(false);
        return;
      }

      if (message.toLowerCase().includes("unauthorized")) {
        toast.error("Session expired. Please log in again.", { position: "top-center", autoClose: 4000 });
        router.push("/login");
        setLoading(false);
        return;
      }

      toast.error(message || "Something went wrong. Try again.", { position: "top-center", autoClose: 4000 });
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Something went wrong. Please try again later.", { position: "top-center", autoClose: 4000 });
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading || !form.name || !form.address || !form.pincode || serviceable !== true;

  return (
    <div className="container mx-auto p-6">
      {/* Delivery Details Section */}
      <h1 className="text-2xl font-bold mb-4 text-pink-600">Delivery Details</h1>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {/* Name */}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="border border-pink-300 focus:border-pink-500 rounded-md p-2 w-full focus:ring-1 focus:ring-pink-400"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          readOnly
          className="border border-pink-300 bg-gray-100 rounded-md p-2 w-full cursor-not-allowed"
        />

        {/* Phone */}
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="border border-pink-300 focus:border-pink-500 rounded-md p-2 w-full focus:ring-1 focus:ring-pink-400"
        />

        {/* Pincode */}
        <input
          type="text"
          name="pincode"
          value={form.pincode}
          onChange={handleChange}
          placeholder="Pincode"
          className="border border-pink-300 focus:border-pink-500 rounded-md p-2 w-full focus:ring-1 focus:ring-pink-400"
        />

        {/* City */}
        <input
          type="text"
          name="city"
          value={form.city}
          disabled
          placeholder="City"
          className="border border-gray-300 bg-gray-100 rounded-md p-2 w-full cursor-not-allowed"
        />

        {/* State */}
        <input
          type="text"
          name="state"
          value={form.state}
          disabled
          placeholder="State"
          className="border border-gray-300 bg-gray-100 rounded-md p-2 w-full cursor-not-allowed"
        />

        {/* Address */}
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="border border-pink-300 focus:border-pink-500 rounded-md p-2 w-full md:col-span-2 focus:ring-1 focus:ring-pink-400"
        />
      </div>

      {/* Cart Review Section */}
      <h2 className="text-2xl font-bold mb-4 text-pink-600">Review Items & Pay</h2>
      <div className="bg-pink-50 rounded-lg p-4 mb-4">
        {Object.keys(localCart).length === 0 && <p className="text-gray-500">Your cart is empty.</p>}
        {Object.keys(localCart).map((k) => (
          <div key={k} className="flex justify-between items-center border-b border-pink-200 py-2">
            <div className="flex-1">
              <span className="font-medium text-gray-800">{localCart[k].name}</span>{" "}
              <span className="text-sm text-gray-500">
                ({localCart[k].size}/{localCart[k].variant})
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <AiFillMinusCircle
                onClick={() =>
                  removeFromCart(
                    k,
                    1,
                    localCart[k].price,
                    localCart[k].name,
                    localCart[k].size,
                    localCart[k].variant
                  )
                }
                className="cursor-pointer text-xl text-pink-500 hover:text-pink-700"
              />
              <span className="font-semibold">{localCart[k].qty}</span>
              <AiFillPlusCircle
                onClick={() =>
                  addToCart(
                    k,
                    1,
                    localCart[k].price,
                    localCart[k].name,
                    localCart[k].size,
                    localCart[k].variant,
                    localCart[k].productId
                  )
                }
                className="cursor-pointer text-xl text-pink-500 hover:text-pink-700"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Subtotal Section */}
      <div className="flex justify-between items-center text-lg mb-4">
        <span className="font-semibold text-gray-800">Subtotal:</span>
        <span className="font-bold text-pink-600">₹{localSubTotal}</span>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={isDisabled}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-lg shadow disabled:opacity-50"
      >
        <FaShoppingBag className="text-lg" />
        {loading ? "Placing Order..." : `Place Order ₹${localSubTotal}`}
      </button>
    </div>
  );
};

export default Checkout;
