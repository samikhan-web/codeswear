import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Handle Input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔒 Validation
    if (!formData.title || !formData.price || !formData.category) {
      toast.error("Please fill required fields!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/addproducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Product added successfully!");

        // 🔄 Reset form
        setFormData({
          title: "",
          category: "",
          price: "",
          stock: "",
          description: "",
          image: "",
        });
      } else {
        toast.error("Failed to add product");
      }
    } catch (error) {
      toast.error("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <AdminNavbar />

        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Add New Product
          </h1>

          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 max-w-2xl">

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Title */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter product title"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. T-Shirts, Hoodies"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="1000"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="10"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter product description"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400"
                ></textarea>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {/* 🖼️ Image Preview */}
              {formData.image && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500 mb-1">Preview:</p>
                  <img
                    src={formData.image}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg text-white transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105"
                }`}
              >
                {loading ? "Adding..." : "Add Product"}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}