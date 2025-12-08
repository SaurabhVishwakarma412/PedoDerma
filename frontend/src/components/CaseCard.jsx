// frontend/src/components/CaseCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const statusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "in_review":
      return "bg-blue-100 text-blue-800";
    case "resolved":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const CaseCard = ({ caseData }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/cases/${caseData._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="border rounded-lg p-4 cursor-pointer hover:shadow-sm transition"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-sm">
          Case #{caseData._id?.slice(-6) || "N/A"}
        </h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${statusColor(
            caseData.status
          )}`}
        >
          {caseData.status || "unknown"}
        </span>
      </div>
      <p className="text-xs text-gray-600 line-clamp-2 mb-2">
        {caseData.description || "No description"}
      </p>
      <p className="text-[11px] text-gray-400">
        Submitted:{" "}
        {caseData.createdAt
          ? new Date(caseData.createdAt).toLocaleString()
          : "Unknown"}
      </p>
    </div>
  );
};

export default CaseCard;
