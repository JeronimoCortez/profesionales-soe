"use client";

import type { Escuela } from "@/lib/data";

interface EscuelaCardProps {
  escuela: Escuela;
  onVerProfesionales: () => void;
}

export default function EscuelaCard({
  escuela,
  onVerProfesionales,
}: EscuelaCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
      <div>
        <p className="text-sm text-[#003087]/60 font-medium mb-1">
          Esc. {escuela.numero}
        </p>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {escuela.nombre || "Sin nombre"}
        </h3>
      </div>
      <button
        onClick={onVerProfesionales}
        className="w-full bg-[#003087] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[#002060] transition-colors cursor-pointer"
      >
        Ver profesionales SOE
      </button>
    </div>
  );
}
