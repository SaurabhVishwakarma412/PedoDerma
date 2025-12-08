// frontend/src/pages/CaseReview.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCaseByIdDoctor, reviewCase } from "../services/doctorAPI";

const CaseReview = () => {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("in_review");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await getCaseByIdDoctor(id);
        setCaseData(res.data);
        setNotes(res.data.doctorNotes || "");
        setStatus(res.data.status || "in_review");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load case");
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await reviewCase(id, { status, doctorNotes: notes });
      setSuccess("Review saved successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save review");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="px-4 py-8 text-sm">Loading...</p>;
  if (error)
    return (
      <p className="px-4 py-8 text-sm text-red-600">
        Error: {error}
      </p>
    );
  if (!caseData)
    return (
      <p className="px-4 py-8 text-sm">
        Case not found.
      </p>
    );

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 text-sm">
      <h1 className="text-2xl font-bold mb-3">
        Review Case #{caseData._id?.slice(-6)}
      </h1>

      <p className="text-gray-700">
        <span className="font-semibold">Title:</span> {caseData.title}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold">Child Age:</span> {caseData.childAge}
      </p>
      <p className="text-gray-700 mb-3">
        <span className="font-semibold">Duration:</span> {caseData.duration}
      </p>

      <p className="text-gray-700 mb-3">
        <span className="font-semibold">Description:</span>{" "}
        {caseData.description}
      </p>

      {caseData.imageUrl && (
        <img
          src={caseData.imageUrl}
          alt="Case"
          className="mt-2 w-64 h-64 object-cover rounded border"
        />
      )}

      <div className="mt-4 flex flex-col gap-2">
        <label className="text-sm font-semibold" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          className="border rounded px-2 py-1 w-40"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in_review">In Review</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <label className="text-sm font-semibold" htmlFor="notes">
          Doctor Notes
        </label>
        <textarea
          id="notes"
          rows={5}
          className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      {success && <p className="text-sm text-green-600 mt-3">{success}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-4 px-4 py-2 rounded bg-blue-600 text-white text-sm disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Review"}
      </button>
    </main>
  );
};

export default CaseReview;
