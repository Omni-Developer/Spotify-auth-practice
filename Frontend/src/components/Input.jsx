import React from "react";

export const Input = ({
  label,
  placeholder,
  type = "text",
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-white">{label}</label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`
          bg-spotify-card border border-spotify-lightText rounded-lg px-4 py-2
          text-white placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-spotify-green
          transition-all duration-200
          ${error ? "border-red-500" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
