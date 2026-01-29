import { invoke } from "@tauri-apps/api/core";

export type PlayEntry = {
  id: number;
  title: string;
  artist: string;
  album?: string | null;
  cover?: string | null;
  path: string;
  played_at: string;
};

export function addPlayHistory(entry: { title: string; artist: string; album?: string | null; cover?: string | null; path: string; }) {
  return invoke("add_play_history", entry);
}

export function getPlayHistory() {
  return invoke<PlayEntry[]>("get_play_history");
}