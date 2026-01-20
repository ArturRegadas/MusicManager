import React from "react";
import { Glass } from "../layout/Glass";

export function SettingsPage() {
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
            <button className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">Alterar</button>
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
