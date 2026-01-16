export type Track = {
  number: number
  title: string
  duration?:number
}

export type Album = {
  title: string
  year?: number
  image?: string
  tracks: Track[]
}

export type Artist = {
  name: string
  albums: Album[]
}
