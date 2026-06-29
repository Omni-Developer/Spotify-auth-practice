import React from "react";

export const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-spotify-card rounded-lg p-4 hover:bg-spotify-hover transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
