import { AlbumCard } from "./AlbumCard"

type Album = {
  id: number
  title: string
  artist: string
  cover: string
}

type AlbumGridProps = {
  albums: Album[]
  onSelect: (id: number) => void
}

export function AlbumGrid({ albums, onSelect }: AlbumGridProps) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {albums.map(album => (
        <div
          key={album.id}
          className="cursor-pointer transition transform hover:scale-105"
          onClick={() => onSelect(album.id)}
        >
          <AlbumCard {...album} />
        </div>
      ))}
    </section>
  )
}
