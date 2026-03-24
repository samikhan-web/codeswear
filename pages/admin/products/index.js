import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ✅ Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/admin/products");
        const data = await res.json();

        if (data.success) {
         console.log(data.products); 
         setProducts(data.products);
        } else {
          toast.error("Failed to fetch products");
        }
      } catch (error) {
        toast.error("Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Delete Product
  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (confirmed) {
      setProducts(products.filter((p) => p._id !== id));
      toast.success("Product deleted successfully!");
    }
  };

  // ✅ Search Filter
  const filteredProducts = products.filter((p) =>
  (p.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <AdminNavbar />

        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Manage Products
            </h1>

            <Link href="/admin/products/add">
              <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition">
                + Add Product
              </button>
            </Link>
          </div>

          {/* 🔍 Search */}
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 px-4 py-2 border rounded-lg w-full max-w-sm focus:ring-2 focus:ring-pink-400"
          />

          {/* 📊 Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            
            {loading ? (
              <div className="p-6 text-gray-500">Loading products...</div>
            ) : (
              <table className="min-w-full text-sm">
                
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  <tr>
                    <th className="py-3 px-4 text-left">#</th>
                    <th className="py-3 px-4 text-left">Product Name</th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-left">Price (PKR)</th>
                    <th className="py-3 px-4 text-left">Stock</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((p, index) => (
                      <tr
                        key={p._id}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4 font-medium text-gray-800 dark:text-white">
                          {p.title}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                          {p.category}
                        </td>
                        <td className="py-3 px-4">{p.price}</td>
                        <td className="py-3 px-4">{p.stock}</td>

                        <td className="py-3 px-4 text-center space-x-2">
                          <button className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-400 transition">
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(p._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-400 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-500">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}