import { Glass } from "../layout/Glass"

interface AlbumCardProps {
  cover: string
  title: string
  artist: string
}

export function AlbumCard({ cover, title, artist }: AlbumCardProps) {
  return (
    <Glass className="p-4 cursor-pointer hover:bg-white/20">
      <img
        src={cover}
        className="rounded-xl mb-3 object-cover"
      />
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-zinc-400">{artist}</p>
    </Glass>
  )
}
