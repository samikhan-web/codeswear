import Link from "next/link";
import { useRouter } from "next/router";
import { FaTachometerAlt, FaBoxOpen, FaShoppingCart, FaUsers, FaSignOutAlt, FaEnvelope, FaMoon, FaSun } from "react-icons/fa";

export default function AdminSidebar({ user, logout, darkMode, toggleDarkMode }) {
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: <FaTachometerAlt /> },
    { name: "Products", href: "/admin/products", icon: <FaBoxOpen /> },
    { name: "Orders", href: "/admin/orders", icon: <FaShoppingCart /> },
    { name: "Users", href: "/admin/users", icon: <FaUsers /> },
    { name: "Contacts", href: "/admin/contact", icon: <FaEnvelope /> },
  ];

  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-900 min-h-screen p-6 flex flex-col justify-between">
      
      {/* Logo / Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Admin Panel
        </h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1">
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.name}>
          <Link
           href={item.href}
           className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition
           ${
            router.pathname === item.href
             ? "bg-pink-500 text-white"
             : "text-gray-800 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-gray-700 hover:text-pink-500"
           }`}
>
         <span className="text-lg">{item.icon}</span>
         <span>{item.name}</span>
        </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer / Actions */}
      <div className="mt-8 flex flex-col space-y-4">
        {/* Toggle Dark Mode */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-center px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-pink-500 hover:text-white transition"
        >
          {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
          Toggle Mode
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center justify-center px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-400 transition"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>
    </aside>
  );
}