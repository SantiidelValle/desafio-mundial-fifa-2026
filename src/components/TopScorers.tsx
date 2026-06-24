import { ChevronLeft } from "lucide-react";
import type { Match } from "../types/Match";
import { getFlagImageUrl } from "../utils/flagImages";

interface TopScorersProps {
  matches: Match[];
  onBack: () => void;
}

interface ScorerRow {
  player: string;
  team: string;
  flag: string;
  goals: number;
}

function buildScorers(matches: Match[]) {
  const teamFlags = new Map<string, string>();
  const scorers = new Map<string, ScorerRow>();

  for (const match of matches) {
    teamFlags.set(match.equipoLocal, match.banderaLocal);
    teamFlags.set(match.equipoVisitante, match.banderaVisitante);

    for (const goal of match.goles) {
      if (goal.ownGoal) continue;

      const key = `${goal.equipo}|${goal.jugador}`;
      const scorer = scorers.get(key) ?? {
        player: goal.jugador,
        team: goal.equipo,
        flag: teamFlags.get(goal.equipo) ?? "",
        goals: 0
      };

      scorer.goals += 1;
      scorers.set(key, scorer);
    }
  }

  return Array.from(scorers.values()).sort((a, b) => {
    if (b.goals !== a.goals) return b.goals - a.goals;
    if (a.team !== b.team) return a.team.localeCompare(b.team);
    return a.player.localeCompare(b.player);
  });
}

export default function TopScorers({ matches, onBack }: TopScorersProps) {
  const scorers = buildScorers(matches);
  const leaderGoals = scorers[0]?.goals ?? 0;

  return (
    <section className="relative overflow-hidden rounded-lg border border-white/15 bg-black/90 p-4 shadow-stadium sm:p-6">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(255,43,8,0.16),transparent_24rem),radial-gradient(circle_at_90%_30%,rgba(0,208,96,0.13),transparent_20rem),radial-gradient(circle_at_18%_75%,rgba(48,79,255,0.2),transparent_22rem)]" />

      <div className="relative z-10 mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white px-4 py-2 text-sm font-black uppercase text-black transition hover:bg-mundialGold"
          >
            <ChevronLeft size={18} />
            Volver
          </button>
          <p className="text-sm font-black uppercase text-mundialGold">Copa Mundial 2026</p>
          <h2 className="mt-1 text-3xl font-black uppercase leading-none text-white sm:text-5xl">
            Tabla de goleadores
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-left sm:text-right">
            <p className="text-xs font-black uppercase text-white/60">Goleadores</p>
            <p className="text-3xl font-black text-white">{scorers.length}</p>
          </div>
          <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-left sm:text-right">
            <p className="text-xs font-black uppercase text-white/60">Líder</p>
            <p className="text-3xl font-black text-white">{leaderGoals}</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl rounded-[1rem] bg-black/20 p-1">
        <div className="mb-1 grid grid-cols-[2.25rem_minmax(0,1fr)_5.5rem] items-end gap-2 px-1 text-[10px] font-black uppercase text-white/70 sm:grid-cols-[2.5rem_minmax(0,1fr)_7rem]">
          <span className="text-center">#</span>
          <span>Jugador</span>
          <span className="text-center">Goles</span>
        </div>

        <div className="space-y-1.5">
          {scorers.map((scorer, index) => {
            const flagImage = getFlagImageUrl(scorer.team);

            return (
              <div
                key={`${scorer.team}-${scorer.player}`}
                className="grid h-12 grid-cols-[2.25rem_4.2rem_minmax(0,1fr)_5.5rem] items-stretch overflow-hidden rounded-l-[0.28rem] rounded-r-[0.95rem] bg-white text-black shadow-[0_1px_0_rgba(255,255,255,0.55),inset_0_0_0_1px_rgba(0,0,0,0.08)] sm:grid-cols-[2.5rem_4.5rem_minmax(0,1fr)_7rem]"
              >
                <div className="flex h-full items-center justify-center bg-black text-sm font-black text-white">
                  {index + 1}
                </div>

                <div className="h-full overflow-hidden bg-black/5">
                  <div className="flag-wedge h-full w-full overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]">
                    {flagImage ? (
                      <img
                        src={flagImage}
                        alt={`Bandera de ${scorer.team}`}
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-2xl">{scorer.flag}</span>
                    )}
                  </div>
                </div>

                <div className="flex min-w-0 items-center py-1 pl-2 pr-1">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-black uppercase leading-tight sm:text-sm">{scorer.player}</p>
                    <p className="truncate text-[10px] font-black uppercase text-black/45">{scorer.team}</p>
                  </div>
                </div>

                <div className="flex justify-center pr-2">
                  <span className="inline-flex h-8 min-w-10 items-center justify-center rounded-[0.48rem] bg-black px-2 text-center text-base font-black text-white">{scorer.goals}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
