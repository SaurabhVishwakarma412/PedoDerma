import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", specialization: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);
    try {
      const { data } = await API.post("/doctors", form);
      setMessage({ type: "success", text: `${data.doctor.name} was registered successfully.` });
      setForm({ name: "", email: "", password: "", specialization: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Could not register doctor" });
    } finally { setLoading(false); }
  };

  return <main className="min-h-screen bg-gray-50 p-6"><div className="max-w-3xl mx-auto">
    <div className="flex justify-between items-center mb-8"><div><h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1><p className="text-gray-600">Welcome, {user?.name}</p></div><button onClick={logout} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Logout</button></div>
    <section className="bg-white rounded-2xl shadow p-6"><h2 className="text-xl font-semibold mb-1">Register a doctor</h2><p className="text-gray-500 mb-6">Only admins can create doctor accounts.</p>
      {message.text && <p className={`mb-4 p-3 rounded text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{message.text}</p>}
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
        {[["name", "Full name", "text"], ["email", "Email", "email"], ["password", "Temporary password", "password"], ["specialization", "Specialization (optional)", "text"]].map(([key, label, type]) => <label key={key} className="text-sm font-medium text-gray-700">{label}<input className="mt-1 w-full border rounded-lg p-3" type={type} required={key !== "specialization"} minLength={key === "password" ? 6 : undefined} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} /></label>)}
        <button disabled={loading} className="sm:col-span-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold disabled:opacity-60">{loading ? "Registering…" : "Register doctor"}</button>
      </form>
    </section>
  </div></main>;
}
