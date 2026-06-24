import { motion } from "framer-motion";
import { Flag, ListChecks, Play, RefreshCcw, Save, Users } from "lucide-react";
import type { GameMode } from "../utils/localStorage";

interface ModeSelectorProps {
  mode: GameMode;
  selectedTeam: string;
  teams: string[];
  hasSavedGame: boolean;
  availableCount: number;
  onModeChange: (mode: GameMode) => void;
  onTeamChange: (team: string) => void;
  onStart: () => void;
  onContinue: () => void;
  onResetProgress: () => void;
}

const modeCards = [
  {
    id: "all" as GameMode,
    title: "Todos los partidos",
    description: "Recorrido cronológico completo con todos los resultados cargados.",
    Icon: ListChecks
  },
  {
    id: "groups" as GameMode,
    title: "Solo fase de grupos",
    description: "Ideal para jugar la etapa actual del torneo sin filtros extra.",
    Icon: Users
  },
  {
    id: "team" as GameMode,
    title: "Por selección",
    description: "Elegí una selección y jugá únicamente sus partidos disponibles.",
    Icon: Flag
  }
];

export default function ModeSelector({
  mode,
  selectedTeam,
  teams,
  hasSavedGame,
  availableCount,
  onModeChange,
  onTeamChange,
  onStart,
  onContinue,
  onResetProgress
}: ModeSelectorProps) {
  return (
    <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="glass-panel rounded-lg p-5 shadow-stadium sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-black uppercase text-mundialGold">Modo de partida</p>
          <h2 className="mt-1 text-2xl font-black uppercase text-white sm:text-3xl">Elegí tu camino a la Copa</h2>
        </div>
        <div className="grid gap-3">
          {modeCards.map(({ id, title, description, Icon }) => {
            const selected = mode === id;
            return (
              <motion.button
                key={id}
                type="button"
                whileHover={{ x: 4 }}
                onClick={() => onModeChange(id)}
                className={`rounded-lg border p-4 text-left transition ${
                  selected ? "border-mundialGold bg-white text-midnight" : "border-white/20 bg-white/10 text-white hover:bg-white/16"
                }`}
              >
                <div className="flex gap-4">
                  <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${selected ? "bg-midnight text-mundialGold" : "bg-white/14"}`}>
                    <Icon size={22} />
                  </span>
                  <span>
                    <span className="block text-lg font-black uppercase">{title}</span>
                    <span className={`mt-1 block text-sm ${selected ? "text-midnight/70" : "text-white/70"}`}>{description}</span>
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {mode === "team" && (
          <div className="mt-5 rounded-lg border border-white/16 bg-midnight/36 p-4">
            <label className="mb-2 block text-xs font-black uppercase text-white/72" htmlFor="team-filter">
              Selección
            </label>
            <select
              id="team-filter"
              value={selectedTeam}
              onChange={(event) => onTeamChange(event.target.value)}
              className="w-full rounded-lg border border-white/20 bg-white px-4 py-3 font-bold text-midnight outline-none"
            >
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="glass-panel flex flex-col justify-between rounded-lg p-5 shadow-stadium sm:p-6">
        <div>
          <p className="text-xs font-black uppercase text-mundialGold">Partidos disponibles</p>
          <div className="mt-2 text-7xl font-black text-white">{availableCount}</div>
          <p className="mt-2 text-sm text-white/72">La lista se ordena automáticamente por fecha y hora, desde el partido inaugural hasta el último marcador cargado.</p>
        </div>

        <div className="mt-6 grid gap-3">
          <button
            type="button"
            onClick={onStart}
            disabled={availableCount === 0}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-mundialGold px-6 py-4 text-sm font-black uppercase text-midnight shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play size={20} />
            Jugar ahora
          </button>
          <button
            type="button"
            onClick={onContinue}
            disabled={!hasSavedGame}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/12 px-6 py-3 text-sm font-black uppercase text-white transition hover:bg-white/22 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Save size={18} />
            Continuar partida guardada
          </button>
          <button
            type="button"
            onClick={onResetProgress}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-transparent px-6 py-3 text-sm font-black uppercase text-white/80 transition hover:bg-white/10"
          >
            <RefreshCcw size={18} />
            Reiniciar progreso
          </button>
        </div>
      </div>
    </div>
  );
}
