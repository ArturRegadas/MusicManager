import { Play, Pause } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Glass } from "../layout/Glass";
import { ImageWithFallback } from "../ui/ImageWithFallback";
import { convertFileSrc } from "@tauri-apps/api/core";

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

export function Player({ currentTrack }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("play", () => setPlaying(true));
    audio.addEventListener("pause", () => setPlaying(false));
    audio.addEventListener("ended", () => setPlaying(false));

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.pause();
      audio.src = "";
    };
  }, []);

  
  useEffect(() => {
    if (!audioRef.current || !currentTrack?.path) return;

    try {
      
      const assetUrl = convertFileSrc(currentTrack.path);
      
      const audio = audioRef.current;
      audio.src = assetUrl;
      audio.load();
      setProgress(0);


      audio.play().catch((err) => console.warn("Autoplay bloqueado:", err));

    } catch (err) {
      console.error("Erro ao carregar a música via Asset Protocol:", err);
    }
  }, [currentTrack]);

  const togglePlay = async () => {
    if (!audioRef.current || !currentTrack) return;

    try {
      if (audioRef.current.paused) {
        await audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    } catch (err) {
      console.error("Erro ao controlar reprodução:", err);
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current?.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audioRef.current.currentTime = percentage * audioRef.current.duration;
  };

  return (
    <Glass className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1100px] z-50 shadow-xl p-3 sm:px-6 sm:py-4 flex items-center gap-4">
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <ImageWithFallback src={currentTrack?.cover} alt={currentTrack?.title} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">
          {currentTrack?.title ?? "Nenhuma música selecionada"}
        </p>
        <p className="text-sm text-white/70 truncate">
          {currentTrack?.artist ?? "Artista desconhecido"}
        </p>

        <div 
          className="relative mt-3 h-4 flex items-center cursor-pointer" 
          onClick={handleSeek}
        >
          <div className="absolute w-full h-[3px] bg-white/20 rounded" />
          <div
            className="absolute h-[3px] bg-white rounded transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Button 
        onClick={togglePlay} 
        size="icon" 
        className="w-12 h-12 rounded-full flex-shrink-0"
        disabled={!currentTrack}
      >
        {playing ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
      </Button>
    </Glass>
  );
}