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
  const [page, setPage] = useState<
    "home" | "library" | "history" | "settings" | "album" | "artist"
  >("library");
  const [filter, setFilter] = useState<"artists" | "albums" | "songs">("albums");
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<any | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playbackHistory, setPlaybackHistory] = useState<Track[]>([]); // histórico local para prev quando necessário

  const [libraryPath, setLibraryPath] = useState<string>(() => {
    try {
      return localStorage.getItem("musicLibraryPath") ?? "D:/01_ArturHenrique/Musicas";
    } catch {
      return "D:/01_ArturHenrique/Musicas";
    }
  });

  const { library, loading } = useMusicLibrary(libraryPath);

  useEffect(() => {
    if (page !== "album") setSelectedAlbum(null);
    if (page !== "artist") setSelectedArtist(null);
  }, [page]);

  const playTrack = (track: Track) => {
    setPlaybackHistory(prev => {
      if (currentTrack) {
        return [...prev, currentTrack];
      }
      return prev;
    });
    setCurrentTrack(track);
  };

  const handlePrev = () => {
    if (selectedAlbum && currentTrack?.path) {
      const tracks = selectedAlbum.tracks ?? [];
      const idx = tracks.findIndex((t: any) => t.path === currentTrack.path);
      if (idx > 0) {
        const prevTrack = tracks[idx - 1];
        playTrack({
          title: prevTrack.title,
          artist: selectedAlbum.artist,
          album: selectedAlbum.title,
          cover: selectedAlbum.image,
          path: prevTrack.path,
        });
        return;
      }
    }


    setPlaybackHistory(prev => {
      if (!prev.length) return prev;
      const last = prev[prev.length - 1];
      const newPrev = prev.slice(0, prev.length - 1);
      setCurrentTrack(last);
      return newPrev;
    });
  };

  const handleNext = () => {
    
    if (selectedAlbum && currentTrack?.path) {
      const tracks = selectedAlbum.tracks ?? [];
      const idx = tracks.findIndex((t: any) => t.path === currentTrack.path);
      if (idx >= 0 && idx < tracks.length - 1) {
        const nextTrack = tracks[idx + 1];
        playTrack({
          title: nextTrack.title,
          artist: selectedAlbum.artist,
          album: selectedAlbum.title,
          cover: selectedAlbum.image,
          path: nextTrack.path,
        });
        return;
      }
    }

    
    if (library && library.length > 0) {
    
      const albumsWithTracks = library.flatMap((artist: any) =>
        (artist.albums ?? []).map((album: any) => ({ album, artistName: artist.name }))
      ).filter((a: any) => (a.album.tracks ?? []).length > 0);

      if (albumsWithTracks.length > 0) {
        const random = albumsWithTracks[Math.floor(Math.random() * albumsWithTracks.length)];
        const firstTrack = random.album.tracks[0];
        playTrack({
          title: firstTrack.title,
          artist: random.artistName,
          album: random.album.title,
          cover: random.album.image,
          path: firstTrack.path,
        });
      }
    }
  };

  const mappedAlbums: {
    id: number | string;
    title: string;
    artist: string;
    cover: string;
    raw?: any;
  }[] =
    library?.flatMap((artist: any) =>
      (artist.albums ?? []).map((album: any) => ({
        id: album.id ?? `${artist.name}-${album.title}`,
        title: album.title,
        artist: artist.name,
        cover:
          album.image ??
          `https://picsum.photos/300/300?random=${album.id ?? Math.floor(Math.random() * 1000)}`,
        raw: { ...album, artist: artist.name },
      }))
    ) ?? [];

  const openAlbumById = (id: number | string) => {
    const a = mappedAlbums.find(m => m.id === id);
    if (a) {
      setSelectedAlbum(a.raw);
      setPage("album");
    }
  };


  const lower = search.trim().toLowerCase();
  const songResults: Track[] = lower
    ? library.flatMap((artist: any) =>
        (artist.albums ?? []).flatMap((album: any) =>
          (album.tracks ?? []).map((t: any) => ({
            title: t.title,
            artist: artist.name,
            album: album.title,
            cover: album.image ?? artist.image,
            path: t.path,
          }))
        )
      ).filter((r: any) =>
        (r.title ?? "").toLowerCase().includes(lower)
      )
    : [];

  const artistResults = lower
    ? library.filter((artist: any) => (artist.name ?? "").toLowerCase().includes(lower))
    : [];

  const albumResults = lower
    ? library.flatMap((artist: any) => (artist.albums ?? []).map((album: any) => ({ ...album, artist: artist.name })))
      .filter((album: any) => (album.title ?? "").toLowerCase().includes(lower))
    : [];

  return (
    <>
      <TopBar />
      <div className="min-h-screen w-full flex justify-center overflow-y-auto pb-40 pt-0 mt-0" style={{
        background: "linear-gradient(135deg, rgba(45,45,48,0.9), rgba(75,80,85,0.75))",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}>
        <div className="bg-black/40 rounded-2xl shadow-2xl w-[1200px] min-h-[820px] relative text-white my-6 mt-0">
          <div className="absolute left-0 top-0 bottom-0 z-20">
            <Sidebar
              open={sidebarOpen}
              onToggle={() => setSidebarOpen(!sidebarOpen)}
              search={search}
              onSearchChange={setSearch}
              onSearchSubmit={(q) => {
                setSearch(q);
                setPage("library");
                setFilter("songs");
              }}
              onNavigate={(p: string) => {
                if (p === "library") setPage("library");
                if (p === "history") setPage("history");
                if (p === "settings") setPage("settings");
                if (p === "home") setPage("home");
              }}
            />
          </div>

          <main className="absolute top-0 right-0 bottom-0 overflow-auto px-6 py-4 mb-70" style={{ left: sidebarOpen ? 256 : 64 }}>
            

            <div className="mt-8">
              {page === "history" && <HistoryPage onPlay={(t) => playTrack(t)} />}
              {page === "settings" && (
                <SettingsPage
                  path={libraryPath}
                  onChangePath={(p) => {
                    setLibraryPath(p);
                  }}
                />
              )}

              {page === "library" && (
                <>
              
                  {search.trim().length > 0 ? (
                    <div className="p-4">
                      <h2 className="text-xl font-semibold mb-3">Resultados da busca para "{search}"</h2>

                      {songResults.length === 0 && artistResults.length === 0 && albumResults.length === 0 ? (
                        <p className="text-white/60">Nenhum resultado encontrado para "{search}".</p>
                      ) : (
                        <>
                          {artistResults.length > 0 && (
                            <>
                              <h3 className="text-lg font-medium mt-3">Artistas</h3>
                              <div className="grid grid-cols-3 gap-3 my-2">
                                {artistResults.map((a: any, i: number) => (
                                  <div key={i} className="p-3 bg-white/5 rounded cursor-pointer" onClick={() => { setSelectedArtist(a); setPage("artist"); }}>
                                    <div className="font-medium text-white">{a.name}</div>
                                    <div className="text-sm text-white/60">{a.albums?.length ?? 0} álbuns</div>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}

                          {albumResults.length > 0 && (
                            <>
                              <h3 className="text-lg font-medium mt-3">Álbuns</h3>
                              <div className="grid grid-cols-4 gap-3 my-2">
                                {albumResults.map((al: any, i: number) => (
                                  <div key={i} className="p-3 bg-white/5 rounded cursor-pointer" onClick={() => { setSelectedAlbum(al); setPage("album"); }}>
                                    <div className="font-medium text-white">{al.title}</div>
                                    <div className="text-sm text-white/60">{al.artist}</div>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}

                          {songResults.length > 0 && (
                            <>
                              <h3 className="text-lg font-medium mt-3">Músicas</h3>
                              <div className="grid grid-cols-1 gap-2 my-2">
                                {songResults.slice(0, 50).map((r, i) => (
                                  <div key={i} className="flex items-center gap-3 p-2 bg-white/5 rounded hover:bg-white/6 cursor-pointer" onClick={() => playTrack(r)}>
                                    <div className="w-14 h-14 rounded overflow-hidden">
                                      <img src={r.cover ?? `https://picsum.photos/60/60?random=${i}`} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-white">{r.title}</div>
                                      <div className="text-xs text-white/70">{r.artist} • {r.album}</div>
                                    </div>
                                    <div className="text-white/60">▶</div>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}

                          { (songResults.length + artistResults.length + albumResults.length) > 0 && (
                            <div className="mt-4">
                              <button className="px-3 py-2 rounded bg-white/10 hover:bg-white/20">Carregar mais resultados</button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <>
                      <FilterBar value={filter} onChange={setFilter} />

                      {filter === "albums" && (
                        <AlbumGrid
                          albums={mappedAlbums}
                          onSelect={(id: any) => openAlbumById(id)}
                          onPlay={(track: any) => playTrack(track)}
                        />
                      )}

                      {filter === "artists" && (
                        <div className="space-y-3">
                          {library?.map((artist: any) => {
                            const artistImage = artist.image ?? (artist.albums?.[0]?.image ?? undefined);
                            return (
                              <div
                                key={artist.name}
                                className="p-2 bg-white/5 rounded hover:bg-white/6 cursor-pointer flex items-center gap-3"
                                onClick={() => {
                                  setSelectedArtist(artist);
                                  setPage("artist");
                                }}
                              >
                                <div className="w-12 h-12 rounded overflow-hidden bg-white/5">
                                  <img src={artistImage ?? `https://picsum.photos/64/64?random=${artist.name}`} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <div className="font-medium text-white">{artist.name}</div>
                                  <div className="text-sm text-white/60">{artist.albums?.length ?? 0} álbuns</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {filter === "songs" && (
                        <SongsList
                          library={library}
                          onPlay={track => {
                            playTrack(track);
                          }}
                        />
                      )}
                    </>
                  )}
                </>
              )}

              {page === "album" && selectedAlbum && (
                <AlbumPage
                  album={selectedAlbum}
                  onPlay={track => {
                    playTrack(track);
                  }}
                  onBack={() => {
                    setSelectedAlbum(null);
                    setPage("library");
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
                  onPlay={track => playTrack(track)}
                  onBack={() => {
                    setSelectedArtist(null);
                    setPage("library");
                  }}
                />
              )}

              {page === "home" && (
                <div className="p-6">
                  <h1 className="text-4xl font-bold mb-3">Bem vindo ao Music Manager</h1>
                  <p className="text-white/70 mb-6">Sua coleção, suas músicas — navegue por artistas, álbuns ou canções. Clique em qualquer item para tocar.</p>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="p-4 bg-gradient-to-br from-white/5 to-white/3 rounded-lg">
                      <h3 className="font-semibold mb-2">Destaques</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {mappedAlbums.slice(0, 6).map(a => (
                          <div key={a.id} className="text-sm text-white/80">
                            <div className="font-medium">{a.title}</div>
                            <div className="text-xs text-white/60">{a.artist}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-white/5 to-white/3 rounded-lg">
                      <h3 className="font-semibold mb-2">Artistas recentes</h3>
                      <div className="space-y-2">
                        {library?.slice(0, 6).map((ar: any) => (
                          <div key={ar.id} className="text-sm text-white/80">{ar.name}</div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-white/5 to-white/3 rounded-lg">
                      <h3 className="font-semibold mb-2">Sugestão aleatória</h3>
                      <div className="text-sm text-white/70">{mappedAlbums.length ? `${mappedAlbums[Math.floor(Math.random()*mappedAlbums.length)].title}` : "Sem álbuns"}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <Player currentTrack={currentTrack} onPrev={handlePrev} onNext={handleNext} />
    </>
  );
}