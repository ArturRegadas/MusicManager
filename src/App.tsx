import { useEffect, useState } from "react"
import { Sidebar } from "./components/layout/SideBar"
import { TopBar } from "./components/layout/TopBar"
import { AlbumGrid } from "./components/music/AlbumGrid"
import { Player } from "./components/music/Player"
import { useMusicLibrary } from "./hooks/useMusicLibrary"

export default function App() {
  const [search, setSearch] = useState("")
  const [currentAlbum, setCurrentAlbum] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const albums = [
    { id: 1, title: "Album 1", artist: "Artist A", cover: "https://picsum.photos/300/300?random=1" },
    { id: 2, title: "Album 2", artist: "Artist B", cover: "https://picsum.photos/300/300?random=2" },
    { id: 3, title: "Album 3", artist: "Artist C", cover: "https://picsum.photos/300/300?random=3" },
    { id: 4, title: "Album 4", artist: "Artist D", cover: "https://picsum.photos/300/300?random=4" },
  ].filter(a => a.title.toLowerCase().includes(search.toLowerCase()))

  const path = "D:/01_ArturHenrique/Musicas"
  /*
  */

  const data = useMusicLibrary(path)
  useEffect(() => {
    console.log(data)
  }, [data])
  

  const currentTrack = albums.find(a => a.id === currentAlbum)

  return (
    <div
      className="min-h-screen w-full flex text-white"
      style={{
        background: "rgba(20,20,20,0.9)",
        backdropFilter: "blur(45px)",
        WebkitBackdropFilter: "blur(45px)",
      }}
    >
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        search={search}
        onSearchChange={setSearch}
      />

      <main className="flex-1 flex flex-col pr-6 pl-6 overflow-y-auto relative">
        <TopBar />

        <AlbumGrid
          albums={albums}
          onSelect={id => {
            setCurrentAlbum(id)
            setPlaying(true)
          }}
        />
      </main>

      <Player
        track={currentTrack ?? { title: "No track selected", artist: "", cover: "" }}
        playing={playing}
        onPlayPause={() => setPlaying(!playing)}
      />
    </div>
  )
}
