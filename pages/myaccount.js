// pages/myaccount.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyAccount = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [passwordData, setPasswordData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token) {
    router.push("/login");
    return;
  }

  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    setUser({ ...parsedUser, token });
  } else {
    // if no user in localStorage, still set token so we can fetch user data
    setUser({ token });
  }

  fetchUserData(token);
}, []);


  const fetchUserData = async (token) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }), // ✅ send token correctly
      });

      const data = await res.json();
      if (data.success) {
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
        });
      } else {
        toast.error("Failed to load user data");
        if (data.error && data.error.toLowerCase().includes("unauthorized")) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          router.push("/login");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching user info");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updateuser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: user.token, ...formData }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Details updated successfully!");

        const updatedUser = { ...user, ...formData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        window.dispatchEvent(new Event("storage"));
      } else {
        toast.error(data.error || "Error updating details");
        if (data.error && data.error.toLowerCase().includes("unauthorized")) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          router.push("/login");
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updatepassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: user.token,
          password: passwordData.password,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Password updated successfully!");
        setPasswordData({ password: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.error || "Failed to update password");
        if (data.error && data.error.toLowerCase().includes("unauthorized")) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          router.push("/login");
        }
      }
    } catch (error) {
      toast.error("Error updating password");
    }
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <ToastContainer position="top-center" autoClose={3000} />
      <h1 className="text-3xl font-bold text-pink-600 mb-8">My Account</h1>

      {/* ===== Delivery Details ===== */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Delivery Details</h2>
        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="border border-pink-300 p-3 rounded-md focus:ring-2 focus:ring-pink-400"
            required
          />
          <input
            name="email"
            value={formData.email}
            type="email"
            placeholder="Email"
            className="border border-gray-300 p-3 rounded-md bg-gray-100 cursor-not-allowed"
            readOnly
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="border border-pink-300 p-3 rounded-md focus:ring-2 focus:ring-pink-400"
            required
          />
          <input
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            className="border border-pink-300 p-3 rounded-md focus:ring-2 focus:ring-pink-400"
          />
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="border border-gray-300 p-3 rounded-md"
          />
          <input
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            className="border border-gray-300 p-3 rounded-md"
          />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Full Address"
            className="border border-pink-300 p-3 rounded-md col-span-1 md:col-span-2 focus:ring-2 focus:ring-pink-400"
            rows="3"
          />
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-md col-span-1 md:col-span-2 shadow"
          >
            Update Details
          </button>
        </form>
      </div>

      {/* ===== Change Password ===== */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Change Password</h2>
        <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="password"
            name="password"
            value={passwordData.password}
            onChange={handlePasswordChange}
            placeholder="Current Password"
            className="border border-pink-300 p-3 rounded-md focus:ring-2 focus:ring-pink-400"
            required
          />
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            placeholder="New Password"
            className="border border-pink-300 p-3 rounded-md focus:ring-2 focus:ring-pink-400"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Confirm New Password"
            className="border border-pink-300 p-3 rounded-md focus:ring-2 focus:ring-pink-400 col-span-1 md:col-span-2"
            required
          />
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-md col-span-1 md:col-span-2 shadow"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyAccount;
