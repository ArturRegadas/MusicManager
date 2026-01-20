import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Glass } from "../layout/Glass";
import { ImageWithFallback } from "../ui/ImageWithFallback";

type Track = {
  title?: string;
  artist?: string;
  album?: string;
  cover?: string;
  path?: string;
};

type Props = {
  currentTrack?: Track | null;
};

function normalizeLocalPath(path?: string) {
  if (!path) return path;
  try {
    if (/^[a-zA-Z]:\\/.test(path) || path.startsWith("/")) {
      const fixed = path.replace(/\\/g, "/");
      if (/^[a-zA-Z]:\//.test(fixed)) {
        return "file:///" + fixed;
      }
      return "file://" + fixed;
    }
  } catch {
    // ignore
  }
  return path;
}

export function Player({ currentTrack }: Props) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener("timeupdate", () => {
        if (audioRef.current && audioRef.current.duration) {
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
      });
      audioRef.current.addEventListener("ended", () => setPlaying(false));
    }
  }, []);

  useEffect(() => {
    if (!currentTrack) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      setPlaying(false);
      return;
    }

    const src = normalizeLocalPath(currentTrack.path) ?? "";
    if (audioRef.current) {
      audioRef.current.src = src || "";
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  return (
    <Glass className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[min(1100px,95%)] h-25 flex items-center gap-6 px-6 z-50 shadow-xl ml-7">
      <div className="w-21 h-21 rounded-lg overflow-hidden">
        <ImageWithFallback src={currentTrack?.cover} alt={currentTrack?.title} className="w-21 h-21 object-cover" />
      </div>

      <div className="flex-1">
        <p className="font-semibold text-base">{currentTrack?.title ?? "Nenhuma música"}</p>
        <p className="text-sm text-white/70">{currentTrack?.artist ?? ""}</p>

        <div className="relative mt-4 h-3 flex items-center select-none">
          <div className="absolute w-full h-[3px] bg-white/20 rounded" />
          <div className="absolute h-[3px] bg-white rounded" style={{ width: `${progress}%` }} />
          <div className="absolute top-0 h-full w-[3px] bg-white" style={{ left: `${progress}%` }} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="scale-125">
          <SkipBack size={28} />
        </Button>

        <Button size="icon" className="bg-white/20 hover:bg-white/30 text-white w-14 h-14" onClick={togglePlay}>
          {playing ? <Pause size={30} /> : <Play size={30} />}
        </Button>

        <Button variant="ghost" size="icon" className="scale-125">
          <SkipForward size={28} />
        </Button>
      </div>
    </Glass>
  );
}