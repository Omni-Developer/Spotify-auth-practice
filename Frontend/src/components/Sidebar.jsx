import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Sidebar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const role = user?.role;

  const menuItems = isAuthenticated
    ? [
        { label: "Home", path: "/" },
        { label: "Browse Music", path: "/music" },
        { label: "Browse Albums", path: "/albums" },

        // ONLY ARTIST
        ...(role === "artist"
          ? [
              { label: "Upload Music", path: "/upload" },
              { label: "Create Album", path: "/create-album" },
            ]
          : []),

        // ONLY LISTENER
        ...(role === "listener" ? [] : []),

        { label: "My Profile", path: "/profile" },
      ]
    : [
        { label: "Login", path: "/login" },
        { label: "Register", path: "/register" },
      ];

  return (
    <>
      {/* Mobile button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-spotify-green p-2 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-spotify-dark border-r border-spotify-hover p-6 transition-transform z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Logo */}
        <Link
          to="/"
          className="text-spotify-green text-2xl font-bold mb-8 block"
        >
          Spotify
        </Link>

        {/* Menu */}
        <nav className="flex flex-col gap-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-lg text-white hover:bg-spotify-hover hover:text-spotify-green"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        {isAuthenticated && (
          <div className="mt-10 border-t border-spotify-hover pt-4">
            <p className="text-white font-semibold">{user.username}</p>
            <p className="text-spotify-green text-sm">{role}</p>

            <button
              onClick={logout}
              className="mt-4 w-full bg-spotify-green py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        )}
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
