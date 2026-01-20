import React from "react";

type Filter = "artists" | "albums" | "songs";

type Props = {
  value: Filter;
  onChange: (f: Filter) => void;
};

export function FilterBar({ value, onChange }: Props) {
  const buttons: { id: Filter; label: string }[] = [
    { id: "artists", label: "Artistas" },
    { id: "albums", label: "Álbuns" },
    { id: "songs", label: "Músicas" },
  ];

  return (
    <div className="flex gap-2 mb-4">
      {buttons.map(b => (
        <button
          key={b.id}
          onClick={() => onChange(b.id)}
          className={`px-3 py-1 rounded ${
            value === b.id ? "bg-white/20 text-white" : "bg-white/5 text-white/70"
          }`}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}