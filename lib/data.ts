import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

export interface Profesional {
  nombre: string;
  profesion: string;
  telefono: string;
}

export interface Escuela {
  numero: string;
  nombre: string;
  profesionales: Profesional[];
}

export type TipoSecundaria = "orientada" | "tecnica";

export interface SedeData {
  sede: number;
  tipo: TipoSecundaria;
  escuelas: Escuela[];
}

function normalizarTelefono(tel: unknown): string {
  if (tel === undefined || tel === null) return "";
  return String(tel).trim();
}

export function getData(): SedeData[] {
  const filePath = path.join(process.cwd(), "public", "DATOS SOE.xlsx");
  const buffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  // range:2 skips the 2 empty rows at top so row 3 ("Sede N°:", "Esc. N°"...) becomes the header
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    range: 2,
    defval: null,
  });

  const sedesMap = new Map<TipoSecundaria, Map<number, Map<string, Escuela>>>(
    [
      ["orientada", new Map()],
      ["tecnica", new Map()],
    ]
  );

  let currentTipo: TipoSecundaria = "orientada";
  let currentSede: number | null = null;
  let currentEscNumero: string | null = null;
  let currentEscNombre: string | null = null;

  for (const row of rows) {
    const rawSede = row["Sede N°:"];

    // String in sede column = section marker (e.g. "SECUNDARIA TÉCNICA")
    if (typeof rawSede === "string") {
      const upper = rawSede.toUpperCase();
      if (upper.includes("TÉCNICA") || upper.includes("TECNICA")) {
        currentTipo = "tecnica";
      }
      currentSede = null;
      currentEscNumero = null;
      currentEscNombre = null;
      continue;
    }

    if (rawSede !== undefined && rawSede !== null) {
      const newSede = Number(rawSede);
      if (!isNaN(newSede) && newSede !== currentSede) {
        currentSede = newSede;
        currentEscNumero = null;
        currentEscNombre = null;
      }
    }

    if (currentSede === null) continue;

    const tipoMap = sedesMap.get(currentTipo)!;
    if (!tipoMap.has(currentSede)) {
      tipoMap.set(currentSede, new Map());
    }

    const rawEscNum = row["Esc. N°"];
    const rawEscNombre = row["Nombre"];
    if (rawEscNum !== undefined && rawEscNum !== null) {
      currentEscNumero = String(rawEscNum).trim();
      currentEscNombre = rawEscNombre ? String(rawEscNombre).trim() : "";
    }

    if (!currentEscNumero) continue;

    const escuelasMap = tipoMap.get(currentSede)!;
    if (!escuelasMap.has(currentEscNumero)) {
      escuelasMap.set(currentEscNumero, {
        numero: currentEscNumero,
        nombre: currentEscNombre || "",
        profesionales: [],
      });
    }

    const cargo = row["Cargos SOE"];
    const nombre = row["Apellido y Nombre"];
    if (cargo && nombre) {
      escuelasMap.get(currentEscNumero)!.profesionales.push({
        nombre: String(nombre).trim(),
        profesion: String(cargo).trim(),
        telefono: normalizarTelefono(row["Teléfono de contacto"]),
      });
    }
  }

  const result: SedeData[] = [];
  for (const tipo of ["orientada", "tecnica"] as const) {
    const tipoMap = sedesMap.get(tipo)!;
    const sortedSedes = [...tipoMap.keys()].sort((a, b) => a - b);
    for (const sede of sortedSedes) {
      const escuelasMap = tipoMap.get(sede)!;
      const escuelas = [...escuelasMap.values()]
        .filter((e) => e.profesionales.length > 0)
        .sort((a, b) => a.numero.localeCompare(b.numero));
      if (escuelas.length > 0) {
        result.push({ sede, tipo, escuelas });
      }
    }
  }

  return result;
}
