import type { Match } from "../types/Match";

export function isPlayableMatch(match: Match): boolean {
  return (
    typeof match.resultadoLocal === "number" &&
    typeof match.resultadoVisitante === "number"
  );
}

export function sortMatches(matches: Match[]): Match[] {
  return [...matches]
    .filter(isPlayableMatch)
    .sort((a, b) => `${a.fecha}T${a.hora}`.localeCompare(`${b.fecha}T${b.hora}`));
}
