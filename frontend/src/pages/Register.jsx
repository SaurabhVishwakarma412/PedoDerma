// frontend/src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/Input";
import { registerParent } from "../services/patientAPI";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    childName: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await registerParent(form);
      setSuccess("Registration successful. Please login.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Parent Registration</h1>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      {success && <p className="text-sm text-green-600 mb-3">{success}</p>}

      <form onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Input
          label="Child Name"
          name="childName"
          value={form.childName}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full mt-2 px-4 py-2 rounded bg-blue-600 text-white text-sm"
        >
          Register
        </button>
      </form>

      <p className="mt-3 text-xs text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600">
          Login
        </Link>
      </p>
    </main>
  );
};

export default Register;
