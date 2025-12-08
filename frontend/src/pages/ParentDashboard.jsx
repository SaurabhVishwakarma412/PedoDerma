// frontend/src/pages/ParentDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyCases } from "../services/patientAPI";
import CaseCard from "../components/CaseCard";

const ParentDashboard = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await getMyCases();
        setCases(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch cases");
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Parent Dashboard</h1>
        <Link
          to="/cases/submit"
          className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
        >
          Submit New Case
        </Link>
      </div>

      {loading && <p className="text-sm">Loading cases...</p>}
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      {!loading && !error && cases.length === 0 && (
        <p className="text-sm text-gray-600">
          No cases yet. Start by submitting a new case.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {cases.map((c) => (
          <CaseCard key={c._id} caseData={c} />
        ))}
      </div>
    </main>
  );
};

export default ParentDashboard;
