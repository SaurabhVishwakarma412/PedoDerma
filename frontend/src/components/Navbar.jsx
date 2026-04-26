// frontend/src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { role, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // State for theme toggle

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  const navClass = ({ isActive }) =>
    `block px-3 py-2 rounded transition ${
      isActive
        ? "text-blue-600 font-bold border-b-2 border-blue-600"
        : "text-gray-700 dark:text-gray-300 hover:text-blue-600"
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/40 dark:bg-gray-800/40 backdrop-blur-md shadow-lg"
          : "bg-white dark:bg-gray-900 shadow-md"
      }`}
    >
      <div className="container mt-2 mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <span className="text-xl font-bold text-blue-800 dark:text-blue-400 hidden sm:inline">
              PedoDerma
            </span>
            <Logo className="w-10 h-10" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" className={navClass}>Home</NavLink>
            {!isAuthenticated && <NavLink to="/about" className={navClass}>About</NavLink>}
            <NavLink to="/contact" className={navClass}>Contact</NavLink>
            <NavLink
              to="/cases/submit"
              className={navClass}
            >
              Book Online
            </NavLink>
            {!isAuthenticated ? (
              <>
                <NavLink to="/login" className={navClass}>Login</NavLink>
                <NavLink
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Register
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to={role === "parent" ? "/parent/dashboard" : "/doctor/dashboard"}
                  className={navClass}
                >
                  {role === "parent" ? "Dashboard" : "Doctor Dashboard"}
                </NavLink>
                <button
                  onClick={logout}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m8.66-8.66h-1M4.34 12H3m15.07 6.07l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l-.7-.7M6.34 17.66l-.7-.7M12 5a7 7 0 100 14 7 7 0 000-14z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m8.66-8.66h-1M4.34 12H3m15.07 6.07l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l-.7-.7M6.34 17.66l-.7-.7M12 5a7 7 0 100 14 7 7 0 000-14z"
                />
              </svg>
            )}
          </button>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="text-gray-700 dark:text-gray-300 p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {open && (
          <div
            className={`md:hidden border-t ${
              scrolled
                ? "bg-white/95 dark:bg-gray-800/95 backdrop-blur-md"
                : "bg-gray-50 dark:bg-gray-900"
            }`}
          >
            <NavLink to="/" className={navClass} onClick={() => setOpen(false)}>
              Home
            </NavLink>
            {!isDoctor && (
              <NavLink
                to="/cases/submit"
                className={navClass}
                onClick={() => setOpen(false)}
              >
                Book Online
              </NavLink>
            )}
            <NavLink to="/about" className={navClass} onClick={() => setOpen(false)}>
              About
            </NavLink>
            <NavLink to="/contact" className={navClass} onClick={() => setOpen(false)}>
              Contact
            </NavLink>
            {!isAuthenticated ? (
              <>
                <NavLink to="/login" className={navClass} onClick={() => setOpen(false)}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="block mx-3 my-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  onClick={() => setOpen(false)}
                >
                  Register
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to={role === "parent" ? "/parent/dashboard" : "/doctor/dashboard"}
                  className={navClass}
                  onClick={() => setOpen(false)}
                >
                  {role === "parent" ? "Dashboard" : "Doctor Dashboard"}
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="block w-[90%] mx-auto my-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;