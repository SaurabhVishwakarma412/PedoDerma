// frontend/src/components/FileUpload.jsx
import React, { useRef, useState } from "react";

const FileUpload = ({ label = "Upload Image", onFileSelect }) => {
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleClick = () => {
    if (fileRef.current) fileRef.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect && onFileSelect(file);

      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-3">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleClick}
          className="px-3 py-2 border rounded text-sm hover:bg-gray-100"
        >
          Choose File
        </button>
        <span className="text-xs text-gray-600">
          {fileName || "No file selected"}
        </span>
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        className="hidden"
        onChange={handleChange}
      />
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="mt-2 w-40 h-40 object-cover rounded border"
        />
      )}
    </div>
  );
};

export default FileUpload;
