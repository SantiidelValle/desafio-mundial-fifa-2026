import { ChevronLeft } from "lucide-react";
import type { Match } from "../types/Match";
import { getFlagImageUrl } from "../utils/flagImages";

interface GroupStandingsProps {
  matches: Match[];
  onBack: () => void;
}

interface TeamStanding {
  team: string;
  flag: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

function groupSortValue(group: string) {
  const letter = group.match(/[A-Z]$/)?.[0] ?? group;
  return letter.charCodeAt(0);
}

function createEmptyStanding(team: string, flag: string): TeamStanding {
  return {
    team,
    flag,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0
  };
}

function addMatchResult(team: TeamStanding, goalsFor: number, goalsAgainst: number) {
  team.played += 1;
  team.goalsFor += goalsFor;
  team.goalsAgainst += goalsAgainst;
  team.goalDifference = team.goalsFor - team.goalsAgainst;

  if (goalsFor > goalsAgainst) {
    team.won += 1;
    team.points += 3;
  } else if (goalsFor === goalsAgainst) {
    team.drawn += 1;
    team.points += 1;
  } else {
    team.lost += 1;
  }
}

function buildGroupStandings(matches: Match[]) {
  const groups = new Map<string, Map<string, TeamStanding>>();

  for (const match of matches.filter((item) => item.fase === "Fase de grupos")) {
    if (!groups.has(match.grupo)) {
      groups.set(match.grupo, new Map());
    }

    const group = groups.get(match.grupo)!;

    if (!group.has(match.equipoLocal)) {
      group.set(match.equipoLocal, createEmptyStanding(match.equipoLocal, match.banderaLocal));
    }
    if (!group.has(match.equipoVisitante)) {
      group.set(match.equipoVisitante, createEmptyStanding(match.equipoVisitante, match.banderaVisitante));
    }

    if (typeof match.resultadoLocal !== "number" || typeof match.resultadoVisitante !== "number") {
      continue;
    }

    addMatchResult(group.get(match.equipoLocal)!, match.resultadoLocal, match.resultadoVisitante);
    addMatchResult(group.get(match.equipoVisitante)!, match.resultadoVisitante, match.resultadoLocal);
  }

  return Array.from(groups.entries())
    .sort(([groupA], [groupB]) => groupSortValue(groupA) - groupSortValue(groupB))
    .map(([group, teams]) => ({
      group,
      teams: Array.from(teams.values()).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        return a.team.localeCompare(b.team);
      })
    }));
}

function formatGoalDifference(value: number) {
  if (value > 0) return `+${value}`;
  return String(value);
}

export default function GroupStandings({ matches, onBack }: GroupStandingsProps) {
  const standings = buildGroupStandings(matches);
  const totalTeams = standings.reduce((total, group) => total + group.teams.length, 0);

  return (
    <section className="relative overflow-hidden rounded-lg border border-white/15 bg-black/90 p-4 shadow-stadium sm:p-6">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(48,79,255,0.22),transparent_24rem),radial-gradient(circle_at_14%_80%,rgba(0,208,96,0.14),transparent_20rem)]" />

      <div className="relative z-10 mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white text-sm font-black uppercase text-black px-4 py-2 transition hover:bg-mundialGold"
          >
            <ChevronLeft size={18} />
            Volver
          </button>
          <p className="text-sm font-black uppercase text-mundialGold">Clasificación Mundial 2026</p>
          <h2 className="mt-1 text-3xl font-black uppercase leading-none text-white sm:text-5xl">
            Tablas de grupos
          </h2>
        </div>

        <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-left sm:text-right">
          <p className="text-xs font-black uppercase text-white/60">Selecciones cargadas</p>
          <p className="text-3xl font-black text-white">{totalTeams}</p>
        </div>
      </div>

      <div className="relative z-10 grid gap-x-5 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        {standings.map(({ group, teams }) => (
          <article key={group} className="rounded-[1rem] bg-black/20 p-1">
            <div className="mb-1 grid grid-cols-[minmax(0,1fr)_7.7rem] items-end gap-2 px-1 text-white sm:grid-cols-[minmax(0,1fr)_8.5rem]">
              <h3 className="text-base font-black uppercase tracking-normal">{group}</h3>
              <div className="grid grid-cols-4 gap-1 text-center text-[9px] font-black uppercase text-white/70">
                <span>Pts</span>
                <span>GF</span>
                <span>GC</span>
                <span>Dif</span>
              </div>
            </div>

            <div className="space-y-1.5">
              {teams.map((team) => {
                const flagImage = getFlagImageUrl(team.team);

                return (
                  <div
                    key={team.team}
                    className="grid h-10 grid-cols-[3.85rem_minmax(0,1fr)_7.5rem] items-stretch overflow-hidden rounded-l-[0.28rem] rounded-r-[0.95rem] bg-white text-black shadow-[0_1px_0_rgba(255,255,255,0.55),inset_0_0_0_1px_rgba(0,0,0,0.08)] sm:grid-cols-[4rem_minmax(0,1fr)_8.2rem]"
                  >
                    <div className="h-full overflow-hidden bg-black/5">
                      <div className="flag-wedge h-full w-full overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]">
                        {flagImage ? (
                          <img
                            src={flagImage}
                            alt={`Bandera de ${team.team}`}
                            className="h-full w-full object-cover"
                            draggable={false}
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-2xl">{team.flag}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex min-w-0 items-center py-0.5 pl-2 pr-1">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-black uppercase leading-tight sm:text-sm">{team.team}</p>
                        <p className="truncate text-[8px] font-black uppercase text-black/45 sm:text-[9px]">
                          PJ {team.played} · PG {team.won} · PE {team.drawn} · PP {team.lost}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-1 pr-2 text-center text-xs font-black sm:text-sm">
                      <span className="inline-flex h-7 items-center justify-center rounded-[0.48rem] bg-black px-1 text-white">{team.points}</span>
                      <span className="inline-flex h-7 items-center justify-center rounded-[0.48rem] bg-black/8 px-1">{team.goalsFor}</span>
                      <span className="inline-flex h-7 items-center justify-center rounded-[0.48rem] bg-black/8 px-1">{team.goalsAgainst}</span>
                      <span className="inline-flex h-7 items-center justify-center rounded-[0.48rem] bg-black/8 px-1">{formatGoalDifference(team.goalDifference)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
