// frontend/src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t mt-10">
      {/* Top Section */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8 text-lg text-gray-50">

        {/* Logo & About */}
        <div className="">
          <h2 className="text-3xl font-bold text-blue-600 mb-2">
            PedoDerma
          </h2>
          <p className="text-lg leading-relaxed mb-4">
            PedoDerma is a digital healthcare platform connecting parents with
            qualified doctors for pediatric skin concerns. Trusted by families
            and medical professionals to provide timely and secure consultations.
          </p>

          {/* Social Media Links */}
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600">
              Facebook
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
              className="text-gray-500 hover:text-sky-500">
              Twitter
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              className="text-gray-500 hover:text-pink-500">
              Instagram
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-700">
              LinkedIn
            </a>
          </div>
        </div>

        {/* Information */}
        <div>
          <h3 className="font-semibold text-xl text-gray-50 mb-3">
            For Information
          </h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-blue-600">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-blue-600">Contact Us</Link></li>
            <li><Link to="/login" className="hover:text-blue-600">Parent Login</Link></li>
            <li><Link to="/doctor/login" className="hover:text-blue-600">Doctor Login</Link></li>
            <li><Link to="/register" className="hover:text-blue-600">Register</Link></li>
          </ul>
        </div>

        {/* Helpful Links */}
        <div>
          <h3 className="font-semibold text-xl text-gray-50 mb-3">
            Helpful Links
          </h3>
          <ul className="space-y-2">
            <li><Link to="/parent/dashboard" className="hover:text-blue-600">Parent Dashboard</Link></li>
            <li><Link to="/cases/submit" className="hover:text-blue-600">Submit a Case</Link></li>
            <li><Link to="/doctor/dashboard" className="hover:text-blue-600">Doctor Dashboard</Link></li>
            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-xl text-gray-50 mb-3">
            Contact
          </h3>
          <p>PedoDerma Health Services Pvt. Ltd.</p>
          <p>Jalandhar, Punjab, India</p>
          <p className="mt-2">📞 +91 94352 00024</p>
          <p className="mt-2">
            <span className="font-medium">Customer Support:</span><br />
            support@pedoderma.com
          </p>
          <p className="mt-2">
            <span className="font-medium">Official Queries:</span><br />
            info@pedoderma.com
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t py-4 text-center text-sm text-gray-50">
        © {new Date().getFullYear()} PedoDerma. All rights reserved.
        <br />
        <Link to="/terms" className="hover:text-blue-600">Terms & Conditions</Link>
        {" | "}
        <Link to="/policy" className="hover:text-blue-600">Privacy Policy</Link>
      </div>
    </footer>
  );
};

export default Footer;
