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
  onBack?: () => void;
};

export function AlbumPage({ album, onPlay, onBack }: Props) {
  if (!album) {
    return <p className="text-white/60">Álbum não encontrado.</p>;
  }

  return (
    <div className="p-4">
      <div className="flex gap-4 items-start justify-between">
        <div className="flex items-center gap-3">
          {onBack && <button className="px-2 py-1 rounded bg-white/6 hover:bg-white/8" onClick={onBack}>← Voltar</button>}
          <div className="w-44 h-44 rounded overflow-hidden">
            <ImageWithFallback src={album.image} alt={album.title} className="w-full h-full object-cover" />
          </div>
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
            <div className="text-sm text-white">{t.title}</div>
            <div className="text-white/60">▶</div>
          </div>
        ))}
      </div>
    </div>
  );
}