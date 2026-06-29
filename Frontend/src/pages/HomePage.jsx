import React, { useEffect, useState } from "react";
import { Layout, Loading, ErrorMessage, MusicCard } from "../components";
import { musicAPI } from "../utils/api";
import { useAuth } from "../hooks/useAuth";

const HomePage = () => {
  const { user } = useAuth();

  const [music, setMusic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMusic();
  }, []);

  const fetchMusic = async () => {
    try {
      const result = await musicAPI.getAllMusic();

      if (result.success) {
        // FIX: backend may return array OR {music: []}
        const tracks = result.data?.music || result.data || [];
        setMusic(Array.isArray(tracks) ? tracks : []);
      } else {
        setError(result.error || "Failed to load music");
      }
    } catch (err) {
      setError("Server error while fetching music");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading fullPage />;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* HERO SECTION */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
            Good {getGreeting()} {user?.username ? `, ${user.username}` : ""}
          </h1>

          <p className="text-zinc-400 text-sm md:text-base">
            Discover fresh music and trending tracks
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onDismiss={() => setError("")} />
          </div>
        )}

        {/* SECTION TITLE */}
        <h2 className="text-2xl font-bold text-white mb-4">
          🔥 Fresh Releases
        </h2>

        {/* MUSIC GRID */}
        {music.length > 0 ? (
          <div
            className="
            grid grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-4
          "
          >
            {music.map((track) => (
              <MusicCard key={track._id} music={track} variant="tall" />
            ))}
          </div>
        ) : (
          <div className="text-center text-zinc-400 py-10">
            No music available yet
          </div>
        )}
      </div>
    </Layout>
  );
};

/* Helper function */
const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Morning ☀️";
  if (hour < 18) return "Afternoon 🌤️";
  return "Evening 🌙";
};

export default HomePage;
