"use client";

import { useState } from "react";
import type { SedeData, Escuela, TipoSecundaria } from "@/lib/data";
import SedeFilter from "./SedeFilter";
import EscuelaCard from "./EscuelaCard";
import ProfesionalesModal from "./ProfesionalesModal";

interface DashboardProps {
  data: SedeData[];
}

export default function Dashboard({ data }: DashboardProps) {
  const [selectedTipo, setSelectedTipo] = useState<TipoSecundaria>("orientada");
  const [selectedSede, setSelectedSede] = useState<number | null>(null);
  const [modalEscuela, setModalEscuela] = useState<Escuela | null>(null);

  const tipoData = data.filter((s) => s.tipo === selectedTipo);
  const sedes = tipoData.map((s) => s.sede);
  const currentSede = tipoData.find((s) => s.sede === selectedSede);

  function handleTipoChange(tipo: TipoSecundaria) {
    setSelectedTipo(tipo);
    setSelectedSede(null);
  }

  return (
    <>
      {/* Tipo toggle */}
      <section className="mb-8">
        <h2 className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
          Tipo de secundaria
        </h2>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => handleTipoChange("orientada")}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-colors cursor-pointer ${
              selectedTipo === "orientada"
                ? "bg-[#003087] text-white shadow-md"
                : "bg-white text-[#003087] border-2 border-[#003087] hover:bg-[#003087]/10"
            }`}
          >
            Secundaria Orientada
          </button>
          <button
            onClick={() => handleTipoChange("tecnica")}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-colors cursor-pointer ${
              selectedTipo === "tecnica"
                ? "bg-[#003087] text-white shadow-md"
                : "bg-white text-[#003087] border-2 border-[#003087] hover:bg-[#003087]/10"
            }`}
          >
            Secundaria Técnica
          </button>
        </div>
      </section>

      {/* Sede filter */}
      <section className="mb-8">
        <h2 className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
          Seleccione una sede
        </h2>
        <SedeFilter
          sedes={sedes}
          selected={selectedSede}
          onSelect={setSelectedSede}
        />
      </section>

      {selectedSede === null && (
        <div className="text-center py-16 text-gray-400">
          <svg
            className="mx-auto mb-4 w-16 h-16 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p className="text-lg">
            Seleccione una sede para ver sus escuelas
          </p>
        </div>
      )}

      {currentSede && currentSede.escuelas.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <svg
            className="mx-auto mb-4 w-16 h-16 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-lg">
            No hay escuelas en la base de datos para la Sede{" "}
            {currentSede.sede}
          </p>
        </div>
      )}

      {currentSede && currentSede.escuelas.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Sede {currentSede.sede}{" "}
            <span className="text-gray-400 font-normal text-base">
              —{" "}
              {currentSede.tipo === "orientada"
                ? "Secundaria Orientada"
                : "Secundaria Técnica"}
              {" · "}
              {currentSede.escuelas.length} escuela
              {currentSede.escuelas.length !== 1 ? "s" : ""}
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentSede.escuelas.map((escuela) => (
              <EscuelaCard
                key={escuela.numero}
                escuela={escuela}
                onVerProfesionales={() => setModalEscuela(escuela)}
              />
            ))}
          </div>
        </section>
      )}

      {modalEscuela && (
        <ProfesionalesModal
          escuela={modalEscuela}
          onClose={() => setModalEscuela(null)}
        />
      )}
    </>
  );
}
