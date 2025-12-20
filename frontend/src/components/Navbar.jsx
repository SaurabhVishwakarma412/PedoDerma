// frontend/src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const Navbar = () => {
  const { role, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);

  // Check if user is logged in as a doctor
  const isDoctor = isAuthenticated && role === "doctor";

  const navClass = ({ isActive }) =>
    `block px-3 py-2 rounded transition ${
      isActive
        ? "text-blue-600 font-bold border-b-2 border-blue-600"
        : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mt-2 mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <span className="text-xl font-bold text-blue-800 hidden sm:inline">PedoDerma</span>
            <Logo className="w-10 h-10" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" className={navClass}>Home</NavLink>
            
            {/* Only show "Book Online" if user is not logged in as a doctor */}
            {!isDoctor && (
              <NavLink to="/cases/submit" className={navClass}>Book Online</NavLink>
            )}
            
            <NavLink to="/about" className={navClass}>About</NavLink>
            <NavLink to="/contact" className={navClass}>Contact</NavLink>

            {!isAuthenticated ? (
              <>
                <NavLink to="/login" className={navClass}>Login</NavLink>
                <NavLink
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {open && (
          <div className="md:hidden bg-gray-50 border-t">
            <NavLink to="/" className={navClass} onClick={() => setOpen(false)}>Home</NavLink>
            
            {/* Only show "Book Online" if user is not logged in as a doctor */}
            {!isDoctor && (
              <NavLink to="/cases/submit" className={navClass} onClick={() => setOpen(false)}>
                Book Online
              </NavLink>
            )}
            
            <NavLink to="/about" className={navClass} onClick={() => setOpen(false)}>About</NavLink>
            <NavLink to="/contact" className={navClass} onClick={() => setOpen(false)}>Contact</NavLink>

            {!isAuthenticated ? (
              <>
                <NavLink to="/login" className={navClass} onClick={() => setOpen(false)}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="block mx-3 my-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
                  className="block w-[90%] mx-auto my-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
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
