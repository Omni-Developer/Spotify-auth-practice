import React, { useState, useEffect } from "react";
import { Layout, Loading, ErrorMessage, MusicCard } from "../components";
import { musicAPI } from "../utils/api";
import { usePlayer } from "../context/PlayerContext";

const BrowseMusic = () => {
  const [music, setMusic] = useState([]);
  const [filteredMusic, setFilteredMusic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { playTrack, currentTrack } = usePlayer();

  useEffect(() => {
    fetchMusic();
  }, []);

  const fetchMusic = async () => {
    setError("");

    const result = await musicAPI.getAllMusic();

    if (result.success) {
      setMusic(result.data);
      setFilteredMusic(result.data);
    } else {
      setError(result.error || "Failed to load music");
    }

    setLoading(false);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);

    const filtered = music.filter(
      (track) =>
        track.title.toLowerCase().includes(term.toLowerCase()) ||
        track.artist?.username?.toLowerCase().includes(term.toLowerCase()),
    );

    setFilteredMusic(filtered);
  };

  if (loading) return <Loading fullPage />;

  return (
    <Layout>
      <div className="max-w-7xl">
        <h1 className="text-4xl font-bold mb-8">Browse Music</h1>

        {error && (
          <ErrorMessage message={error} onDismiss={() => setError("")} />
        )}

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search music or artist..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-spotify-card border border-spotify-lightText rounded-lg px-4 py-3 text-white"
          />
        </div>

        {/* Music Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMusic.map((track) => (
            <MusicCard
              key={track._id}
              music={track}
              onPlay={() => playTrack(track)}
              isPlaying={currentTrack?._id === track._id}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default BrowseMusic;
