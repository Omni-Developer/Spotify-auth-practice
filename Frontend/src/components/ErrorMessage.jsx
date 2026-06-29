import React from "react";

export const ErrorMessage = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="bg-red-900 border border-red-700 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
      <p className="text-red-100">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-300 hover:text-red-100 text-lg"
        >
          ×
        </button>
      )}
    </div>
  );
};
