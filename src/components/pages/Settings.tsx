import React, { useState } from "react";
import { Glass } from "../layout/Glass";

type Props = {
  path: string;
  onChangePath?: (newPath: string) => void;
};

export function SettingsPage({ path, onChangePath }: Props) {
  const [localPath, setLocalPath] = useState(path ?? "");

  const save = () => {
    onChangePath?.(localPath);
    try {
      localStorage.setItem("musicLibraryPath", localPath);
    } catch {}
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