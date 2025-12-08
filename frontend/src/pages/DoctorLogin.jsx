// frontend/src/pages/DoctorLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { loginDoctor } from "../services/doctorAPI";
import { useAuth } from "../context/AuthContext";

const DoctorLogin = () => {
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
      const res = await loginDoctor(form);
      const { user, token } = res.data;
      login("doctor", user, token);
      navigate("/doctor/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Doctor Login</h1>
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
    </main>
  );
};

export default DoctorLogin;
