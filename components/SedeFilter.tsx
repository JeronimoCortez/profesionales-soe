"use client";

interface SedeFilterProps {
  sedes: number[];
  selected: number | null;
  onSelect: (sede: number) => void;
}

export default function SedeFilter({
  sedes,
  selected,
  onSelect,
}: SedeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {sedes.map((sede) => (
        <button
          key={sede}
          onClick={() => onSelect(sede)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            selected === sede
              ? "bg-[#003087] text-white shadow-md"
              : "bg-white text-[#003087] border border-[#003087] hover:bg-[#003087]/10"
          }`}
        >
          Sede {sede}
        </button>
      ))}
    </div>
  );
}
