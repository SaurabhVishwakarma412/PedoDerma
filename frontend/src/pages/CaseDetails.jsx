// frontend/src/pages/CaseDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCaseById } from "../services/patientAPI";
import { getCaseByIdDoctor } from "../services/doctorAPI";
import { useAuth } from "../context/AuthContext";

const statusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "in_review":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const CaseDetails = () => {
  const { id } = useParams();
  const { role } = useAuth();

  const [caseData, setCaseData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const baseURL = import.meta.env.VITE_API_URL; // http://localhost:5000

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res =
          role === "doctor"
            ? await getCaseByIdDoctor(id)
            : await getCaseById(id);

        setCaseData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load case details");
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id, role]);

  if (loading) return <p className="px-4 py-8 text-sm">Loading...</p>;
  if (error)
    return (
      <p className="px-4 py-8 text-sm text-red-600">
        Error: {error}
      </p>
    );
  if (!caseData)
    return <p className="px-4 py-8 text-sm">Case not found.</p>;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 text-sm">
      {/* Header */}
      <div className="flex justify-between mb-5">
        <h1 className="text-2xl font-bold">
          Case #{caseData._id?.slice(-6)}
        </h1>

        <span className={`text-xs px-2 py-1 rounded-full h-fit ${statusColor(caseData.status)}`}>
          {caseData.status}
        </span>
      </div>

      {/* Case Info */}
      <div className="space-y-2">
        <p className="text-gray-700">
          <span className="font-semibold">Title:</span> {caseData.title}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Child Age:</span> {caseData.childAge}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Duration:</span> {caseData.duration}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Submitted:</span>{" "}
          {new Date(caseData.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Description */}
      <div className="mt-4">
        <h2 className="font-semibold mb-1">Description</h2>
        <p className="text-gray-700">{caseData.description}</p>
      </div>

      {/* Image */}
      {caseData.imageUrl && (
        <div className="mt-5">
          <h2 className="font-semibold mb-1">Case Image</h2>
          <img
            src={`${baseURL}${caseData.imageUrl}`}
            alt="Case"
            className="w-full max-w-sm h-64 object-cover rounded border"
          />
        </div>
      )}

      {/* Doctor Notes */}
      {caseData.doctorNotes && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="font-semibold mb-1">Doctor Notes</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {caseData.doctorNotes}
          </p>
        </div>
      )}
    </main>
  );
};

export default CaseDetails;
