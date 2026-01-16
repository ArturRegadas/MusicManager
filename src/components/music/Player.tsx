import { Play, Pause, SkipBack, SkipForward } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import { Glass } from "../layout/Glass"

export function Player() {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(40)
  const [dragging, setDragging] = useState(false)

  const updateProgress = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const value = ((e.clientX - rect.left) / rect.width) * 100
    setProgress(Math.min(100, Math.max(0, value)))
  }

  return (
    <Glass className="fixed bottom-4 left-4 right-4 h-28 flex items-center gap-6 px-6">
      <img
        src="https://picsum.photos/100"
        className="w-20 h-20 rounded-xl object-cover"
      />

      <div className="flex-1">
        <p className="font-semibold">Song Name</p>
        <p className="text-sm text-zinc-400">Artist Name</p>

        <div
          className="relative mt-3 h-4 flex items-center cursor-pointer select-none"
          onMouseDown={e => {
            setDragging(true)
            updateProgress(e)
          }}
          onMouseMove={e => {
            if (dragging) updateProgress(e)
          }}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}
        >
          <div className="absolute w-full h-[2px] bg-white/30 rounded" />

          <div
            className="absolute h-[2px] bg-white rounded"
            style={{ width: `${progress}%` }}
          />

          <div
            className="absolute top-0 h-full w-[2px] bg-white"
            style={{ left: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <SkipBack />
        </Button>

        <Button
          size="icon"
          className="bg-white/20 hover:bg-white/30"
          onClick={() => setPlaying(!playing)}
        >
          {playing ? <Pause /> : <Play />}
        </Button>

        <Button variant="ghost" size="icon">
          <SkipForward />
        </Button>
      </div>
    </Glass>
  )
}
