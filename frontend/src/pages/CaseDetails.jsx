// frontend/src/pages/CaseDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCaseById } from "../services/patientAPI";
import { getCaseByIdDoctor } from "../services/doctorAPI";
import { useAuth } from "../context/AuthContext";

const CaseDetails = () => {
  const { id } = useParams();
  const { role } = useAuth();
  const [caseData, setCaseData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
    return (
      <p className="px-4 py-8 text-sm">
        Case not found.
      </p>
    );

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 text-sm">
      <h1 className="text-2xl font-bold mb-3">
        Case #{caseData._id?.slice(-6) || "Details"}
      </h1>
      <p className="text-gray-600 mb-1">
        <span className="font-semibold">Title:</span> {caseData.title}
      </p>
      <p className="text-gray-600 mb-1">
        <span className="font-semibold">Status:</span> {caseData.status}
      </p>
      <p className="text-gray-600 mb-1">
        <span className="font-semibold">Child Age:</span> {caseData.childAge}
      </p>
      <p className="text-gray-600 mb-1">
        <span className="font-semibold">Duration:</span> {caseData.duration}
      </p>
      <p className="text-gray-700 mt-3">
        <span className="font-semibold">Description:</span>{" "}
        {caseData.description}
      </p>

      {caseData.imageUrl && (
        <img
          src={caseData.imageUrl}
          alt="Case"
          className="mt-4 w-64 h-64 object-cover rounded border"
        />
      )}

      {caseData.doctorNotes && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
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
