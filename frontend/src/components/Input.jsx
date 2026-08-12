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
  darkMode,
}) => {
  const [detectedDarkMode, setDetectedDarkMode] = React.useState(() =>
    document.documentElement.classList.contains("dark")
  );

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setDetectedDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    setDetectedDarkMode(document.documentElement.classList.contains("dark"));

    return () => observer.disconnect();
  }, []);

  const isDarkMode = darkMode ?? detectedDarkMode;

  return (
    <div className={`flex flex-col gap-1 mb-3 ${isDarkMode ? "text-gray-100" : "text-gray-700"}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        className={`border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
          isDarkMode
            ? "bg-gray-800 border-gray-600 focus:ring-blue-500 text-gray-100 placeholder:text-gray-400"
            : "bg-white border-gray-300 focus:ring-blue-500 text-gray-700"
        }`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default Input;
