import { useEffect, useState } from "react";
import { Sidebar } from "./components/layout/SideBar";
import { TopBar } from "./components/layout/TopBar";
import { AlbumGrid } from "./components/music/AlbumGrid";
import { useMusicLibrary } from "./hooks/useMusicLibrary";
import { Player } from "./components/music/Player";
import { HistoryPage } from "./components/pages/History";
import { SettingsPage } from "./components/pages/Settings";
import { FilterBar } from "./components/music/FilterBar";
import { SongsList } from "./components/music/SongsList";
import { AlbumPage } from "./components/pages/AlbumPage";
import { ArtistPage } from "./components/pages/ArtistPage";

//recusrividade do player
//ficar botoes superiores
// foto quando abre musica pelo artista
// botao de voltar
// config
// player

type Track = {
  title?: string;
  artist?: string;
  album?: string;
  cover?: string;
  path?: string;
};

export default function App() {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState<"home" | "library" | "history" | "settings" | "album" | "artist">("library");
  const [filter, setFilter] = useState<"artists" | "albums" | "songs">("albums");
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<any | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  const path = "D:/01_ArturHenrique/Musicas";
  const { library, loading } = useMusicLibrary(path);

  const mappedAlbums: {
    id: number;
    title: string;
    artist: string;
    cover: string;
    raw?: any;
  }[] =
    library?.flatMap((artist: any) =>
      artist.albums.map((album: any) => ({
        id: album.id ?? Math.floor(Math.random() * 1000000),
        title: album.title,
        artist: artist.name,
        cover:
          album.image ??
          `https://picsum.photos/300/300?random=${album.id ?? Math.floor(Math.random() * 1000)}`,
        raw: { ...album, artist: artist.name },
      }))
    ) ?? [];

  const albums = mappedAlbums.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {

    if (page !== "album") setSelectedAlbum(null);
    if (page !== "artist") setSelectedArtist(null);
  }, [page]);

  const openAlbumById = (id: number) => {
    const a = mappedAlbums.find(m => m.id === id);
    if (a) {
      setSelectedAlbum(a.raw);
      setPage("album");
    }
  };

  const openArtist = (artistName: string) => {
    const artistObj = library?.find((a: any) => a.name === artistName);
    if (artistObj) {
      setSelectedArtist(artistObj);
      setPage("artist");
    }
  };

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
              onNavigate={(p: string) => {
                if (p === "library") setPage("library");
                if (p === "history") setPage("history");
                if (p === "settings") setPage("settings");
                if (p === "home") setPage("home");
              }}
            />
          </div>

          <main
            className="absolute top-0 right-0 bottom-0 overflow-auto px-6 py-4"
            style={{ left: sidebarOpen ? 256 : 64 }}
          >
            <TopBar />

            <div className="mt-4">
              {page === "history" && <HistoryPage />}
              {page === "settings" && <SettingsPage />}

              {page === "library" && (
                <>
                  <FilterBar value={filter} onChange={setFilter} />

                  {filter === "albums" && <AlbumGrid albums={albums} onSelect={openAlbumById} />}

                  {filter === "artists" && (
                    <div className="space-y-3">
                      {library?.map((artist: any) => (
                        <div
                          key={artist.name}
                          className="p-2 bg-white/5 rounded hover:bg-white/6 cursor-pointer"
                          onClick={() => {
                            setSelectedArtist(artist);
                            setPage("artist");
                          }}
                        >
                          <div className="font-medium text-white">{artist.name}</div>
                          <div className="text-sm text-white/60">{artist.albums?.length ?? 0} álbuns</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {filter === "songs" && (
                    <SongsList
                      library={library}
                      onPlay={track => {
                        setCurrentTrack(track);
                      }}
                    />
                  )}
                </>
              )}

              {page === "album" && selectedAlbum && (
                <AlbumPage
                  album={selectedAlbum}
                  onPlay={track => {
                    setCurrentTrack(track);
                  }}
                />
              )}

              {page === "artist" && selectedArtist && (
                <ArtistPage
                  artist={selectedArtist}
                  onOpenAlbum={a => {
              
                    setSelectedAlbum({ ...a, artist: selectedArtist?.name });
                    setPage("album");
                  }}
                  onPlay={track => setCurrentTrack(track)}
                />
              )}

              {page === "home" && <div>Bem vindo ao Music Manager</div>}
            </div>
          </main>
        </div>
      </div>

      <Player currentTrack={currentTrack} />
    </>
  );
}