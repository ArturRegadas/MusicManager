import { Glass } from "../layout/Glass"

interface AlbumCardProps {
  cover: string
  title: string
  artist: string
}

export function AlbumCard({ cover, title, artist }: AlbumCardProps) {
  return (
    <Glass className="p-3 cursor-pointer hover:scale-105 transform transition">
      <img
        src={cover}
        className="w-36 h-36 rounded-xl mb-3 object-cover flex-shrink-0"
        alt={title}
      />
      <h3 className="font-semibold text-sm leading-tight">{title}</h3>
      <p className="text-xs text-white/70 mt-1">{artist}</p>
    </Glass>
  )
}