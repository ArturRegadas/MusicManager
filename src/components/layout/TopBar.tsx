import { Button } from "../ui/button"
import { Window } from "@tauri-apps/api/window"

export function TopBar() {
  const mainWindow = new Window("main")

  return (
    <div
      className="h-10 flex items-center justify-end gap-2 mb-4 select-none mt-0"
    >
      <div className="flex-1 h-full"
      onMouseDown={() => mainWindow.startDragging()}></div>
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
