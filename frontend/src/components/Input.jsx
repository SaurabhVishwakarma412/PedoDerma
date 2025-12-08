// frontend/src/components/Input.jsx
import React from "react";

const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required,
}) => {
  return (
    <div className="flex flex-col gap-1 mb-3">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default Input;
