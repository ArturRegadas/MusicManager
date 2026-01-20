import React from "react";
import { ImageWithFallback } from "../ui/ImageWithFallback";

type Track = {
  id?: number | string;
  title?: string;
  path?: string;
  duration?: number;
};

type Album = {
  title?: string;
  image?: string;
  artist?: string;
  tracks?: Track[];
};

type Props = {
  album?: Album;
  onPlay?: (track: { title?: string; artist?: string; album?: string; cover?: string; path?: string }) => void;
};

export function AlbumPage({ album, onPlay }: Props) {
  if (!album) {
    return <p className="text-white/60">Álbum não encontrado.</p>;
  }

  return (
    <div className="p-4">
      <div className="flex gap-4 items-start">
        <div className="w-44 h-44 rounded overflow-hidden">
          <ImageWithFallback src={album.image} alt={album.title} className="w-full h-full object-cover" />
        </div>

        <div>
          <h2 className="text-2xl font-bold">{album.title}</h2>
          <p className="text-white/70">{album.artist}</p>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {album.tracks?.map((t, i) => (
          <div
            key={t.id ?? i}
            className="flex items-center justify-between p-2 bg-white/5 rounded hover:bg-white/6 cursor-pointer"
            onClick={() =>
              onPlay?.({
                title: t.title,
                artist: album.artist,
                album: album.title,
                cover: album.image,
                path: t.path,
              })
            }
          >
            <div>
              <div className="text-sm font-medium text-white">{t.title}</div>
              <div className="text-xs text-white/70">{t.duration ? `${Math.floor(t.duration / 60)}:${String(t.duration % 60).padStart(2, "0")}` : ""}</div>
            </div>

            <div className="text-white/60">▶</div>
          </div>
        ))}
      </div>
    </div>
  );
}