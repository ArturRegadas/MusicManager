import { useEffect, useState } from "react"
import { Artist } from "../types/music"
import { loadMusicLibrary } from "../services/musicServices"

export function useMusicLibrary(path: string) {
  const [library, setLibrary] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMusicLibrary(path).then(data => {
      setLibrary(data)
      setLoading(false)
    })
  }, [path])

  return { library, loading }
}
