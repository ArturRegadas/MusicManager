import { Button } from "../ui/button"
import { Window } from "@tauri-apps/api/window"

export function TopBar() {
  const mainWindow = new Window("main")

  return (
    <div
      className="fixed top-0 left-0 right-0 h-10 flex items-center justify-end gap-2 z-50 select-none bg-transparent mb-0"
    >
      <div className="flex-1 h-full" onMouseDown={() => mainWindow.startDragging()}></div>

      <Button size="icon" variant="ghost" onClick={() => mainWindow.minimize()}>
        <span className="text-xl">—</span>
      </Button>
      <Button size="icon" variant="ghost" onClick={() => mainWindow.toggleMaximize()}>
        <span className="text-xl">▢</span>
      </Button>
      <Button size="icon" variant="ghost" onClick={() => mainWindow.close()}>
        <span className="text-xl">✕</span>
      </Button>
    </div>
  )
}