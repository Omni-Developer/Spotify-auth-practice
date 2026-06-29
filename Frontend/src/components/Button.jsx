import React from "react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  ...props
}) => {
  const baseClass =
    "font-semibold rounded-lg transition-all duration-200 focus:outline-none";

  const variants = {
    primary:
      "bg-green-500 hover:bg-green-600 text-white disabled:opacity-50",
    secondary:
      "bg-spotify-card hover:bg-spotify-hover text-white border border-spotify-lightText",
    danger: "bg-red-600 hover:bg-red-700 text-white disabled:opacity-50",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
