// frontend/src/components/Navbar.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { role, isAuthenticated, logout } = useAuth();

  const activeClass = ({ isActive }) =>
    isActive
    ? "text-blue-600 p-2 rounded text-2xl hover:text-blue-800"
    : "text-gray-700 p-2 rounded hover:text-blue-600 hover:bg-gray-200 transition duration-200";

  return (
    <nav className="flex items-center justify-between px-6 py-6 bg-white shadow">
      <Link to="/" className="text-3xl font-bold">
        PedoDerma
      </Link>

      <div className="flex items-center gap-4 text-lg font-semibold">
        <NavLink to="/" className={activeClass}>
          HOME
        </NavLink>
        <NavLink to="/book-online" className={activeClass}>
          BOOK ONLINE
        </NavLink>
        <NavLink to="/about" className={activeClass}>
          ABOUT
        </NavLink>
        <NavLink to="/contact" className={activeClass}>
          CONTACT
        </NavLink>

        {!isAuthenticated && (
          <>
            <NavLink to="/login" className={activeClass}>
              Parent Login
            </NavLink>
            <NavLink to="/doctor/login" className={activeClass}>
              Doctor Login
            </NavLink>
            <NavLink to="/register" className={activeClass}>
              Register
            </NavLink>
          </>
        )}

        {isAuthenticated && role === "parent" && (
          <NavLink to="/parent/dashboard" className={activeClass}>
            Parent Dashboard
          </NavLink>
        )}

        {isAuthenticated && role === "doctor" && (
          <NavLink to="/doctor/dashboard" className={activeClass}>
            Doctor Dashboard
          </NavLink>
        )}

        {isAuthenticated && (
          <button
            onClick={logout}
            className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
