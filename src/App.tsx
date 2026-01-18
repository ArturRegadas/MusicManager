import { useEffect, useState } from "react"
import { Sidebar } from "./components/layout/SideBar"
import { TopBar } from "./components/layout/TopBar"
import { AlbumGrid } from "./components/music/AlbumGrid"
import { useMusicLibrary } from "./hooks/useMusicLibrary"
import { Album as AlbumType } from "./types/music"
import { Player } from "./components/music/Player"

export default function App() {
  const [search, setSearch] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const path = "D:/01_ArturHenrique/Musicas"
  const { library } = useMusicLibrary(path)

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
      cover:
        album.image ??
        `https://picsum.photos/300/300?random=${album.id ?? Math.floor(Math.random() * 1000)}`,
      raw: album,
    }))
  )

  const albums = mappedAlbums.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div
        className="min-h-screen w-full flex justify-center overflow-y-auto pb-40"
        style={{
          background: "linear-gradient(135deg, rgba(45,45,48,0.9), rgba(75,80,85,0.75))",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      >
        <div className="bg-black/40 rounded-2xl shadow-2xl w-[1200px] min-h-[820px] relative text-white my-6">
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
            <AlbumGrid albums={albums} />
          </main>
        </div>
      </div>

      <Player />
    </>
  )
}
