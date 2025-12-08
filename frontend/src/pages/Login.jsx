// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/Input";
import { loginParent } from "../services/patientAPI";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginParent(form);
      // adjust according to your backend
      const { user, token } = res.data;
      login("parent", user, token);
      navigate("/parent/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Parent Login</h1>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <button
          type="submit"
          className="w-full mt-2 px-4 py-2 rounded bg-blue-600 text-white text-sm"
        >
          Login
        </button>
      </form>
      <p className="mt-3 text-xs text-gray-600">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-blue-600">
          Register
        </Link>
      </p>
    </main>
  );
};

export default Login;
