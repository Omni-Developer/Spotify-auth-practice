import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Button,
  Input,
  ErrorMessage,
  MusicCard,
  Loading,
} from "../components";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { musicAPI } from "../utils/api";
import { useAuth } from "../hooks/useAuth";

const CreateAlbum = () => {
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [selectedMusics, setSelectedMusics] = useState([]);
  const [allMusic, setAllMusic] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMusic, setFetchingMusic] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllMusic();
  }, []);

  const fetchAllMusic = async () => {
    setFetchingMusic(true);

    const result = await musicAPI.getAllMusic();

    if (result.success) {
      setAllMusic(result.data);
    } else {
      setError(result.error || "Failed to load music");
    }

    setFetchingMusic(false);
  };

  const handleMusicSelect = (music) => {
    setSelectedMusics((prev) => {
      const exists = prev.find((m) => m._id === music._id);

      if (exists) {
        return prev.filter((m) => m._id !== music._id);
      }

      return [...prev, music];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Album title is required");
      return;
    }

    if (selectedMusics.length === 0) {
      setError("Select at least one track");
      return;
    }

    setLoading(true);

    const musicIds = selectedMusics.map((m) => m._id);

    // Create FormData for multipart upload
    const formData = new FormData();
    formData.append("title", title);
    formData.append("musicIds", JSON.stringify(musicIds));
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    const result = await musicAPI.createAlbumWithCover(formData);

    if (result.success) {
      setSuccess("Album created successfully!");

      setTitle("");
      setCoverImage(null);
      setSelectedMusics([]);

      setTimeout(() => {
        navigate("/albums");
      }, 1500);
    } else {
      setError(result.error || "Failed to create album");
    }

    setLoading(false);
  };

  if (fetchingMusic) return <Loading fullPage />;

  return (
    <ProtectedRoute requireRole="artist">
      <Layout>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-white">Create Album</h1>

          {/* ERROR / SUCCESS */}
          {error && (
            <ErrorMessage message={error} onDismiss={() => setError("")} />
          )}

          {success && (
            <div className="bg-green-900 border border-green-700 rounded-lg px-4 py-3 mb-6 text-green-100">
              {success}
            </div>
          )}

          {/* FORM */}
          <div className="bg-spotify-card rounded-lg p-8 mb-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <Input
                label="Album Title"
                type="text"
                placeholder="Enter album title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
              />

              {/* Cover Image Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white">
                  Album Cover (Optional)
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
                  <div className="bg-spotify-hover rounded-lg p-3 flex items-center gap-3">
                    <img
                      src={URL.createObjectURL(coverImage)}
                      alt="Cover preview"
                      className="w-12 h-12 rounded object-cover"
                    />
                    <span className="text-sm text-spotify-green">
                      {coverImage.name}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-4 items-center">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading || selectedMusics.length === 0}
                >
                  {loading ? "Creating..." : "Create Album"}
                </Button>

                <p className="text-spotify-lightText">
                  {selectedMusics.length} track
                  {selectedMusics.length !== 1 ? "s" : ""} selected
                </p>
              </div>
            </form>
          </div>

          {/* MUSIC LIST */}
          <h2 className="text-2xl font-bold mb-6 text-white">Select Tracks</h2>

          {allMusic.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allMusic.map((music) => (
                <MusicCard
                  key={music._id}
                  music={music}
                  onSelect={handleMusicSelect}
                  isSelected={selectedMusics.some((m) => m._id === music._id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-spotify-lightText">No music available</p>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CreateAlbum;
