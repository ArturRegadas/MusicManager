import React from "react";
import { ImageWithFallback } from "../ui/ImageWithFallback";

type Track = {
  id?: number | string;
  title?: string;
  path?: string;
  duration?: number;
};

type Album = {
  id?: number;
  title?: string;
  image?: string;
  tracks?: Track[];
};

type Artist = {
  name?: string;
  albums?: Album[];
};

type Props = {
  artist?: Artist;
  onOpenAlbum?: (album: Album) => void;
  onPlay?: (track: { title?: string; artist?: string; album?: string; cover?: string; path?: string }) => void;
};

export function ArtistPage({ artist, onOpenAlbum, onPlay }: Props) {
  if (!artist) return <p className="text-white/60">Artista não encontrado.</p>;

  const topSongs = (artist.albums ?? []).flatMap(a => (a.tracks ?? []).slice(0, 3)).slice(0, 8);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{artist.name}</h1>

      <section className="mb-6">
        <h2 className="text-lg font-medium mb-2">Álbuns</h2>
        <div className="grid grid-cols-3 gap-3">
          {artist.albums?.map(a => (
            <div key={a.id} className="cursor-pointer" onClick={() => onOpenAlbum?.(a)}>
              <div className="w-full aspect-square rounded overflow-hidden bg-white/5">
                <ImageWithFallback src={a.image} alt={a.title} className="w-full h-full object-cover" />
              </div>
              <div className="mt-2 text-sm text-white">{a.title}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Músicas populares</h2>
        <div className="space-y-2">
          {topSongs.map((t, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 bg-white/5 rounded hover:bg-white/6 cursor-pointer"
              onClick={() =>
                onPlay?.({
                  title: t.title,
                  artist: artist.name,
                  album: "", // unknown here
                  cover: undefined,
                  path: t.path,
                })
              }
            >
              <div className="text-sm text-white">{t.title}</div>
              <div className="text-white/60">▶</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}