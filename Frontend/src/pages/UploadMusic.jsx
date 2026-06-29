import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Layout, Button, Input, ErrorMessage } from "../components";

import { ProtectedRoute } from "../components/ProtectedRoute";

import { musicAPI } from "../utils/api";
import { useAuth } from "../hooks/useAuth";

const UploadMusic = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { user } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validation
    if (!title.trim()) {
      setError("Music title is required");
      return;
    }

    if (!file) {
      setError("Please select an audio file");
      return;
    }

    if (!coverImage) {
      setError("Please select a cover image");
      return;
    }

    try {
      setLoading(true);

      // FIXED: use user.id instead of user._id
      const result = await musicAPI.uploadMusic(
        title,
        file,
        coverImage,
        user.id,
      );

      if (result.success) {
        setSuccess("Music uploaded successfully!");

        // Reset form
        setTitle("");
        setFile(null);
        setCoverImage(null);

        // Redirect
        setTimeout(() => {
          navigate("/music");
        }, 1500);
      } else {
        setError(result.error || "Upload failed");
      }
    } catch (err) {
      console.log(err);

      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireRole="artist">
      <Layout>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-white">Upload Music</h1>

          <div className="bg-spotify-card rounded-lg p-8 shadow-lg">
            {/* Error */}
            {error && (
              <ErrorMessage message={error} onDismiss={() => setError("")} />
            )}

            {/* Success */}
            {success && (
              <div className="bg-green-900 border border-green-700 rounded-lg px-4 py-3 mb-6 text-green-100">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Music Title */}
              <Input
                label="Music Title"
                type="text"
                placeholder="Enter music title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
              />

              {/* Audio Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white">
                  Audio File
                </label>

                <input
                  type="file"
                  accept="audio/*"
                  disabled={loading}
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0] || null;
                    console.log("Audio file selected:", selectedFile);
                    console.log("Audio file size:", selectedFile?.size);
                    setFile(selectedFile);
                  }}
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

                {file && (
                  <div className="bg-spotify-hover rounded-lg px-3 py-2 mt-2">
                    <p className="text-sm text-spotify-green">Selected File:</p>

                    <p className="text-white text-sm">{file.name}</p>
                  </div>
                )}
              </div>

              {/* Cover Image Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white">
                  Cover Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  disabled={loading}
                  onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
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

                {coverImage && (
                  <div className="bg-spotify-hover rounded-lg px-3 py-2 mt-2 flex gap-3">
                    <div className="w-12 h-12 bg-spotify-dark rounded overflow-hidden flex-shrink-0">
                      <img
                        src={URL.createObjectURL(coverImage)}
                        alt="cover preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-spotify-green">
                        Selected Cover:
                      </p>
                      <p className="text-white text-sm">{coverImage.name}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Artist Info */}
              {user && (
                <div className="bg-spotify-hover rounded-lg p-4">
                  <p className="text-sm text-gray-400">Uploading as:</p>

                  <p className="text-white font-semibold">{user.username}</p>

                  <p className="text-xs text-gray-500 mt-1">
                    Role: {user.role}
                  </p>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full"
              >
                {loading ? "Uploading..." : "Upload Music"}
              </Button>
            </form>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default UploadMusic;
