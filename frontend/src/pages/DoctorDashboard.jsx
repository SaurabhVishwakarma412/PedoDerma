// frontend/src/pages/DoctorDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCases } from "../services/doctorAPI";
import CaseCard from "../components/CaseCard";

const DoctorDashboard = () => {
  const [cases, setCases] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await getAllCases();
        setCases(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch cases");
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  const filtered = cases.filter((c) =>
    filter === "all" ? true : c.status === filter
  );

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
        <div className="flex items-center gap-2 text-xs">
          <span>Filter:</span>
          <select
            className="border rounded px-2 py-1"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in_review">In Review</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {loading && <p className="text-sm">Loading cases...</p>}
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-sm text-gray-600">
          No cases for this filter.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {filtered.map((c) => (
          <Link key={c._id} to={`/cases/${c._id}/review`}>
            <CaseCard caseData={c} />
          </Link>
        ))}
      </div>
    </main>
  );
};

export default DoctorDashboard;
