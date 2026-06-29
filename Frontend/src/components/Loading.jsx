import React from "react";

export const Loading = ({ fullPage = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 border-4 border-spotify-card border-t-spotify-green rounded-full animate-spin" />
      <p className="text-spotify-lightText">Loading...</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-spotify-dark">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-8">{content}</div>;
};
