// frontend/src/pages/Contact.jsx
import React, { useState } from "react";
import Input from "../components/Input";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now just simulate success
    setSent(true);
  };

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>

      {sent && (
        <p className="text-sm text-green-600 mb-3">
          Thank you! We&apos;ll reach out soon.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
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
        <div className="flex flex-col gap-1 mb-3">
          <label className="text-sm font-medium text-gray-700" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={form.message}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
        >
          Send
        </button>
      </form>
    </main>
  );
};

export default Contact;
