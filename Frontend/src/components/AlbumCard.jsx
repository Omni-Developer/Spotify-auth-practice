import React from "react";
import { Card } from "./Card";

export const AlbumCard = ({ album, onClick }) => {
  return (
    <Card
      className="cursor-pointer group bg-zinc-900 hover:bg-zinc-800 transition-all"
      onClick={() => onClick?.(album)}
    >
      <div className="flex flex-col gap-2">
        {/* COVER */}
        <div className="relative h-28 rounded-lg overflow-hidden bg-gradient-to-br from-zinc-700 to-zinc-900 group-hover:from-green-600 group-hover:to-green-800 transition-all flex items-center justify-center">
          {album.musics?.[0]?.coverImage ? (
            <img
              src={album.musics[0].coverImage}
              alt={album.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              className="w-10 h-10 text-white opacity-80"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
            </svg>
          )}
        </div>

        {/* INFO */}
        <div>
          <h3 className="text-white font-semibold truncate">{album.title}</h3>

          <p className="text-zinc-400 text-sm">
            {album.musics?.length || 0} tracks
          </p>
        </div>
      </div>
    </Card>
  );
};
