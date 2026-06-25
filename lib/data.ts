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

export interface SedeData {
  sede: number;
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
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

  const sedesMap = new Map<number, Map<string, Escuela>>();

  let currentSede: number | null = null;
  let currentEscNumero: string | null = null;
  let currentEscNombre: string | null = null;

  for (const row of rows) {
    const rawSede = row["Sede N°:"];
    if (rawSede !== undefined && rawSede !== null) {
      const newSede = Number(rawSede);
      if (newSede !== currentSede) {
        currentEscNumero = null;
        currentEscNombre = null;
      }
      currentSede = newSede;
    }
    if (currentSede === null || isNaN(currentSede)) continue;

    const rawEscNum = row["Esc. N°"];
    const rawEscNombre = row["Nombre"];
    if (rawEscNum !== undefined && rawEscNum !== null) {
      currentEscNumero = String(rawEscNum).trim();
      currentEscNombre = rawEscNombre ? String(rawEscNombre).trim() : "";
    }
    if (!sedesMap.has(currentSede)) {
      sedesMap.set(currentSede, new Map());
    }
    if (!currentEscNumero) continue;
    const escuelasMap = sedesMap.get(currentSede)!;
    const escKey = currentEscNumero;

    if (!escuelasMap.has(escKey)) {
      escuelasMap.set(escKey, {
        numero: currentEscNumero,
        nombre: currentEscNombre || "",
        profesionales: [],
      });
    }

    const cargo = row["Cargos SOE"];
    const nombre = row["Apellido y Nombre"];
    if (cargo && nombre) {
      escuelasMap.get(escKey)!.profesionales.push({
        nombre: String(nombre).trim(),
        profesion: String(cargo).trim(),
        telefono: normalizarTelefono(row["Teléfono de contacto"]),
      });
    }
  }

  const result: SedeData[] = [];
  const sortedSedes = [...sedesMap.keys()].sort((a, b) => a - b);

  for (const sede of sortedSedes) {
    const escuelasMap = sedesMap.get(sede)!;
    const escuelas = [...escuelasMap.values()]
      .filter((e) => e.profesionales.length > 0)
      .sort((a, b) => a.numero.localeCompare(b.numero));
    result.push({ sede, escuelas });
  }

  return result;
}
