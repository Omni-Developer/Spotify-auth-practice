import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout, Loading, ErrorMessage, MusicCard } from "../components";
import { musicAPI } from "../utils/api";

const AlbumPage = () => {
  const { id } = useParams();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAlbum();
  }, [id]);

  const fetchAlbum = async () => {
    try {
      const result = await musicAPI.getAlbumById(id);

      if (result.success) {
        setAlbum(result.data);
      } else {
        setError(result.error || "Failed to load album");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading fullPage />;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-6">
        {error && (
          <ErrorMessage message={error} onDismiss={() => setError("")} />
        )}

        {/* Album Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">{album?.title}</h1>

          <p className="text-zinc-400 mt-2">
            {album?.musics?.length || 0} songs
          </p>
        </div>

        {/* Songs */}
        {album?.musics?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {album.musics.map((track) => (
              <MusicCard key={track._id} music={track} />
            ))}
          </div>
        ) : (
          <p className="text-zinc-400">No songs in this album</p>
        )}
      </div>
    </Layout>
  );
};

export default AlbumPage;
