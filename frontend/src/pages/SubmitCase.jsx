// frontend/src/pages/SubmitCase.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import FileUpload from "../components/FileUpload";
import { submitCase } from "../services/patientAPI";

const SubmitCase = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    childAge: "",
  });
  const [imageFile, setImageFile] = useState(null);
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
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));
      if (imageFile) fd.append("image", imageFile);

      await submitCase(fd);
      setSuccess("Case submitted successfully!");
      setTimeout(() => navigate("/parent/dashboard"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit case");
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Submit New Case</h1>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      {success && <p className="text-sm text-green-600 mb-3">{success}</p>}

      <form onSubmit={handleSubmit}>
        <Input
          label="Case Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <Input
          label="Duration of Problem (e.g. 3 days)"
          name="duration"
          value={form.duration}
          onChange={handleChange}
          required
        />
        <Input
          label="Child Age"
          name="childAge"
          value={form.childAge}
          onChange={handleChange}
          required
        />

        <div className="flex flex-col gap-1 mb-3">
          <label className="text-sm font-medium text-gray-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <FileUpload
          label="Upload Skin Image"
          onFileSelect={(file) => setImageFile(file)}
        />

        <button
          type="submit"
          className="w-full mt-2 px-4 py-2 rounded bg-blue-600 text-white text-sm"
        >
          Submit Case
        </button>
      </form>
    </main>
  );
};

export default SubmitCase;
