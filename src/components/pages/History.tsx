import React, { useEffect, useState } from "react";
import { Glass } from "../layout/Glass";
import { invoke } from "@tauri-apps/api/core";

type Entry = {
  id: number;
  title: string;
  artist: string;
  album?: string | null;
  cover?: string | null;
  path: string;
  played_at: string;
};

type Props = {
  onPlay?: (track: { title?: string; artist?: string; album?: string; cover?: string; path?: string }) => void;
};

export function HistoryPage({ onPlay }: Props) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await invoke<Entry[]>("get_play_history");
      setEntries(res ?? []);
    } catch (err) {
      console.error("Erro ao buscar histórico:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Histórico</h1>
      <Glass className="p-4">
        <p className="text-sm text-white/70">Aqui será mostrado o histórico de reprodução.</p>
        <div className="mt-4 text-sm text-white/60">
          {loading ? (
            <div>Carregando...</div>
          ) : entries.length === 0 ? (
            <div>Nenhuma reprodução registrada.</div>
          ) : (
            <div className="space-y-2">
              {entries.map(e => (
                <div
                  key={e.id}
                  className="flex items-center gap-3 p-2 bg-white/5 rounded hover:bg-white/6 cursor-pointer"
                  onClick={() => onPlay?.({
                    title: e.title,
                    artist: e.artist,
                    album: e.album ?? undefined,
                    cover: e.cover ?? undefined,
                    path: e.path
                  })}
                >
                  <div className="w-12 h-12 rounded overflow-hidden bg-white/5">
                    <img src={e.cover ?? `https://picsum.photos/48/48?random=${e.id}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{e.title}</div>
                    <div className="text-xs text-white/70">{e.artist} • {e.album ?? "—"}</div>
                  </div>
                  <div className="text-xs text-white/60">{new Date(e.played_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-4">
          <button className="px-3 py-2 rounded bg-white/10 hover:bg-white/20" onClick={load}>Atualizar</button>
        </div>
      </Glass>
    </div>
  );
}