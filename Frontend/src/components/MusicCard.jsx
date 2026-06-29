import { usePlayer } from "../context/PlayerContext";

export const MusicCard = ({
  music,
  variant = "compact",
  onSelect,
  isSelected,
}) => {
  const { playTrack, currentTrack } = usePlayer();

  const isActive = currentTrack?._id === music._id;

  const handleClick = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(music);
    } else {
      playTrack(music);
    }
  };

  const base =
    "cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]";

  const variants = {
    compact: "p-3 bg-zinc-900 hover:bg-zinc-800",
    tall: "p-4 bg-gradient-to-b from-zinc-800 to-zinc-950 h-64",
  };

  return (
    <div
      onClick={handleClick}
      className={`${base} ${variants[variant]} ${
        isSelected ? "ring-2 ring-spotify-green" : ""
      }`}
    >
      {/* COVER */}
      <div
        className={`
          flex items-center justify-center
          rounded-xl mb-3 overflow-hidden
          ${variant === "tall" ? "h-36" : "h-24"}
          bg-zinc-800
          group-hover:opacity-75
          transition
          relative
        `}
      >
        {music.coverImage ? (
          <img
            src={music.coverImage}
            alt={music.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            className="w-8 h-8 text-zinc-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm-1 5v6a1 1 0 102 0v-6a1 1 0 10-2 0z" />
          </svg>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition">
          <span className="text-white text-sm font-semibold">
            {isSelected
              ? "✓ Selected"
              : onSelect
                ? "+ Select"
                : isActive
                  ? "▶ Playing"
                  : "▶ Play"}
          </span>
        </div>

        {/* Selected Badge */}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-spotify-green rounded-full p-1 flex items-center justify-center">
            <span className="text-black text-lg">✓</span>
          </div>
        )}
      </div>

      {/* INFO */}
      <h3 className="text-white font-semibold truncate">{music.title}</h3>

      <p className="text-zinc-400 text-sm truncate">{music.artist?.username}</p>
    </div>
  );
};
