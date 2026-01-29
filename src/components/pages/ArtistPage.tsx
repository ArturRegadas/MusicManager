import { ImageWithFallback } from "../ui/ImageWithFallBack";

type Track = {
  id?: number | string;
  title?: string;
  path?: string;
  duration?: number;
  cover?: string;
};

type Album = {
  id?: number;
  title?: string;
  image?: string;
  tracks?: Track[];
};

type Artist = {
  id?: number;
  name?: string;
  image?: string;
  albums?: Album[];
};

type Props = {
  artist?: Artist;
  onOpenAlbum?: (album: Album) => void;
  onPlay?: (track: { title?: string; artist?: string; album?: string; cover?: string; path?: string }) => void;
  onBack?: () => void;
};

export function ArtistPage({ artist, onOpenAlbum, onPlay, onBack }: Props) {
  if (!artist) return <p className="text-white/60">Artista não encontrado.</p>;

  const artistImage = artist.image ?? (artist.albums?.[0]?.image ?? undefined);

  const topSongs = (artist.albums ?? []).flatMap(a =>
    (a.tracks ?? []).slice(0, 3).map(t => ({
      ...t,
      cover: (t as any).cover ?? a.image,
      albumTitle: a.title,
    }))
  ).slice(0, 8);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button className="px-2 py-1 rounded bg-white/6 hover:bg-white/8" onClick={onBack}>← Voltar</button>
          )}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded overflow-hidden bg-white/5">
              <ImageWithFallback src={artistImage} alt={artist.name} className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold mb-0">{artist.name}</h1>
          </div>
        </div>
      </div>

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
          {topSongs.map((t: any, i: number) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 bg-white/5 rounded hover:bg-white/6 cursor-pointer"
              onClick={() =>
                onPlay?.({
                  title: t.title,
                  artist: artist.name,
                  album: t.albumTitle ?? "",
                  cover: t.cover,
                  path: t.path,
                })
              }
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded overflow-hidden bg-white/5">
                  <ImageWithFallback src={t.cover} alt={t.title} className="w-full h-full object-cover" />
                </div>
                <div className="text-sm text-white">{t.title}</div>
              </div>
              <div className="text-white/60">▶</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}