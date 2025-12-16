// frontend/src/components/CaseCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

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

const CaseCard = ({ caseData }) => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL; // http://localhost:5000

  const handleClick = () => {
    navigate(`/cases/${caseData._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition bg-white"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-sm">
          {caseData.title || `Case #${caseData._id?.slice(-6)}`}
        </h3>

        <span
          className={`text-xs px-2 py-1 rounded-full ${statusColor(
            caseData.status
          )}`}
        >
          {caseData.status}
        </span>
      </div>

      {/* Image */}
      {caseData.imageUrl && (
        <img
          src={`${baseURL}${caseData.imageUrl}`}
          alt="Case"
          className="w-full h-32 object-cover rounded mb-3 border"
        />
      )}

      {/* Description */}
      <p className="text-xs text-gray-600 line-clamp-2 mb-3">
        {caseData.description || "No description provided"}
      </p>

      {/* Extra info */}
      <div className="flex justify-between text-[11px] text-gray-500 mb-2">
        <span>Child Age: {caseData.childAge || "N/A"}</span>
        <span>Duration: {caseData.duration || "N/A"}</span>
      </div>

      {/* Doctor Notes */}
      {caseData.status === "completed" && caseData.doctorNotes && (
        <p className="text-[11px] text-green-600 italic border-t pt-2 mt-2">
          Doctor Notes: {caseData.doctorNotes}
        </p>
      )}

      {/* Timestamp */}
      <p className="text-[11px] text-gray-400 mt-2">
        Submitted:{" "}
        {caseData.createdAt
          ? new Date(caseData.createdAt).toLocaleDateString()
          : "Unknown"}
      </p>
    </div>
  );
};

export default CaseCard;
