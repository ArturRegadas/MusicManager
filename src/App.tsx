import { useEffect, useState } from "react"
import { Sidebar } from "./components/layout/SideBar"
import { TopBar } from "./components/layout/TopBar"
import { AlbumGrid } from "./components/music/AlbumGrid"
import { useMusicLibrary } from "./hooks/useMusicLibrary"
import { Album as AlbumType } from "./types/music"
import { Player } from "./components/music/Player"

export default function App() {
  const [search, setSearch] = useState("")
  const [currentAlbum, setCurrentAlbum] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const path = "D:/01_ArturHenrique/Musicas"
  const { library, loading } = useMusicLibrary(path)

  const mappedAlbums: {
    id: number
    title: string
    artist: string
    cover: string
    raw?: AlbumType
  }[] = library.flatMap(artist =>
    artist.albums.map(album => ({
      id: album.id ?? 0,
      title: album.title,
      artist: artist.name,
      cover: album.image ?? `https://picsum.photos/300/300?random=${album.id ?? Math.floor(Math.random() * 1000)}`,
      raw: album,
    }))
  )

  const albums = mappedAlbums.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    console.log("Library loaded:", library, "loading:", loading)
  }, [library, loading])

  const currentAlbumObj = albums.find(a => a.id === currentAlbum)

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, rgba(45,45,48,0.9), rgba(75,80,85,0.75))",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      <div className="bg-black/40 rounded-2xl shadow-2xl w-[1200px] h-[820px] relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 z-20">
          <Sidebar
            open={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            search={search}
            onSearchChange={setSearch}
          />
        </div>

        <main
          className="absolute top-0 right-0 bottom-0 overflow-auto px-6 py-4"
          style={{ left: sidebarOpen ? 256 : 64 }}
        >
          <TopBar />

          <AlbumGrid
            albums={albums}
            onSelect={id => {
              setCurrentAlbum(id)
              setPlaying(true)
            }}
          />
        </main>

        <Player />
      </div>
    </div>
  )
}