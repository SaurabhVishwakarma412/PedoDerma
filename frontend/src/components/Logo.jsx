import React from "react";

const Logo = ({ className = "w-10 h-10" }) => {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Circle */}
      <circle cx="60" cy="60" r="58" fill="#E3F2FD" stroke="#2563EB" strokeWidth="2" />

      {/* Shield Shape */}
      <path
        d="M 60 15 L 85 30 L 85 55 Q 85 75 60 95 Q 35 75 35 55 L 35 30 Z"
        fill="#2563EB"
        opacity="0.9"
      />

      {/* Skin Pattern (circles representing skin cells) */}
      <circle cx="50" cy="50" r="4" fill="white" opacity="0.8" />
      <circle cx="60" cy="45" r="3.5" fill="white" opacity="0.7" />
      <circle cx="70" cy="50" r="4" fill="white" opacity="0.8" />
      <circle cx="55" cy="60" r="3" fill="white" opacity="0.6" />
      <circle cx="65" cy="60" r="3.5" fill="white" opacity="0.7" />
      <circle cx="60" cy="70" r="4" fill="white" opacity="0.8" />

      {/* Medical Cross */}
      <g transform="translate(60, 65)">
        <rect x="-2.5" y="-8" width="5" height="16" fill="white" rx="1" />
        <rect x="-8" y="-2.5" width="16" height="5" fill="white" rx="1" />
      </g>

      {/* Smile curve (pediatric element) */}
      <path
        d="M 45 75 Q 60 82 75 75"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Logo;
