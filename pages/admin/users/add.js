import { useState } from "react";
import { useRouter } from "next/router";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";

export default function AddUser() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("✅ Form submitted:", formData);

    // basic validation
    if (!formData.name || !formData.email || !formData.password) {
      alert("❌ Please fill all required fields!");
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create user");
      }

      alert("✅ User created successfully!");
      setFormData({ name: "", email: "", password: "", role: "user" });

      router.push("/admin/users");
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Error creating user: " + error.message);
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 bg-gray-50 min-h-screen">
        <AdminNavbar />

        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Add New User
          </h1>

          <div className="bg-white shadow-md rounded-xl p-6 max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email address"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-500 transition duration-200"
              >
                + Add User
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
