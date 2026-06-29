import { createContext, useContext, useRef, useState, useEffect } from "react";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);

  // Set initial volume and update audio volume when it changes
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const playTrack = (track, tracks = null) => {
    if (!track?.uri) return;

    audioRef.current.src = track.uri;
    audioRef.current.play();

    setCurrentTrack(track);
    setIsPlaying(true);

    // If a playlist is provided, set it and update current index
    if (tracks && Array.isArray(tracks)) {
      setPlaylist(tracks);
      const index = tracks.findIndex((t) => t._id === track._id);
      setCurrentIndex(index >= 0 ? index : 0);
    }

    saveRecent(track);
  };

  const pauseTrack = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const stopTrack = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const nextTrack = () => {
    if (playlist.length === 0) return;

    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    playTrack(playlist[nextIndex], playlist);
  };

  const previousTrack = () => {
    if (playlist.length === 0) return;

    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentIndex(prevIndex);
    playTrack(playlist[prevIndex], playlist);
  };

  const increaseVolume = () => {
    const newVolume = Math.min(volume + 0.1, 1);
    setVolume(newVolume);
  };

  const decreaseVolume = () => {
    const newVolume = Math.max(volume - 0.1, 0);
    setVolume(newVolume);
  };

  const setVolumeValue = (value) => {
    setVolume(value);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playTrack,
        pauseTrack,
        stopTrack,
        nextTrack,
        previousTrack,
        audioRef,
        playlist,
        currentIndex,
        setPlaylist,
        volume,
        increaseVolume,
        decreaseVolume,
        setVolumeValue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);

// recent songs
export const saveRecent = (track) => {
  let recent = JSON.parse(localStorage.getItem("recent")) || [];

  recent = [track, ...recent.filter((t) => t._id !== track._id)];

  localStorage.setItem("recent", JSON.stringify(recent.slice(0, 10)));
};
