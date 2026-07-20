import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/patients/admin/login", form);
      login(data.user, data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in as admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-5">
        <div className="text-center">
          <ShieldCheck className="mx-auto w-12 h-12 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800 mt-3">Admin Portal</h1>
          <p className="text-gray-500 text-sm">Sign in to manage doctors</p>
        </div>
        {error && <p className="p-3 rounded bg-red-50 text-red-700 text-sm">{error}</p>}
        <label className="block text-sm font-medium text-gray-700">Email
          <div className="relative mt-1"><Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" /><input className="w-full border rounded-lg p-3 pl-10" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        </label>
        <label className="block text-sm font-medium text-gray-700">Password
          <div className="relative mt-1"><Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" /><input className="w-full border rounded-lg p-3 pl-10" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        </label>
        <button disabled={loading} className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold disabled:opacity-60">{loading ? "Signing in…" : "Sign in as Admin"}</button>
        <Link className="block text-center text-blue-600 text-sm" to="/login">Back to regular login</Link>
      </form>
    </main>
  );
}
