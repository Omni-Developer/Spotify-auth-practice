import React from "react";
import { Sidebar } from "./Sidebar";
import { BottomPlayer } from "./BottomPlayer";

export const Layout = ({ children }) => {
  return (
    <div className="flex bg-spotify-dark text-white min-h-screen">
      <Sidebar />
      <BottomPlayer />
      <main className="flex-1 md:ml-64 p-4 md:p-8">{children}</main>
    </div>
  );
};
