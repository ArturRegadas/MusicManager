import React from "react";
import { ImageWithFallback } from "../ui/ImageWithFallback";

type SongItem = {
  id: string | number;
  title: string;
  artist?: string;
  album?: string;
  cover?: string;
  path?: string;
};

type Props = {
  library: any[]; 
  onPlay?: (track: SongItem) => void;
  onOpenAlbum?: (album: any) => void;
  onOpenArtist?: (artist: any) => void;
};

export function SongsList({ library, onPlay }: Props) {
  const songs: SongItem[] = [];

  library?.forEach((artist: any) => {
    const artistName = artist.name;
    artist.albums?.forEach((album: any) => {
      const albumTitle = album.title;
      const cover = album.image;
      album.tracks?.forEach((track: any, idx: number) => {
        songs.push({
          id: track.id ?? `${artistName}-${albumTitle}-${idx}`,
          title: track.title ?? track.name ?? `Track ${idx + 1}`,
          artist: artistName,
          album: albumTitle,
          cover,
          path: track.path,
        });
      });
    });
  });

  if (!songs.length) {
    return <p className="text-white/60">Nenhuma música encontrada.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      {songs.map(s => (
        <div
          key={s.id}
          className="flex items-center gap-3 bg-white/5 p-2 rounded hover:bg-white/6 transition cursor-pointer"
          onClick={() => onPlay?.(s)}
        >
          <div className="w-14 h-14 flex-shrink-0 rounded overflow-hidden">
            <ImageWithFallback src={s.cover} alt={s.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1">
            <div className="text-sm font-medium text-white">{s.title}</div>
            <div className="text-xs text-white/70">{s.artist} • {s.album}</div>
          </div>

          <div className="text-sm text-white/60">▶</div>
        </div>
      ))}
    </div>
  );
}