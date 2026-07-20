import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function ForgotPassword() {
  const [form, setForm] = useState({ email: "", role: "parent", token: "", password: "", confirmPassword: "" });
  const [requested, setRequested] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const request = async (e) => {
    e.preventDefault(); setLoading(true); setMessage({ type: "", text: "" });
    try {
      const { data } = await API.post("/patients/forgot-password", { email: form.email, role: form.role });
      setForm({ ...form, token: data.resetToken }); setRequested(true);
      setMessage({ type: "success", text: "Identity found. Enter a new password below." });
    } catch (err) { setMessage({ type: "error", text: err.response?.data?.message || "Could not start password reset" }); }
    finally { setLoading(false); }
  };

  const reset = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return setMessage({ type: "error", text: "Passwords do not match" });
    setLoading(true); setMessage({ type: "", text: "" });
    try {
      const { data } = await API.post("/patients/reset-password", { token: form.token, role: form.role, password: form.password });
      setMessage({ type: "success", text: data.message }); setRequested(false);
      setForm({ email: "", role: "parent", token: "", password: "", confirmPassword: "" });
    } catch (err) { setMessage({ type: "error", text: err.response?.data?.message || "Could not reset password" }); }
    finally { setLoading(false); }
  };

  return <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"><div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
    <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot password?</h1><p className="text-gray-500 text-sm mb-6">Recover your parent, doctor, or admin account.</p>
    {message.text && <p className={`mb-4 p-3 rounded text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{message.text}</p>}
    {!requested ? <form onSubmit={request} className="space-y-4"><label className="block text-sm font-medium">Account type<select className="mt-1 w-full border rounded-lg p-3" value={form.role} onChange={update("role")}><option value="parent">Parent</option><option value="doctor">Doctor</option><option value="admin">Admin</option></select></label><label className="block text-sm font-medium">Email<input className="mt-1 w-full border rounded-lg p-3" type="email" required value={form.email} onChange={update("email")} /></label><button disabled={loading} className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold">{loading ? "Checking…" : "Continue"}</button></form> : <form onSubmit={reset} className="space-y-4"><label className="block text-sm font-medium">Reset token<input className="mt-1 w-full border rounded-lg p-3 text-xs" required value={form.token} onChange={update("token")} /></label><label className="block text-sm font-medium">New password<input className="mt-1 w-full border rounded-lg p-3" type="password" minLength="6" required value={form.password} onChange={update("password")} /></label><label className="block text-sm font-medium">Confirm password<input className="mt-1 w-full border rounded-lg p-3" type="password" minLength="6" required value={form.confirmPassword} onChange={update("confirmPassword")} /></label><button disabled={loading} className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold">{loading ? "Updating…" : "Update password"}</button></form>}
    <Link to="/login" className="block text-center mt-6 text-blue-600 text-sm">Back to login</Link>
  </div></main>;
}
