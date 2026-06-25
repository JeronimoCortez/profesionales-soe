"use client";

import { useState, useEffect } from "react";
import type { Escuela } from "@/lib/data";

interface ProfesionalesModalProps {
  escuela: Escuela;
  onClose: () => void;
}

export default function ProfesionalesModal({
  escuela,
  onClose,
}: ProfesionalesModalProps) {
  const [filtro, setFiltro] = useState<string | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const profesiones = [
    ...new Set(escuela.profesionales.map((p) => p.profesion)),
  ].sort();

  const filtrados = filtro
    ? escuela.profesionales.filter((p) => p.profesion === filtro)
    : escuela.profesionales;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <p className="text-sm text-[#003087]/60 font-medium">
              Esc. {escuela.numero}
            </p>
            <h2 className="text-xl font-bold text-gray-900">
              {escuela.nombre || "Sin nombre"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none p-1 cursor-pointer"
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>

        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltro(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                filtro === null
                  ? "bg-[#003087] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos
            </button>
            {profesiones.map((prof) => (
              <button
                key={prof}
                onClick={() => setFiltro(prof)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  filtro === prof
                    ? "bg-[#003087] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {prof}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-auto flex-1 p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-sm font-semibold text-[#003087]">
                  Profesión
                </th>
                <th className="pb-3 text-sm font-semibold text-[#003087]">
                  Nombre
                </th>
                <th className="pb-3 text-sm font-semibold text-[#003087]">
                  Teléfono
                </th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((prof, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-50 last:border-0"
                >
                  <td className="py-3 pr-4 text-sm text-gray-600">
                    {prof.profesion}
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-900 font-medium">
                    {prof.nombre}
                  </td>
                  <td className="py-3 text-sm">
                    {prof.telefono ? (
                      <a
                        href={`tel:${prof.telefono}`}
                        className="text-[#003087] hover:underline"
                      >
                        {prof.telefono}
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-8 text-center text-gray-400 text-sm"
                  >
                    No hay profesionales con este filtro
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
