import { invoke } from "@tauri-apps/api/core"
import { Artist } from "../types/music"

export function loadMusicLibrary(path: string) {
  return invoke<Artist[]>("load_music_library", { path })
}
