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
    <Glass className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[min(1100px,95%)] h-25 flex items-center gap-6 px-6 z-50 shadow-xl ml-7">
      <img
        src="https://picsum.photos/120"
        className="w-21 h-21 rounded-lg object-cover"
        alt="cover"
      />

      <div className="flex-1">
        <p className="font-semibold text-base">Song Name</p>
        <p className="text-sm text-white/70">Artist Name</p>

        <div
          className="relative mt-4 h-3 flex items-center cursor-pointer select-none"
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
          <div className="absolute w-full h-[3px] bg-white/20 rounded" />

          <div
            className="absolute h-[3px] bg-white rounded"
            style={{ width: `${progress}%` }}
          />

          <div
            className="absolute top-0 h-full w-[3px] bg-white"
            style={{ left: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="scale-125">
          <SkipBack size={28} />
        </Button>

        <Button
          size="icon"
          className="bg-white/20 hover:bg-white/30 text-white w-14 h-14"
          onClick={() => setPlaying(!playing)}
        >
          {playing ? <Pause size={30} /> : <Play size={30} />}
        </Button>

        <Button variant="ghost" size="icon" className="scale-125">
          <SkipForward size={28} />
        </Button>
      </div>
    </Glass>
  )
}
