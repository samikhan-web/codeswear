"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function AdminNavbar() {
  const [darkMode, setDarkMode] = useState(false);

  // ✅ Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  // ✅ Toggle dark mode
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700">
      
      {/* Heading */}
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
        Admin Dashboard
      </h1>

      {/* Toggle Mode Button */}
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center justify-center"
        title="Toggle Mode"
      >
        {darkMode ? (
          <Sun className="text-yellow-400 w-5 h-5" />
        ) : (
          <Moon className="text-gray-800 dark:text-white w-5 h-5" />
        )}
      </button>
    </div>
  );
}