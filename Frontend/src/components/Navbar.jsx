import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Code2, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <nav className={`w-full backdrop-blur-md border-b fixed top-0 left-0 z-50 ${isDark
        ? 'bg-gray-900/95 border-gray-700'
        : 'bg-white/95 border-gray-200'
      }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg group-hover:scale-110 transition-transform">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Cloud IDE
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex space-x-8 font-medium">
            <li>
              <Link
                to="/"
                className={`transition-colors ${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                  }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/features"
                className={`transition-colors ${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                  }`}
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className={`transition-colors ${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                  }`}
              >
                Register
              </Link>
            </li>
          </ul>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all ${isDark
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link
            to="/login"
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:scale-105 transition-transform text-white"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center gap-3">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all ${isDark
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`focus:outline-none transition-colors ${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
              }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}>
          <ul className={`flex flex-col space-y-4 px-6 py-6 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
            <li>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block transition-colors ${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'
                  }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/features"
                onClick={() => setMobileMenuOpen(false)}
                className={`block transition-colors ${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'
                  }`}
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className={`block transition-colors ${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'
                  }`}
              >
                Register
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white text-center"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
