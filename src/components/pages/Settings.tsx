import React, { useState } from "react";
import { Glass } from "../layout/Glass";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { loadMusicLibrary } from "../../services/musicServices";

type Props = {
  path: string;
  onChangePath?: (newPath: string) => void;
};

export function SettingsPage({ path, onChangePath }: Props) {
  const [localPath, setLocalPath] = useState(path ?? "");
  const [busy, setBusy] = useState(false);

  const save = () => {
    onChangePath?.(localPath);
    try {
      localStorage.setItem("musicLibraryPath", localPath);
    } catch {}
  };

  const pickFolder = async () => {
    try {
      const picked = (await open({ directory: true, multiple: false })) as string | null;
      if (picked) {
        setLocalPath(picked);
        onChangePath?.(picked);
        try { localStorage.setItem("musicLibraryPath", picked); } catch {}
      }
    } catch (err) {
      console.error("Erro ao abrir diálogo de pasta:", err);
    }
  };

  const clearHistory = async () => {
    setBusy(true);
    try {
      await invoke("clear_play_history");
    } catch (err) {
      console.error("Erro ao limpar histórico:", err);
    }
    setBusy(false);
  };

  const rescan = async () => {
    setBusy(true);
    try {
      await loadMusicLibrary(localPath);
    } catch (err) {
      console.error("Erro ao reescanear biblioteca:", err);
    }
    setBusy(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Configurações</h1>
      <Glass className="p-4">
        <p className="text-sm text-white/70">Opções da aplicação</p>

        <div className="mt-4 space-y-3 text-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Caminho da biblioteca</p>
              <p className="text-sm text-white/60">Defina a pasta onde suas músicas estão.</p>
            </div>
            <div className="flex items-center gap-2">
              <input value={localPath} onChange={e => setLocalPath(e.target.value)} className="px-3 py-1 rounded bg-white/5 text-white" />
              <button className="px-3 py-1 rounded bg-white/10 hover:bg-white/20" onClick={save}>Salvar</button>
              <button className="px-3 py-1 rounded bg-white/10 hover:bg-white/20" onClick={pickFolder}>Selecionar pasta</button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Histórico</p>
              <p className="text-sm text-white/60">Apague todo o histórico de reprodução.</p>
            </div>
            <div>
              <button className="px-3 py-1 rounded bg-rose-600/80 hover:bg-rose-600" onClick={clearHistory} disabled={busy}>Apagar histórico</button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Biblioteca</p>
              <p className="text-sm text-white/60">Reescaneia a pasta da biblioteca agora.</p>
            </div>
            <div>
              <button className="px-3 py-1 rounded bg-white/10 hover:bg-white/20" onClick={rescan} disabled={busy}>Reescanear biblioteca</button>
            </div>
          </div>

          <div>
            <p className="font-medium">Aparência</p>
            <p className="text-sm text-white/60">Tema, tamanho do player, etc.</p>
          </div>
        </div>
      </Glass>
    </div>
  );
}