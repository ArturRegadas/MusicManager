import { ImageWithFallback } from "../ui/ImageWithFallBack";

type AlbumProps = {
  id: number;
  title: string;
  artist: string;
  cover?: string;
};

export function AlbumCard({ id, title, artist, cover }: AlbumProps) {
  return (
    <div className="flex flex-col items-start">
      <div className="w-full aspect-square rounded-lg overflow-hidden bg-white/5">
        <ImageWithFallback src={cover} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="mt-2 w-full">
        <div className="text-sm font-medium text-white truncate">{title}</div>
        <div className="text-xs text-white/70 truncate">{artist}</div>
      </div>
    </div>
  );
}