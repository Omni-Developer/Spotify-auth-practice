import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  Layout,
  ProtectedRoute,
  Loading,
  MusicCard,
  ErrorMessage,
} from "../components";

import { musicAPI, authAPI } from "../utils/api";

const ProfilePage = () => {
  const { user, setUser } = useAuth();

  const [userMusic, setUserMusic] = useState([]);
  const [freshReleases, setFreshReleases] = useState([]);

  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  // Edit form states
  const [editBio, setEditBio] = useState(user?.bio || "");
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(
    user?.profilePic || "",
  );

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    setEditBio(user?.bio || "");
    setProfilePicPreview(user?.profilePic || "");
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      const result = await musicAPI.getAllMusic();

      if (result.success) {
        if (user?.role === "artist") {
          const myMusic = result.data.filter(
            (music) => music.artist?._id === user?.id,
          );

          setUserMusic(myMusic);
        } else {
          setFreshReleases(result.data.slice(0, 12));
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setProfilePicFile(file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    setEditError("");
    setEditSuccess("");
    setEditLoading(true);

    try {
      const result = await authAPI.updateProfile(editBio, profilePicFile);

      if (result.success) {
        setEditSuccess("Profile updated successfully!");

        if (setUser) {
          setUser({
            ...user,
            bio: editBio,
            profilePic: result.data?.user?.profilePic || profilePicPreview,
          });
        }

        setTimeout(() => {
          setIsEditing(false);
          setProfilePicFile(null);
          setEditSuccess("");
        }, 1500);
      } else {
        setEditError(result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      setEditError("Something went wrong");
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);

    setEditBio(user?.bio || "");
    setProfilePicFile(null);
    setProfilePicPreview(user?.profilePic || "");

    setEditError("");
    setEditSuccess("");
  };

  if (loading) {
    return <Loading fullPage />;
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-7xl mx-auto">
          {/* EDIT MODAL */}
          {isEditing && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-spotify-card rounded-2xl max-w-md w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Edit Profile
                </h2>

                {/* Error */}
                {editError && (
                  <ErrorMessage
                    message={editError}
                    onDismiss={() => setEditError("")}
                  />
                )}

                {/* Success */}
                {editSuccess && (
                  <div className="bg-green-900 border border-green-700 rounded-lg px-4 py-3 mb-6 text-green-100">
                    {editSuccess}
                  </div>
                )}

                <form
                  onSubmit={handleSaveProfile}
                  className="flex flex-col gap-6"
                >
                  {/* Profile Picture */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-white">
                      Profile Picture
                    </label>

                    {/* Preview */}
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-spotify-green to-blue-900 flex items-center justify-center border-4 border-spotify-green mx-auto">
                      {profilePicPreview ? (
                        <img
                          src={profilePicPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          className="w-12 h-12 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      )}
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                      disabled={editLoading}
                      className="
                        bg-spotify-hover
                        border
                        border-spotify-lightText
                        rounded-lg
                        px-4
                        py-3
                        text-white
                        file:mr-4
                        file:px-4
                        file:py-2
                        file:border-0
                        file:rounded-md
                        file:bg-spotify-green
                        file:text-white
                        file:cursor-pointer
                        hover:file:bg-green-600
                      "
                    />

                    {profilePicFile && (
                      <p className="text-xs text-spotify-green">
                        {profilePicFile.name}
                      </p>
                    )}
                  </div>

                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    className="bg-spotify-hover border
                      border-spotify-lightText
                        rounded-lg
                        px-4
                        py-3
                        text-white
                        placeholder-zinc-500
                        focus:border-spotify-green
                        focus:outline-none
                        resize-none
                        h-10
                     "
                    type="text"
                    placeholder="Update your username here"
                  />

                  {/* Bio */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-white">
                      Bio
                    </label>

                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      disabled={editLoading}
                      placeholder="Tell us about yourself..."
                      maxLength={150}
                      className="
                        bg-spotify-hover
                        border
                        border-spotify-lightText
                        rounded-lg
                        px-4
                        py-3
                        text-white
                        placeholder-zinc-500
                        focus:border-spotify-green
                        focus:outline-none
                        resize-none
                        h-24
                      "
                    />

                    <p className="text-xs text-zinc-400">
                      {editBio.length}/150
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={editLoading}
                      className="
                        flex-1
                        bg-spotify-green
                        hover:bg-green-500
                        disabled:opacity-50
                        text-black
                        font-bold
                        py-3
                        rounded-lg
                        transition-all
                        duration-200
                      "
                    >
                      {editLoading ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={editLoading}
                      className="
                        flex-1
                        bg-zinc-700
                        hover:bg-zinc-600
                        disabled:opacity-50
                        text-white
                        font-bold
                        py-3
                        rounded-lg
                        transition-all
                        duration-200
                      "
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* PROFILE HEADER */}
          <div className="bg-gradient-to-br from-spotify-card to-zinc-900 rounded-xl p-8 mb-12 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-end gap-8">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-40 h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-spotify-green to-blue-900 shadow-lg flex items-center justify-center border-4 border-spotify-green">
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-20 h-20 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>

                {/* Edit Icon */}
                <button
                  onClick={() => setIsEditing(true)}
                  title="Edit profile"
                  className="
                    absolute bottom-0 right-0
                    bg-spotify-green hover:bg-green-500
                    rounded-full p-3
                    text-black
                    transition-all
                    duration-200
                    shadow-lg
                  "
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                    <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-5xl font-bold text-white">
                    {user?.username}
                  </h1>

                  <span className="bg-spotify-green text-black px-4 py-1 rounded-full text-sm font-bold uppercase">
                    {user?.role}
                  </span>
                </div>

                <p className="text-spotify-lightText text-lg mb-6">
                  {user?.bio || "No bio yet"}
                </p>

                {/* Stats */}
                <div className="flex gap-8 flex-wrap">
                  <div>
                    <p className="text-spotify-green text-2xl font-bold">
                      {user?.role === "artist" ? userMusic.length : "Listener"}
                    </p>

                    <p className="text-spotify-lightText text-sm">
                      {user?.role === "artist"
                        ? "Songs Uploaded"
                        : "Music Lover"}
                    </p>
                  </div>

                  <div>
                    <p className="text-spotify-green text-lg font-bold break-all">
                      {user?.email}
                    </p>

                    <p className="text-spotify-lightText text-sm">Email</p>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(true)}
                className="
                  bg-spotify-green hover:bg-green-500
                  text-black font-bold
                  px-6 py-3 rounded-lg
                  transition-all
                  duration-200
                  shadow-lg
                "
              >
                Edit Profile
              </button>
            </div>

            {/* User Details */}
            <div className="mt-8 pt-8 border-t border-zinc-700 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-spotify-lightText text-sm mb-1">Username</p>

                <p className="text-white text-lg font-semibold">
                  {user?.username}
                </p>
              </div>

              <div>
                <p className="text-spotify-lightText text-sm mb-1">Role</p>

                <p className="text-white text-lg font-semibold capitalize">
                  {user?.role}
                </p>
              </div>

              <div>
                <p className="text-spotify-lightText text-sm mb-1">Email</p>

                <p className="text-white text-lg font-semibold break-all">
                  {user?.email}
                </p>
              </div>

              <div>
                <p className="text-spotify-lightText text-sm mb-1">Joined</p>

                <p className="text-white text-lg font-semibold">May 2026</p>
              </div>
            </div>
          </div>

          {/* CONTENT SECTION */}
          {user?.role === "artist" ? (
            <>
              <h2 className="text-3xl font-bold text-white mb-8">
                Your Uploaded Songs
              </h2>

              {userMusic.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
                  {userMusic.map((music) => (
                    <MusicCard key={music._id} music={music} />
                  ))}
                </div>
              ) : (
                <div className="bg-spotify-card rounded-lg p-12 text-center mb-16">
                  <svg
                    className="w-16 h-16 text-zinc-600 mx-auto mb-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
                  </svg>

                  <p className="text-spotify-lightText text-lg">
                    You haven't uploaded any songs yet
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-white mb-8">
                Fresh Releases
              </h2>

              {freshReleases.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
                  {freshReleases.map((music) => (
                    <MusicCard key={music._id} music={music} />
                  ))}
                </div>
              ) : (
                <div className="bg-spotify-card rounded-lg p-12 text-center mb-16">
                  <svg
                    className="w-16 h-16 text-zinc-600 mx-auto mb-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
                  </svg>

                  <p className="text-spotify-lightText text-lg">
                    No music available yet
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default ProfilePage;
