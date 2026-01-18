export type Track = {
  id?: number
  album_id?: number
  number: number
  title: string
  duration?: number
}

export type Album = {
  id?: number
  artist_id?: number
  title: string
  year?: number
  image?: string
  tracks: Track[]
}

export type Artist = {
  id?: number
  name: string
  image?: string
  albums: Album[]
}