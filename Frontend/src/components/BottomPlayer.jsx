import {
  MdSkipPrevious,
  MdStop,
  MdPlayArrow,
  MdPause,
  MdSkipNext,
  MdVolumeDown,
  MdVolumeUp,
} from "react-icons/md";
import { usePlayer } from "../context/PlayerContext";

export const BottomPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    pauseTrack,
    playTrack,
    stopTrack,
    nextTrack,
    previousTrack,
    volume,
    increaseVolume,
    decreaseVolume,
    setVolumeValue,
  } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div
      className="
        fixed bottom-0 left-0 right-0 z-50
        bg-gradient-to-t from-zinc-950 to-zinc-900/95 backdrop-blur-lg
        border-t border-spotify-green/20
        px-4 py-4
        flex items-center justify-between
        shadow-2xl
      "
    >
      {/* Track Info - Left */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Cover Image */}
        <div className="w-14 h-14 bg-gradient-to-br from-spotify-green to-zinc-800 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
          {currentTrack.coverImage ? (
            <img
              src={currentTrack.coverImage}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white text-xl">♪</span>
            </div>
          )}
        </div>

        {/* Track Details */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">
            {currentTrack.title}
          </p>
          <p className="text-zinc-400 text-xs truncate">
            {currentTrack.artist?.username}
          </p>
        </div>
      </div>

      {/* Player Controls - Center */}
      <div className="flex items-center gap-6 px-8">
        {/* Previous Button */}
        <button
          onClick={previousTrack}
          className="
            p-2 rounded-full
            text-zinc-400 hover:text-spotify-green hover:bg-zinc-800/50
            transition-all duration-200
            flex items-center justify-center
          "
          title="Previous track"
        >
          <MdSkipPrevious size={32} />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={() => (isPlaying ? pauseTrack() : playTrack(currentTrack))}
          className="
            w-14 h-14 rounded-full
            bg-spotify-green hover:bg-green-500
            flex items-center justify-center
            text-black font-bold
            transition-all duration-200
            shadow-lg hover:shadow-green-500/50
            active:scale-95
          "
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <MdPause size={36} /> : <MdPlayArrow size={36} />}
        </button>

        {/* Next Button */}
        <button
          onClick={nextTrack}
          className="
            p-2 rounded-full
            text-zinc-400 hover:text-spotify-green hover:bg-zinc-800/50
            transition-all duration-200
            flex items-center justify-center
          "
          title="Next track"
        >
          <MdSkipNext size={32} />
        </button>
      </div>

      {/* Volume Controls - Right */}
      <div className="flex items-center gap-3 flex-1 justify-end">
        {/* Decrease Volume Button */}
        <button
          onClick={decreaseVolume}
          className="
            p-2 rounded-full
            text-zinc-400 hover:text-spotify-green hover:bg-zinc-800/50
            transition-all duration-200
            flex items-center justify-center
          "
          title="Decrease volume"
        >
          <MdVolumeDown size={28} />
        </button>

        {/* Volume Slider */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => {
            const newVolume = parseFloat(e.target.value);
            setVolumeValue(newVolume);
          }}
          className="
            w-24 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer
            accent-spotify-green
          "
          title={`Volume: ${Math.round(volume * 100)}%`}
        />

        {/* Increase Volume Button */}
        <button
          onClick={increaseVolume}
          className="
            p-2 rounded-full
            text-zinc-400 hover:text-spotify-green hover:bg-zinc-800/50
            transition-all duration-200
            flex items-center justify-center
          "
          title="Increase volume"
        >
          <MdVolumeUp size={28} />
        </button>

        {/* Volume Percentage */}
        <span className="text-xs text-zinc-400 w-10 text-right">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
};
