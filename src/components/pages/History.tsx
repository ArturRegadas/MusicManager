import React from "react";
import { Glass } from "../layout/Glass";

export function HistoryPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Histórico</h1>
      <Glass className="p-4">
        <p className="text-sm text-white/70">Aqui será mostrado o histórico de reprodução.</p>
        <div className="mt-4 text-sm text-white/60">
        </div>
      </Glass>
    </div>
  );
}