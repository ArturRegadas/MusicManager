import { Button } from "../ui/button";
import { Search, ChevronLeft, ChevronRight, Settings, Home, Clock, Music } from "lucide-react";

type SidebarProps = {
  open: boolean;
  onToggle: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  onNavigate?: (page: string) => void;
};

export function Sidebar({ open, onToggle, search, onSearchChange, onSearchSubmit, onNavigate }: SidebarProps) {
  const items = [
    { icon: Home, label: "Home", id: "home" },
    { icon: Music, label: "Library", id: "library" },
    { icon: Clock, label: "History", id: "history" },
    { icon: Settings, label: "Settings", id: "settings" },
  ];

  return (
    <aside
      className={`absolute left-0 top-0 bottom-0 z-30 flex flex-col transition-all duration-300 ${
        open ? "w-64 p-6" : "w-16 p-2"
      } bg-black/50 backdrop-blur-2xl border-r border-white/10 shadow-lg`}
    >
      <div className="flex items-center justify-between mb-6 mt-6">
        {open && <h2 className="text-xl font-bold select-none">Music Manager</h2>}
        <Button size="icon" variant="ghost" onClick={onToggle}>
          {open ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </Button>
      </div>

      {open && (
        <div className="flex items-center gap-2 bg-white/10 p-2 rounded mb-6">
          <Search className="w-5 h-5 text-white" />
          <input
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                onSearchSubmit?.(search);
                onNavigate?.("library");
              }
            }}
            placeholder="Search albums..."
            className="bg-transparent flex-1 outline-none text-sm text-white"
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        {items.map(item => (
          <Button
            key={item.label}
            variant="ghost"
            size="sm"
            className={`justify-start ${!open && "justify-center"}`}
            onClick={() => onNavigate?.(item.id)}
          >
            <item.icon className="w-5 h-5" />
            {open && <span className="ml-3">{item.label}</span>}
          </Button>
        ))}
      </div>
    </aside>
  );
}