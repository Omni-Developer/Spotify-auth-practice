import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Loading, ErrorMessage, AlbumCard } from "../components";
import { musicAPI } from "../utils/api";

const BrowseAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    setError("");

    const result = await musicAPI.getAllAlbums();

    if (result.success) {
      const data = result.data || [];
      setAlbums(data);
      setFilteredAlbums(data);
    } else {
      setError(result.error || "Failed to load albums");
    }

    setLoading(false);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);

    const filtered = albums.filter((album) =>
      album.title.toLowerCase().includes(term.toLowerCase()),
    );

    setFilteredAlbums(filtered);
  };

  const handleAlbumClick = (album) => {
    navigate(`/album/${album._id}`);
  };

  if (loading) return <Loading fullPage />;

  return (
    <Layout>
      <div className="max-w-7xl">
        <h1 className="text-4xl font-bold mb-8">Browse Albums</h1>

        {error && (
          <ErrorMessage message={error} onDismiss={() => setError("")} />
        )}

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search albums..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-spotify-card border border-spotify-lightText rounded-lg px-4 py-3 text-white"
          />
        </div>

        {/* Grid */}
        {filteredAlbums.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAlbums.map((album) => (
              <AlbumCard
                key={album._id}
                album={album}
                onClick={handleAlbumClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-spotify-lightText">
            No albums found
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BrowseAlbums;
