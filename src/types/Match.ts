import type { Goal } from "./Goal";

export interface Match {
  id: number;
  fecha: string;
  hora: string;
  fase: string;
  grupo: string;
  equipoLocal: string;
  equipoVisitante: string;
  banderaLocal: string;
  banderaVisitante: string;
  resultadoLocal: number | null;
  resultadoVisitante: number | null;
  goles: Goal[];
  estadio?: string;
  fuente?: string;
}
