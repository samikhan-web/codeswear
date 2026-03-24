import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ✅ Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/admin/users");
        const data = await res.json();

        if (data.success) {
          setUsers(data.users);
        } else {
          toast.error("Failed to fetch users");
        }
      } catch (error) {
        toast.error("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Toggle Status
  const handleStatusToggle = (id) => {
    const updatedUsers = users.map((user) =>
      user._id === id
        ? {
            ...user,
            status: user.status === "Active" ? "Blocked" : "Active",
          }
        : user
    );

    setUsers(updatedUsers);

    toast.success("User status updated!");
  };

  // ✅ Delete User
  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (confirmed) {
      setUsers(users.filter((user) => user._id !== id));
      toast.success("User deleted successfully!");
    }
  };

  // ✅ Search Filter
  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
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
              Manage Users
            </h1>

            <Link href="/admin/users/add">
              <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition">
                + Add User
              </button>
            </Link>
          </div>

          {/* 🔍 Search */}
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 px-4 py-2 border rounded-lg w-full max-w-sm focus:ring-2 focus:ring-pink-400"
          />

          {/* 📊 Table */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden">

            {loading ? (
              <div className="p-6 text-gray-500">Loading users...</div>
            ) : (
              <table className="min-w-full text-sm">

                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  <tr>
                    <th className="py-3 px-4 text-left">User ID</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-left">Role</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Joined</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                          {user._id}
                        </td>

                        <td className="py-3 px-4 font-medium text-gray-800 dark:text-white">
                          {user.name}
                        </td>

                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                          {user.email}
                        </td>

                        {/* Role Badge */}
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${
                              user.role === "admin"
                                ? "bg-blue-100 text-blue-700"
                                : user.role === "manager"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-center space-x-2">

                          <button
                            onClick={() => handleStatusToggle(user._id)}
                            className={`px-3 py-1 text-xs rounded-md transition ${
                              user.status === "Active"
                                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                          >
                            {user.status === "Active" ? "Block" : "Unblock"}
                          </button>

                          <button
                            onClick={() => handleDelete(user._id)}
                            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
                          >
                            Delete
                          </button>

                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-6 text-gray-500">
                        No users found
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